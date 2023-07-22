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

    event Whitelisted(address indexed addr);
    event AskCertification(address indexed addr, string message);
    event Certified(address indexed addr, CertificationStatus indexed newStatus);
    event EventCreated(uint indexed event_id, address indexed author);
    event EventStatusChanged(
        uint indexed event_id,
        EventStatus oldStatus,
        EventStatus newStatus
    );
    event NewTickets(uint indexed event_id, uint indexed quantity, address indexed author);
    event TicketOwnered(uint indexed event_id, uint indexed quantity, address indexed buyer);
    event TicketConsumed(uint indexed event_id, uint indexed ticket_id, address indexed consumer);
    event SumRecovered(uint sum, address indexed collector);

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
