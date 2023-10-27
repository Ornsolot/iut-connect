"use client"
import React, { useEffect, useState } from 'react'
import PageEmployee from "@/components/employees/page_employee"
import { useAuth } from "@/components/auth-provider"
import { useRouter, useParams } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

export default function Employee() {
  const { api } = useAuth();
  const { toast } = useToast()
  const [employee, setEmployee] = useState([])
  const router = useRouter(); // retrieves the router object from the React Router
  const params = useParams(); // retrieves the URL parameters

  useEffect(() => {
      if (params.id) { 
        
        api.get(`/private/employee/${params.id}`) 
            .then ((r:any) => setEmployee(r.data.data.employee))
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
    <PageEmployee employee={employee} />
  </div>
)
}
