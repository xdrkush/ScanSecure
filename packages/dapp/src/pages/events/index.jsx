import MainLayout from "../../components/layouts/Main.layout"
import { Heading } from "@chakra-ui/react"
import { ListEvent } from "../../components/event/ListEvent"

export default function Events() {
    return (
        <MainLayout>
            <Heading size="md">Events</Heading>
            <ListEvent />
        </MainLayout>
    )
}
