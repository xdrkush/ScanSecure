// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// import "../access/RoleControl.sol";
// import "../ScanSecure.sol";

// Library
// import {LibStorage} from "../libs/LibStorage.sol";
// import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "../utils/Roles.sol";

//
contract ScanSecureTicketManager is ERC1155 {
    // ERC20 public usdtToken;
    // ScanSecure scanSecure;
    // uint private fees = 5;
    // address private firstOwner;

    // modifier checkedRole(bytes32 role) {
    //     require(scanSecure.hasRole(role, msg.sender), "You have not access");
    //     _;
    // }

    constructor(string memory _uri) ERC1155(_uri) {}

    // function calcFees(uint _price) internal view returns (uint) {
    //     uint fee = (_price * fees) / 100;
    //     return fee;
    // }

    function mint(uint _event_id, uint _quantity) external {
        // Your _mint implementation here
        // Make sure to mint the tokens correctly
        _mint(msg.sender, _event_id, _quantity, "");
    }

    /*
     * Tickets
     * **************** */
    // function createTickets(
    //     uint _event_id,
    //     uint _quantity,
    //     uint _price
    // ) external checkedRole(CREATOR_ROLE) {
    //     // LibStorage.Data storage data = _data();
    //     // require(
    //     //     msg.sender == data.events[_event_id].author,
    //     //     "Vous devez etre author de l event"
    //     // );

    //     _mint(msg.sender, _event_id, _quantity, "");
    //     setApprovalForAll(address(this), true);

    //     data.events[_event_id].limitTickets = _quantity;
    //     data.ticketsValidity[_event_id][0].isValid = false;
    //     data.ticketsValidity[_event_id][0].isValid = false;
    //     data.ticketsValidity[_event_id][0].price = _price;
    //     data.ticketsValidity[_event_id][0].owner = msg.sender;

    //     emit LibStorage.ticketPurchased(_event_id, 0, msg.sender);

    //     emit LibStorage.newTickets(_event_id, _quantity, msg.sender);
    // }

    // function getTicket(
    //     uint _event_id,
    //     uint _ticket_id
    // ) external view returns (LibStorage.Ticket memory) {
    //     LibStorage.Data storage data = _data();
    //     return data.ticketsValidity[_event_id][_ticket_id];
    // }

    // function buyTicket(
    //     uint _event_id,
    //     uint _quantity
    // ) external payable checkedRole(MEMBER_ROLE) {
    //     LibStorage.Data storage data = _data();
    //     address seller = data.events[_event_id].author;

    //     ERC1155(address(this)).safeTransferFrom(
    //         address(seller),
    //         msg.sender,
    //         _event_id,
    //         _quantity,
    //         ""
    //     );

    //     for (uint256 i = 0; i < _quantity; i++) {
    //         data.ticketsValidity[_event_id][
    //             data.events[_event_id].totalSold + i + 1
    //         ] = LibStorage.Ticket(
    //             true,
    //             data.ticketsValidity[_event_id][0].price,
    //             msg.sender
    //         );

    //         emit LibStorage.ticketPurchased(
    //             _event_id,
    //             data.events[_event_id].totalSold + i + 1,
    //             msg.sender
    //         );
    //     }

    //     data.events[_event_id].totalSold += _quantity;

    //     // Paid fees for contract
    //     usdtToken.transferFrom(
    //         msg.sender,
    //         address(this),
    //         calcFees(data.ticketsValidity[_event_id][0].price * _quantity)
    //     );

    //     // Paid creator event
    //     usdtToken.transferFrom(
    //         msg.sender,
    //         data.events[_event_id].author,
    //         data.ticketsValidity[_event_id][0].price * _quantity
    //     );
    // }

    // function consumeTicket(
    //     uint _event_id
    // ) external view checkedRole(CREATOR_ROLE) {
    //     LibStorage.Data storage data = _data();
    //     require(
    //         msg.sender == data.events[_event_id].author,
    //         "You are not creator of event"
    //     );
    //     require(balanceOf(msg.sender, _event_id) > 0, "You have not ticket");

    //     // for (uint i = 0; i < data.events[_event_id].totalSold; i++) {
    //     //     if(data.ticketsValidity[_event_id][i].owner == msg.sender
    //     //     && data.ticketsValidity[_event_id][i].isValid) {
    //     //         data.ticketsValidity[_event_id][i].isValid = true;
    //     //         break;
    //     //     }
    //     // }
    // }

    // function sumRecovery() external checkedRole(ADMIN_ROLE) {
    //     uint totalSum = usdtToken.balanceOf(address(this));
    //     // Paid creator event
    //     usdtToken.transfer(firstOwner, totalSum);
    // }

    // function supportsInterface(
    //     bytes4 interfaceId
    // ) public view override(ERC1155, ERC1155Receiver) returns (bool) {
    //     return super.supportsInterface(interfaceId);
    // }

    // // Internal storage
    // function _data() internal pure virtual returns (LibStorage.Data storage) {
    //     return LibStorage.accessData();
    // }
}
