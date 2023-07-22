import {
    Box, Flex,
    useColorModeValue,
    Breadcrumb,
    BreadcrumbItem,
} from "@chakra-ui/react"
import Link from 'next/link'
import { ColorModeSwitcher } from "../ColorSwitcher"
import ButtonProfile from "./ButtonProfile";

export function Navbar({ isOpen }) {

    return (
        <Box>
            <Flex
                w={"100%"}
                position="fixed"
                zIndex="10"
                bg={useColorModeValue("white", "primary.800")}
                color={useColorModeValue("gray.600", "white")}
                minH={"60px"}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={"solid"}
                borderColor={useColorModeValue("gray.100", "primary.100")}
                align={"center"}
            >
                {/* HOME LINK */}
                <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
                    <Box
                        display="flex"
                        color={useColorModeValue("gray.800", "white")}
                        fontSize={"lg"}
                        _hover={{
                            textDecoration: "none",
                            color: useColorModeValue("gray.800", "white"),
                        }}
                        fontWeight="bold"
                    >
                        <Link href="/">
                            ScanSecure
                        </Link>
                    </Box>
                </Flex>

                <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
                    <Box
                        display="flex"
                        color={useColorModeValue("gray.800", "white")}
                        fontSize={"lg"}
                        _hover={{
                            textDecoration: "none",
                            color: useColorModeValue("gray.800", "white"),
                        }}
                    >
                        Admin
                    </Box>
                </Flex>

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
