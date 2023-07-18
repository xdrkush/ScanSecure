// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

library LibFees {
    uint private constant FEES_PERCENTAGE = 5;

    function calcFees(uint _price) internal pure returns (uint) {
        require(_price > 0, "Not rigth price");
        uint fee = (_price * FEES_PERCENTAGE) / 100;
        return fee;
    }
}