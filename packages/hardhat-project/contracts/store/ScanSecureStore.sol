// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "../access/RoleControl.sol";
import "./ScanSecureTicketManager.sol";

// Library
import {LibStorage} from "../libs/LibStorage.sol";
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "../utils/Roles.sol";

//
abstract contract ScanSecureStore is RoleControl, ScanSecureTicketManager {

    constructor(string memory _uri) ScanSecureTicketManager(_uri) {}

    /*
     * Events
     * **************** */

    function createEvent(
        string calldata _title,
        string calldata _hash_ipfs
    ) external checkedRole(CREATOR_ROLE) {
        LibStorage.Data storage data = _data();
        uint128 newId = data.eventLastId++;

        data.events.push(
            LibStorage.Event(
                newId,
                _title,
                _hash_ipfs,
                LibStorage.EventStatus.created,
                msg.sender
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

        emit LibStorage.EventStatusChanged(
            data.events[_event_id].id,
            oldStatus,
            newStatus
        );
    }

    function getEvent(
        uint128 _event_id
    ) external view returns (LibStorage.Event memory) {
        LibStorage.Data storage data = _data();
        return data.events[_event_id];
    }

    /*
     * Tickets
     * **************** */
    function createTickets(
        uint128 _event_id,
        uint128 _quantity
    ) external checkedRole(CREATOR_ROLE) {
        LibStorage.Data storage data = _data();
        require(
            msg.sender == data.events[_event_id].author,
            "Vous devez etre author de l event"
        );
        _mint(msg.sender, _event_id, _quantity, "");
    }

    function getTickets(
        uint128 _ticket_id
    ) external view returns (LibStorage.Ticket memory) {
        LibStorage.Data storage data = _data();
        return data.tickets[_ticket_id];
    }

    // Internal storage
    function _data() internal pure virtual returns (LibStorage.Data storage) {
        return LibStorage.accessData();
    }
}
