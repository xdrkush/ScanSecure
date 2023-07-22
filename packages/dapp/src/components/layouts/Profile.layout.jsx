import { useContext, useEffect } from "react"
import { Navbar } from "../_global/Navbar.profile"
import { Grid, GridItem, Container, useDisclosure } from "@chakra-ui/react"
import Sidebar from "../_global/Sidebar.profile"
import { ScanSecureContext } from "../../contexts"
import { useRouter } from "next/router"

export default function Profile({ children }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isWhitelisted } = useContext(ScanSecureContext)
    const router = useRouter()

    // OpenSidebar for frist load (default)
    useEffect(() => onOpen(), [onOpen])

    useEffect(() => {
        if (!isWhitelisted) router.push('/')
    }, [isWhitelisted, router])

    return (
        <Grid
            pb="20"
            templateAreas={`"sidebar nav" "sidebar main"`}
            gridTemplateRows={"60px 1fr"}
            gridTemplateColumns={isOpen ? "230px" : "60px" + " 1fr"}
        >
            <GridItem area={"nav"}>
                <Navbar
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                />
            </GridItem>

            {/* Auto Open & Close with pointer */}
            <GridItem area={"sidebar"} onMouseEnter={onOpen} onMouseLeave={onClose}>
                <Sidebar isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
            </GridItem>

            <GridItem minH="80vh" area={"main"}>
                <Container as="main" maxW="container.lg" pt="5">
                    {children}
                </Container>
            </GridItem>
        </Grid>
    )
}
