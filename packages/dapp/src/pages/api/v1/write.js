import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { config, chain } from "../../../config/index.js";

const url = process.env.NEXT_PUBLIC_CLIENT_CHAIN === "hardhat" ? `http://localhost:8545` : `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`

console.log(process.env.NEXT_PUBLIC_ETH_PRIVATE_KEY)
const account = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_ETH_PRIVATE_KEY}`)
const client = createWalletClient({
    account,
    chain,
    transport: http(url)
})

export default async function handler(req, res) {
    try {
        const { request } = await client.writeContract({
            account,
            address: config.contracts.scanSecure.address,
            abi: config.contracts.scanSecure.abi,
            functionName: 'register',
            args: ["Owner"]
        })
        const hash = await client.writeContract(request)
        res.status(200).json({
            data: {
                hash: String(hash)
            }
        })
    } catch (error) {
        res.status(400).json({ error })
    }
}