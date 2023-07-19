// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ScanSecureERC1155 is ERC1155 {
    address public owner;
    constructor(
        string memory _uri
    ) ERC1155(_uri) {
        owner = msg.sender;
    }

    function mint(address _addr, uint _event_id, uint _quantity) external {
        _mint(_addr, _event_id, _quantity, "");
    }

}