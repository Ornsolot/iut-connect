"use client"
import React, { useEffect, useState } from 'react'
import ListOffers from "@/components/offers/list"
import { DataTable} from "@/components/offers/offers-archived-table/data-table"
import { columns } from "@/components/offers/offers-archived-table/columns"
import { useAuth } from "@/components/auth-provider"
import { useToast } from '@/components/ui/use-toast'

export default function archived() {
  const { api } = useAuth();
  const { toast } = useToast()
  const [offer, setOffers] = useState([])

  useEffect(() => {
    api.get('/private/offers/archived')
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
      <DataTable columns={columns} data={offer}/>
    </div>
  )

}
