// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../store/ScanSecureStorage.sol";

// Library
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "../utils/Roles.sol";

contract ScanSecureAccess is AccessControl, ScanSecureStorage {
    constructor(
        address _addrUSDT,
        address _addrERC1155
    ) ScanSecureStorage(_addrUSDT, _addrERC1155) {}

    // Functions
    function register(string calldata _pseudo) external {
        require(bytes(_pseudo).length > 0, "The pseudo is empty");
        require(
            !hasRole(MEMBER_ROLE, msg.sender),
            "You are already registred on member"
        );

        members[msg.sender] = User(_pseudo, CertificationStatus.noAsked);
        _grantRole(MEMBER_ROLE, msg.sender);
        totalMembers++;

        emit Whitelisted(msg.sender);
    }

    function askCertification(
        string calldata _message
    ) external onlyRole(MEMBER_ROLE) {
        require(bytes(_message).length > 0, "Your message is empty");
        require(
            uint(members[msg.sender].status) == 0,
            "You are already ask certification"
        );
        require(
            !hasRole(CREATOR_ROLE, msg.sender),
            "You are already registred creator"
        );
        CertificationStatus status = CertificationStatus.pending;

        members[msg.sender].status = status;

        emit AskCertification(msg.sender, _message);
    }

    function certificationAnswer(
        bool _choose,
        address _asker
    ) external onlyRole(ADMIN_ROLE) {
        require(
            members[_asker].status == CertificationStatus.pending,
            "The user are not status asker"
        );
        if (!_choose) {
            CertificationStatus status = CertificationStatus.noAsked;

            members[_asker].status = status;
        } else {
            CertificationStatus status = CertificationStatus
                .succeeded;

            members[_asker].status = status;
            _grantRole(CREATOR_ROLE, _asker);

            emit Certified(_asker, status);
        }
    }

    function getUser(address _addr) external view returns (User memory) {
        User memory user = members[_addr];
        require(bytes(user.pseudo).length > 0, "User not exist");
        return user;
    }
}
