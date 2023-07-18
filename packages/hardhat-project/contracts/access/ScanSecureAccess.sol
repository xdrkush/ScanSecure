// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../store/ScanSecureStorage.sol";
import {LibStorage} from "../libs/LibStorage.sol";

// Library
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "../utils/Roles.sol";

abstract contract ScanSecureAccess is AccessControl, ScanSecureStorage {
    constructor(address _addrUSDT) ScanSecureStorage(_addrUSDT) { }

    // Functions
    function register(string calldata _pseudo) external {
        require(!hasRole(MEMBER_ROLE, msg.sender), "Vous etes deja inscrit");

        members[msg.sender] = LibStorage.User(_pseudo, LibStorage.CertificationStatus.noAsked);
        _grantRole(MEMBER_ROLE, msg.sender);

        emit LibStorage.Whitelisted(msg.sender);
    }
    function askCertification(string calldata _message) external onlyRole(MEMBER_ROLE) {
        require(!hasRole(CREATOR_ROLE, msg.sender), "Vous etes deja certifie");
        LibStorage.CertificationStatus status = LibStorage.CertificationStatus.pending;

        members[msg.sender].status = status;

        emit LibStorage.AskCertification(msg.sender, _message);
    }

    function certificationAnswer(
        bool _choose,
        address _asker
    ) external onlyRole(ADMIN_ROLE) {
        if (!_choose) {
            LibStorage.CertificationStatus status = LibStorage.CertificationStatus.noAsked;

            members[_asker].status = status;

        } else {
            LibStorage.CertificationStatus status = LibStorage.CertificationStatus.succeeded;

            members[_asker].status = status;
            _grantRole(CREATOR_ROLE, _asker);

            emit LibStorage.Certified(_asker, status);
        }
    }

    function getUser(address _addr) external view returns (LibStorage.User memory) {
        return members[_addr];
    }

}