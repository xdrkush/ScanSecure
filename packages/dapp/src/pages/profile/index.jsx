import { Box, Grid, Heading } from "@chakra-ui/react"
import ProfileLayout from "../../components/layouts/Profile.layout"
import { AskCertification } from "../../components/profile/AskCertification"
import { BuyTicket } from "../../components/ticket/BuyTicket"

export default function Profile() {
    return (
        <ProfileLayout>
            <Heading size="md">My Ticket</Heading>
            <Grid py={3} minH={"20vh"}>
                <AskCertification />
            </Grid>
            <Grid py={3} minH={"20vh"}>
                <BuyTicket />
            </Grid>
        </ProfileLayout>
    )
}
