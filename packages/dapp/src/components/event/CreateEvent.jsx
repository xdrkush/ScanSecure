import { Box, Button, FormControl, FormLabel, Input, InputGroup } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { ScanSecureContext } from "../../contexts"


export const CreateEvent = () => {
    const { createEvent } = useContext(ScanSecureContext)
    const [title, setTitle] = useState("")

    const checkTitle = () => title.length > 0

    return (
        <>
            <Box px="2">
                <InputGroup w="100%">
                    <FormControl id="Message">
                        <FormLabel>Title</FormLabel>
                        <Input
                            type="text"
                            focusBorderColor={title.length > 0 ? "green.500" : "red.500"}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </FormControl>
                </InputGroup>

                <Button type="submit" bg="primary.100" mr={3}
                    variant={checkTitle() ? "solid" : "outlined"} isDisabled={!title.length}
                    onClick={async () => {
                        await createEvent(title)
                    }}>
                    Create Event
                </Button>
            </Box>
        </>
    )
}