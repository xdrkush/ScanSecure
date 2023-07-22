// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../store/ScanSecureStorage.sol";

// Library
import {ADMIN_ROLE, CREATOR_ROLE, MEMBER_ROLE} from "../utils/Roles.sol";

/**
 * @title ScanSecureAccess
 * @dev This contract extends AccessControl and ScanSecureStorage, providing access control and user registration functionalities for the ScanSecure application.
 */
contract ScanSecureAccess is AccessControl, ScanSecureStorage {
    constructor(
        address _addrUSDT,
        address _addrERC1155
    ) ScanSecureStorage(_addrUSDT, _addrERC1155) {}

    /**
     * @dev Allows a user to register with a pseudo.
     * @param _pseudo The pseudo to register with.
     * @notice The pseudo must not be empty, and the user must not already be registered as a member.
     * The user is assigned the MEMBER_ROLE, and their total registration count is incremented.
     * An event is emitted to indicate that the user has been whitelisted.
     */
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

    /**
     * @dev Allows a member to ask for certification with a message.
     * @param _message The message provided by the member requesting certification.
     * @notice The message must not be empty, and the user must not have already requested certification or be registered as a creator.
     * The user's status is set to 'pending' for certification.
     * An event is emitted to indicate that the user has asked for certification.
     */
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

    /**
     * @dev Allows an admin to answer the certification request for a member.
     * @param _choose The choice of certification (true for succeeded, false for noAsked).
     * @param _asker The address of the member who requested certification.
     * @notice Only an admin can answer the certification request.
     * If `_choose` is true, the user's status is set to 'succeeded', and they are granted the CREATOR_ROLE.
     * If `_choose` is false, the user's status is set to 'noAsked'.
     * An event is emitted to indicate the certification status change.
     */
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
            CertificationStatus status = CertificationStatus.succeeded;

            members[_asker].status = status;
            _grantRole(CREATOR_ROLE, _asker);

            emit Certified(_asker, status);
        }
    }

    /**
     * @dev Retrieves the user information for the specified address.
     * @param _addr The address of the user to retrieve information for.
     * @return The User structure containing the pseudo and certification status of the user.
     * @notice The user must exist in the list of members.
     */
    function getUser(address _addr) external view returns (User memory) {
        User memory user = members[_addr];
        require(bytes(user.pseudo).length > 0, "User not exist");
        return user;
    }
}
