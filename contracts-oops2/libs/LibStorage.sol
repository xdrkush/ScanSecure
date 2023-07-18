// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

library LibStorage {
    /* Data
     * ***** */
    struct Data {
        mapping(address => User) members;
        uint totalMembers;
        Event[] events;
        uint eventLastId;
        mapping(uint => mapping(uint => Ticket)) ticketsValidity;
        uint ticketLastId;
        uint totalTickets;
    }

    // Struct
    struct User {
        string pseudo;
        bytes32 role;
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
        bool isValid;
        uint price;
        address owner;
    }

    // Events
    event Whitelisted(address addr);
    event AskCertification(address addr, string message);
    event Certified(address addr, CertificationStatus newStatus);
    event EventCreated(uint event_id, address author_id);
    event EventStatusChanged(
        uint event_id,
        EventStatus oldStatus,
        EventStatus newStatus
    );
    event newTickets(uint event_id, uint quantity, address author_id);
    event ticketPurchased(uint event_id, uint ticket_id, address buyer);

    // Enum
    enum EventStatus {
        created,
        buyingTicket,
        soldOut,
        closed
    }
    enum TicketStatus {
        buyable,
        saleable,
        consumed
    }
    enum CertificationStatus {
        noAsked,
        pending,
        succeeded,
        canceled
    }

    // Error
    error MissingRole(address caller, bytes32 role);

    /*////////////////////////////////////////////////////////////////////////////////////////////////
                                            STORAGE LOCATION
    ////////////////////////////////////////////////////////////////////////////////////////////////*/

    /// @dev Storage slot for Data struct
    bytes32 internal constant STORAGE_SLOT =
        keccak256("scansecure.contracts.storage.v1");

    /// @return data Data struct at `STORAGE_SLOT`
    function accessData() internal pure returns (Data storage data) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            data.slot := slot
        }
    }
}
