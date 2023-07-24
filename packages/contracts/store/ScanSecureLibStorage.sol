// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

/**
 * @title ScanSecureLibStorage
 * @dev This contract defines the library storage structures and events used in the ScanSecure application.
 */
contract ScanSecureLibStorage {
    /**
     * Errors
     * ******* */ 
    error MisssingRole(bytes32 role, address caller);

    /**
     * User
     * ******* */ 
    struct User {
        string pseudo;
        CertificationStatus status;
    }
    /**
     * Event
     * ******* */ 
    struct Event {
        string title;
        uint limitTickets;
        uint totalSold;
        address author;
        EventStatus status;
    }
    /**
     * Ticket
     * ******* */ 
    struct Ticket {
        uint price;
        address owner;
        TicketStatus status;
    }

    /**
     * @notice This event is emitted when a user is whitelisted.
     * @param addr The address of the whitelisted user.
     */
    event Whitelisted(address indexed addr);
    /**
     * @notice This event is emitted when a user asks for certification.
     * @param addr The address of the user asking for certification.
     * @param message The message sent by the user for certification.
     */
    event AskCertification(address indexed addr, string message);
    /**
     * @notice This event is emitted when a user is certified.
     * @param addr The address of the certified user.
     * @param newStatus The new certification status of the user (succeeded).
     */
    event Certified(
        address indexed addr,
        CertificationStatus indexed newStatus
    );
    /**
     * @notice This event is emitted when a new event is created.
     * @param event_id The ID of the newly created event.
     * @param author The address of the event creator.
     */
    event EventCreated(uint indexed event_id, address indexed author);
    /**
     * @notice This event is emitted when the status of an event is changed.
     * @param event_id The ID of the event whose status is changed.
     * @param oldStatus The old status of the event.
     * @param newStatus The new status of the event.
     */
    event EventStatusChanged(
        uint indexed event_id,
        EventStatus oldStatus,
        EventStatus newStatus
    );
    /**
     * @notice This event is emitted when new tickets are created for an event.
     * @param event_id The ID of the event for which tickets are created.
     * @param quantity The quantity of new tickets created.
     * @param author The address of the ticket creator.
     */
    event NewTickets(
        uint indexed event_id,
        uint indexed quantity,
        address indexed author
    );
    /**
     * @notice This event is emitted when tickets are transferred to a new owner.
     * @param event_id The ID of the event for which tickets are transferred.
     * @param quantity The quantity of tickets transferred.
     * @param buyer The address of the new ticket owner.
     */
    event TicketOwnered(
        uint indexed event_id,
        uint indexed quantity,
        address indexed buyer
    );
    /**
     * @notice This event is emitted when a ticket is consumed.
     * @param event_id The ID of the event for which the ticket is consumed.
     * @param ticket_id The ID of the consumed ticket.
     * @param consumer The address of the ticket consumer.
     */
    event TicketConsumed(
        uint indexed event_id,
        uint indexed ticket_id,
        address indexed consumer
    );
    /**
     * @notice This event is emitted when the contract owner recovers the sum of funds held by the contract.
     * @param sum The total sum of funds recovered.
     * @param collector The address of the contract owner who collected the funds.
     */
    event SumRecovered(uint sum, address indexed collector);


    /**
     * EventStatus
     * ************ */ 
    enum EventStatus {
        created,
        buyingTicket,
        soldOut,
        closed
    }
    /**
     * TicketStatus
     * ************ */ 
    enum TicketStatus {
        saleable,
        consumed
    }
    /**
     * CertificationStatus
     * ******************* */ 
    enum CertificationStatus {
        noAsked,
        pending,
        succeeded
    }

}
