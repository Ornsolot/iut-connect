"use client"
import React, { useEffect, useState } from 'react'
import PageOffer from "@/components/offers/page_offer"
import { DataTable} from "@/components/ui/data-table"
import { columns } from "@/components/offers/offers-archived-table/columns"
import { useAuth } from "@/components/auth-provider"
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast'

export default function Offer() {
  const { api } = useAuth();
  const { toast } = useToast()
  const [offer, setOffer] = useState([])
  const router = useRouter(); // retrieves the router object from the React Router
  const params = useParams(); // retrieves the URL parameters

  useEffect(() => {
      if (params.id) {
        api.get(`/private/offer/${params.id}`) 
            .then ((r:any) => setOffer(r.data.data.offer))
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
  }, [])

return (
  <div>
    <PageOffer offer={offer} />
  </div>
)
}
