import { Grid, Heading } from "@chakra-ui/react"
import ProfileLayout from "../../components/layouts/Profile.layout"
import { ConsumeTicket } from "../../components/ticket/ConsumeTicket"
import { OfferTicket } from "../../components/ticket/OfferTicket"

export default function ProfileTicket() {
    return (
        <ProfileLayout>
            <Heading size="md">My Ticket</Heading>

            <Grid py={3} minH={"20vh"}>
                <OfferTicket />
            </Grid>
            <Grid py={3} minH={"20vh"}>
                <ConsumeTicket />
            </Grid>
        </ProfileLayout>
    )
}
