// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "../access/RoleControl.sol";
import "../store/ScanSecureTicketManager.sol";

// Library
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {LibStorage} from "../libs/LibStorage.sol";
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "../utils/Roles.sol";

//
abstract contract ScanSecureStore is RoleControl {
    ERC20 public usdtToken;
    ScanSecureTicketManager ticketManager;
    uint private fees = 5;
    address private firstOwner;

    constructor(address _addrUSDT) {
        usdtToken = ERC20(_addrUSDT);
        firstOwner = msg.sender;
        ticketManager = new ScanSecureTicketManager("fssdfsd");
    }

    function calcFees(uint _price) internal view returns (uint) {
        uint fee = (_price * fees) / 100;
        return fee;
    }

    /*
     * Events
     * **************** */

    function createEvent(
        string calldata _title
    ) external checkedRole(CREATOR_ROLE) {
        LibStorage.Data storage data = _data();

        data.events.push(
            LibStorage.Event(
                _title,
                0,
                0,
                msg.sender,
                LibStorage.EventStatus.created
            )
        );

        emit LibStorage.EventCreated(data.eventLastId, msg.sender);
    }

    function setStatusEvent(
        uint _event_id,
        uint8 _newStatus
    ) external checkedRole(CREATOR_ROLE) {
        LibStorage.Data storage data = _data();
        require(
            msg.sender == data.events[_event_id].author,
            "Vous devez etre author de l event"
        );

        LibStorage.EventStatus oldStatus = data.events[_event_id].status;
        LibStorage.EventStatus newStatus = LibStorage.EventStatus(_newStatus);

        data.events[_event_id].status = newStatus;

        emit LibStorage.EventStatusChanged(_event_id, oldStatus, newStatus);
    }

    function getEvent(
        uint _event_id
    ) external view returns (LibStorage.Event memory) {
        LibStorage.Data storage data = _data();
        return data.events[_event_id];
    }

    function createTickets(
        uint _event_id,
        uint _quantity,
        uint _price
    ) external checkedRole(CREATOR_ROLE) {
        LibStorage.Data storage data = _data();
        require(
            msg.sender == data.events[_event_id].author,
            "Vous devez etre author de l event"
        );

        ticketManager.mint(_event_id, _quantity);
        ticketManager.setApprovalForAll(address(this), true);

        data.events[_event_id].limitTickets = _quantity;
        data.ticketsValidity[_event_id][0].price = _price;
        data.ticketsValidity[_event_id][0].owner = msg.sender;

        emit LibStorage.ticketPurchased(_event_id, 0, msg.sender);

        emit LibStorage.newTickets(_event_id, _quantity, msg.sender);
    }

    function getTicket(
        uint _event_id,
        uint _ticket_id
    ) external view returns (LibStorage.Ticket memory) {
        LibStorage.Data storage data = _data();
        return data.ticketsValidity[_event_id][_ticket_id];
    }

    function buyTicket(
        uint _event_id,
        uint _quantity
    ) external payable checkedRole(MEMBER_ROLE) {
        LibStorage.Data storage data = _data();
        address seller = data.events[_event_id].author;

        ERC1155(address(this)).safeTransferFrom(
            address(seller),
            msg.sender,
            _event_id,
            _quantity,
            ""
        );

        for (uint256 i = 0; i < _quantity; i++) {
            data.ticketsValidity[_event_id][
                data.events[_event_id].totalSold + i + 1
            ] = LibStorage.Ticket(
                true,
                data.ticketsValidity[_event_id][0].price,
                msg.sender
            );

            emit LibStorage.ticketPurchased(
                _event_id,
                data.events[_event_id].totalSold + i + 1,
                msg.sender
            );
        }

        data.events[_event_id].totalSold += _quantity;

        // Paid fees for contract
        usdtToken.transferFrom(
            msg.sender,
            address(this),
            calcFees(data.ticketsValidity[_event_id][0].price * _quantity)
        );

        // Paid creator event
        usdtToken.transferFrom(
            msg.sender,
            data.events[_event_id].author,
            data.ticketsValidity[_event_id][0].price * _quantity
        );
    }

    function consumeTicket(
        uint _event_id
    ) external view checkedRole(CREATOR_ROLE) {
        LibStorage.Data storage data = _data();
        require(
            msg.sender == data.events[_event_id].author,
            "You are not creator of event"
        );
        require(
            ticketManager.balanceOf(msg.sender, _event_id) > 0,
            "You have not ticket"
        );

        // for (uint i = 0; i < data.events[_event_id].totalSold; i++) {
        //     if(data.ticketsValidity[_event_id][i].owner == msg.sender
        //     && data.ticketsValidity[_event_id][i].isValid) {
        //         data.ticketsValidity[_event_id][i].isValid = true;
        //         break;
        //     }
        // }
    }

    function sumRecovery() external checkedRole(ADMIN_ROLE) {
        uint totalSum = usdtToken.balanceOf(address(this));
        // Paid creator event
        usdtToken.transfer(firstOwner, totalSum);
    }

    // Internal storage
    function _data() internal pure virtual returns (LibStorage.Data storage) {
        return LibStorage.accessData();
    }
}
