"use client"

import { Card, CardContent } from "@/components/ui/card"
import React from 'react'
import { useRouter } from "next/navigation";
import { format } from "date-fns";
export default function ListEmployees({ employee }: { employee: any[] }) {
    const router = useRouter()
    return (<div className="h-screen flex flex-col gap-3">
        {
        employee?.map(d =>
            {
                return (<Card key={d.id} onClick={() => router.push(`/t/admin/dashboard/employee/${d.id}`)}>
                    <CardContent className="p-6 ">
                        <div className="flex gap-5">
                            <img src="/logo.svg" alt="icon" className="w-12 h-12 object-contain"/>
                            <div className="flex-auto flex justify-between flex-col"> 
                                    <p className="font-bold  text-2xl ">{d.first_name} {d.name}</p>
                                    <p className="font-thin text-sm">Entreprise donnée : {d.com_name}</p>
                                    <br/>
                            </div>
                            <div className="flex-none flex justify-between flex-col text-right">
                                    <p className="font-thin text-sm">E-Mail : {d.mail}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>)}
        )}
    </div>)
}