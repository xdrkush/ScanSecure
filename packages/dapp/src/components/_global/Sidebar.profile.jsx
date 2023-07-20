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
import { HamburgerIcon } from "@chakra-ui/icons"

const LinkItems = [
    { name: "Home", path: "/", icon: FiHome },
    { name: "MyProfile", path: "/profile", icon: FiCompass },
    { name: "MyTickets", path: "/profile/ticket", icon: FiTrendingUp },
    { name: "MyEvent", path: "/profile/event", icon: FiTrendingDown },
    { name: "Creator", path: "/creator", icon: FiTrendingDown },
]

export default function Sidebar({ isOpen, onOpen, onClose }) {
    return (
        <Box>
            <Flex
                position="fixed"
                w={isOpen ? "230px" : "60px"}
                borderRight="1px"
                borderStyle={"solid"}
                backgroundColor={useColorModeValue("gray.100", "darkness.900")}
                borderColor={useColorModeValue("gray.100", "primary.100")}
            >
                <Flex minH="100vh" w="100%">
                    <SidebarContent onClose={onClose} onOpen={onOpen} isOpen={isOpen} />
                </Flex>
            </Flex>
        </Box>
    )
}

const SidebarContent = ({ onClose, isOpen, onOpen, ...rest }) => {
    return (
        <Box {...rest} w="100%">
            <Flex w="100%" justify="center">
                {isOpen ? (
                    // <Slide direction='left' in={isOpen} style={{ zIndex: 0, width: '1', height: '0' }}>
                    <Flex h="20" mt={5}>
                        <Text
                            fontSize="2xl"
                            fontFamily="monospace"
                            zIndex="10"
                            fontWeight="bold"
                        >
                            <Link href="/">
                                ScanSecure
                            </Link>
                        </Text>
                    </Flex>
                    // </Slide>
                ) : (
                    <Flex h="20" mt={5} w="100%" justify="center">
                        <IconButton
                            onClick={isOpen ? onClose : onOpen}
                            icon={isOpen ? <></> : <HamburgerIcon w={5} h={5} />}
                            variant={"ghost"}
                            aria-label={"Toggle Navigation"}
                        />
                    </Flex>
                )}
            </Flex>

            <Box w={'100%'}>
                {LinkItems.length > 0 &&
                    LinkItems.map((link) => (
                        <NavItem
                            key={link.name}
                            icon={link.icon}
                            path={link.path}
                            isOpen={isOpen}
                        >
                            {link.name}
                        </NavItem>
                    ))}
            </Box>
        </Box>
    )
}

const NavItem = ({ icon, children, path, isOpen, ...rest }) => {
    return (
        <Flex w={'100%'} _hover={{ bg: "gray.500" }}>
            <Link href={path}>
                <Box
                    mx="1"
                    my="2"
                    borderRadius="lg"
                    style={{ textDecoration: "none" }}
                    _focus={{ boxShadow: "none" }}
                    _activeLink={{
                        color: useColorModeValue("violet.50", "primary.100"),
                        bgColor: useColorModeValue("violet.5", "gray.700"),
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
                                    color: "primary.100",
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