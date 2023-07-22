// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "./store/ScanSecureStore.sol";

// Library
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "./utils/Roles.sol";
/**
 * @title ScanSecure
 * @author xDrKush
 * @notice You can use this contract for only the most basic simulation
 * @dev This contract is joined with ScanSecure (is original erc20)
 * @custom:experimental This is an experimental contract realised for diplome in AlyraSchool.
 */
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
