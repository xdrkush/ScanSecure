import { Box, Button } from "@chakra-ui/react"
import { useContext } from "react"
import { ScanSecureContext } from "../../contexts"


export const SumRecovery = () => {
    const { sumRecovery } = useContext(ScanSecureContext)

    return (
        <Box>
            <Button type="submit" bg="primary.100" mr={3} onClick={() => sumRecovery()}>
                Sum Recovery
            </Button>
        </Box>
    )
}