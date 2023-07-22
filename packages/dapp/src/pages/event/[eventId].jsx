import React, { useContext, useEffect, useState } from 'react'
import MainLayout from "../../components/layouts/Main.layout"
import { useRouter } from 'next/router';
import { ScanSecureContext } from '../../contexts';
import { Box, Heading } from '@chakra-ui/react';
import {BuyTicket} from '../../components/ticket/BuyTicket'

export default function EventID() {
  const router = useRouter()
  const { eventId } = router.query
  const { eventLastId, getEvent } = useContext(ScanSecureContext)
  const [event, setEvent] = useState()

  useEffect(() => {
      if (!(eventId >= 0) && !(eventId < eventLastId)) return;
      const init = async () => {
          setEvent(await getEvent(eventId))
      }
      init()
  }, [eventId])

  return (
    <MainLayout>
      <Box>
        <Heading>#{eventId} - {event && event.title} </Heading>
      </Box>
      <BuyTicket eventId={eventId} onlyQuantity="true"/>
    </MainLayout>
  )
}
