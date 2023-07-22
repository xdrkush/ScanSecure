import { Box, Grid } from "@chakra-ui/react"
import ProfileLayout from "../../components/layouts/Profile.layout"
import { CreateEvent } from "../../components/event/CreateEvent"
import { CreateTickets } from "../../components/ticket/CreateTickets"
import { SetStatusEvent } from "../../components/event/SetStatusEvent"
import { useContext, useEffect } from "react"
import { ScanSecureContext } from "../../contexts"
import { useRouter } from "next/router"

export default function ProfileEvent() {
    const { isCreator } = useContext(ScanSecureContext)
    const router = useRouter()

    useEffect(() => {
        if (!isCreator) router.push('/')
    }, [isCreator, router])

    return (
        <ProfileLayout>
            <Box>Creator</Box>

            <Grid py={3} minH={"20vh"}>
                <CreateEvent />
            </Grid>
            <Grid py={3} minH={"20vh"}>
                <CreateTickets />
            </Grid>
            <Grid py={3} minH={"20vh"}>
                <SetStatusEvent />
            </Grid>
        </ProfileLayout>
    )
}
