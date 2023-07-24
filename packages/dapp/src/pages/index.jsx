import { useContext } from "react"
import MainLayout from "../components/layouts/Main.layout"
import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react"
import { ScanSecureContext } from "../contexts"

export default function Home() {
  const { scanSecureSC, scanSecure1155SC, tetherSC } = useContext(ScanSecureContext)

  return (
    <MainLayout>
      <Grid py={3} minH={"20vh"} minW={"100%"}>
        <Flex minH={"20vh"} align={"center"} justify="center" textColor={"primary.100"}>
          <Box textAlign="center">
            <Heading>Welcome to</Heading>
            <Heading>0xScanSecure</Heading>

            <Heading size="sm">Only on sepolia or hardhat (local)</Heading>
          </Box>
        </Flex>
        <Box textAlign="center">
          {scanSecureSC && (
            <Box mt={5}>
              <Text>Address Scansecure:</Text>
              <Text>{scanSecureSC.address}</Text>
            </Box>
          )}
          {scanSecure1155SC && (
            <Box mt={5}>
              <Text>Address Scansecure ERC1155:</Text>
              <Text>{scanSecure1155SC.address}</Text>
            </Box>
          )}
          {tetherSC && (
            <Box mt={5}>
              <Text>Address Scansecure USDT:</Text>
              <Text>{tetherSC.address}</Text>
            </Box>
          )}
        </Box>
      </Grid>
    </MainLayout>
  )
}
