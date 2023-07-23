import React, { useContext, useEffect, useState } from 'react'
import MainLayout from "../../components/layouts/Main.layout"
import { useRouter } from 'next/router';
import { ScanSecureContext } from '../../contexts';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { BuyTicket } from '../../components/ticket/BuyTicket'
import { useAccount } from 'wagmi';
import { CreateTickets } from '../../components/ticket/CreateTickets';
import { SetStatusEvent } from '../../components/event/SetStatusEvent';

export default function EventID() {
  const { address } = useAccount()
  const router = useRouter()
  const { eventId } = router.query
  const { eventLastId, isWhitelisted, getEvent } = useContext(ScanSecureContext)
  const [event, setEvent] = useState()

  useEffect(() => {
    console.log('evnetid', event)
    if (!(eventId >= 0) && !(eventId < eventLastId)) return;
    const init = async () => {
      setEvent(await getEvent(eventId))

    }
    init()
  }, [eventId])

  return (
    <MainLayout>
      <Flex>
        <Box w="70%">
          <Heading>#{eventId} - {event && event.title} </Heading>
          <Text>Auhtor: {event && event.author} </Text>
          <Heading size="md">Limit: {event && Number(event.limitTickets).toString()} </Heading>
          <Heading size="md">Status: {event && Number(event.status).toString()} </Heading>
          <Heading size="md">TotalSold: {event && Number(event.totalSold).toString()} </Heading>

        </Box>

        {isWhitelisted && (
          <Box w="30%">
            <BuyTicket eventId={eventId} onlyQuantity="true" />
          </Box>
        )}

      </Flex>


      {event && address === event.author && (
        <Flex pt="5">
          <Box w="70%" mr="5">
            <CreateTickets eventId={eventId} />
          </Box>
          <Box w="30%">
            <SetStatusEvent eventId={eventId} />
          </Box>
        </Flex>
      )}
    </MainLayout>
  )
}
