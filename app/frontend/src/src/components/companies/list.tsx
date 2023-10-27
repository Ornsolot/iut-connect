"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Divide } from "lucide-react";
import React from 'react'
import { useRouter } from "next/navigation";
import { format } from "date-fns";
export default function ListCompanies({ company }: { company: any[] }) {
    const router = useRouter()
    return (
    <div className="h-screen flex flex-col gap-3">
        {
        company?.map(c =>
            {
                return (
                <Card key={c.com_name} onClick={() => router.push(`/t/admin/dashboard/entreprise/${c.com_name}`)}>
                    <CardContent className="p-6 ">
                        <div className="flex gap-5">
                            <img src="/logo.svg" alt="icon" className="w-12 h-12 object-contain"/>
                            <div className="flex-auto flex justify-between flex-col">
                                <p className="font-bold  text-2xl ">{c.com_name}</p>
                                   <p className="font-thin text-sm">{c.contact && c.contact.Valid ? c.contact.String : ""}</p>
                            </div>
                            <div className="flex-none flex justify-between flex-col text-right">
                                    <p className="font-kodchasan">{c.city} - {c.postal_code} - {c.country && c.country.Valid ? c.country.String : ""}</p>
                                    <p className="font-thin text-sm">{c.website_url && c.website_url.Valid ? c.website_url.String : ""}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>)}
        )}
    </div>)
}