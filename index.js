import { mainnet, sepolia, hardhat, polygonMumbai } from "wagmi/chains";
import { createWalletClient, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import dotenv from "dotenv"
dotenv.config()

/*
 * mkdir script && cd script
 * npm init -y
 * npm i dotenv viem wagmi
 */ 

/*
 * Env
 * *** */

// CLIENT_CHAIN=hardhat
// INFURA_PROJECT_ID=
// ETH_PRIVATE_KEY=
// OWNER=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
// SECOND=59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
// THIRD=5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
// FOURTH=7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6


/*
 * Contract
 * ******** */
// Address sepolia: 
// Address local: 
const ticketsMarketplace = {
    address: "",
    abi: []
}

/*
 * Scripts
 * ******* */

// Chain wagmi
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
    account: account
}).extend(publicActions)

export const config = {
    chain: process.env.CLIENT_CHAIN,
    contracts: {
        ticketsMarketplace: {
            address: ticketsMarketplace.address, abi: ticketsMarketplace.abi
        },
    }
}

/*
 * Scripts
 * ******* */

async function init(req, res) {
    console.log('init')

    // Total supplyt
    try {
        const data = await client.readContract({
            abi: ticketsMarketplace.abi,
            address: ticketsMarketplace.address,
            functionName: 'balanceOf',
            args: [owner.address, 1]
        })
        console.log('data', data)
    } catch (error) {
        console.log(error.message)
    }

    // Register Owner
    // try {
    //     const { request } = await client.writeContract({
    //         account,
    //         abi: ticketsMarketplace.abi,
    //         address: ticketsMarketplace.address,
    //         functionName: 'balanceOf',
    //         args: [owner.address, 1]
    //     })
    //     const hash = await client.writeContract(request)
    //     console.log('hash', hash)
    // } catch (error) {
    //     console.log(error.message)
    // }
}

init()