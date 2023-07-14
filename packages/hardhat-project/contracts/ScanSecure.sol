// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "./store/ScanSecureStore.sol";
import "./access/ScanSecureAccess.sol";

// Library
import {LibStorage} from "./libs/LibStorage.sol";
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "./utils/Roles.sol";

contract ScanSecure is ScanSecureAccess, ScanSecureStore {
    constructor(string memory _uri) ScanSecureStore(_uri) {
        _initialize();
    }

    function _initialize() internal {
        _grantRole(ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, ADMIN_ROLE);
        LibStorage.accessData().members[msg.sender].role = ADMIN_ROLE;
    }

    receive() external payable {}

    fallback() external payable {}

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Internal storage
    function _data()
        internal
        pure
        override(ScanSecureAccess, ScanSecureStore)
        returns (LibStorage.Data storage)
    {
        return LibStorage.accessData();
    }
}
