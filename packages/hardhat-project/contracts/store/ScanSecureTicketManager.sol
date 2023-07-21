// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;
import "hardhat/console.sol";
// Contract
import "../access/ScanSecureAccess.sol";
import "./ScanSecureERC1155.sol";

import {LibFees} from "../libs/LibFees.sol";

//
abstract contract ScanSecureTicketManager is ScanSecureAccess {
    uint private fees = 5;

    constructor(
        address _addrUSDT,
        address _addrERC1155
    ) ScanSecureAccess(_addrUSDT, _addrERC1155) {}

    modifier checkIsBuyer() {
        if (
            hasRole(MEMBER_ROLE, msg.sender) ||
            hasRole(CREATOR_ROLE, msg.sender) ||
            hasRole(ADMIN_ROLE, msg.sender)
        ) {
            _;
        } else revert("No Buyer");
    }

    function getTicket(
        uint _event_id,
        uint _ticket_id
    ) external view returns (Ticket memory) {
        require(
            ticketsValidity[_event_id][_ticket_id].price > 0,
            "Ticket not exist"
        );
        return ticketsValidity[_event_id][_ticket_id];
    }

    function createTickets(
        uint _event_id,
        uint _quantity,
        uint _price
    ) external onlyRole(CREATOR_ROLE) {
        require(_event_id >= 0 && _event_id <= eventLastId, "Event not exist");
        require(
            msg.sender == events[_event_id].author,
            "You are not author of event"
        );
        require(_price > 0 && _quantity > 0, "Not rigth price or quantity");

        ScErc1155.mint(msg.sender, _event_id, _quantity);

        events[_event_id].limitTickets = _quantity;
        ticketsValidity[_event_id][0] = Ticket(
            _price,
            msg.sender,
            TicketStatus.saleable
        );

        emit NewTickets(_event_id, _quantity, msg.sender);
    }

    function buyTicket(
        uint _event_id,
        uint _quantity
    ) external payable checkIsBuyer {
        require(_event_id >= 0 && _event_id <= eventLastId, "Event not exist");
        Event storage e = events[_event_id];
        require(e.totalSold < e.limitTickets, "Sold Out");
        require(e.limitTickets - e.totalSold >= _quantity, "No more ticket");
        require(
            _quantity > 0 && _quantity <= 100,
            "Quantity should be between zero & 100"
        );
        require(e.status == EventStatus.buyingTicket, "Its not rigth status");

        uint totalPrice = _quantity * ticketsValidity[_event_id][0].price;
        uint totalFees = LibFees.calcFees(totalPrice);
        uint totalCost = totalPrice + totalFees;

        address seller = events[_event_id].author;
        require(
            ScErc1155.isApprovedForAll(seller, address(this)),
            "Contract not approved to spend ticket"
        );

        require(usdtToken.balanceOf(msg.sender) >= totalCost, "Not fund");

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
        }

        emit TicketOwnered(_event_id, _quantity, msg.sender);

        events[_event_id].totalSold += _quantity;
    }

    function consumeTicket(uint _event_id, uint _ticket_id) external {
        require(
            ticketsValidity[_event_id][_ticket_id].price > 0,
            "Ticket not exist"
        );
        require(
            ScErc1155.balanceOf(msg.sender, _event_id) > 0,
            "You have not ticket"
        );
        require(
            ticketsValidity[_event_id][_ticket_id].status ==
                TicketStatus.saleable,
            "Ticket consumed"
        );
        require(
            ticketsValidity[_event_id][_ticket_id].owner == msg.sender,
            "You are not owner on ticket"
        );

        ticketsValidity[_event_id][_ticket_id].status = TicketStatus.consumed;

        emit TicketConsumed(_event_id, _ticket_id, msg.sender);
    }

    function sumRecovery() external onlyRole(ADMIN_ROLE) {
        uint totalSum = usdtToken.balanceOf(address(this));
        usdtToken.transfer(firstOwner, totalSum);
        emit SumRecovered(totalSum, msg.sender);
    }

    function offerTicket(
        address _addr,
        uint _event_id,
        uint _ticket_id
    ) external {
        require(
            ticketsValidity[_event_id][_ticket_id].price > 0,
            "Ticket not exist"
        );

        require(
            ScErc1155.balanceOf(msg.sender, _event_id) > 0,
            "You dont have a ticket"
        );
        require(
            ticketsValidity[_event_id][_ticket_id].owner == msg.sender,
            "You are not owner on ticket"
        );

        ScErc1155.safeTransferFrom(
            address(msg.sender),
            _addr,
            _event_id,
            1,
            ""
        );
        ticketsValidity[_event_id][_ticket_id].owner = _addr;

        emit TicketOwnered(_event_id, 1, _addr);
    }
}
