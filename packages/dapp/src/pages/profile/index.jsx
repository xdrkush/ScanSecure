import { Box, Grid, Heading } from "@chakra-ui/react"
import ProfileLayout from "../../components/layouts/Profile.layout"
import { AskCertification } from "../../components/profile/AskCertification"
import { BuyTicket } from "../../components/ticket/BuyTicket"
import { ScanSecureContext } from "../../contexts"
import { useContext, useEffect } from "react"
import { useRouter } from "next/router"

export default function Profile() {
    const { isWhitelisted } = useContext(ScanSecureContext)
    const router = useRouter()

    useEffect(() => {
        if (!isWhitelisted) router.push('/')
    }, [isWhitelisted, router])


    return (
        <ProfileLayout>
            <Heading size="md">My Profile</Heading>
            {!isWhitelisted && (
                <Grid py={3} minH={"20vh"}>
                    <AskCertification />
                </Grid>
            )}
            <Grid py={3} minH={"20vh"}>
                <BuyTicket />
            </Grid>
        </ProfileLayout>
    )
}
