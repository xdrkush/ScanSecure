// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "./store/ScanSecureStore.sol";

// Library
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "./utils/Roles.sol";
/**
 * @title ScanSecure
 * @dev This contract extends ScanSecureStore and represents a basic simulation of the ScanSecure application.
 * @author xDrKush
 * @notice This contract is intended for experimental use and basic simulation purposes only.
 * @custom:experimental This is an experimental contract realized for a diploma in AlyraSchool.
 */
contract ScanSecure is ScanSecureStore {
    constructor(
        address _addrUSDT,
        address _addrERC1155
    ) ScanSecureStore(_addrUSDT, _addrERC1155) {
        _initialize();
    }
    /**
     * @dev Private function to initialize the contract and grant roles to the contract deployer.
     * This function grants the MEMBER_ROLE, CREATOR_ROLE, and ADMIN_ROLE to the contract deployer.
     * It also sets up the DEFAULT_ADMIN_ROLE and assigns ADMIN_ROLE as its admin role.
     */
    function _initialize() private {
        _grantRole(MEMBER_ROLE, msg.sender);
        _grantRole(CREATOR_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, ADMIN_ROLE);
    }

    /**
     * @dev Fallback function to receive Ether sent to the contract.
     * This function is payable and allows the contract to receive Ether.
     */
    receive() external payable {}
    /**
     * @dev Fallback function to receive Ether sent to the contract without any function call.
     * This function is payable and allows the contract to receive Ether when no valid function is called.
     */
    fallback() external payable {}

}
