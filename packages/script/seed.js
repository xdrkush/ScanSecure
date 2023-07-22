import { parseEther } from "viem";
import { config, client, owner, second, third, fourth } from "./config/index.js";

async function init(req, res) {
    console.log('init')

    // Transfert USDT
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.tether.abi,
    //         address: config.contracts.tether.address,
    //         functionName: 'transfer',
    //         account: owner,
    //         args: [second.address, 15000 * (10 ** 18)]
    //     })
    //     console.log('transfer', data)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.tether.abi,
    //         address: config.contracts.tether.address,
    //         functionName: 'transfer',
    //         account: owner,
    //         args: [third.address, 10000 * (10 ** 18)]
    //     })
    //     console.log('transfer', data)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.tether.abi,
    //         address: config.contracts.tether.address,
    //         functionName: 'transfer',
    //         account: owner,
    //         args: [fourth.address, 10000 * (10 ** 18)]
    //     })
    //     console.log('transfer', data)
    // } catch (error) {
    //     console.log(error.message)
    // }

    // // BalanceOf
    // try {
    //     const data = await client.readContract({
    //         abi: config.contracts.tether.abi,
    //         address: config.contracts.tether.address,
    //         functionName: 'balanceOf',
    //         args: [config.contracts.scanSecure.address]
    //     })
    //     console.log('balanceOf ScanSecure', data)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.readContract({
    //         abi: config.contracts.tether.abi,
    //         address: config.contracts.tether.address,
    //         functionName: 'balanceOf',
    //         args: [owner.address]
    //     })
    //     console.log('balanceOf owner', data)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.readContract({
    //         abi: config.contracts.tether.abi,
    //         address: config.contracts.tether.address,
    //         functionName: 'balanceOf',
    //         args: [second.address]
    //     })
    //     console.log('balanceOf second', data)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.readContract({
    //         abi: config.contracts.tether.abi,
    //         address: config.contracts.tether.address,
    //         functionName: 'balanceOf',
    //         args: [third.address]
    //     })
    //     console.log('balanceOf third', data)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.readContract({
    //         abi: config.contracts.tether.abi,
    //         address: config.contracts.tether.address,
    //         functionName: 'balanceOf',
    //         args: [third.address]
    //     })
    //     console.log('balanceOf fourth', data)
    // } catch (error) {
    //     console.log(error.message)
    // }

    // // Register
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'register',
    //         account: second,
    //         args: ["User1"]
    //     })
    //     console.log('register user 1', data)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'register',
    //         account: third,
    //         args: ["User2"]
    //     })
    //     console.log('register user 2', data)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'register',
    //         account: fourth,
    //         args: ["User3"]
    //     })
    //     console.log('register user 3', data)
    // } catch (error) {
    //     console.log(error.message)
    // }

    // // AskCertification
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'askCertification',
    //         account: second,
    //         args: ["Ask User1"]
    //     })
    //     console.log('askCertification user 1', data)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'askCertification',
    //         account: third,
    //         args: ["Ask User2"]
    //     })
    //     console.log('askCertification user 2', data)
    // } catch (error) {
    //     console.log(error.message)
    // }

    // // AnswerCertification
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'certificationAnswer',
    //         account: owner,
    //         args: [true, second.address]
    //     })
    //     console.log('certificationAnswer user 1', data)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'certificationAnswer',
    //         account: owner,
    //         args: [true, third.address]
    //     })
    //     console.log('certificationAnswer user 2', data)
    // } catch (error) {
    //     console.log(error.message)
    // }

    // // CreateEvent
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'createEvent',
    //         account: second,
    //         args: ["Event1"]
    //     })
    //     console.log('createEvent user 1', data)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'createEvent',
    //         account: third,
    //         args: ["Event2"]
    //     })
    //     console.log('createEvent user 2', data)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'createEvent',
    //         account: second,
    //         args: ["Event3"]
    //     })
    //     console.log('createEvent user 1', data)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'createEvent',
    //         account: third,
    //         args: ["Event4"]
    //     })
    //     console.log('createEvent user 2', data)
    // } catch (error) {
    //     console.log(error.message)
    // }

    // // CreateTicket
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'createTickets',
    //         account: second,
    //         args: [0, 1000, 10 * (10 ** 9)]
    //     })
    //     const data2 = await client.writeContract({
    //         abi: config.contracts.scanSecureERC1155.abi,
    //         address: config.contracts.scanSecureERC1155.address,
    //         functionName: 'setApprovalForAll',
    //         account: second,
    //         args: [config.contracts.scanSecure.address, true]
    //     })
    //     console.log('CreateTickets user 1 & setApprovalForAll', data, data2)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'createTickets',
    //         account: third,
    //         args: [3, 1500, 20 * (10 ** 9)]
    //     })
    //     const data2 = await client.writeContract({
    //         abi: config.contracts.scanSecureERC1155.abi,
    //         address: config.contracts.scanSecureERC1155.address,
    //         functionName: 'setApprovalForAll',
    //         account: third,
    //         args: [config.contracts.scanSecure.address, true]
    //     })
    //     console.log('CreateTickets user 2 & setApprovalForAll', data, data2)
    // } catch (error) {
    //     console.log(error.message)
    // }

    // GeEvent
    // try {
    //     const data = await client.readContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'getEvent',
    //         account: owner,
    //         args: [0]
    //     })
    //     console.log('getEvent 0', data)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.readContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'getEvent',
    //         account: owner,
    //         args: [3]
    //     })
    //     console.log('getEvent 1', data)
    // } catch (error) {
    //     console.log(error.message)
    // }

    // GetTicket
    // try {
    //     const data = await client.readContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'getTicket',
    //         account: owner,
    //         args: [0, 0]
    //     })
    //     console.log('GetTicket 0', data)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.readContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'getTicket',
    //         account: owner,
    //         args: [3, 0]
    //     })
    //     console.log('GetTicket 1', data)
    // } catch (error) {
    //     console.log(error.message)
    // }


    // SetStatus
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'setStatusEvent',
    //         account: second,
    //         args: [0]
    //     })
    //     console.log('setStatusEvent user 1', data)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'setStatusEvent',
    //         account: third,
    //         args: [3]
    //     })
    //     console.log('setStatusEvent user 2', data)
    // } catch (error) {
    //     console.log(error.message)
    // }

    const calcFees = (_sumNoFees) => {
        const fee = _sumNoFees * BigInt(5) / BigInt(100);
        const total = BigInt(_sumNoFees + fee)
        return {
            price: _sumNoFees, fee,
            total: BigInt(total.toString()),
        }
    }

    // BuyTickets
    // try {
    //     const buyer = fourth, quantity = BigInt(10), idEvent = 0;

    //     const ticket = await client.readContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'getTicket',
    //         account: buyer,
    //         args: [idEvent, 0]
    //     })
    //     const data = await client.writeContract({
    //         abi: config.contracts.tether.abi,
    //         address: config.contracts.tether.address,
    //         functionName: 'allowance',
    //         account: buyer,
    //         args: [buyer.address, config.contracts.scanSecure.address]
    //     })
    //     const data1 = await client.writeContract({
    //         abi: config.contracts.tether.abi,
    //         address: config.contracts.tether.address,
    //         functionName: 'approve',
    //         account: buyer,
    //         args: [config.contracts.scanSecure.address, calcFees(ticket.price * quantity).total]
    //     })
    //     const data2 = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'buyTicket',
    //         account: buyer,
    //         args: [idEvent, quantity]
    //     })
    //     console.log('buyTicket event 1 - 10', ticket, data, data1, data2)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const buyer = fourth, quantity = BigInt(50), idEvent = 3;

    //     const ticket = await client.readContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'getTicket',
    //         account: buyer,
    //         args: [idEvent, 0]
    //     })
    //     const data = await client.writeContract({
    //         abi: config.contracts.tether.abi,
    //         address: config.contracts.tether.address,
    //         functionName: 'allowance',
    //         account: buyer,
    //         args: [buyer.address, config.contracts.scanSecure.address]
    //     })
    //     const data1 = await client.writeContract({
    //         abi: config.contracts.tether.abi,
    //         address: config.contracts.tether.address,
    //         functionName: 'approve',
    //         account: buyer,
    //         args: [config.contracts.scanSecure.address, calcFees(ticket.price * quantity).total]
    //     })
    //     const data2 = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'buyTicket',
    //         account: buyer,
    //         args: [idEvent, quantity]
    //     })
    //     console.log('buyTicket event 1 - 10', ticket, data, data1, data2)
    // } catch (error) {
    //     console.log(error.message)
    // }

    // SumRecovery
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'sumRecovery',
    //         account: owner,
    //     })
    //     console.log('SumRecovery owner', data)
    // } catch (error) {
    //     console.log(error.message)
    // }

    // SetApproval No Creator -> offer & consume
    // try {
    //     const data = await client.writeContract({
    //         abi: config.contracts.scanSecureERC1155.abi,
    //         address: config.contracts.scanSecureERC1155.address,
    //         functionName: 'setApprovalForAll',
    //         account: fourth,
    //         args: [config.contracts.scanSecure.address, true]
    //     })
    // } catch (error) {
    //     console.log(error)
    // }

    // OfferTicket
    // try {
    //     const data1 = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'offerTicket',
    //         account: fourth,
    //         args: [second.address, 0, 2]
    //     })
    //     console.log('OfferTicket fourth > second  | event: 0: ticket: 1', data1)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data1 = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'offerTicket',
    //         account: fourth,
    //         args: [second.address, 0, 1]
    //     })
    //     console.log('OfferTicket fourth > second >  | event: 0: ticket: 1', data1)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data1 = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'offerTicket',
    //         account: fourth,
    //         args: [third.address, 3, 1]
    //     })
    //     console.log('OfferTicket fourth > third | event: 3: ticket: 1', data1)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data1 = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'offerTicket',
    //         account: third,
    //         args: [second.address, 3, 1]
    //     })
    //     console.log('OfferTicket third > second | event: 3: ticket: 1', data1)
    // } catch (error) {
    //     console.log(error.message)
    // }


    // Consume Ticket
    // try {
    //     const data1 = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'consumeTicket',
    //         account: fourth,
    //         args: [0, 3]
    //     })
    //     console.log('Consume Ticket fourth | event: 0: ticket: 3', data1)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // try {
    //     const data1 = await client.writeContract({
    //         abi: config.contracts.scanSecure.abi,
    //         address: config.contracts.scanSecure.address,
    //         functionName: 'consumeTicket',
    //         account: second,
    //         args: [0, 1]
    //     })
    //     console.log('Consume Ticket fourth | event: 0: ticket: 1', data1)
    // } catch (error) {
    //     console.log(error.message)
    // }
}

init()