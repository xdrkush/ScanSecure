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
        <Box p={5} border='1px' borderColor='accent.500' borderRadius="25">
            <Heading size="md">ListEvent: (total = {String(eventLastId)}):</Heading>

            <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                {eventLastId >= 0 && createArrayByLength(eventLastId).map((el, i) => (
                    <CardEvent key={el.uuid} id={el.id} />
                ))}
            </SimpleGrid>
        </Box>
    )
}