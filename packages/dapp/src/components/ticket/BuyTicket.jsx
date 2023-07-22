import { Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, InputGroup, Wrap } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { ScanSecureContext } from "../../contexts"


export const BuyTicket = ({ eventId, onlyQuantity }) => {
    const { buyTicket, isWhitelisted, eventLastId } = useContext(ScanSecureContext)
    const [event_id, setEventId] = useState(null)
    const [quantity, setQuantity] = useState(0)

    const checkEventId = () => event_id >= 0
    const checkQuantity = () => quantity > 0 && quantity <= 100

    useEffect(() => {
        if (!(eventId >= 0) && !(eventId < eventLastId)) return;
        setEventId(eventId)
    }, [eventId])

    return (
        <Box p={5} border='1px' borderColor='accent.500' borderRadius="25">
            <Heading size="md">BuyTicket:</Heading>
            <Box align="center">
                <InputGroup w="100%">
                    {!onlyQuantity && (
                        <FormControl id="EventId">
                            <FormLabel>EventId</FormLabel>
                            <Input
                                type="number"
                                focusBorderColor={checkEventId() ? "green.500" : "red.500"}
                                onChange={(e) => setEventId(e.target.value)}
                            />
                        </FormControl>
                    )}
                    <FormControl id="Quantity">
                        <FormLabel>Buy ticket/s (between 0 & 100)</FormLabel>
                        <Input
                            type="number"
                            placeholder="Quantity"
                            focusBorderColor={checkQuantity() ? "green.500" : "red.500"}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </FormControl>
                </InputGroup>

                {isWhitelisted && (
                    <Button type="submit" color="primary.100" mr={3}
                        variant={checkEventId() && checkQuantity() ? "solid" : "outlined"} isDisabled={!checkEventId() || !checkQuantity()}
                        onClick={() => buyTicket(event_id, quantity)}>
                        Buy Tickets
                    </Button>
                )}
            </Box>
        </Box>
    )
}