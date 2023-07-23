import { Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { ScanSecureContext } from "../../contexts"
import Link from "next/link"
import { createArrayByLength } from "../../utils"
import { useAccount } from "wagmi"


const CardEvent = ({ el }) => {
    const { eventLastId, getEvent } = useContext(ScanSecureContext)
    const [event, setEvent] = useState()
    const { id, buyer, eventId } = el

    // useEffect(() => {
    //     if (!(id >= 0) && !(id < eventLastId)) return;
    //     const init = async () => {
    //         setEvent(await getEvent(id))
    //     }
    //     init()
    // }, [id])

    return (
        <Card>
            <CardHeader>
                <Heading size='md'> #{String(id)}</Heading>
            </CardHeader>
            <CardBody>
                <Text> {eventId}</Text>
            </CardBody>
            <CardFooter>
                <Link href={`/event/${id}`}>
                    <Button>+ info</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

export const MyTickets = () => {
    const { eventLastId, ticketOwneredLogs } = useContext(ScanSecureContext)
    const { address } = useAccount()
    const [tickets, setTickets] = useState([])

    useEffect(() => {
        if (!ticketOwneredLogs) return
        const init = async () => {
            ticketOwneredLogs.map((el, i) => {
                if (address === el.buyer) {
                    console.log('el', el)
                    setTickets((tickets) => [...tickets, el])
                }
            })
        }
        init()

        console.log('tickets', tickets)
    }, [ticketOwneredLogs])

    return (
        <Box p={5} border='1px' borderColor='accent.500' borderRadius="25">
            <Heading size="md">ListEvent: (total = {String(eventLastId)}):</Heading>

            <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                {tickets.length > 0 && tickets.map((el, i) => (
                    <CardEvent key={el.id} el={el} />
                ))}
            </SimpleGrid>
        </Box>
    )
}