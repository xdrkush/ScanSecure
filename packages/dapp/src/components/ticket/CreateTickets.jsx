import { Box, Button, FormControl, FormLabel, Input, InputGroup } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { ScanSecureContext } from "../../contexts"

export const CreateTickets = () => {
    const { createTickets } = useContext(ScanSecureContext)
    const [event_id, setEventId] = useState(null)
    const [quantity, setQuantity] = useState(0)
    const [price, setPrice] = useState(0)

    const checkEventId = () => event_id >= 0
    const checkQuantity = () => quantity > 0
    const checkPrice = () => price > 0

    return (
        <>
            <Box px="2">
                <InputGroup w="100%">
                    <FormControl id="EventId">
                        <FormLabel>EventId</FormLabel>
                        <Input
                            type="number"
                            focusBorderColor={event_id >= 0 ? "green.500" : "red.500"}
                            onChange={(e) => setEventId(e.target.value)}
                        />
                    </FormControl>
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
        </>
    )
}