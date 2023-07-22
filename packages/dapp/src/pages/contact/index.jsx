import { Box, Flex, Grid, Heading } from "@chakra-ui/react"
import MainLayout from "../../components/layouts/Main.layout"

export default function Contact() {
  return (
    <MainLayout>
      <Grid py={3} minH={"20vh"} minW={"100%"}>
        <Flex minH={"20vh"} align={"center"} justify="center" textColor={"primary.100"}>
          <Box textAlign="center">
            <Heading>Development by,</Heading>
          </Box>
        </Flex>
        <Flex minH={"20vh"} align={"center"} justify="space-around" textColor={"primary.100"}>
          <Box textAlign="center">
            <Heading size="xl">xDrKush</Heading>
          </Box>
        </Flex>
      </Grid>
      <Grid py={3} minH={"20vh"} minW={"100%"}>
        <Flex minH={"20vh"} align={"center"} justify="center" textColor={"primary.100"}>
          <Box textAlign="center">
            <Heading>Consulting by,</Heading>
          </Box>
        </Flex>
        <Flex minH={"20vh"} align={"center"} justify="space-around" textColor={"primary.100"}>
          <Box textAlign="center">
            <Heading size="xl">Khalid</Heading>
          </Box>
          <Box textAlign="center">
            <Heading size="xl">Davy</Heading>
          </Box>
        </Flex>
      </Grid>
    </MainLayout>
  )
}
