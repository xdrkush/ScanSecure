import { Box, Button, FormControl, FormLabel, Input, InputGroup } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { ScanSecureContext } from "../../contexts"


export const BuyTicket = () => {
    const { buyTicket } = useContext(ScanSecureContext)
    const [event_id, setEventId] = useState(null)
    const [quantity, setQuantity] = useState(0)
    
    const checkEventId = () => event_id >= 0
    const checkQuantity = () => quantity > 0

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
                    <FormControl id="Quantity">
                        <FormLabel>Quantity (between 0 & 100)</FormLabel>
                        <Input
                            type="number"
                            focusBorderColor={checkQuantity() ? "green.500" : "red.500"}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </FormControl>
                </InputGroup>

                <Button type="submit" bg="primary.100" mr={3}
                    variant={checkEventId() && checkQuantity() ? "solid" : "outlined"} isDisabled={!checkEventId() || !checkQuantity()}
                    onClick={() => buyTicket(event_id, quantity)}>
                    Buy Tickets
                </Button>
            </Box>
        </>
    )
}