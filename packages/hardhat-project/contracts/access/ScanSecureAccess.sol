// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./RoleControl.sol";
import {LibStorage} from "../libs/LibStorage.sol";

// Library
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "../utils/Roles.sol";

contract ScanSecureAccess is AccessControl, RoleControl {

    // Functions
    function register(string calldata _pseudo) external {
        require(!hasRole(MEMBER_ROLE, msg.sender), "Vous etes deja inscrit");
        LibStorage.Data storage data = _data();

        data.members[msg.sender].pseudo = _pseudo;
        data.members[msg.sender].role = MEMBER_ROLE;
        _grantRole(MEMBER_ROLE, msg.sender);

        emit LibStorage.Whitelisted(msg.sender);
    }

    function askCertification() external checkedRole(MEMBER_ROLE) {
        require(!hasRole(CREATOR_ROLE, msg.sender), "Vous etes deja certifie");
        LibStorage.Data storage data = _data();
        LibStorage.CertificationStatus status = LibStorage
            .CertificationStatus
            .pending;

        data.members[msg.sender].status = status;

        emit LibStorage.Certification(msg.sender, status);
    }

    function certificationAnswer(
        bool _choose,
        address _asker
    ) external checkedRole(ADMIN_ROLE) {
        LibStorage.Data storage data = _data();
        if (!_choose) {
            LibStorage.CertificationStatus status = LibStorage
                .CertificationStatus
                .canceled;

            data.members[_asker].status = status;

            emit LibStorage.Certification(_asker, status);
        } else {
            LibStorage.CertificationStatus status = LibStorage
                .CertificationStatus
                .succeeded;

            data.members[_asker].status = status;
            data.members[_asker].role = CREATOR_ROLE;
            _grantRole(CREATOR_ROLE, _asker);

            emit LibStorage.Certification(_asker, status);
        }
    }

    function getUser(address _addr) external view returns (LibStorage.User memory) {
        return LibStorage.accessData().members[_addr];
    }

    // Internal storage
    function _data() internal pure virtual returns (LibStorage.Data storage) {
        return LibStorage.accessData();
    }
}
