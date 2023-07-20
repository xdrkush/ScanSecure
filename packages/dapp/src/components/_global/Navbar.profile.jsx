import {
    Box, Flex,
    useColorModeValue,
    Breadcrumb,
    BreadcrumbItem,
    Spacer,
} from "@chakra-ui/react"
import Link from 'next/link'
import { ColorModeSwitcher } from "../ColorSwitcher"
import ButtonProfile from "./ButtonProfile";

export function Navbar({ isOpen }) {
    const color1 = useColorModeValue("white", "gray.800")
    const color2 = useColorModeValue("gray.800", "white")
    const color3 = useColorModeValue("gray.600", "white")
    const color4 = useColorModeValue("gray.100", "primary.100")
    
    return (
        <Box>
            <Flex
                w={isOpen ? "calc(100% - 230px)" : "calc(100% - 60px)"}
                position="fixed"
                zIndex="10"
                bg={color1}
                color={color3}
                minH={"60px"}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={"solid"}
                borderColor={color4}
                align={"center"}
                justify={"space-between"}
            >
                {/* HOME LINK */}
                {!isOpen && (
                    <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
                        <Box
                            display="flex"
                            color={color2}
                            fontSize={"lg"}
                            _hover={{
                                textDecoration: "none",
                                color: color2,
                            }}
                            fontWeight="bold"
                        >
                            <Link href="/">
                                ScanSecure
                            </Link>
                        </Box>
                    </Flex>
                )}

                <Spacer />

                <Breadcrumb separator='/'>
                    <BreadcrumbItem>
                        <Link href="/events">
                            Events
                        </Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <Link href="/tickets">
                            Tickets
                        </Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem isCurrentPage>

                        <Link href="/contact">
                            Contact
                        </Link>
                    </BreadcrumbItem>
                </Breadcrumb>

                <Spacer />

                {/* COLOR MODE */}
                <Box px={1}>
                    <ColorModeSwitcher justifySelf="flex-end" />
                </Box>

                <Box px={1}>
                    <ButtonProfile />
                </Box>

            </Flex>
        </Box>
    )
}
