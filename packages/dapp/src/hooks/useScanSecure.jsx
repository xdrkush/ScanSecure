import { useState, useEffect, useCallback } from 'react';

import { getWalletClient, getContract, prepareWriteContract, writeContract, readContract, waitForTransaction } from '@wagmi/core'
import { useAccount, useContractEvent, useNetwork } from "wagmi"
import { parseAbiItem, getAddress, parseEther } from 'viem'

import { useNotif } from './useNotif';
import { config, client } from "../config"
import { confetti, MEMBER_ROLE, CREATOR_ROLE, ADMIN_ROLE } from '../utils';

export function useScanSecure() {
    const { isConnected, address } = useAccount()
    const { chain } = useNetwork()
    const { setNotif } = useNotif()

    // init state
    const [scanSecureSC, setScanSecureSC] = useState();
    const [scanSecure1155SC, setScanSecure1155SC] = useState();
    const [tetherSC, setTetherSC] = useState();
    const [contractIsConnected, setContractIsConnected] = useState();
    const [profile, setProfile] = useState()
    const [whitelist, setWhitelist] = useState()
    const [askCertificationLogs, setAskCertificationLogs] = useState()
    const [certifiedLogs, setCertifiedLogs] = useState()
    const [eventCreatedLogs, setEventCreatedLogs] = useState()
    const [eventStatusChangedLogs, setEventStatusChangedLogs] = useState()
    const [newTicketsLogs, setNewTicketsLogs] = useState()
    const [ticketOwneredLogs, setTicketOwneredLogs] = useState()
    const [ticketConsumedLogs, setTicketConsumedLogs] = useState()
    const [sumRecoveredLogs, setSumRecoveredLogs] = useState()

    // Roles
    const [isWhitelisted, setIsWhitelisted] = useState();
    const [isCreator, setIsCreator] = useState();
    const [isAdmin, setIsAdmin] = useState();

    /*
     * Load Contract
     * ************** */
    const loadContract = useCallback(async () => {
        try {
            const walletClient = await getWalletClient()
            const scanSercure = getContract({
                address: getAddress(config.contracts.scanSecure.address),
                abi: config.contracts.scanSecure.abi,
                walletClient
            })
            const scanSecure1155 = getContract({
                address: getAddress(config.contracts.scanSecureERC1155.address),
                abi: config.contracts.scanSecureERC1155.abi,
                walletClient
            })
            const tether = getContract({
                address: getAddress(config.contracts.tether.address),
                abi: config.contracts.tether.abi,
                walletClient
            })

            setScanSecureSC(scanSercure)
            setScanSecure1155SC(scanSecure1155)
            setTetherSC(tether)

            setContractIsConnected(true)
        } catch (error) {
            setNotif({ type: "error", message: "Impossible de se connecter au contrat, êtes vous sur le bon réseaux ?" })
            setContractIsConnected(false)
        }
    }, [setNotif])

    useEffect(() => {
        if (!isConnected) return;
        try {
            loadContract()
        } catch (error) {
            console.log(error)
        }
    }, [isConnected, address, chain?.id, loadContract])

    // Roles
    const checkRoles = useCallback(async () => {
        console.log('checkRoles')
        // IsWhitelisted
        try {
            const data = await readContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'hasRole',
                args: [MEMBER_ROLE, getAddress(address)]
            })
            setIsWhitelisted(data)
        } catch (error) {
            setIsWhitelisted(false)
            setNotif({ type: "error", message: String(error) })
        }
        // IsCreator
        try {
            const data = await readContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'hasRole',
                args: [CREATOR_ROLE, getAddress(address)]
            })
            setIsCreator(data)
        } catch (error) {
            setIsCreator(false)
            setNotif({ type: "error", message: String(error) })
        }
        // IsWhitelisted
        try {
            const data = await readContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'hasRole',
                args: [ADMIN_ROLE, getAddress(address)]
            })
            setIsAdmin(data)
        } catch (error) {
            setIsAdmin(false)
            setNotif({ type: "error", message: String(error) })
        }
    }, [address, setNotif])

    const checkUser = useCallback(async () => {
        console.log('checkUser')
        // Profile user
        try {
            const data = await getUser(address)
            console.log('Profile', data)
            setProfile(data)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }, [address, getUser, setNotif])

    useEffect(() => {
        if (!address || !scanSecureSC || !contractIsConnected) return;
        checkRoles()
        if (!isWhitelisted || !isCreator || !isAdmin) return;
        checkUser()
    }, [address, scanSecureSC, scanSecure1155SC, checkRoles, checkUser, tetherSC, contractIsConnected, isAdmin, isCreator, isWhitelisted])

    /*
     * Utils
     * ************** */
    const transactionsCompleted = async (_request) => {
        const { hash } = await writeContract(_request)
        setNotif({ type: 'info', message: "Transactions Processing..." })
        const data = await waitForTransaction({
            hash: hash,
        })
        setNotif({ type: 'info', message: "Transactions effectué !" })
        confetti(0)
        return data
    }
    const setApprovalForAll = async () => {
        try {
            console.log('setApproval')
            const { request } = await prepareWriteContract({
                address: config.contracts.scanSecureERC1155.address,
                abi: config.contracts.scanSecureERC1155.abi,
                functionName: 'setApprovalForAll',
                args: [config.contracts.scanSecure.address, true]
            })
            await transactionsCompleted(request)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const calcFees = (_price) => {
        const fee = _price * BigInt(5) / BigInt(100);
        console.log('calcFees', typeof _price, _price, fee)
        return {
            price: _price, fee,
            total: parseEther((_price + fee).toString()),
        }
    }
    const approveTether = async (_total) => {
        console.log("approveTether", _total)
        try {
            console.log('setApproval')
            const { request } = await prepareWriteContract({
                address: config.contracts.tether.address,
                abi: config.contracts.tether.abi,
                functionName: 'allowance',
                args: [address, config.contracts.scanSecure.address]
            })
            await transactionsCompleted(request)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
        try {
            console.log('setApproval')
            const { request } = await prepareWriteContract({
                address: config.contracts.tether.address,
                abi: config.contracts.tether.abi,
                functionName: 'approve',
                args: [config.contracts.scanSecure.address, _total]
            })
            await transactionsCompleted(request)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }

    /*
     * Functions
     * ************** */
    const register = async (_pseudo) => {
        try {
            const { request } = await prepareWriteContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'register',
                args: [_pseudo]
            })
            await transactionsCompleted(request)
            await checkRoles()
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const askCertification = async (_message) => {
        try {
            const { request } = await prepareWriteContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'askCertification',
                args: [String(_message)]
            })
            await transactionsCompleted(request)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })

        }
    }

    const answerCertification = async (_bool, _address) => {
        try {
            const { request } = await prepareWriteContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'certificationAnswer',
                args: [_bool, _address]
            })
            await transactionsCompleted(request)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }

    const createEvent = async (_title) => {
        try {
            const { request } = await prepareWriteContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'createEvent',
                args: [_title]
            })
            await transactionsCompleted(request)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const createTickets = async (_event_id, _quantity, _price) => {
        try {
            await setApprovalForAll()
            const { request } = await prepareWriteContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'createTickets',
                args: [_event_id, _quantity, _price]
            })
            await transactionsCompleted(request)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const setStatusEvent = async (_event_id) => {
        try {
            const { request } = await prepareWriteContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'setStatusEvent',
                args: [_event_id]
            })
            await transactionsCompleted(request)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const buyTicket = async (_event_id, _quantity) => {
        try {
            const { price } = await getTicket(_event_id, 0)

            await approveTether(calcFees(price * BigInt(_quantity)).total)

            const { request } = await prepareWriteContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'buyTicket',
                args: [_event_id, _quantity]
            })
            await transactionsCompleted(request)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const offerTicket = async (_address, _event_id, _ticket_id) => {
        try {
            await setApprovalForAll()

            const { request } = await prepareWriteContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'offerTicket',
                args: [_address, _event_id, _ticket_id]
            })
            await transactionsCompleted(request)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const consumeTicket = async (_event_id, _ticket_id) => {
        try {
            const { request } = await prepareWriteContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'consumeTicket',
                args: [_event_id, _ticket_id]
            })
            await transactionsCompleted(request)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const sumRecovery = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'sumRecovery',
                args: []
            })
            await transactionsCompleted(request)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }

    // const incStore = async () => {
    //     if (!isWhitelisted) return;
    //     try {
    //         const { request } = await prepareWriteContract({
    //             address: getAddress(config.contracts.scanSecure.address),
    //             abi: config.contracts.scanSecure.abi,
    //             functionName: 'setStore'
    //         })
    //         await transactionsCompleted(request)
    //         getStore()
    //     } catch (error) {
    //         setNotif({ type: "error", message: String(error) })
    //     }
    // }

    /*
     * Getters
     * ************** */
    const getUser = async (_address) => {
        try {
            const data = await readContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'getUser',
                args: [getAddress(address)]
            })
            return data
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const getEvent = async (_event_id) => {
        try {
            const data = await readContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'getEvent',
                args: [Number(_event_id)]
            })
            return data
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const getTicket = async (_event_id, _ticket_id) => {
        try {
            const data = await readContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'getTicket',
                args: [_event_id, _ticket_id]
            })
            return data
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }

    /*
     * Watcher
     * ************** */
    // useContractEvent({
    //     address: getAddress(config.contracts.scanSecure.address),
    //     abi: config.contracts.scanSecure.abi,
    //     eventName: 'Whitelisted',
    //     listener(log) {
    //         console.log('event1', address, String(log[0].args.addr))
    //         console.log('event1', whitelist, String(address) === String(log[0].args.addr))
    //         if (String(address) === String(log[0].args.addr)) {
    //             setNotif({ type: 'info', message: 'Vous êtes Whitelisted' })
    //             checkRoles()
    //         }
    //         setNotif({ type: 'info', message: String(log[0].args.addr) })
    //         if (!whitelist) return;
    //         setWhitelist([...whitelist, { id: whitelist.length, address: String(log[0].args.addr) }])
    //     }
    // })

    /*
     * Event logs
     * ************** */
    const getWhitelisted = async () => {
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 15000)

        const logs = await client.getLogs({
            address: getAddress(config.contracts.scanSecure.address),
            event: parseAbiItem(
                "event Whitelisted(address addr)"
            ),
            fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
        });

        const arr = (await Promise.all(logs.map(async (log, i) => {
            return { id: Number(i + 1), address: String(log.args.addr) };
        }))).map(w => w)

        console.log('log whitelist', arr)

        setWhitelist(arr)
    }
    const getAskCertification = async () => {
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 15000)

        const logs = await client.getLogs({
            address: getAddress(config.contracts.scanSecure.address),
            event: parseAbiItem(
                "event AskCertification(address addr, string message)"
            ),
            fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
        });

        const arr = (await Promise.all(logs.map(async (log, i) => {
            return { id: Number(i + 1), address: String(log.args.addr), message: String(log.args.message) };
        }))).map(w => w)

        console.log('log askCertification', arr)

        setAskCertificationLogs(arr)
    }
    const getCertified = async () => {
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 15000)

        const logs = await client.getLogs({
            address: getAddress(config.contracts.scanSecure.address),
            event: parseAbiItem(
                "event Certified(address addr, uint8 newStatus)"
            ),
            fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
        });

        const arr = (await Promise.all(logs.map(async (log, i) => {
            return { id: Number(i + 1), address: String(log.args.addr), newStatus: String(log.args.newStatus) };
        }))).map(w => w)

        console.log('log certified', arr)

        setCertifiedLogs(arr)
    }
    const getEventCreated = async () => {
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 15000)

        const logs = await client.getLogs({
            address: getAddress(config.contracts.scanSecure.address),
            event: parseAbiItem(
                "event EventCreated(uint event_id, address author)"
            ),
            fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
        });

        const arr = (await Promise.all(logs.map(async (log, i) => {
            return { id: Number(i + 1), eventId: String(log.args.event_id), address: String(log.args.author) };
        }))).map(w => w)

        console.log('log eventCreatedLogs', arr)

        setEventCreatedLogs(arr)
    }
    const getEventStatusChanged = async () => {
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 15000)

        const logs = await client.getLogs({
            address: getAddress(config.contracts.scanSecure.address),
            event: parseAbiItem(
                "event EventStatusChanged(uint event_id, uint8 oldStatus, uint8 newStatus)"
            ),
            fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
        });

        const ar = (await Promise.all(logs.map(async (log, i) => {
            return { id: Number(i + 1), eventId: String(log.args.event_id), oldStatus: String(log.args.oldStatus), newStatus: String(log.args.newStatus) };
        }))).map(w => w)

        console.log('log eventStatusChanged', ar)

        setEventStatusChangedLogs(ar)
    }
    const getNewTickets = async () => {
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 15000)

        const logs = await client.getLogs({
            address: getAddress(config.contracts.scanSecure.address),
            event: parseAbiItem(
                "event NewTickets(uint event_id, uint quantity, address author)"
            ),
            fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
        });

        const arr = (await Promise.all(logs.map(async (log, i) => {
            return { id: Number(i + 1), eventId: String(log.args.event_id), quantity: String(log.args.quantity), author: String(log.args.author) };
        }))).map(w => w)

        console.log('log newTickets', arr)

        setNewTicketsLogs(arr)
    }
    const getTicketOwnered = async () => {
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 15000)

        const logs = await client.getLogs({
            address: getAddress(config.contracts.scanSecure.address),
            event: parseAbiItem(
                "event TicketOwnered(uint event_id, uint quantity, address buyer)"
            ),
            fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
        });

        const arr = (await Promise.all(logs.map(async (log, i) => {
            return { id: Number(i + 1), eventId: String(log.args.event_id), quantity: String(log.args.quantity), buyer: String(log.args.buyer) };
        }))).map(w => w)

        console.log('log ticketOwnered', arr)

        setTicketOwneredLogs(arr)
    }
    const getTicketConsumed = async () => {
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 15000)

        const logs = await client.getLogs({
            address: getAddress(config.contracts.scanSecure.address),
            event: parseAbiItem(
                "event TicketConsumed(uint event_id, uint ticket_id, address consumer)"
            ),
            fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
        });

        const arr = (await Promise.all(logs.map(async (log, i) => {
            return { id: Number(i + 1), eventId: String(log.args.event_id), ticketId: String(log.args.ticket_id), consumer: Number(log.args.consumer) };
        }))).map(w => w)

        console.log('log ticket consumed', arr)

        setTicketConsumedLogs(arr)
    }
    const getRecoverySum = async () => {
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 15000)

        const logs = await client.getLogs({
            address: getAddress(config.contracts.scanSecure.address),
            event: parseAbiItem(
                "event SumRecovered(uint sum, address collector)"
            ),
            fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
        });

        const arr = (await Promise.all(logs.map(async (log, i) => {
            return { id: Number(i + 1), sum: String(log.args.sum), collector: String(log.args.collector) };
        }))).map(w => w)

        console.log('log recoverysum', arr)

        setSumRecoveredLogs(arr)
    }

    // const [ticketConsumedLogs, setTicketConsumedLogs] = useState()
    // const [sumRecoveredLogs, setSumRecoveredLogs] = useState()
    useEffect(() => {
        if (!contractIsConnected) return;
        getWhitelisted()
        getAskCertification()
        getCertified()
        getEventCreated()
        getEventStatusChanged()
        getNewTickets()
        getTicketOwnered()
        getTicketConsumed()
        getRecoverySum()
    }, [scanSecureSC, contractIsConnected])

    // export from hook
    return {
        // Contracts
        scanSecureSC, scanSecure1155SC, tetherSC,
        // Roles
        isWhitelisted, isCreator, isAdmin,
        // Access
        register, askCertification, answerCertification, sumRecovery,
        // Event
        createEvent, setStatusEvent,
        // Tickets
        createTickets, buyTicket, offerTicket, consumeTicket,
        // Getters
        getUser, getEvent, getTicket
    }
}
