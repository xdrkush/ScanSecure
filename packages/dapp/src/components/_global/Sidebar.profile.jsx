import Link from "next/link"
import {
    IconButton,
    Box,
    Flex,
    Icon,
    Text,
    useColorModeValue,
} from "@chakra-ui/react"
import { FiHome, FiCompass, FiTrendingUp, FiTrendingDown } from "react-icons/fi"
import { HamburgerIcon, CheckCircleIcon, CalendarIcon } from "@chakra-ui/icons"
import { useContext } from "react"
import { ScanSecureContext } from "../../contexts"

const LinkItemsMain = [
    { name: "Home", path: "/", icon: FiHome },
    { name: "MyProfile", path: "/profile", icon: FiCompass },
    { name: "MyTickets", path: "/profile/ticket", icon: FiTrendingUp },
    { name: "MyEvent", path: "/profile/event", icon: CalendarIcon }
]
const LinkItemsCreator = [
    { name: "Creator", path: "/profile/creator", icon: CheckCircleIcon },
]

export default function Sidebar({ isOpen, onOpen, onClose }) {
    return (
        <Box>
            <Flex
                position="fixed"
                w={isOpen ? "230px" : "60px"}
                borderRight="1px"
                borderStyle={"solid"}
                backgroundColor={useColorModeValue("primary.500", "primary.900")}
                borderColor={useColorModeValue("primary.100", "primary.900")}
            >
                <Flex minH="100vh" w="100%">
                    <SidebarContent onClose={onClose} onOpen={onOpen} isOpen={isOpen} />
                </Flex>
            </Flex>
        </Box>
    )
}

const SidebarContent = ({ onClose, isOpen, onOpen, ...rest }) => {
    const { isCreator } = useContext(ScanSecureContext)
    return (
        <Box {...rest} w="100%">
            <Flex w="100%" justify="center">
                {isOpen ? (
                    // <Slide direction='left' in={isOpen} style={{ zIndex: 0, width: '1', height: '0' }}>
                    <Flex h="20" mt={5}>
                        <Link href="/">
                            <Text
                                fontSize="2xl"
                                fontFamily="monospace"
                                zIndex="10"
                                fontWeight="bold"
                                textColor={"secondary.100"}
                            >
                                0xScanSecure
                            </Text>
                        </Link>
                    </Flex>
                    // </Slide>
                ) : (
                    <Flex h="20" mt={5} w="100%" justify="center" color="secondary.100">
                        <IconButton
                            onClick={isOpen ? onClose : onOpen}
                            icon={isOpen ? <></> : <HamburgerIcon w={5} h={5} />}
                        />
                    </Flex>
                )}
            </Flex>

            <Box w={'100%'}>
                {LinkItemsMain.length > 0 &&
                    LinkItemsMain.map((link) => (
                        <NavItem
                            key={link.name}
                            icon={link.icon}
                            path={link.path}
                            isOpen={isOpen}
                        >
                            {link.name}
                        </NavItem>
                    ))
                }
                {isCreator && LinkItemsCreator.length > 0 &&
                    LinkItemsCreator.map((link) => (
                        <NavItem
                            key={link.name}
                            icon={link.icon}
                            path={link.path}
                            isOpen={isOpen}
                        >
                            {link.name}
                        </NavItem>
                    ))
                }
            </Box>
        </Box>
    )
}

const NavItem = ({ icon, children, path, isOpen, ...rest }) => {
    return (
        <Flex w={'100%'} _hover={{ bg: "secondary.100" }}>
            <Link href={path}>
                <Box
                    mx="1"
                    my="2"
                    borderRadius="lg"
                    style={{ textDecoration: "none", color: "white" }}
                    _focus={{ boxShadow: "none" }}
                    _activeLink={{
                        color: useColorModeValue("white.100", "white.100"),
                        bgColor: useColorModeValue("white.100", "white.900"),
                        border: "solid 1px",
                    }}
                >
                    <Flex
                        align="center"
                        w="100%"
                        m="1"
                        role="group"
                        textDecoration={"none"}
                    >
                        {icon && (
                            <Icon
                                mx="2"
                                fontSize="24"
                                _groupHover={{
                                    color: "accent.100",
                                }}
                                as={icon}
                            />
                        )}

                        {isOpen && (
                            <Box>
                                <Text>{children}</Text>
                            </Box>
                        )}
                    </Flex>
                </Box>
            </Link>
        </Flex>
    )
}