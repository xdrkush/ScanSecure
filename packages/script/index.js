import { config, client, account } from "./config/index.js";

async function init() {
    console.log('init')

    // Total supplyt
    try {
        const data = await client.readContract({
            abi: config.contracts.tether.abi,
            address: config.contracts.tether.address,
            functionName: 'totalSupply'
        })
        console.log('data', data)
    } catch (error) {
        console.log(error.message)
    }

    // Register Owner
    // try {
    //     const { request } = await client.writeContract({
    //         account,
    //         address: config.contracts.scanSecure.address,
    //         abi: config.contracts.scanSecure.abi,
    //         functionName: 'register',
    //         args: ["Owner"]
    //     })
    //     const hash = await client.writeContract(request)
    //     console.log('hash', hash)
    // } catch (error) {
    //     console.log(error.message)
    // }
}

init()