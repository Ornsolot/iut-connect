"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Divide } from "lucide-react";
import { useAuth } from "@/components/auth-provider"
import { useToast } from '@/components/ui/use-toast'
import React from 'react'
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button"

export default function PageOffer({ offer }: { offer: any }) {
    const { api } = useAuth();
    const { toast } = useToast()
    const router = useRouter()
    const params = useParams(); // retrieves the URL parameters

    function validateOffer() {
        if (params.id) { 
          api.patch(`/private/offers/validate/${params.id}`) 
              .then (
                toast({
                title: "Offre validée !",
              })
              )
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
    }
    
    return (<div className="h-screen flex flex-col gap-3">
        <Card key={offer.name}>
            <CardContent className="p-6">
                <div className="flex gap-5"> 
                    <div className="flex-auto flex justify-between"> 
                        <img src="/logo.svg" alt="icon" className="w-12 h-12 object-contain"/>
                    </div>
                </div>
                <div>
                    <div>
                        <p className="font-bold  text-2xl " >{offer.name} - {offer.com_name}</p>
                    </div>
                    <div className="flex-none  flex justify-between">
                        <p className="font-thin text-sm">Contacter : {offer.contact && offer.contact.Valid ? offer.contact.String : ""}</p>
                    </div>
                </div>
                <div>
                    <div className="flex-none  flex justify-between">
                        <p className="font-thin text-sm">Approuvé? {offer.approved ? "Oui" : "Non"} | Archivé ? {offer.archived ? "Oui" : "Non"}</p>
                    </div>
                </div>
                <div>
                    <br/>
                    <p>Présentation de l'Entreprise : </p>
                    <p>{offer.companyPresentation}</p>
                    <br/>
                    <p>Secteur : </p>
                    <p>{offer.sector && offer.sector.Valid ? offer.sector.String : ""}</p>
                    <br/>
                    <p>Context :</p>
                    <p>{offer.context && offer.context.Valid ? offer.context.String : ""}</p>
                    <br/>
                    <p>Outils : </p>
                    <p>{offer.tools && offer.tools.Valid ? offer.tools.String : ""}</p>
                    <br/>
                    <p>Resultats : </p>
                    <p>{offer.condition && offer.condition.Valid ? offer.condition.String : ""}</p>
                    <br/>
                </div>
                <div className=" w-fit h-fit">
                  <Button type="submit" onClick={() => validateOffer()}>Valider l'Offre</Button>
                </div>
            </CardContent>
        </Card>

    </div>)
}