import { useRouter } from 'next/router'
import { useContext, useEffect } from "react"
import { Navbar } from "../_global/Navbar.main"
import { Grid, GridItem, Container } from "@chakra-ui/react"
import { ScanSecureContext } from "../../contexts"

export default function Admin({ children }) {
    const router = useRouter()
    const { isAdmin } = useContext(ScanSecureContext)

    useEffect(() => {
        if (!isAdmin) router.push('/')
    }, [isAdmin, router])

    return (
        <Grid
            templateAreas={`"nav" "main"`}
            gridTemplateRows={"60px 1fr"}
        >
            <GridItem area={"nav"}>
                <Navbar />
            </GridItem>

            <GridItem minH="80vh" area={"main"}>
                <Container as="main" maxW="container.lg" pt="5">
                    {children}
                </Container>
            </GridItem>
        </Grid>
    )
}
