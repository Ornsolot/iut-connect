"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Archive, Divide, Mail, PanelTop, PhoneCall } from "lucide-react";
import React from 'react'
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
export default function PageOffer({ offer }: { offer: any }) {
    return (
        <div className="h-screen flex flex-col flex-wrap gap-3">
            <div className="grid grid-rows-2 grid-cols-2 gap-10 grid-flow-row-dense">
                <Card key={offer.name} className="col-span-1">
                    <CardContent className="p-6">
                        <div className="flex gap-5 mb-3">
                            <div className="flex gap-8 px-3 items-center mb-8">
                                <img src="/logo.svg" alt="icon" className="w-24 h-24 object-contain"/>
                            <div>
                                <p className="font-bold items-center text-2xl mb-3 "> {offer.name}</p>
                                { offer.sector?.Valid && <Badge className="font-kodchasan">{offer.sector.String}</Badge> }
                            </div>
                            </div>
                        </div>
                        {/* <div className="flex gap-8 px-3 items-center mb-8">
                            <img src="/logo.svg" alt="icon" className="w-24 h-24 object-contain"/>
                            <div>
                                <p className="font-bold items-center text-3xl mb-3 "> {offer.offer_name}</p>
                                { offer.sector?.Valid && <Badge className="font-kodchasan">{offer.sector.String}</Badge> }
                            </div>
                        </div> */}
                        <div className="flex text-left flex-col gap-8 px-3">
                            <div>
                                <p className="font-kodchasan text-primary font-semibold">Présentation de l'Entreprise</p>
                                <p>{ offer.companyPresentation}</p>
                            </div>
                            <div>
                            {offer.context && offer.context.Valid ? 
                                <>
                                    <p className="font-kodchasan text-primary font-semibold">Context</p>
                                    <p>{ offer.context.String }</p>
                                </>
                            : ""}
                            </div>
                            <div>
                            {offer.tools && offer.tools.Valid ?
                                <>
                                    <p className="font-kodchasan text-primary font-semibold">Outils</p>
                                    <p>{ offer.tools.String }</p>
                                </>
                            : ""}
                            </div>
                            <div>
                            {offer.condition && offer.condition.Valid ? 
                                <>
                                    <p className="font-kodchasan text-primary font-semibold">Résultats attendus </p>
                                    <p>{ offer.condition.String }</p>
                                </>
                            : ""}
                            </div>
                        </div>
                        <div className="px-3 text-right"> 
                                <p className="font-thin text-sm">{offer.com_name}</p> 

                        </div>

                    </CardContent>
                </Card>
                <Card className="w-fit h-fit">
                    <CardContent>
                        <div className="mb-3 p-6">
                            <p className="font-kodchasan text-primary font-semibold"> Contact</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3" >
                            {offer.contact && offer.contact.Valid ? 
                                <>
                                    <Mail size={20} />
                                    <p>{ offer.contact.String }</p>
                                </>
                            : ""}
                            </div>
                            <div className="flex gap-3" >
                            {offer.url && offer.url.Valid ?
                                <>
                                    <PanelTop size={20} />
                                    <p>{ offer.url.String }</p>
                                </>
                            : ""}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}