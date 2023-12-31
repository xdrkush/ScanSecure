import { Box, Button, FormControl, FormLabel, Heading, Input, InputGroup } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { ScanSecureContext } from "../../contexts"


export const SetStatusEvent = ({ eventId }) => {
    const { setStatusEvent } = useContext(ScanSecureContext)
    const [event_id, setEventId] = useState(null)

    const checkEventId = () => event_id >= 0

    useEffect(() => {
        if (!eventId) return
        setEventId(eventId)
    }, [eventId])

    return (
        <Box p={5} border='1px' borderColor='accent.500' borderRadius="25">
            <Heading size="md">SetStatusEvent:</Heading>
            <Box px="2">
                {!eventId && (
                    <InputGroup w="100%">
                        <FormControl id="Message">
                            <FormLabel>EventId</FormLabel>
                            <Input
                                type="number"
                                focusBorderColor={checkEventId() ? "green.500" : "red.500"}
                                onChange={(e) => setEventId(e.target.value)}
                            />
                        </FormControl>
                    </InputGroup>
                )}

                <Button type="submit" bg="primary.100" mr={3}
                    variant={checkEventId() ? "solid" : "outlined"} isDisabled={!checkEventId()}
                    onClick={() => setStatusEvent(event_id)}>
                    SetStatusEvent
                </Button>
            </Box>
        </Box>
    )
}