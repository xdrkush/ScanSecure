// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "./ScanSecureAccess.sol";
import "./ScanSecureStore.sol";

// Library
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import { LibScanSecure } from "./libs/LibScanSecure.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/**
 * @title A simulator for
 * @author xDrKush
 * @notice You can use this contract for only the most basic simulation
 * @dev All function calls are currently implemented without side effects
 * @custom:experimental This is an experimental contract.
 */

contract ScanSecureV2 is OwnableUpgradeable, ScanSecureAccess, ScanSecureStore  {
    constructor() { }

    // Internal storage
    function _data() internal pure override(ScanSecureAccess, ScanSecureStore) returns (LibScanSecure.Data storage) {
        return LibScanSecure.accessData();
    }

    receive() external payable {}

    fallback() external payable {}

    function getTest() external pure returns (bool) {
        return true;
    }

}
