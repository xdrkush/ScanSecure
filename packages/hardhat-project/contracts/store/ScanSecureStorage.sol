// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ScanSecureERC1155.sol";
import "./ScanSecureLibStorage.sol";
import {LibFees} from "../libs/LibFees.sol";

/**
 * @title ScanSecureStorage
 * @dev This contract serves as the storage contract for the ScanSecure application.
 * @notice It manages the state and storage variables required for the application.
 */
abstract contract ScanSecureStorage is ScanSecureLibStorage {
    ERC20 usdtToken;
    ScanSecureERC1155 ScErc1155;
    address internal firstOwner;

    /**
     * @dev Constructor to initialize the ScanSecureStorage contract.
     * @param _addrUSDT The address of the ERC20 (USDT) contract.
     * @param _addrERC1155 The address of the ERC1155 contract.
     * It sets the addresses for the USDT token and the ERC1155 contract.
     * The deployer of the contract is set as the first owner.
     */
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
