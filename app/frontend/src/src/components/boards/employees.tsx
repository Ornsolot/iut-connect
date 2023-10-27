"use client"
import React, { useEffect, useState } from 'react'
import ListEmployees from "@/components/employees/list"
import { useAuth } from "@/components/auth-provider"
import { useToast } from '@/components/ui/use-toast'

export default function Employee() {
  const { api } = useAuth();
  const { toast } = useToast()
  const [employee, setEmployee] = useState([])

  useEffect(() => {
    api.get('/private/employees')
    .then ((r:any) => setEmployee(r.data.data.employee))
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
  <div>
    Employeurs
    <ListEmployees employee={employee} />
  </div>
)
}
