// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ScanSecureERC1155.sol";
import "./ScanSecureLibStorage.sol";
import {LibFees} from "../libs/LibFees.sol";

abstract contract ScanSecureStorage is ScanSecureLibStorage {
    ERC20 usdtToken;
    ScanSecureERC1155 ScErc1155;
    address internal firstOwner;

    constructor(address _addrUSDT, address _addrERC1155) {
        ScErc1155 = ScanSecureERC1155(_addrERC1155);
        usdtToken = ERC20(_addrUSDT);
        firstOwner = msg.sender;
    }

    // State
    Event[] events;
    mapping(address => User) members;
    mapping(uint => mapping(uint => Ticket)) ticketsValidity;
    uint public eventLastId;
    uint public totalMembers;

}
