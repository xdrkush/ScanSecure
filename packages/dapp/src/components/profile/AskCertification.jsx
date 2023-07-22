import { Box, Button, FormControl, FormLabel, Heading, Input, InputGroup } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { ScanSecureContext } from "../../contexts"


export const AskCertification = () => {
    const { askCertification } = useContext(ScanSecureContext)
    const [message, setMessage] = useState("")

    const checkMessage = () => message.length > 0

    return (
        <Box p={5} border='1px' borderColor='accent.500' borderRadius="25">
            <Heading size="md">AskCertification:</Heading>
            <Box px="2">
                <InputGroup w="100%">
                    <FormControl id="Message">
                        <FormLabel>Message</FormLabel>
                        <Input
                            type="text"
                            focusBorderColor={message.length > 0 ? "green.500" : "red.500"}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </FormControl>
                </InputGroup>

                <Button type="submit" bg="primary.100" mr={3}
                    variant={checkMessage() ? "solid" : "outlined"} isDisabled={!message.length}
                    onClick={async () => {
                        await askCertification(message)
                    }}>
                    Ask Certification
                </Button>
            </Box>
        </Box>
    )
}