// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "./store/ScanSecureStore.sol";

// Library
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "./utils/Roles.sol";

contract ScanSecure is ScanSecureStore {
    constructor(
        address _addrUSDT,
        address _addrERC1155
    ) ScanSecureStore(_addrUSDT, _addrERC1155) {
        _initialize();
    }

    function _initialize() private {
        _grantRole(MEMBER_ROLE, msg.sender);
        _grantRole(CREATOR_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, ADMIN_ROLE);
    }

    receive() external payable {}

    fallback() external payable {}

}
