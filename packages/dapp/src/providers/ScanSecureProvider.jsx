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
        getUser, getEvent, getTicket
    } = useScanSecure()

    // Memory
    const values = useMemo(() => ({
        scanSecureSC, scanSecure1155SC, tetherSC,
        isWhitelisted, isCreator, isAdmin,
        register, askCertification, answerCertification, sumRecovery,
        createEvent, setStatusEvent,
        createTickets, buyTicket, offerTicket, consumeTicket,
        getUser, getEvent, getTicket
    }), [
        scanSecureSC, scanSecure1155SC, tetherSC,
        isWhitelisted, isCreator, isAdmin,
        register, askCertification, answerCertification, sumRecovery,
        createEvent, setStatusEvent,
        createTickets, buyTicket, offerTicket, consumeTicket,
        getUser, getEvent, getTicket
    ])

    return <ScanSecureContext.Provider value={values}>{children}</ScanSecureContext.Provider>;

}
