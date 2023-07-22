import { Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { ScanSecureContext } from "../../contexts"
import Link from "next/link"
import { createArrayByLength } from "../../utils"


const CardEvent = ({ id }) => {
    const { eventLastId, getEvent } = useContext(ScanSecureContext)
    const [event, setEvent] = useState()

    useEffect(() => {
        if (!(id >= 0) && !(id < eventLastId)) return;
        const init = async () => {
            setEvent(await getEvent(id))
        }
        init()
    }, [id])

    console.log("event", event, createArrayByLength(3))

    return (
        <Card>
            <CardHeader>
                <Heading size='md'> #{String(id)}</Heading>
            </CardHeader>
            <CardBody>
                <Text> {event && event.title}</Text>
            </CardBody>
            <CardFooter>
                <Link href={`/event/${id}`}>
                    <Button>+ info</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

export const ListEvent = () => {
    const { eventLastId } = useContext(ScanSecureContext)

    return (
        <Box>

            <Box>ListEvent: (total = {String(eventLastId)})</Box>

            <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                {eventLastId >= 0 && createArrayByLength(eventLastId).map((el, i) => (
                    <CardEvent key={el.uuid} id={el.id} />
                ))}
            </SimpleGrid>
        </Box>
    )
}