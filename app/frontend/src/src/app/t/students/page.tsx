"use client"
import React, { useEffect, useState } from 'react'
import ListStudents from "@/components/students/tutor/list"
import { useAuth } from "@/components/auth-provider"
import { useToast } from '@/components/ui/use-toast'

export default function Students() {
  const { user, api } = useAuth();
  const { toast } = useToast()
  const [students, setStudents] = useState([])

  useEffect(() => {
    api.get(`/private/tutor/${user.id}/students`)
    .then ((r:any) => setStudents(r.data.data.students))
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
    <ListStudents students={students} />
  </div>
)
}