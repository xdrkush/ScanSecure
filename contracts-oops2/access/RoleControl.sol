// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

// Library
import {LibStorage} from "../libs/LibStorage.sol";

abstract contract RoleControl {
    /**
     * @dev Prevents an account to use a function if it
     * hasn't the `role`
     *
     * @param role the role allowed
     */
    modifier checkedRole(bytes32 role) {
        bytes32 senderRole = LibStorage.accessData().members[msg.sender].role;

        // NOTE Cannot use this modifier for multiple role:
        // user has one of (A|B) roles => not possible yet

        if (senderRole == 0 || senderRole != role)
            revert LibStorage.MissingRole(msg.sender, role);
        _;
    }
}
