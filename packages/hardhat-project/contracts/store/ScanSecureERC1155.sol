// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/**
 * @title ScanSecureERC1155
 * @dev This contract extends ERC1155 and represents a custom ERC1155 token for the ScanSecure application.
 */
contract ScanSecureERC1155 is ERC1155 {
    address public owner;

    /**
     * @dev Constructor to initialize the ScanSecureERC1155 contract.
     * @param _uri The base URI for the ERC1155 token.
     * It sets the deployer of the contract as the owner.
     */
    constructor(string memory _uri) ERC1155(_uri) {
        owner = msg.sender;
    }

    /**
     * @dev Mint function to create new ERC1155 tokens and assign them to the specified address.
     * @param _addr The address to which the newly created tokens will be assigned.
     * @param _event_id The identifier of the event for which to create the tokens.
     * @param _quantity The quantity of tokens to create.
     * @notice The function mints the specified quantity of ERC1155 tokens and assigns them to the specified address.
     */
    function mint(address _addr, uint _event_id, uint _quantity) external {
        _mint(_addr, _event_id, _quantity, "");
    }
}
