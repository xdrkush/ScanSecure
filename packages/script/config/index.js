import { mainnet, sepolia, hardhat, polygonMumbai } from "wagmi/chains";
import { createWalletClient, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
// Import contract
import scansecure from "../../../config/abis/scansecure.js";
import scansecureERC1155 from "../../../config/abis/scansecureERC1155.js";
import tethertoken from "../../../config/abis/tethertoken.js";
import dotenv from "dotenv"
dotenv.config()

/*
 * Client viem
 */

export let chain
const loadChain = () => {
    switch (process.env.CLIENT_CHAIN) {
        case "mainnet":
            chain = mainnet
            break;
        case "sepolia":
            chain = sepolia
            break;
        case "mumbai":
            chain = polygonMumbai
            break;

        default:
            chain = hardhat;
            break;
    }
}
loadChain()

// Client viem
const url = process.env.CLIENT_CHAIN === "hardhat" 
? `http://localhost:8545` 
: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`

export const [account, owner, second, third, fourth] = [
    privateKeyToAccount(`0x${process.env.ETH_PRIVATE_KEY}`),
    privateKeyToAccount(`0x${process.env.OWNER}`),
    privateKeyToAccount(`0x${process.env.SECOND}`),
    privateKeyToAccount(`0x${process.env.THIRD}`),
    privateKeyToAccount(`0x${process.env.FOURTH}`),
]

export const client = createWalletClient({
    chain: chain,
    transport: http(url),
    account
}).extend(publicActions)

export const config = {
    chain: process.env.CLIENT_CHAIN,
    contracts: {
        scanSecure: {
            address: scansecure.address, abi: scansecure.abi
        },
        scanSecureERC1155: {
            address: scansecureERC1155.address, abi: scansecureERC1155.abi
        },
        tether: {
            address: tethertoken.address, abi: tethertoken.abi
        }
    }
}
