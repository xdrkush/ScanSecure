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
    const [eventLastId, setEventLastId] = useState();
    const [totalMembers, setTotalMembers] = useState();
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
    }, [])

    useEffect(() => {
        if (!isConnected) return;
        try {
            loadContract()
        } catch (error) {
            console.log(error)
        }
    }, [isConnected, address, chain?.id])

    // Roles
    const checkRoles = useCallback(async () => {
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
        }
    }, [address])

    const checkUser = useCallback(async () => {
        // Profile user
        try {
            const data = await getUser(address)
            setProfile(data)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }, [address])

    useEffect(() => {
        if (!address || !scanSecureSC || !contractIsConnected) return;
        checkRoles()
        if (!isWhitelisted || !isCreator || !isAdmin) return;
        checkUser()
    }, [address, scanSecureSC, contractIsConnected])

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
        const total = BigInt(_price + fee)

        return {
            price: _price, fee,
            total: parseEther(total.toString()),
        }
    }
    const approveTether = async (_total) => {
        try {
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
                args: [String(_pseudo)]
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
                args: [_event_id]
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
    const getTickets = async (_event_id, _addr) => {
        try {
            const data = await readContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'getTickets',
                args: [_event_id, _addr]
            })
            return data
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const getEventLastId = async () => {
        try {
            const data = await readContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'eventLastId',
            })

            setEventLastId(Number(data))
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const getTotalMembers = async () => {
        try {
            const data = await readContract({
                address: config.contracts.scanSecure.address,
                abi: config.contracts.scanSecure.abi,
                functionName: 'totalMembers',
            })

            setTotalMembers(Number(data))
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }

    /*
     * Watcher
     * ************** */
    useContractEvent({
        address: getAddress(config.contracts.scanSecure.address),
        abi: config.contracts.scanSecure.abi,
        eventName: 'Whitelisted',
        listener(log) {
            if (String(address) === String(log[0].args.addr)) {
                checkRoles()
                setNotif({ type: 'info', message: 'Vous êtes Whitelisted' })
            }
        }
    })

    /*
     * Event logs
     * ************** */
    const getWhitelisted = async () => {
        try {

            const fromBlock = BigInt(Number(await client.getBlockNumber()) - 1000)

            const logs = await client.getLogs({
                address: getAddress(config.contracts.scanSecure.address),
                event: parseAbiItem(
                    "event Whitelisted(address indexed addr)"
                ),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
            });
            console.log('getWhitelisted', logs)

            const arr = (await Promise.all(logs.map(async (log, i) => {
                return { id: Number(i + 1), address: String(log.args.addr) };
            }))).map(w => w)

            setWhitelist(arr)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }

    }
    const getAskCertification = async () => {
        try {
            const fromBlock = BigInt(Number(await client.getBlockNumber()) - 1000)

            const logs = await client.getLogs({
                address: getAddress(config.contracts.scanSecure.address),
                event: parseAbiItem(
                    "event AskCertification(address indexed addr, string message)"
                ),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
            });

            const arr = (await Promise.all(logs.map(async (log, i) => {
                return { id: Number(i + 1), address: String(log.args.addr), message: String(log.args.message) };
            }))).map(w => w)

            console.log('log askCertification', arr)

            setAskCertificationLogs(arr)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const getCertified = async () => {
        try {
            const fromBlock = BigInt(Number(await client.getBlockNumber()) - 1000)

            const logs = await client.getLogs({
                address: getAddress(config.contracts.scanSecure.address),
                event: parseAbiItem(
                    "event Certified(address indexed addr, uint indexed newStatus)"
                ),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
            });

            const arr = (await Promise.all(logs.map(async (log, i) => {
                return { id: Number(i + 1), address: String(log.args.addr), newStatus: String(log.args.newStatus) };
            }))).map(w => w)

            console.log('log certified', arr)

            setCertifiedLogs(arr)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const getEventCreated = async () => {
        try {
            const fromBlock = BigInt(Number(await client.getBlockNumber()) - 1000)

            const logs = await client.getLogs({
                address: getAddress(config.contracts.scanSecure.address),
                event: parseAbiItem(
                    "event EventCreated(uint indexed event_id, address indexed author)"
                ),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
            });

            const arr = (await Promise.all(logs.map(async (log, i) => {
                return { id: Number(i + 1), eventId: String(log.args.event_id), address: String(log.args.author) };
            }))).map(w => w)

            console.log('log eventCreatedLogs', arr)

            setEventCreatedLogs(arr)

        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const getEventStatusChanged = async () => {
        try {
            const fromBlock = BigInt(Number(await client.getBlockNumber()) - 1000)

            const logs = await client.getLogs({
                address: getAddress(config.contracts.scanSecure.address),
                event: parseAbiItem(
                    "event EventStatusChanged(uint indexed event_id, uint8 oldStatus, uint8 newStatus)"
                ),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
            });

            const ar = (await Promise.all(logs.map(async (log, i) => {
                return { id: Number(i + 1), eventId: String(log.args.event_id), oldStatus: String(log.args.oldStatus), newStatus: String(log.args.newStatus) };
            }))).map(w => w)

            console.log('log eventStatusChanged', ar)

            setEventStatusChangedLogs(ar)

        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const getNewTickets = async () => {
        try {

            const fromBlock = BigInt(Number(await client.getBlockNumber()) - 1000)

            const logs = await client.getLogs({
                address: getAddress(config.contracts.scanSecure.address),
                event: parseAbiItem(
                    "event NewTickets(uint indexed event_id, uint indexed quantity, address indexed author)"
                ),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
            });

            const arr = (await Promise.all(logs.map(async (log, i) => {
                return { id: Number(i + 1), eventId: String(log.args.event_id), quantity: String(log.args.quantity), author: String(log.args.author) };
            }))).map(w => w)

            console.log('log newTickets', arr)

            setNewTicketsLogs(arr)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const getTicketOwnered = async () => {
        try {

            const fromBlock = BigInt(Number(await client.getBlockNumber()) - 1000)

            const logs = await client.getLogs({
                address: getAddress(config.contracts.scanSecure.address),
                event: parseAbiItem(
                    "event TicketOwnered(uint indexed event_id, uint indexed quantity, address indexed buyer)"
                ),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
            });

            const arr = (await Promise.all(logs.map(async (log, i) => {
                return { id: Number(i + 1), eventId: String(log.args.event_id), quantity: String(log.args.quantity), buyer: String(log.args.buyer) };
            }))).map(w => w)

            console.log('log ticketOwnered', arr)

            setTicketOwneredLogs(arr)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const getTicketConsumed = async () => {
        try {
            const fromBlock = BigInt(Number(await client.getBlockNumber()) - 1000)

            const logs = await client.getLogs({
                address: getAddress(config.contracts.scanSecure.address),
                event: parseAbiItem(
                    "event TicketConsumed(uint indexed event_id, uint indexed ticket_id, address indexed consumer)"
                ),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
            });

            const arr = (await Promise.all(logs.map(async (log, i) => {
                return { id: Number(i + 1), eventId: String(log.args.event_id), ticketId: String(log.args.ticket_id), consumer: Number(log.args.consumer) };
            }))).map(w => w)

            console.log('log ticket consumed', arr)

            setTicketConsumedLogs(arr)

        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }
    const getRecoverySum = async () => {
        try {

            const fromBlock = BigInt(Number(await client.getBlockNumber()) - 1000)

            const logs = await client.getLogs({
                address: getAddress(config.contracts.scanSecure.address),
                event: parseAbiItem(
                    "event SumRecovered(uint sum, address indexed collector)"
                ),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
            });

            const arr = (await Promise.all(logs.map(async (log, i) => {
                return { id: Number(i + 1), sum: String(log.args.sum), collector: String(log.args.collector) };
            }))).map(w => w)

            console.log('log recoverysum', arr)

            setSumRecoveredLogs(arr)
        } catch (error) {
            setNotif({ type: "error", message: String(error) })
        }
    }

    useEffect(() => {
        if (!contractIsConnected || !scanSecureSC) return;
        // getWhitelisted()
        // getAskCertification()
        // getCertified()
        // getEventCreated()
        // getEventStatusChanged()
        // getNewTickets()
        // getTicketOwnered()
        // getTicketConsumed()
        // getRecoverySum()
        // getEventLastId()
        // getTotalMembers()
        // loadMoreWhitelisted()
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
        getUser, getEvent, getTicket, getTickets,
        // Data
        eventLastId, totalMembers,
        profile, whitelist, askCertificationLogs, certifiedLogs,
        eventCreatedLogs, eventStatusChangedLogs, newTicketsLogs,
        ticketOwneredLogs, ticketConsumedLogs, sumRecoveredLogs,
    }
}
