"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Divide } from "lucide-react";
import React from 'react'
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/auth-provider"
import { useToast } from '@/components/ui/use-toast'
import { Button } from "@/components/ui/button"

export default function PageCompany({ company }: { company: any }) {
    const { api } = useAuth();
    const { toast } = useToast()
    const router = useRouter()
    const params = useParams(); // retrieves the URL parameters

    function deleteCompany() {
        if (company.com_name) { 
          api.delete(`/private/company/${company.com_name}`) 
              .then (
                toast({
                title: "Successfuly deleted !",
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
      router.push(`/t/admin/entreprise`)
      }
    
    return (<div className="h-screen flex flex-col gap-3">
        <Card key={company.com_name}>
            <CardContent className="p-6">
                <div className="flex gap-5"> 
                    <div className="flex-none  flex justify-between">
                        <p className="font-thin text-sm">{company.city} - {company.postal_code} - {company.country && company.country.Valid ? company.country.String : ""}</p>
                    </div>
                </div>
                <div className="flex gap-5 px-5 items-center">
                    <img src="/logo.svg" alt="icon" className="w-12 h-12 object-contain"/>
                    <p className="font-bold mx-auto text-2xl items-center"> {company.com_name}</p>
                </div>
                <div>
                    <p>Site Web : </p>
                    <p>{company.website_url && company.website_url.Valid ? company.website_url.String : ""}</p>
                    <br/>
                    <p>Contact : </p>
                    <p>{company.contact && company.contact.Valid ? company.contact.String : ""}</p>
                    <br/>
                </div>
                  <Button type="submit" onClick={() => deleteCompany()}>Supprimer l'Entreprise</Button>
            </CardContent>
        </Card>

    </div>)
}