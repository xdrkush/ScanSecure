// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "./store/ScanSecureStore.sol";

// Library
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { LibScanSecure } from "./libs/LibScanSecure.sol";

contract ScanSecure is ScanSecureStore  {
    
    receive() external payable {}

    fallback() external payable {}

}
