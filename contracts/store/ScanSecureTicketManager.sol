// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Contract
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

//
abstract contract ScanSecureTicketManager is ERC1155 {

    constructor() ERC1155("ipfs://gateway.com/<id>.json") {}
    
}