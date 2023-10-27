"use client"
import React, { useEffect, useState } from 'react'
import ListCompanies from "@/components/companies/list"
import { useAuth } from "@/components/auth-provider"
import { useToast } from '@/components/ui/use-toast'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export default function Companies() {
  const { api } = useAuth();
  const { toast } = useToast()
  const router = useRouter()
  const [company, setCompanies] = useState([])

  useEffect(() => {
    api.get('/private/companies')
    .then ((r:any) => setCompanies(r.data.data.company))
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
  }, [api, toast])

return (
  <div className="w-full">
    <div className="w-full flex mb-5">
      Entreprises
      <Button type="submit" className="ml-auto" onClick={() => router.push(`./redacent`)} >Créer une entreprise</Button>
    </div>
    
    <ListCompanies company={company} />
  </div>
)
}