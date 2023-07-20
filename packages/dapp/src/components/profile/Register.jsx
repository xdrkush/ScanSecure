import { Box, Button, FormControl, FormLabel, Input, InputGroup, Modal, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useColorModeValue } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { ScanSecureContext } from "../../contexts"


export const Register = () => {
    const { register, isWhitelisted, isCreator, isAdmin } = useContext(ScanSecureContext)
    const [pseudo, setPseudo] = useState("")
    const [openModal, setOpenModal] = useState(false)

    const handleOpenModal = () => {
        setOpenModal(!openModal ? true : false)
    }

    const checkPseudo = () => pseudo.length > 0

    return (
        <Box>
            {!isWhitelisted ? (
                <>
                    <Button onClick={() => handleOpenModal()}>Register</Button>
                </>
            ) : (
                <Box>
                    You are already whitelisted
                </Box>
            )}

            {/* Modal */}
            <Modal isOpen={openModal} onClose={handleOpenModal}>
                <ModalOverlay />
                <ModalContent
                    backgroundColor={useColorModeValue("gray.100", "darkness.900")}
                >
                    <ModalHeader>Create your pseudo</ModalHeader>
                    <Box px="2">
                        <InputGroup w="100%">
                            <FormControl id="pseudo">
                                <FormLabel>Pseudo</FormLabel>
                                <Input
                                    type="text"
                                    focusBorderColor={pseudo.length > 0 ? "green.500" : "red.500"}
                                    value={pseudo}
                                    onChange={(e) => setPseudo(e.target.value)}
                                />
                            </FormControl>
                        </InputGroup>
                    </Box>

                    <ModalFooter>
                        <Button type="submit" bg="primary.100" mr={3}
                            variant={checkPseudo() ? "solid" : "outlined"} isDisabled={!pseudo.length}
                            onClick={async () => {
                                await register(pseudo)
                                await handleOpenModal()
                            }}>
                            Register
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}