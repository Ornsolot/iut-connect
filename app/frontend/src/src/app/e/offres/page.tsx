"use client"
import React, { useEffect, useState } from 'react'
import ListOffers from "@/components/offers/listCompany"
import { useAuth } from "@/components/auth-provider"
import { useToast } from '@/components/ui/use-toast'

export default function Offers() {
  const { api } = useAuth();
  const { toast } = useToast()
  const [offer, setOffers] = useState([])

  useEffect(() => {
    api.get('/private/offers/company')
    .then ((r:any) => setOffers(r.data.data.offer))
    .catch((e:any) => {
      console.log(e);
      toast({
        variant: "destructive",
        title: "Error : ",
        description: (
          e.response.data.error
        ),
      })
    })
  }, [])

  // return (
  //   <div>
  //     Offer
  //     <DataTable columns={columns} data={offer}/>
  //   </div>
  // )

// }


return (
  <div>
    Vos Offres :
    <ListOffers offer={offer} />
  </div>
)
}
