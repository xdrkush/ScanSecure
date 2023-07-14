// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

library LibStorage  {
    /* Data
     * ***** */
     struct Data {
        mapping(address => User) members;
        uint128 totalMembers;
        Event[] events;
        uint128 eventLastId;
        mapping(uint128 => Ticket) tickets;
        uint128 totalTickets;
     }

    // Struct
    struct User {
        string pseudo;
        bytes32 role;
        CertificationStatus status;
    }
    struct Event {
        uint128 id;
        string title;
        string hash_ipfs;
        EventStatus status;
        address author;
    }
    struct Ticket {
        uint128 id;
        string hash_ipfs;
        bool isValid;
        uint price;
        TicketStatus status;
    }

    // Events
    event Whitelisted(address addr);
    event Certification(address addr, CertificationStatus newStatus);
    event EventCreated(uint event_id, address author_id);
    event EventStatusChanged(
        uint event_id,
        EventStatus oldStatus,
        EventStatus newStatus
    );
    event newTickets(uint event_id, uint ticket_id, address author_id);
    event ticketBuyed(uint ticket_id, address buyer);

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

