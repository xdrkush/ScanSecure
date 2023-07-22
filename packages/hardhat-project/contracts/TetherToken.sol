// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title TetherToken
 * @dev A simulator ERC20 (USDT) for ScanSecure
 * @author xDrKush
 * @notice You can use this contract for only the most basic simulation
 * @custom:experimental This is an experimental contract realized for a diploma in AlyraSchool.
 */
contract TetherToken is ERC20 {
    uint256 constant initialSupply = 420000000 * (10 ** 18);

    /**
     * @dev Constructor to initialize the TetherToken contract.
     * It mints the initial supply of USDT tokens and assigns them to the contract deployer.
     */
    constructor() ERC20("TETHER", "USDT") {
        _mint(msg.sender, initialSupply);
    }
}
