// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "../store/ScanSecureTicketManager.sol";
import "../access/ScanSecureAccess.sol";

// Library
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {LibStorage} from "../libs/LibStorage.sol";

// Utils
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "../utils/Roles.sol";

//
abstract contract ScanSecureStore is ScanSecureTicketManager {
    constructor(
        string memory _uri,
        address _addrUSDT
    ) ScanSecureTicketManager(_uri, _addrUSDT) {}

    function createEvent(
        string calldata _title
    ) external onlyRole(CREATOR_ROLE) {
        events.push(LibStorage.Event(_title, 0, 0, msg.sender, LibStorage.EventStatus.created));
        emit LibStorage.EventCreated(eventLastId, msg.sender);
    }

    function setStatusEvent(
        uint _event_id
    ) external onlyRole(CREATOR_ROLE) {
        if (msg.sender != events[_event_id].author)
            revert("Vous devez etre author de l event");
            
        LibStorage.EventStatus s = LibStorage.EventStatus(uint(events[_event_id].status));
        LibStorage.EventStatus newS = LibStorage.EventStatus(uint(events[_event_id].status) +1);

        events[_event_id].status = newS;

        emit LibStorage.EventStatusChanged(_event_id, s, newS);
    }

    function getEvent(uint _event_id) external view returns (LibStorage.Event memory) {
        require(_event_id < events.length, "Evenement inexistant");
        return events[_event_id];
    }
}
