import { Navbar } from "../_global/Navbar.main"
import { Grid, GridItem, Container } from "@chakra-ui/react"

export default function Main({ children }) {
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
