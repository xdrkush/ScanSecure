import MainLayout from "../components/layouts/Main.layout"
import { Box, Flex, Grid, Heading } from "@chakra-ui/react"

export default function Home() {

  return (
    <MainLayout>
      <Grid py={3} minH={"20vh"} minW={"100%"}>
        <Flex minH={"20vh"} align={"center"} justify="center" textColor={"primary.100"}>
          <Box textAlign="center">
            <Heading>Welcome to</Heading>
            <Heading>0xScanSecure</Heading>
          </Box>
        </Flex>
      </Grid>
    </MainLayout>
  )
}
