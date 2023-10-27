"use client"
import React, { useEffect, useState } from 'react'
import ListOffers from "@/components/offers/list"
import { useAuth } from "@/components/auth-provider"
import { useToast } from '@/components/ui/use-toast'

export default function Offers() {
  const { api } = useAuth();
  const { toast } = useToast()
  const [offer, setOffers] = useState([])

  useEffect(() => {
    api.get('/private/offers/actived')
    .then ((r:any) => setOffers(r.data.data.offer))
    .catch((e:any) => {
      toast({
        variant: "destructive",
        title: "Error : ",
        description: (
          e.response.data.error
        ),
      })
    })
  }, [])

return (
  <div>
    <ListOffers offer={offer} />
  </div>
)
}
