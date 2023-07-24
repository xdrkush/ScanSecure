// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

/**
 * @title LibFees
 * @dev A library for calculating fees based on a percentage of the price.
 */
library LibFees {
    uint private constant FEES_PERCENTAGE = 5;

    /**
     * @dev Calculates the fees based on a percentage of the given price.
     * @param _price The price for which to calculate the fees.
     * @return The calculated fee amount.
     * @notice The price must be greater than zero to calculate the fees.
     */
    function calcFees(uint _price) internal pure returns (uint) {
        require(_price > 0, "Not rigth price");
        uint fee = (_price * FEES_PERCENTAGE) / 100;
        return fee;
    }
}
