// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../access/ScanSecureAccess.sol";

import {LibFees} from "../libs/LibFees.sol";
import {LibStorage} from "../libs/LibStorage.sol";

//
abstract contract ScanSecureTicketManager is ERC1155, ScanSecureAccess {
    uint private fees = 5;

    constructor(
        string memory _uri,
        address _addrUSDT
    ) ERC1155(_uri) ScanSecureAccess(_addrUSDT) {}

    function getTicket(
        uint _event_id,
        uint _ticket_id
    ) external view returns (LibStorage.Ticket memory) {
        return ticketsValidity[_event_id][_ticket_id];
    }

    function createTickets(
        uint _event_id,
        uint _quantity,
        uint _price
    ) external onlyRole(CREATOR_ROLE) {
        require(
            msg.sender == events[_event_id].author,
            "Vous devez etre author de l event"
        );
        require(_price > 0, "Not rigth price");
        require(_quantity > 0, "Not rigth quantity");

        _mint(msg.sender, _event_id, _quantity, "");
        setApprovalForAll(address(this), true);

        events[_event_id].limitTickets = _quantity;
        ticketsValidity[_event_id][0] = LibStorage.Ticket(
            false,
            _price,
            msg.sender,
            LibStorage.TicketStatus.consumed
        );

        emit LibStorage.TicketPurchased(_event_id, 0, msg.sender);

        emit LibStorage.NewTickets(_event_id, _quantity, msg.sender);
    }

    function buyTicket(
        uint _event_id,
        uint _quantity
    ) external payable onlyRole(MEMBER_ROLE) {
        require(
            events[_event_id].status == LibStorage.EventStatus.buyingTicket,
            "Its not rigth status"
        );

        uint totalPrice = ticketsValidity[_event_id][0].price * _quantity;
        uint totalFees = LibFees.calcFees(totalPrice);

        require(
            usdtToken.balanceOf(msg.sender) > totalPrice + totalFees,
            "You have not the fund"
        );
        address seller = events[_event_id].author;

        // Paid fees for contract
        usdtToken.transferFrom(msg.sender, address(this), totalFees);

        // Paid creator event
        usdtToken.transferFrom(
            msg.sender,
            events[_event_id].author,
            totalPrice
        );

        ERC1155(address(this)).safeTransferFrom(
            address(seller),
            msg.sender,
            _event_id,
            _quantity,
            ""
        );

        for (uint i = 0; i < _quantity; i++) {
            ticketsValidity[_event_id][
                events[_event_id].totalSold + i + 1
            ] = LibStorage.Ticket(
                true,
                ticketsValidity[_event_id][0].price,
                msg.sender,
                LibStorage.TicketStatus.saleable
            );
        }

        emit LibStorage.TicketPurchased(_event_id, _quantity, msg.sender);

        events[_event_id].totalSold += _quantity;
    }

    function consumeTicket(
        uint _event_id,
        uint _ticket_id
    ) external onlyRole(MEMBER_ROLE) {
        require(balanceOf(msg.sender, _event_id) > 0, "You have not ticket");
        require(
            ticketsValidity[_event_id][_ticket_id].isValid,
            "Ticket consumed"
        );

        ticketsValidity[_event_id][_ticket_id].isValid = false;

        emit LibStorage.TicketConsumed(_event_id, _ticket_id, msg.sender);
    }

    function sumRecovery() external onlyRole(ADMIN_ROLE) {
        uint totalSum = usdtToken.balanceOf(address(this));
        usdtToken.transfer(firstOwner, totalSum);
        emit LibStorage.SumRecovered(totalSum, msg.sender);
    }

    // function offerTicket(
    //     address _addr,
    //     uint _event_id,
    //     uint _ticket_id
    // ) external onlyRole(MEMBER_ROLE) {
    //     require(balanceOf(msg.sender, _event_id) > 0, "Not fund");

    //     safeTransferFrom(msg.sender, _addr, _event_id, 1, "");
    //     ticketsValidity[_event_id][_ticket_id].owner = _addr;

    //     emit LibStorage.TicketPurchased(_event_id, 1, _addr);
    // }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
