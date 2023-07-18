// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {LibStorage} from "../libs/LibStorage.sol";

abstract contract ScanSecureStorage {
    ERC20 internal usdtToken;
    address internal firstOwner;

    constructor(address _addrUSDT) {
        usdtToken = ERC20(_addrUSDT);
        firstOwner = msg.sender;
    }

    // State
    LibStorage.Event[] events;
    mapping(address => LibStorage.User) members;
    mapping(uint => mapping(uint => LibStorage.Ticket)) ticketsValidity;
    uint eventLastId;
    uint totalMembers;
    uint ticketLastId;
    uint totalTickets;

}
