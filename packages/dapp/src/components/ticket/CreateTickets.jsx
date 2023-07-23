import { Box, Button, FormControl, FormLabel, Heading, Input, InputGroup } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { ScanSecureContext } from "../../contexts"

export const CreateTickets = ({ eventId }) => {
    const { createTickets } = useContext(ScanSecureContext)
    const [event_id, setEventId] = useState(null)
    const [quantity, setQuantity] = useState(0)
    const [price, setPrice] = useState(0)

    const checkEventId = () => event_id >= 0
    const checkQuantity = () => quantity > 0
    const checkPrice = () => price > 0

    useEffect(() => {
        if (!eventId) return
        setEventId(eventId)
    }, [eventId])

    return (
        <Box p={5} border='1px' borderColor='accent.500' borderRadius="25">
            <Heading size="md">CreateTicket:</Heading>
            <Box px="2">
                <InputGroup w="100%">
                    {!eventId && (
                        <FormControl id="EventId">
                            <FormLabel>EventId</FormLabel>
                            <Input
                                type="number"
                                focusBorderColor={event_id >= 0 ? "green.500" : "red.500"}
                                onChange={(e) => setEventId(e.target.value)}
                            />
                        </FormControl>
                    )}
                    <FormControl id="Quantity">
                        <FormLabel>quantity</FormLabel>
                        <Input
                            type="number"
                            focusBorderColor={quantity > 0 ? "green.500" : "red.500"}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="Price">
                        <FormLabel>Price</FormLabel>
                        <Input
                            type="number"
                            focusBorderColor={price > 0 ? "green.500" : "red.500"}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </FormControl>
                </InputGroup>

                <Button type="submit" bg="primary.100" mr={3}
                    variant={checkEventId() && checkQuantity() && checkPrice() ? "solid" : "outlined"} isDisabled={!checkEventId() || !checkQuantity() || !checkPrice()}
                    onClick={async () => {
                        await createTickets(event_id, quantity, price)
                    }}>
                    Create Tickets
                </Button>
            </Box>
        </Box>
    )
}