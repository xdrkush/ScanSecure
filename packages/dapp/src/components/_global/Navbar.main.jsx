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
    const color1 = useColorModeValue("primary.500", "primary.900")
    const color4 = useColorModeValue("accent.500", "accent.500")

    return (
        <Box>
            <Flex
                w={"100%"}
                position="fixed"
                zIndex="10"
                bg={color1}
                color={"white"}
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
                <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
                    <Link href="/">
                        <Box
                            display="flex"
                            color={"secondary.100"}
                            fontSize={"lg"}
                            fontWeight="bold"
                        >
                            0xScanSecure
                        </Box>
                    </Link>
                </Flex>

                <Breadcrumb separator='-'>
                    <BreadcrumbItem>
                        <Link href="/events">
                            Events
                        </Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem isCurrentPage>

                        <Link href="/contact">
                            Contact
                        </Link>
                    </BreadcrumbItem>
                </Breadcrumb>

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
