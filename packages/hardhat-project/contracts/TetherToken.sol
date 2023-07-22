// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title A simulator ERC20 (USDT) for ScanSecure
 * @author xDrKush
 * @notice You can use this contract for only the most basic simulation
 * @dev This contract is joined with ScanSecure (is original erc20)
 * @custom:experimental This is an experimental contract realised for diplome in AlyraSchool.
 */

contract TetherToken is ERC20 {
    uint256 constant initialSupply = 420000000 * (10**18);
    constructor() ERC20("TETHER", "USDT") {
        _mint(msg.sender, initialSupply);
    }
}