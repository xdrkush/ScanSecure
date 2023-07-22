import { Box, Button, Heading } from "@chakra-ui/react"
import { useContext } from "react"
import { ScanSecureContext } from "../../contexts"


export const SumRecovery = () => {
    const { sumRecovery } = useContext(ScanSecureContext)

    return (
        <Box p={5} border='1px' borderColor='accent.500' borderRadius="25">
            <Heading size="md">SumRecovery:</Heading>
            <Button type="submit" bg="primary.100" mr={3} onClick={() => sumRecovery()}>
                Sum Recovery
            </Button>
        </Box>
    )
}