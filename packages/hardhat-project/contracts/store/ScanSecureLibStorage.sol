// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

contract ScanSecureLibStorage {
    struct User {
        string pseudo;
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
        uint price;
        address owner;
        TicketStatus status;
    }

    event Whitelisted(address addr);
    event AskCertification(address addr, string message);
    event Certified(address addr, CertificationStatus newStatus);
    event EventCreated(uint event_id, address author_id);
    event EventStatusChanged(
        uint event_id,
        EventStatus oldStatus,
        EventStatus newStatus
    );
    event NewTickets(uint event_id, uint quantity, address author_id);
    event TicketOwnered(uint event_id, uint _quantity, address buyer);
    event TicketConsumed(uint event_id, uint ticket_id, address consumer);
    event SumRecovered(uint sum, address collector);

    enum EventStatus {
        created,
        buyingTicket,
        soldOut,
        closed
    }
    enum TicketStatus {
        saleable,
        consumed
    }
    enum CertificationStatus {
        noAsked,
        pending,
        succeeded
    }

    // Error
    error MisssingRole (bytes32 role, address caller);
}
