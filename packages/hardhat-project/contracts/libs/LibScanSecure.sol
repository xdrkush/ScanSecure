// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

library LibScanSecure {
    // Events
    event Whitelisted(address addr);
    event newEvent(uint event_id, address author_id);
    event newTickets(uint event_id, uint ticket_id, address author_id);
    event ticketBuyed(uint ticket_id, address buyer);

    enum EventStatus {
        eventCreated,
        buyingTicket,
        soldOut
    }
    enum TicketStatus {
        buyable,
        buyed,
        consumed
    }

    struct Data {
        mapping(address => bool) whitelist;
        uint store;
    }

    struct User {
        bytes32 pseudo;
        bool isCertified;
    }
    struct Event {
        bytes32 title;
        bytes32 description;
        bytes32 hash_ipfs;
        EventStatus status;
    }
    struct Ticket {
        bytes32 ticket;
        bytes32 hash_ipfs;
        bool isValid;
        uint price;
        TicketStatus status;
    }
    
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
