import { Box, Button, FormControl, FormLabel, Input, InputGroup } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { ScanSecureContext } from "../../contexts"

export const ConsumeTicket = () => {
    const { consumeTicket } = useContext(ScanSecureContext)
    const [event_id, setEventId] = useState(null)
    const [ticket_id, setTicketId] = useState(0)

    const checkEventId = () => event_id >= 0
    const checkTicketId = () => ticket_id > 0

    return (
        <>
            <Box px="2">
                <InputGroup w="100%">
                    <FormControl id="EventId">
                        <FormLabel>EventId</FormLabel>
                        <Input
                            type="number"
                            focusBorderColor={checkEventId() ? "green.500" : "red.500"}
                            onChange={(e) => setEventId(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="ticket_id">
                        <FormLabel>Ticket_id</FormLabel>
                        <Input
                            type="number"
                            focusBorderColor={checkTicketId() ? "green.500" : "red.500"}
                            onChange={(e) => setTicketId(e.target.value)}
                        />
                    </FormControl>
                </InputGroup>

                <Button type="submit" bg="primary.100" mr={3}
                    variant={checkEventId() && checkTicketId() ? "solid" : "outlined"} isDisabled={!checkEventId() || !checkTicketId()}
                    onClick={async () => {
                        await consumeTicket(event_id, ticket_id)
                    }}>
                    Consume Tickets
                </Button>
            </Box>
        </>
    )
}