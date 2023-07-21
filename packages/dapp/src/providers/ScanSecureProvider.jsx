import { useMemo } from 'react';
import { ScanSecureContext } from "../contexts"
import { useScanSecure } from "../hooks/useScanSecure"

export default function ScanSecureProvider({ children }) {
    // Hook
    const {
        scanSecureSC, scanSecure1155SC, tetherSC,
        isWhitelisted, isCreator, isAdmin,
        register, askCertification, answerCertification, sumRecovery,
        createEvent, setStatusEvent,
        createTickets, buyTicket, offerTicket, consumeTicket,
        getUser, getEvent, getTicket,
        profile,whitelist,askCertificationLogs,certifiedLogs,
        eventCreatedLogs,eventStatusChangedLogs,newTicketsLogs,
        ticketOwneredLogs,ticketConsumedLogs,sumRecoveredLogs
    } = useScanSecure()

    // Memory
    const values = useMemo(() => ({
        scanSecureSC, scanSecure1155SC, tetherSC,
        isWhitelisted, isCreator, isAdmin,
        register, askCertification, answerCertification, sumRecovery,
        createEvent, setStatusEvent,
        createTickets, buyTicket, offerTicket, consumeTicket,
        getUser, getEvent, getTicket,
        profile,whitelist,askCertificationLogs,certifiedLogs,
        eventCreatedLogs,eventStatusChangedLogs,newTicketsLogs,
        ticketOwneredLogs,ticketConsumedLogs,sumRecoveredLogs
    }), [
        scanSecureSC, scanSecure1155SC, tetherSC,
        isWhitelisted, isCreator, isAdmin,
        register, askCertification, answerCertification, sumRecovery,
        createEvent, setStatusEvent,
        createTickets, buyTicket, offerTicket, consumeTicket,
        getUser, getEvent, getTicket,
        profile,whitelist,askCertificationLogs,certifiedLogs,
        eventCreatedLogs,eventStatusChangedLogs,newTicketsLogs,
        ticketOwneredLogs,ticketConsumedLogs,sumRecoveredLogs
    ])

    return <ScanSecureContext.Provider value={values}>{children}</ScanSecureContext.Provider>;

}
