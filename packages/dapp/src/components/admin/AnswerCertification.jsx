
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Checkbox, Flex, FormControl, FormLabel, Heading, Input, InputGroup } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { ScanSecureContext } from "../../contexts"

const AccordionUser = ({ userLog }) => {
    const { getUser, answerCertification } = useContext(ScanSecureContext)
    const { address, message } = userLog
    const [user, setUser] = useState()

    useEffect(() => {
        if (!address) return
        setUser({ ...userLog })
        const init = async () => {
            try {
                const u = await getUser(address)
                setUser({ ...user, ...u })
            } catch (error) {
                console.log(error)
            }
        }
        init()
    }, [address])

    console.log('user loop', user)

    return (
        <AccordionItem>
            <h2>
                <AccordionButton>
                    <Box as="span" flex='1' textAlign='left'>
                        {address}
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
                <Box>{message}</Box>
                <Flex>
                    <Button bg="primary.100" mr={3}
                        onClick={() => answerCertification(true, address)}>
                        Answer Certification
                    </Button>
                </Flex>
            </AccordionPanel>
        </AccordionItem>
    )
}

export const AnswerCertification = () => {
    const { answerCertification, askCertificationLogs } = useContext(ScanSecureContext)
    const [address, setAddress] = useState("")
    const [bool, setBool] = useState(false)

    const checkAddress = () => address.length === 42

    return (
        <Box p={5} border='1px' borderColor='accent.500' borderRadius="25">
            <Heading size="md">AnswerCertification:</Heading>
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

            <Accordion>
                {askCertificationLogs && askCertificationLogs.length > 0 && askCertificationLogs.map((el, i) => (
                    <AccordionUser key={el.address} userLog={el} />
                ))}

            </Accordion>
        </Box>
    )
}