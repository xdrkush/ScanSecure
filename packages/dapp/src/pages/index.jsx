import MainLayout from "../components/layouts/Main.layout"
import { Box, Grid } from "@chakra-ui/react"
import { Register } from "../components/profile/Register"

export default function Home() {

  return (
    <MainLayout>
      <Grid py={3} minH={"20vh"}>
        <Box>Home</Box>
      </Grid>
    </MainLayout>
  )
}
