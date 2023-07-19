// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "../store/ScanSecureTicketManager.sol";
import "../access/ScanSecureAccess.sol";

// Library
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Utils
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "../utils/Roles.sol";

//
abstract contract ScanSecureStore is ScanSecureTicketManager {
    constructor(
        address _addrUSDT,
        address _addrERC1155
    ) ScanSecureTicketManager(_addrUSDT, _addrERC1155) {}

    function createEvent(
        string calldata _title
    ) external onlyRole(CREATOR_ROLE) {
        require(bytes(_title).length > 0, "Title null is not accepted");
        events.push(Event(_title, 0, 0, msg.sender, EventStatus.created));
        ++eventLastId;
        emit EventCreated(eventLastId, msg.sender);
    }

    function setStatusEvent(
        uint _event_id
    ) external {
        if (msg.sender != events[_event_id].author)
            revert("You are not creator of event");
            
        EventStatus s = EventStatus(uint(events[_event_id].status));
        EventStatus newS = EventStatus(uint(events[_event_id].status) +1);

        events[_event_id].status = newS;

        emit EventStatusChanged(_event_id, s, newS);
    }

    function getEvent(uint _event_id) external view returns (Event memory) {
        require(_event_id > 0 && _event_id < events.length, "Event not exist");
        return events[_event_id];
    }
}
