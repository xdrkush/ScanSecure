import { Box, Grid } from "@chakra-ui/react"
import AdminLayout from "../../components/layouts/Admin.layout"
import { AnswerCertification } from "../../components/admin/AnswerCertification"
import { SumRecovery } from "../../components/admin/SumRecovery"

export default function Admin() {
  return (
    <AdminLayout>
      <Box>Profile</Box>
      <Grid py={3} minH={"20vh"}>
        <AnswerCertification />
      </Grid>
      <Grid py={3} minH={"20vh"}>
        <SumRecovery />
      </Grid>
    </AdminLayout>
  )
}
