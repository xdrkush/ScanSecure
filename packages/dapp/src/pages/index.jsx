import MainLayout from "../components/layouts/Main.layout"
import { Box, Grid } from "@chakra-ui/react"

export default function Home() {

  return (
    <MainLayout>
      <Grid py={3} minH={"20vh"}>
        <Box>Home</Box>
      </Grid>
    </MainLayout>
  )
}
