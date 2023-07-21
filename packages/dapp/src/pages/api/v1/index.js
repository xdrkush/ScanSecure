import { createPublicClient, http } from 'viem'
import { chain } from "../../../config/index.js";

const url = process.env.NEXT_PUBLIC_CLIENT_CHAIN === "hardhat" ? `http://localhost:8545`: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`

const client = createPublicClient({
    chain: chain,
    transport: http(url)
})

export default async function handler(req, res) {
    try {
        const blockNumber = String(await client.getBlockNumber())
        res.status(200).json({
            data: {
                blockNumber
            }
        })
    } catch (error) {
        res.status(400).json({ error })
    }
}