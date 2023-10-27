"use client"
import React, { useEffect, useState } from 'react'
import { DataTable} from "@/components/tutors/data-table"
import { columns } from "@/components/tutors/column"
import { useAuth } from "@/components/auth-provider"
import { useToast } from '@/components/ui/use-toast'

export default function Tutors() {
  const { api } = useAuth();
  const { toast } = useToast()
  const [tutors, setTutors] = useState([])

  useEffect(() => {
    api.get('/private/tutors')
    .then ((r:any) => {
      setTutors(r.data.data.tutors)
    })
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
    <div className="container mx-auto">
        <DataTable columns={columns} data={tutors} />
    </div>
  );
}
