'use client'

import { useAuth } from '@/components/auth-provider';
import ParcoursLine from '@/components/parcours/parcours'
import { useToast } from '@/components/ui/use-toast';
import React, { useEffect, useState } from 'react'

export default function Parcours() {
  const [events, setEvents] = useState([])
  const { api, user } = useAuth();
  const { toast } = useToast()

  useEffect(() => {
    refreshEvents();
  }, [])

  function refreshEvents() {
    api.get(`http://localhost:8080/private/steps/${user.id}`)
    .then((r:any) => {
      setEvents(r.data.data.steps.sort((a:any, b:any) => a.deadline - b.deadline));
    })
    .catch((e:any) => {
      toast({
        variant: "destructive",
        title: "Error : ",
        description: (
          e.response.data.error
        ),
      })
    })
  }


  function onClick(id:number) {
    if (!(events.find((event:any) => event.id === id) as any).is_validated) {
      api.patch(`http://localhost:8080/private/steps/${user.id}/${id}/valid`)
        .then((r:any) => {
          refreshEvents();
          toast({
            title: "Info : ",
            description: (
              r.data.message
            ),
          })
        })
        .catch((e:any) => {
          toast({
            variant: "destructive",
            title: "Error : ",
            description: (
              e.response.data.error
            ),
          })
        })
    } else {
      api.patch(`http://localhost:8080/private/steps/${user.id}/${id}/unvalid`)
        .then((r:any) => {
          refreshEvents();
          toast({
            title: "Info : ",
            description: (
              r.data.message
            ),
          })
        })
        .catch((e:any) => {
          toast({
            variant: "destructive",
            title: "Error : ",
            description: (
              e.response.data.error
            ),
          })
        })
    }
  }

  return (
    <div>
      <ParcoursLine events={events} onClick={onClick} />
    </div>
  )
}
