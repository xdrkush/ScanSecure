import MainLayout from "../../components/layouts/Main.layout"
import { Box } from "@chakra-ui/react"
import { ListEvent } from "../../components/event/ListEvent"

export default function Events() {
    return (
        <MainLayout>
            <Box>Events</Box>
            <ListEvent />
        </MainLayout>
    )
}
