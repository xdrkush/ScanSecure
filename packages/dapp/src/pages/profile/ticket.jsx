import { Grid, Heading } from "@chakra-ui/react"
import ProfileLayout from "../../components/layouts/Profile.layout"
import { ConsumeTicket } from "../../components/ticket/ConsumeTicket"
import { OfferTicket } from "../../components/ticket/OfferTicket"
import { MyTickets } from "../../components/ticket/MyTickets"
import { useContext } from "react"
import { ScanSecureContext } from "../../contexts"
import { createArrayByLength } from "../../utils"

export default function ProfileTicket() {
    const { eventLastId } = useContext(ScanSecureContext)

    return (
        <ProfileLayout>
            <Heading size="md">My Ticket</Heading>
            <Grid py={3} minH={"20vh"}>
                {eventLastId >= 0 && createArrayByLength(eventLastId).map((el, i) => (
                    <MyTickets key={el.uuid} eventId={i} />
                ))}
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
