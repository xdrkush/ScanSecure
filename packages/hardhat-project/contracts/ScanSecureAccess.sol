// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Library
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import { LibScanSecure } from "./libs/LibScanSecure.sol";
import { ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE } from "./libs/Roles.sol";

contract ScanSecureAccess is AccessControlUpgradeable {
    function initialize() external initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, ADMIN_ROLE);
        _grantRole(ADMIN_ROLE, _msgSender());
    }

    // Functions
    function register() external {
        LibScanSecure.Data storage data = _data();
        require(!data.whitelist[msg.sender], "Vous etes deja inscrit");
        data.whitelist[msg.sender] = true;

        _grantRole(MEMBER_ROLE, msg.sender);

        emit LibScanSecure.Whitelisted(msg.sender);
    }

    function isWhitelisted(address _addr) external view returns (bool) {
        LibScanSecure.Data storage data = _data();
        return data.whitelist[_addr];
    }

    // Internal storage
    function _data() internal pure virtual returns (LibScanSecure.Data storage) {
        return LibScanSecure.accessData();
    }
}