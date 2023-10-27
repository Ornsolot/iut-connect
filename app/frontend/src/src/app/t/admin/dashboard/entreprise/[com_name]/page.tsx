"use client"
import React, { useEffect, useState } from 'react'
import PageCompany from "@/components/companies/page_company"
import { useAuth } from "@/components/auth-provider"
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast'

export default function Company() {
  const { api } = useAuth();
  const { toast } = useToast()
  const [company, setCompany] = useState([])
  const router = useRouter(); // retrieves the router object from the React Router
  const params = useParams(); // retrieves the URL parameters

  useEffect(() => {
      if (params.com_name) { 
        
        api.get(`/private/company/${params.com_name}`) 
            .then ((r:any) => setCompany(r.data.data.company))
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
    Entreprises
    <PageCompany company={company} />
  </div>
)
}