// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "../access/ScanSecureAccess.sol";
import "./ScanSecureTicketManager.sol";

// Library
import {LibScanSecure} from "../libs/LibScanSecure.sol";
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "../utils/Roles.sol";

//
abstract contract ScanSecureStore is ScanSecureAccess {
    
    /*
     * Events
     * **************** */

    function createEvent(
        string calldata _title,
        bytes32 _hash_ipfs
    ) external onlyRole(CREATOR_ROLE) {
        LibScanSecure.Data storage data = _data();

        data.eventLastId++;

        data.events.push(
            LibScanSecure.Event(
                data.eventLastId,
                _title,
                _hash_ipfs,
                LibScanSecure.EventStatus.created,
                msg.sender
            )
        );

        emit LibScanSecure.EventCreated(data.eventLastId, msg.sender);
    }

    function setStatusEvent(
        uint _event_id,
        uint8 _newStatus
    ) external onlyRole(CREATOR_ROLE) {
        LibScanSecure.Data storage data = _data();
        require(
            msg.sender == data.events[_event_id].author,
            "Vous devez etre author de l event"
        );

        LibScanSecure.EventStatus oldStatus = data.events[_event_id].status;
        LibScanSecure.EventStatus newStatus = LibScanSecure.EventStatus(
            _newStatus
        );

        data.events[_event_id].status = newStatus;

        emit LibScanSecure.EventStatusChanged(
            data.events[_event_id].id,
            oldStatus,
            newStatus
        );
    }

    /*
     * Tickets
     * **************** */

    //  function createTickets(
    //     uint128 _event_id,
    //     bytes32 _uri,
    //     uint128 _quantity
    // ) external onlyRole(CREATOR_ROLE) {
    //     LibScanSecure.Data storage data = _data();
    //     require(msg.sender == data.events[_event_id].author, "Vous devez etre author de l event");

    // }

    // Internal storage
    function _data()
        internal
        pure
        override(ScanSecureAccess)
        returns (LibScanSecure.Data storage)
    {
        return LibScanSecure.accessData();
    }
}
