import { Box, Grid } from "@chakra-ui/react"
import ProfileLayout from "../../components/layouts/Profile.layout"
import { AskCertification } from "../../components/profile/AskCertification"
import { CreateEvent } from "../../components/event/CreateEvent"
import { CreateTickets } from "../../components/ticket/CreateTickets"
import { SetStatusEvent } from "../../components/event/SetStatusEvent"
import { BuyTicket } from "../../components/ticket/BuyTicket"
import { OfferTicket } from "../../components/ticket/OfferTicket"
import { ConsumeTicket } from "../../components/ticket/ConsumeTicket"

export default function Profile() {
    return (
        <ProfileLayout>
            <Box>Profile</Box>
            <Grid py={3} minH={"20vh"}>
                <AskCertification />
            </Grid>
            <Grid py={3} minH={"20vh"}>
                <CreateEvent />
            </Grid>
            <Grid py={3} minH={"20vh"}>
                <CreateTickets />
            </Grid>
            <Grid py={3} minH={"20vh"}>
                <SetStatusEvent />
            </Grid>
            <Grid py={3} minH={"20vh"}>
                <BuyTicket />
            </Grid>
            <Grid py={3} minH={"20vh"}>
                <OfferTicket />
            </Grid>
            <Grid py={3} minH={"20vh"}>
                <ConsumeTicket />
            </Grid>
        </ProfileLayout>
    )
}
