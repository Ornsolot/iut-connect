"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Divide } from "lucide-react";
import SelectCompanyForEmp from "@/components/employees/select_page"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/auth-provider"
import { useToast } from '@/components/ui/use-toast'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import * as z from "zod"
  import { Button } from "@/components/ui/button"

  

export default function PageEmployee(this: any, { employee }: { employee: any }) {
    const { api } = useAuth();
    const { toast } = useToast()
    const [company, setCompanies] = useState([])
    const router = useRouter()
    const params = useParams(); // retrieves the URL parameters
    useEffect(() => {
        api.get('/private/companies')
        .then ((r:any) => setCompanies(r.data.data.company))
        .catch((e:any) => {
        console.log(e);
        toast({
            variant: "destructive",
            title: "Error : ",
            description: (
            e.response.data.error
            ),
        })
        })
    }, [api, toast])

      function deleteEmployees() {
          if (params.id) {
            api.delete(`/private/employee/${params.id}`) 
                .then (
                  toast({
                  title: "Employeur supprimé !",
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
        router.push(`/t/admin/employee`)
      }
    
    return (<div className="h-screen flex flex-col gap-3">
        <Card key={employee.id}>
            <CardContent className="p-6">
                <div className="flex gap-5"> 
                    <div className="flex-none  flex justify-between">
                        <p className="font-bold  text-2xl ">{employee.name} - {employee.first_name}</p>
                    </div>
                </div>
                <div className="flex gap-5 px-5 items-center">
                    <img src="/logo.svg" alt="icon" className="w-12 h-12 object-contain"/>
                    <p className="font-bold mx-auto text-2xl items-center">{employee.com_name}</p>
                </div>
                <SelectCompanyForEmp company={company}/>
                <br/>
                <div className=" w-fit h-fit">
                  <Button type="submit" onClick={() => deleteEmployees()}>Supprimer l'Employeur</Button>
                </div>
            </CardContent>
        </Card>

    </div>)
}