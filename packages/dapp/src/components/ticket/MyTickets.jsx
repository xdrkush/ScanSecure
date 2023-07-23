import { Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { ScanSecureContext } from "../../contexts"
import Link from "next/link"
import { createArrayByLength } from "../../utils"
import { useAccount } from "wagmi"


const CardTicket = ({ el }) => {
    const { id, status, eventId } = el
    const { consumeTicket } = useContext(ScanSecureContext)

    return (
        <Card>
            <CardHeader>
                <Heading size='md'> #{String(id)}</Heading>
            </CardHeader>
            <CardBody>
                <Text> {Number(status) === 0 ? "available" : "already consumed"}</Text>
                <Text> event: {String(eventId)}</Text>
            </CardBody>
            {Number(status) < 1 && (
                <CardFooter>
                    <Button onClick={() => consumeTicket(eventId, id)}>Consume</Button>
                </CardFooter>
            )}
        </Card>
    )
}
// Non fonctionel
export const MyTickets = ({ eventId }) => {
    const { getTickets, getTicket, eventLastId } = useContext(ScanSecureContext)
    const { address } = useAccount()
    const [tickets, setTickets] = useState([])

    useEffect(() => {
        if (eventId < 0 || eventId >= eventLastId) return
        const init = async () => {
            const result = await getTickets(eventId, address)

            if (result) {
                result.map(async (el) => {
                    const t = await getTicket(eventId, Number(el))
                    setTickets(tickets => [...tickets, { ...t, id: Number(el), eventId }])
                })
                console.log('getTickets', result, eventId, tickets)
            } else setTickets([])
        }
        init()

    }, [eventId, address])

    return (
        <Box p={5} mt={5} border='1px' borderColor='accent.500' borderRadius="25">
            <Heading size="md">MyTickets (event: {String(eventId)}): (total = {tickets && String(tickets.length)}):</Heading>

            <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                {tickets.length > 0 && tickets.map((el, i) => (
                    <CardTicket key={el.id} el={el} />
                ))}
            </SimpleGrid>
        </Box>
    )
}