// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title TetherToken
 * @dev A simulator ERC20 (USDT) for ScanSecure
 * @author xDrKush
 * @notice You can use this contract for only the most basic simulation
 * @custom:experimental This is an experimental contract realized for a diploma in AlyraSchool.
 */
contract TetherToken is ERC20 {
    uint256 constant initialSupply = 420000000 * (10 ** 18);

    /**
     * @dev Constructor to initialize the TetherToken contract.
     * It mints the initial supply of USDT tokens and assigns them to the contract deployer.
     */
    constructor() ERC20("TETHER", "USDT") {
        _mint(msg.sender, initialSupply);
    }
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "./store/ScanSecureStore.sol";

// Library
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "./utils/Roles.sol";
/**
 * @title ScanSecure
 * @dev This contract extends ScanSecureStore and represents a basic simulation of the ScanSecure application.
 * @author xDrKush
 * @notice This contract is intended for experimental use and basic simulation purposes only.
 * @custom:experimental This is an experimental contract realized for a diploma in AlyraSchool.
 */
contract ScanSecure is ScanSecureStore {
    constructor(
        address _addrUSDT,
        address _addrERC1155
    ) ScanSecureStore(_addrUSDT, _addrERC1155) {
        _initialize();
    }
    /**
     * @dev Private function to initialize the contract and grant roles to the contract deployer.
     * This function grants the MEMBER_ROLE, CREATOR_ROLE, and ADMIN_ROLE to the contract deployer.
     * It also sets up the DEFAULT_ADMIN_ROLE and assigns ADMIN_ROLE as its admin role.
     */
    function _initialize() private {
        _grantRole(MEMBER_ROLE, msg.sender);
        _grantRole(CREATOR_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, ADMIN_ROLE);
    }

    /**
     * @dev Fallback function to receive Ether sent to the contract.
     * This function is payable and allows the contract to receive Ether.
     */
    receive() external payable {}
    /**
     * @dev Fallback function to receive Ether sent to the contract without any function call.
     * This function is payable and allows the contract to receive Ether when no valid function is called.
     */
    fallback() external payable {}

}
// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "../store/ScanSecureTicketManager.sol";
import "../access/ScanSecureAccess.sol";

// Library
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Utils
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "../utils/Roles.sol";

/**
 * @title ScanSecureStore
 * @dev This contract extends ScanSecureTicketManager and provides additional functionalities for event management.
 */
abstract contract ScanSecureStore is ScanSecureTicketManager {
    constructor(
        address _addrUSDT,
        address _addrERC1155
    ) ScanSecureTicketManager(_addrUSDT, _addrERC1155) {}

    /**
     * @dev Allows a user with the CREATOR_ROLE to create a new event.
     * @param _title The title of the event to create.
     * @notice A non-empty title must be provided to create the event.
     * The newly created event is added to the list of events, and an event for creation is emitted.
     */
    function createEvent(
        string calldata _title
    ) external onlyRole(CREATOR_ROLE) {
        require(bytes(_title).length > 0, "Title null is not accepted");
        events.push(Event(_title, 0, 0, msg.sender, EventStatus.created));
        ++eventLastId;
        emit EventCreated(eventLastId, msg.sender);
    }

    /**
     * @dev Allows the author of the event to set the status of the event specified by `_event_id`.
     * @param _event_id The identifier of the event for which to set the status.
     * @notice Only the author of the event can set the status, and the event must not be closed.
     * The status of the event is updated, and an event for status change is emitted.
     */
    function setStatusEvent(uint _event_id) external {
        if (msg.sender != events[_event_id].author)
            revert("You are not creator of event");

        if (EventStatus(uint(events[_event_id].status)) == EventStatus.closed)
            revert("Event closed");

        EventStatus s = EventStatus(uint(events[_event_id].status));
        EventStatus newS = EventStatus(uint(events[_event_id].status) + 1);

        events[_event_id].status = newS;

        emit EventStatusChanged(_event_id, s, newS);
    }

    /**
     * @dev Retrieves the information of the event specified by `_event_id`.
     * @param _event_id The identifier of the event to retrieve.
     * @return The Event structure containing the details of the event.
     * @notice The event must exist in the list of events.
     */
    function getEvent(uint _event_id) external view returns (Event memory) {
        require(_event_id >= 0 && _event_id < events.length, "Event not exist");
        return events[_event_id];
    }
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;
import "hardhat/console.sol";
// Contract
import "../access/ScanSecureAccess.sol";
import "./ScanSecureERC1155.sol";

import {LibFees} from "../libs/LibFees.sol";

/**
 * @title ScanSecureTicketManager
 * @dev This contract extends AccessControl and ScanSecureStorage, providing ticket management functionalities for the ScanSecure application.
 */
abstract contract ScanSecureTicketManager is ScanSecureAccess {
    uint private fees = 5;

    constructor(
        address _addrUSDT,
        address _addrERC1155
    ) ScanSecureAccess(_addrUSDT, _addrERC1155) {}

    /**
     * @dev Modifier to check if the sender is a valid buyer (member, creator, or admin).
     */
    modifier checkIsBuyer() {
        if (
            hasRole(MEMBER_ROLE, msg.sender) ||
            hasRole(CREATOR_ROLE, msg.sender) ||
            hasRole(ADMIN_ROLE, msg.sender)
        ) {
            _;
        } else revert("No Buyer");
    }

    /**
     * @dev Retrieves the ticket information for the specified event and ticket IDs.
     * @param _event_id The identifier of the event.
     * @param _ticket_id The identifier of the ticket within the event.
     * @return The Ticket structure containing the price, owner, and status of the ticket.
     * @notice The ticket must exist in the ticketsValidity mapping.
     */
    function getTicket(
        uint _event_id,
        uint _ticket_id
    ) external view returns (Ticket memory) {
        require(
            ticketsValidity[_event_id][_ticket_id].price > 0,
            "Ticket not exist"
        );
        return ticketsValidity[_event_id][_ticket_id];
    }

    /**
     * @dev Allows a creator to create tickets for an event.
     * @param _event_id The identifier of the event to create tickets for.
     * @param _quantity The quantity of tickets to create.
     * @param _price The price of each ticket.
     * @notice The creator must be the author of the event, and the event must exist.
     * The price and quantity must be greater than zero.
     * The event's limitTickets property is set to the specified quantity, and the first ticket (ID 0) is created with the given price and author.
     * An event is emitted to indicate the creation of new tickets.
     */

    function createTickets(
        uint _event_id,
        uint _quantity,
        uint _price
    ) external onlyRole(CREATOR_ROLE) {
        require(_event_id >= 0 && _event_id <= eventLastId, "Event not exist");
        require(
            msg.sender == events[_event_id].author,
            "You are not author of event"
        );
        require(_price > 0 && _quantity > 0, "Not rigth price or quantity");

        ScErc1155.mint(msg.sender, _event_id, _quantity);

        events[_event_id].limitTickets = _quantity;
        ticketsValidity[_event_id][0] = Ticket(
            _price,
            msg.sender,
            TicketStatus.saleable
        );

        emit NewTickets(_event_id, _quantity, msg.sender);
    }

    /**
     * @dev Allows a buyer to purchase tickets for an event.
     * @param _event_id The identifier of the event to buy tickets for.
     * @param _quantity The quantity of tickets to purchase.
     * @notice The event must exist, and there must be available tickets for purchase.
     * The quantity must be between 1 and 100.
     * The buyer must have the required USDT balance to cover the total cost of the tickets, including fees.
     * Tickets are transferred from the event's author to the buyer, and new tickets are added to the ticketsValidity mapping.
     * An event is emitted to indicate the ownership transfer of the tickets.
     */
    function buyTicket(
        uint _event_id,
        uint _quantity
    ) external payable checkIsBuyer {
        require(_event_id >= 0 && _event_id <= eventLastId, "Event not exist");
        Event storage e = events[_event_id];
        require(e.totalSold < e.limitTickets, "Sold Out");
        require(e.limitTickets - e.totalSold >= _quantity, "No more ticket");
        require(
            _quantity > 0 && _quantity <= 100,
            "Quantity should be between zero & 100"
        );
        require(e.status == EventStatus.buyingTicket, "Its not rigth status");

        uint totalPrice = _quantity * ticketsValidity[_event_id][0].price;
        uint totalFees = LibFees.calcFees(totalPrice);
        uint totalCost = totalPrice + totalFees;

        address seller = events[_event_id].author;
        require(
            ScErc1155.isApprovedForAll(seller, address(this)),
            "Contract not approved to spend ticket"
        );

        require(usdtToken.balanceOf(msg.sender) >= totalCost, "Not fund");

        // Paid fees for contract
        usdtToken.transferFrom(msg.sender, address(this), totalFees);

        // Paid creator event
        usdtToken.transferFrom(
            msg.sender,
            events[_event_id].author,
            totalPrice
        );

        ScErc1155.safeTransferFrom(
            address(seller),
            msg.sender,
            _event_id,
            _quantity,
            ""
        );

        for (uint i = 0; i < _quantity; i++) {
            ticketsValidity[_event_id][
                events[_event_id].totalSold + (i + 1)
            ] = Ticket(
                ticketsValidity[_event_id][0].price,
                msg.sender,
                TicketStatus.saleable
            );
        }

        emit TicketOwnered(_event_id, _quantity, msg.sender);

        events[_event_id].totalSold += _quantity;
    }

    /**
     * @dev Allows a ticket owner to consume a ticket for an event.
     * @param _event_id The identifier of the event.
     * @param _ticket_id The identifier of the ticket to consume.
     * @notice The ticket must exist and be owned by the caller.
     * The ticket's status is set to 'consumed', and an event is emitted to indicate the ticket consumption.
     */
    function consumeTicket(uint _event_id, uint _ticket_id) external {
        require(
            ticketsValidity[_event_id][_ticket_id].price > 0,
            "Ticket not exist"
        );
        require(
            ScErc1155.balanceOf(msg.sender, _event_id) > 0,
            "You have not ticket"
        );
        require(
            ticketsValidity[_event_id][_ticket_id].status ==
                TicketStatus.saleable,
            "Ticket consumed"
        );
        require(
            ticketsValidity[_event_id][_ticket_id].owner == msg.sender,
            "You are not owner on ticket"
        );

        ticketsValidity[_event_id][_ticket_id].status = TicketStatus.consumed;

        emit TicketConsumed(_event_id, _ticket_id, msg.sender);
    }

    /**
     * @dev Allows an admin to recover the USDT balance of the contract.
     * @notice Only admins can call this function, and the total balance of the contract is transferred to the first owner of the contract.
     * An event is emitted to indicate the sum recovery.
     */
    function sumRecovery() external onlyRole(ADMIN_ROLE) {
        uint totalSum = usdtToken.balanceOf(address(this));
        usdtToken.transfer(firstOwner, totalSum);
        emit SumRecovered(totalSum, msg.sender);
    }

    /**
     * @dev Allows a ticket owner to offer a ticket to another address.
     * @param _addr The address to offer the ticket to.
     * @param _event_id The identifier of the event.
     * @param _ticket_id The identifier of the ticket to offer.
     * @notice The ticket must exist and be owned by the caller.
     * The ticket ownership is transferred to the specified address, and an event is emitted to indicate the ticket ownership transfer.
     */
    function offerTicket(
        address _addr,
        uint _event_id,
        uint _ticket_id
    ) external {
        require(
            ticketsValidity[_event_id][_ticket_id].price > 0,
            "Ticket not exist"
        );

        require(
            ScErc1155.balanceOf(msg.sender, _event_id) > 0,
            "You dont have a ticket"
        );
        require(
            ticketsValidity[_event_id][_ticket_id].owner == msg.sender,
            "You are not owner on ticket"
        );

        ScErc1155.safeTransferFrom(
            address(msg.sender),
            _addr,
            _event_id,
            1,
            ""
        );
        ticketsValidity[_event_id][_ticket_id].owner = _addr;

        emit TicketOwnered(_event_id, 1, _addr);
    }
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../store/ScanSecureStorage.sol";

// Library
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "../utils/Roles.sol";

/**
 * @title ScanSecureAccess
 * @dev This contract extends AccessControl and ScanSecureStorage, providing access control and user registration functionalities for the ScanSecure application.
 */
contract ScanSecureAccess is AccessControl, ScanSecureStorage {
    constructor(
        address _addrUSDT,
        address _addrERC1155
    ) ScanSecureStorage(_addrUSDT, _addrERC1155) {}

    /**
     * @dev Allows a user to register with a pseudo.
     * @param _pseudo The pseudo to register with.
     * @notice The pseudo must not be empty, and the user must not already be registered as a member.
     * The user is assigned the MEMBER_ROLE, and their total registration count is incremented.
     * An event is emitted to indicate that the user has been whitelisted.
     */
    function register(string calldata _pseudo) external {
        require(bytes(_pseudo).length > 0, "The pseudo is empty");
        require(
            !hasRole(MEMBER_ROLE, msg.sender),
            "You are already registred on member"
        );

        members[msg.sender] = User(_pseudo, CertificationStatus.noAsked);
        _grantRole(MEMBER_ROLE, msg.sender);
        totalMembers++;

        emit Whitelisted(msg.sender);
    }

    /**
     * @dev Allows a member to ask for certification with a message.
     * @param _message The message provided by the member requesting certification.
     * @notice The message must not be empty, and the user must not have already requested certification or be registered as a creator.
     * The user's status is set to 'pending' for certification.
     * An event is emitted to indicate that the user has asked for certification.
     */
    function askCertification(
        string calldata _message
    ) external onlyRole(MEMBER_ROLE) {
        require(bytes(_message).length > 0, "Your message is empty");
        require(
            uint(members[msg.sender].status) == 0,
            "You are already ask certification"
        );
        require(
            !hasRole(CREATOR_ROLE, msg.sender),
            "You are already registred creator"
        );
        CertificationStatus status = CertificationStatus.pending;

        members[msg.sender].status = status;

        emit AskCertification(msg.sender, _message);
    }

    /**
     * @dev Allows an admin to answer the certification request for a member.
     * @param _choose The choice of certification (true for succeeded, false for noAsked).
     * @param _asker The address of the member who requested certification.
     * @notice Only an admin can answer the certification request.
     * If `_choose` is true, the user's status is set to 'succeeded', and they are granted the CREATOR_ROLE.
     * If `_choose` is false, the user's status is set to 'noAsked'.
     * An event is emitted to indicate the certification status change.
     */
    function certificationAnswer(
        bool _choose,
        address _asker
    ) external onlyRole(ADMIN_ROLE) {
        require(
            members[_asker].status == CertificationStatus.pending,
            "The user are not status asker"
        );
        if (!_choose) {
            CertificationStatus status = CertificationStatus.noAsked;

            members[_asker].status = status;
        } else {
            CertificationStatus status = CertificationStatus.succeeded;

            members[_asker].status = status;
            _grantRole(CREATOR_ROLE, _asker);

            emit Certified(_asker, status);
        }
    }

    /**
     * @dev Retrieves the user information for the specified address.
     * @param _addr The address of the user to retrieve information for.
     * @return The User structure containing the pseudo and certification status of the user.
     * @notice The user must exist in the list of members.
     */
    function getUser(address _addr) external view returns (User memory) {
        User memory user = members[_addr];
        require(bytes(user.pseudo).length > 0, "User not exist");
        return user;
    }
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ScanSecureERC1155.sol";
import "./ScanSecureLibStorage.sol";
import {LibFees} from "../libs/LibFees.sol";

/**
 * @title ScanSecureStorage
 * @dev This contract serves as the storage contract for the ScanSecure application.
 * @notice It manages the state and storage variables required for the application.
 */
abstract contract ScanSecureStorage is ScanSecureLibStorage {
    ERC20 usdtToken;
    ScanSecureERC1155 ScErc1155;
    address internal firstOwner;

    /**
     * @dev Constructor to initialize the ScanSecureStorage contract.
     * @param _addrUSDT The address of the ERC20 (USDT) contract.
     * @param _addrERC1155 The address of the ERC1155 contract.
     * It sets the addresses for the USDT token and the ERC1155 contract.
     * The deployer of the contract is set as the first owner.
     */
    constructor(address _addrUSDT, address _addrERC1155) {
        ScErc1155 = ScanSecureERC1155(_addrERC1155);
        usdtToken = ERC20(_addrUSDT);
        firstOwner = msg.sender;
    }

    // State
    Event[] events;
    mapping(address => User) members;
    mapping(uint => mapping(uint => Ticket)) ticketsValidity;
    uint public eventLastId;
    uint public totalMembers;
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;
/**
 * @title ScanSecureLibStorage
 * @dev This contract defines the library storage structures and events used in the ScanSecure application.
 */
contract ScanSecureLibStorage {
    struct User {
        string pseudo;
        CertificationStatus status;
    }
    struct Event {
        string title;
        uint limitTickets;
        uint totalSold;
        address author;
        EventStatus status;
    }
    struct Ticket {
        uint price;
        address owner;
        TicketStatus status;
    }

    event Whitelisted(address indexed addr);
    event AskCertification(address indexed addr, string message);
    event Certified(address indexed addr, CertificationStatus indexed newStatus);
    event EventCreated(uint indexed event_id, address indexed author);
    event EventStatusChanged(
        uint indexed event_id,
        EventStatus oldStatus,
        EventStatus newStatus
    );
    event NewTickets(uint indexed event_id, uint indexed quantity, address indexed author);
    event TicketOwnered(uint indexed event_id, uint indexed quantity, address indexed buyer);
    event TicketConsumed(uint indexed event_id, uint indexed ticket_id, address indexed consumer);
    event SumRecovered(uint sum, address indexed collector);

    enum EventStatus {
        created,
        buyingTicket,
        soldOut,
        closed
    }
    enum TicketStatus {
        saleable,
        consumed
    }
    enum CertificationStatus {
        noAsked,
        pending,
        succeeded
    }

    // Error
    error MisssingRole (bytes32 role, address caller);
}
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

// Main role for the DAO, this role should be assinged only to the main contract.
// The deployer should have this role to configure the DAO and then `renounceRole`.
bytes32 constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

// Member role, each time this role is modified, the list of member in {LibMembers}
// is modified as well.
bytes32 constant CREATOR_ROLE = keccak256("CREATOR_ROLE");

// Member role, each time this role is modified, the list of member in {LibMembers}
// is modified as well.
bytes32 constant MEMBER_ROLE = keccak256("MEMBER_ROLE");
// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

/**
 * @title LibFees
 * @dev A library for calculating fees based on a percentage of the price.
 */
library LibFees {
    uint private constant FEES_PERCENTAGE = 5;

    /**
     * @dev Calculates the fees based on a percentage of the given price.
     * @param _price The price for which to calculate the fees.
     * @return The calculated fee amount.
     * @notice The price must be greater than zero to calculate the fees.
     */
    function calcFees(uint _price) internal pure returns (uint) {
        require(_price > 0, "Not rigth price");
        uint fee = (_price * FEES_PERCENTAGE) / 100;
        return fee;
    }
}
