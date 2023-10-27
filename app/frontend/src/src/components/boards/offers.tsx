"use client"
import React, { useEffect, useState } from 'react'
import ListOffers from "@/components/offers/adminlist"
import { useAuth } from "@/components/auth-provider"
import { useToast } from '@/components/ui/use-toast'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export default function Offers() {
  const { api } = useAuth();
  const { toast } = useToast()
  const router = useRouter()
  const [offer, setOffers] = useState([])

  useEffect(() => {
    api.get('/private/offers')
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
  }, [api, toast])

return (
  <div className="w-full">
    <div className="w-full flex mb-5">
      Toutes les Offres
      <Button type="submit" className="ml-auto" onClick={() => router.push(`./redaction`)} >Créer une offre</Button>
    </div>
    <ListOffers offer={offer} />
  </div>
)
}
