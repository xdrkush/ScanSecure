// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

// Main role for the DAO, this role should be assinged only to the main contract.
// The deployer should have this role to configure the DAO and then `renounceRole`.
bytes32 constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

// Member role, each time this role is modified, the list of member in {LibMembers}
// is modified as well.
bytes32 constant CREATOR_ROLE = keccak256("CREATOR_ROLE");

// Member role, each time this role is modified, the list of member in {LibMembers}
// is modified as well.
bytes32 constant MEMBER_ROLE = keccak256("MEMBER_ROLE");
