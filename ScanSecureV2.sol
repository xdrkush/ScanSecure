// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "./access/ScanSecureAccess.sol";
import "./store/ScanSecureStore.sol";

// Library
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { LibScanSecure } from "./libs/LibScanSecure.sol";

contract ScanSecure is OwnableUpgradeable, ScanSecureAccess, ScanSecureStore  {
    
    // Internal storage
    function _data() internal pure override(ScanSecureAccess, ScanSecureStore) returns (LibScanSecure.Data storage) {
        return LibScanSecure.accessData();
    }

    receive() external payable {}

    fallback() external payable {}

    function getTestUpgrade() external pure returns (bool) {
        return true;
    }

}
