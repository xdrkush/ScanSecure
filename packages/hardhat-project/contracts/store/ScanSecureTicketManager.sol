// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../access/RoleControl.sol";

// Library
import {LibStorage} from "../libs/LibStorage.sol";
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "../utils/Roles.sol";

//
abstract contract ScanSecureTicketManager is ERC1155, RoleControl {
    constructor(string memory _uri) ERC1155(_uri) {}

    /*
     * Tickets
     * **************** */
    // function createTickets(
    //     uint128 _event_id,
    //     uint128 _quantity
    // ) external checkedRole(CREATOR_ROLE) {
    //     LibStorage.Data storage data = _data();
    //     require(
    //         msg.sender == data.events[_event_id].author,
    //         "Vous devez etre author de l event"
    //     );
    //     _mint(msg.sender, _event_id, _quantity, "");
    // }

    // function geet(address _addr) external view returns (LibStorage.User memory) {
    //     LibStorage.Data storage data = _data();
    //     return data.members[_addr];
    // }

    // // Internal storage
    // function _data() internal pure returns (LibStorage.Data storage) {
    //     return LibStorage.accessData();
    // }
}
