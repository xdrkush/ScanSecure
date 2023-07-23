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
        if (bytes(_title).length <= 0) revert("Title null is not accepted");
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
        if (_event_id < 0 || _event_id > events.length)
            revert("Event not exist");
        return events[_event_id];
    }
}
