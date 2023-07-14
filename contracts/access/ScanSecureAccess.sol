// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Openzeppelin
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

// Library
import {LibScanSecure} from "../libs/LibScanSecure.sol";
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "../utils/Roles.sol";

contract ScanSecureAccess is AccessControlUpgradeable {
    function initialize() external initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, ADMIN_ROLE);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // Functions
    function register(string calldata _pseudo) external {
        require(!hasRole(MEMBER_ROLE, msg.sender), "Vous etes deja inscrit");
        LibScanSecure.Data storage data = _data();

        data.members[msg.sender].pseudo = _pseudo;
        _grantRole(MEMBER_ROLE, msg.sender);

        emit LibScanSecure.Whitelisted(msg.sender);
    }

    function askCertification() external onlyRole(MEMBER_ROLE) {
        require(!hasRole(CREATOR_ROLE, msg.sender), "Vous etes deja certifie");
        LibScanSecure.Data storage data = _data();
        LibScanSecure.CertificationStatus status = LibScanSecure
            .CertificationStatus
            .pending;

        data.members[msg.sender].status = status;
        _grantRole(MEMBER_ROLE, msg.sender);

        emit LibScanSecure.Certification(msg.sender, status);
    }

    function certificationAnswer(bool _choose, address _asker) external onlyRole(ADMIN_ROLE) {
        LibScanSecure.Data storage data = _data();

        if (!_choose) {
            LibScanSecure.CertificationStatus status = LibScanSecure
                .CertificationStatus
                .canceled;

            data.members[_asker].status = status;

            emit LibScanSecure.Certification(_asker, status);
        } else {
            LibScanSecure.CertificationStatus status = LibScanSecure
                .CertificationStatus
                .succeeded;

            data.members[_asker].status = status;
            _grantRole(CREATOR_ROLE, _asker);

            emit LibScanSecure.Certification(_asker, status);
        }
    }

    // Internal storage
    function _data()
        internal
        pure
        virtual
        returns (LibScanSecure.Data storage)
    {
        return LibScanSecure.accessData();
    }
}
