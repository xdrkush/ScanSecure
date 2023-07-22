import { Box, Button, FormControl, FormLabel, Heading, Input, InputGroup } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { ScanSecureContext } from "../../contexts"

export const OfferTicket = () => {
    const { offerTicket } = useContext(ScanSecureContext)
    const [event_id, setEventId] = useState(null)
    const [ticket_id, setTicketId] = useState(0)
    const [address, setAddress] = useState(0)

    const checkEventId = () => event_id >= 0
    const checkTicketId = () => ticket_id > 0
    const checkAddress = () => address.length === 42

    return (
        <Box p={5} border='1px' borderColor='accent.500' borderRadius="25">
            <Heading size="md">OfferTicket:</Heading>
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
                        <FormLabel>ticket_id</FormLabel>
                        <Input
                            type="number"
                            focusBorderColor={checkTicketId() ? "green.500" : "red.500"}
                            onChange={(e) => setTicketId(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="address">
                        <FormLabel>address</FormLabel>
                        <Input
                            type="text"
                            focusBorderColor={checkAddress() ? "green.500" : "red.500"}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </FormControl>
                </InputGroup>

                <Button type="submit" bg="primary.100" mr={3}
                    variant={checkEventId() && checkTicketId() && checkAddress() ? "solid" : "outlined"} isDisabled={!checkEventId() || !checkTicketId() || !checkAddress()}
                    onClick={async () => {
                        await offerTicket(address, event_id, ticket_id)
                    }}>
                    Offer Tickets
                </Button>
            </Box>
        </Box>
    )
}