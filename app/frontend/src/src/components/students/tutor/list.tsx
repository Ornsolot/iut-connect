"use client"

import { Card, CardContent } from "@/components/ui/card"
import React from 'react'
import UserIcon from "@/components/user-icon";
import { useRouter } from "next/navigation";

export default function ListStudents({ students }: { students: any[] }) {
  const router = useRouter()
  return (
    <div className="h-screen flex flex-col gap-3">
      {
        students && students.map(student => {
          return (
            <Card key={student.name} onClick={() => router.push(`/t/students/${student.id}`) } className="cursor-pointer">
              <CardContent className="p-6 " >
                <div className="flex gap-5 items-center ">
                  <UserIcon user={student} />
                  <div className="flex-auto flex justify-center flex-col"> 
                    <p className="font-bold text-xl ">{student.name} {student.first_name}</p>
                  </div>
                  <div className="flex-none flex justify-center flex-col text-right">
                    {
                      student.state && student.state.Valid ?
                      <>
                        <p className="font-kodchasan">{student.state.String }</p>
                      </> : 
                      ""
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })
      }
    </div>
  )
}
