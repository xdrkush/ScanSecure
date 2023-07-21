import { createPublicClient, http } from 'viem'
import { config, chain } from "../../../config/index.js";

const url = process.env.NEXT_PUBLIC_CLIENT_CHAIN === "hardhat" ? `http://localhost:8545` : `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`

const client = createPublicClient({
    chain: chain,
    transport: http(url)
})

export default async function handler(req, res) {
    try {
        const data = await client.readContract({
            abi: config.contracts.tether.abi,
            address: config.contracts.tether.address,
            functionName: 'totalSupply'
        })
        res.status(200).json({
            data: {
                totalSuplly: String(data)
            }
        })
    } catch (error) {
        res.status(400).json({ error })
    }
}