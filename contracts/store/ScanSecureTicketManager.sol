// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;
// import "hardhat/console.sol";
// Contract
import "../access/ScanSecureAccess.sol";
import "./ScanSecureERC1155.sol";

import {LibFees} from "../libs/LibFees.sol";

/**
 * @title ScanSecureTicketManager
 * @dev This contract extends AccessControl and ScanSecureStorage, providing ticket management functionalities for the ScanSecure application.
 */
abstract contract ScanSecureTicketManager is ScanSecureAccess {
    uint private fees = 5;

    constructor(
        address _addrUSDT,
        address _addrERC1155
    ) ScanSecureAccess(_addrUSDT, _addrERC1155) {}

    /**
     * @dev Modifier to check if the sender is a valid buyer (member, creator, or admin).
     */
    modifier checkIsBuyer() {
        if (
            hasRole(MEMBER_ROLE, msg.sender) ||
            hasRole(CREATOR_ROLE, msg.sender) ||
            hasRole(ADMIN_ROLE, msg.sender)
        ) {
            _;
        } else revert("No Buyer");
    }

    /**
     * @dev Retrieves the ticket information for the specified event and ticket IDs.
     * @param _event_id The identifier of the event.
     * @param _ticket_id The identifier of the ticket within the event.
     * @return The Ticket structure containing the price, owner, and status of the ticket.
     * @notice The ticket must exist in the ticketsValidity mapping.
     */
    function getTicket(
        uint _event_id,
        uint _ticket_id
    ) external view returns (Ticket memory) {
        if (ticketsValidity[_event_id][_ticket_id].price <= 0)
            revert("Ticket not exist");

        return ticketsValidity[_event_id][_ticket_id];
    }

    /**
     * @dev Retrieves the ids of event with owner _addr.
     * @param _event_id The identifier of the event.
     * @param _addr The address of the members.
     * @return The uint[] of Ticket id of event for user, owner.
     * @notice The ticket must exist in the ticketsValidity mapping.
     */
    function getTickets(
        uint _event_id,
        address _addr
    ) external view returns (uint[] memory) {
        return ticketsUser[_addr][_event_id];
    }

    /**
     * @dev Allows a creator to create tickets for an event.
     * @param _event_id The identifier of the event to create tickets for.
     * @param _quantity The quantity of tickets to create.
     * @param _price The price of each ticket.
     * @notice The creator must be the author of the event, and the event must exist.
     * The price and quantity must be greater than zero.
     * The event's limitTickets property is set to the specified quantity, and the first ticket (ID 0) is created with the given price and author.
     * An event is emitted to indicate the creation of new tickets.
     */

    function createTickets(
        uint _event_id,
        uint _quantity,
        uint _price
    ) external onlyRole(CREATOR_ROLE) {
        if (_event_id < 0 || _event_id >= eventLastId)
            revert("Event not exist");
        if (msg.sender != events[_event_id].author)
            revert("You are not author of event");
        if (_price <= 0 || _quantity <= 0)
            revert("Not rigth price or quantity");

        ScErc1155.mint(msg.sender, _event_id, _quantity);

        events[_event_id].limitTickets = _quantity;
        ticketsValidity[_event_id][0] = Ticket(
            _price,
            msg.sender,
            TicketStatus.saleable
        );

        emit NewTickets(_event_id, _quantity, msg.sender);
    }

    /**
     * @dev Allows a buyer to purchase tickets for an event.
     * @param _event_id The identifier of the event to buy tickets for.
     * @param _quantity The quantity of tickets to purchase.
     * @notice The event must exist, and there must be available tickets for purchase.
     * The quantity must be between 1 and 100.
     * The buyer must have the required USDT balance to cover the total cost of the tickets, including fees.
     * Tickets are transferred from the event's author to the buyer, and new tickets are added to the ticketsValidity mapping.
     * An event is emitted to indicate the ownership transfer of the tickets.
     */
    function buyTicket(
        uint _event_id,
        uint _quantity
    ) external payable checkIsBuyer {
        if (_event_id < 0 || _event_id >= eventLastId)
            revert("Event not exist");
        Event storage e = events[_event_id];
        if (e.totalSold == e.limitTickets) revert("Sold Out");
        if (e.limitTickets - e.totalSold < _quantity) revert("No more ticket");
        if (_quantity <= 0 || _quantity > 100)
            revert("Quantity should be between zero & 100");
        if (uint(e.status) != uint(EventStatus.buyingTicket))
            revert("Its not rigth status");

        uint totalPrice = _quantity * ticketsValidity[_event_id][0].price;
        uint totalFees = LibFees.calcFees(totalPrice);
        uint totalCost = totalPrice + totalFees;

        address seller = events[_event_id].author;

        if (!ScErc1155.isApprovedForAll(seller, address(this)))
            revert("Contract not approved to spend ticket");

        if (usdtToken.balanceOf(msg.sender) <= totalCost) revert("Not fund");

        // Paid fees for contract
        usdtToken.transferFrom(msg.sender, address(this), totalFees);

        // Paid creator event
        usdtToken.transferFrom(
            msg.sender,
            events[_event_id].author,
            totalPrice
        );

        ScErc1155.safeTransferFrom(
            address(seller),
            msg.sender,
            _event_id,
            _quantity,
            ""
        );

        for (uint i = 0; i < _quantity; i++) {
            ticketsValidity[_event_id][
                events[_event_id].totalSold + (i + 1)
            ] = Ticket(
                ticketsValidity[_event_id][0].price,
                msg.sender,
                TicketStatus.saleable
            );
            ticketsUser[msg.sender][_event_id].push(
                events[_event_id].totalSold + (i + 1)
            );
        }

        emit TicketOwnered(_event_id, _quantity, msg.sender);

        events[_event_id].totalSold += _quantity;
    }

    /**
     * @dev Allows a ticket owner to consume a ticket for an event.
     * @param _event_id The identifier of the event.
     * @param _ticket_id The identifier of the ticket to consume.
     * @notice The ticket must exist and be owned by the caller.
     * The ticket's status is set to 'consumed', and an event is emitted to indicate the ticket consumption.
     */
    function consumeTicket(uint _event_id, uint _ticket_id) external {
        if (ticketsValidity[_event_id][_ticket_id].price <= 0)
            revert("Ticket not exist");
        if (ScErc1155.balanceOf(msg.sender, _event_id) <= 0)
            revert("You dont have a ticket");
        if (
            ticketsValidity[_event_id][_ticket_id].status !=
            TicketStatus.saleable
        ) revert("Ticket consumed");
        if (ticketsValidity[_event_id][_ticket_id].owner != msg.sender)
            revert("You are not owner on ticket");

        ticketsValidity[_event_id][_ticket_id].status = TicketStatus.consumed;

        emit TicketConsumed(_event_id, _ticket_id, msg.sender);
    }

    /**
     * @dev Allows an admin to recover the USDT balance of the contract.
     * @notice Only admins can call this function, and the total balance of the contract is transferred to the first owner of the contract.
     * An event is emitted to indicate the sum recovery.
     */
    function sumRecovery() external onlyRole(ADMIN_ROLE) {
        uint totalSum = usdtToken.balanceOf(address(this));
        usdtToken.transfer(firstOwner, totalSum);
        emit SumRecovered(totalSum, msg.sender);
    }

    /**
     * @dev Allows the owner of a ticket to offer it to another address.
     * @param _addr The address to offer the ticket to.
     * @param _event_id The identifier of the event.
     * @param _ticket_id The identifier of the ticket to offer.
     * @notice The ticket must exist and be owned by the caller.
     * The ticket ownership is transferred to the specified address, and an event is emitted to indicate the ticket ownership transfer.
     */
    function offerTicket(
        address _addr,
        uint _event_id,
        uint _ticket_id
    ) external {
        if (ticketsValidity[_event_id][_ticket_id].price <= 0)
            revert("Ticket not exist");
        if (ScErc1155.balanceOf(msg.sender, _event_id) <= 0)
            revert("You dont have a ticket");
        if (ticketsValidity[_event_id][_ticket_id].owner != msg.sender)
            revert("You are not owner on ticket");

        ScErc1155.safeTransferFrom(
            address(msg.sender),
            _addr,
            _event_id,
            1,
            ""
        );

        uint[] storage senderTickets = ticketsUser[msg.sender][_event_id];
        for (uint i = 0; i < senderTickets.length; i++) {
            if (senderTickets[i] == _ticket_id) {
                // Move the last element to the position of the ticket to be removed
                senderTickets[i] = senderTickets[senderTickets.length - 1];
                // Remove the last element (which is now a duplicate)
                senderTickets.pop();
                break;
            }
        }

        // ticketsUser[msg.sender][_event_id][_ticket_id] = ticketsUser[
        //     msg.sender
        // ][_event_id][ticketsUser[msg.sender][_event_id].length - 1];
        // ticketsUser[msg.sender][_event_id].pop();

        ticketsValidity[_event_id][_ticket_id].owner = _addr;
        ticketsUser[_addr][_event_id].push(_ticket_id);

        emit TicketOwnered(_event_id, 1, _addr);
    }
}
