'use client'

import React, { useEffect, useState } from 'react'

import { useAuth } from "@/components/auth-provider"
import { useToast } from '@/components/ui/use-toast'

import { DataTable } from "@/components/students/students-table/data-table";
import { columns } from "@/components/students/students-table/column";


export default function Students() {
  const { api } = useAuth();
  const { toast } = useToast()
  const [students, setStudents] = useState([])
  const [tutors, setTutors] = useState([])


  function refresh() {
    api.get('/private/students')
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
  }
  function handleUpdate(rows:any[], tutor:any) {
    api.patch(`/private/students?ids=${rows.map((r:any) => r.original.id)}`, {tutor_id: tutor.id})
      .then((r:any) => {
        console.log("rrr", r)
        refresh()
        
      })
  }

  useEffect(() => {
    refresh()

    api.get('/private/tutors')
      .then ((r:any) => setTutors(r.data.data.tutors))
  }, [])

  return (
    <div>
      <div className="container mx-auto">
        <DataTable columns={columns} data={students} onUpdate={handleUpdate} tutors={tutors} />
      </div>
    </div>
  )
}
