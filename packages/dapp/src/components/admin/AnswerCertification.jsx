
import { Box, Button, Checkbox, Flex, FormControl, FormLabel, Input, InputGroup } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { ScanSecureContext } from "../../contexts"


export const AnswerCertification = () => {
    const { answerCertification, isWhitelisted, isCreator, isAdmin } = useContext(ScanSecureContext)
    const [address, setAddress] = useState("")
    const [bool, setBool] = useState(false)

    const checkAddress = () => address.length === 42

    return (
        <>
            <Box px="2">
                <Flex >
                    <Checkbox
                        isChecked={bool}
                        onChange={(e) => setBool(e.target.checked)}
                    >
                        isValid
                    </Checkbox>
                    <InputGroup w="100%">
                        <FormControl id="Address">
                            <FormLabel>address</FormLabel>
                            <Input
                                type="text"
                                focusBorderColor={checkAddress() ? "green.500" : "red.500"}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </FormControl>
                    </InputGroup>
                </Flex>

                <Button type="submit" bg="primary.100" mr={3}
                    variant={checkAddress() ? "solid" : "outlined"} isDisabled={!checkAddress() || !bool}
                    onClick={() => answerCertification(bool, address)}>
                    Answer Certification
                </Button>
            </Box>
        </>
    )
}