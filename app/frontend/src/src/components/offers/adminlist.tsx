"use client"

import { Card, CardContent } from "@/components/ui/card"
import React from 'react'
import { useRouter } from "next/navigation";
import { format } from "date-fns";
export default function ListOffers({ offer }: { offer: any[] }) {
    const router = useRouter()
    return (<div className="h-screen flex flex-col gap-3">
        {
        offer?.map(d =>
            {
                return (<Card key={d.name} onClick={() => router.push(`/t/admin/dashboard/offres/${d.id}`)}>
                    <CardContent className="p-6 ">
                    <div className="flex gap-5">
                        <img src="/logo.svg" alt="icon" className="w-12 h-12 object-contain"/>
                        <div className="flex-auto flex justify-between flex-col">
                            <p className="font-bold  text-2xl ">{d.name}</p>
                            <p className="font-thin text-sm">Entreprise : {d.com_name}</p>
                            <p className="font-thin text-sm">Secteur : {d.sector && d.sector.Valid ? d.sector.String : ""}</p>
                        </div>
                        <div className="flex-none flex justify-between flex-col text-right">
                        <p className="font-thin text-sm">Contacter : {d.contact && d.contact.Valid ? d.contact.String : ""}</p>
                            <p className="font-thin text-sm">{format(new Date(d.date), "dd/MM/yyyy")}</p>
                        </div>
                    </div>
                    </CardContent>
                </Card>)}
        )}
    </div>)
}