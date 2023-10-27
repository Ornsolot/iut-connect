"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios";
import React, { useEffect, useState } from 'react'
import { useAuth } from "@/components/auth-provider"
import { useRouter, useParams } from 'next/navigation'
import EmployeeProfileForm from "@/components/employees/profile_form"

//if account is confirmed, company can change its profile else not
var confirmed = true

const FormSchema = z.object({
    email: z.string().email({
        message: "Le courriel est invalide."
    }),
    password: z.string().min(14, {
        message: "Le mot de passe doit faire au moins 14 caractères.",
    }),
    name: z.string().min(1, {
        message: "Le nom de l'entreprise est requis."
    }),
    city: z.string().min(1, {
        message: "Le nom de la ville est requis."
    }),
    postal: z.coerce.number().int({
        message: "Le code postal est invalide."
    }),
    website: z.string().url({
        message: "L'adresse du site est invalide."
    }).optional(),
    contact: z.string().optional()
})


export default function modifyCompanyProfile() {
    const { toast } = useToast()

    const [employee, setEmployee] = useState([])
    const { api } = useAuth();
    const params = useParams();

    useEffect(() => {
      console.log("ENTER");
      if (params.id) { 
        console.log("ENTER2");
        
        api.get(`/private/employee/${params.id}`) 
            .then ((r:any) => setEmployee(r.data.data.employee))
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
    }, [])
  
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      shouldUnregister: false,
    })
  
    function onSubmit(data: z.infer<typeof FormSchema>) {
        modify(JSON.stringify(data, null, 2))
    }
  
    function modify(data: string) {
        console.log(JSON.parse(data));
    
        const company = JSON.parse(data)
    
        api.post('/private/profile', {
          "email": company.email,
          "password": company.password,
          "name": company.name,
          "city": company.city,
          "postal": company.postal,
          "website": company.website,
          "conctat": company.contact,
        })
    
        toast({
          title: "You submitted the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{data}</code>
            </pre>
          ),
        })
    }

    return (
      <EmployeeProfileForm employee={employee} />
    )
}