// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TetherToken is ERC20 {
    constructor() ERC20("TETHER", "USDT") {
        _mint(msg.sender, 420000000);
    }
}