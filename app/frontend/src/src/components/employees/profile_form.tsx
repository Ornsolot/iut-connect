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
import { useParams } from "next/navigation"

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
        }).min(1, {
            message: "Le code postal est invalide."
        }),
        website: z.string().url({
            message: "L'adresse du site est invalide."
        }).optional(),
        contact: z.string().optional()
    })

export default function EmployeeProfileForm(this: any, { employee }: { employee: any }) {
    const { toast } = useToast()
    const { api } = useAuth();
    const [confirmed, fctMiseAJour] = React.useState(false);
    const params = useParams();

    function onModif() {
        if (confirmed) {
            fctMiseAJour(false)
        } else {
            fctMiseAJour(true)
        }
    }
    
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
         
          api.post(`/private/employeeprofile/${params.id}`, {
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
        <>
          <Label>
            <h1 className='text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl dark:text-white'>Profil de l'entreprise</h1>
          </Label>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'entreprise</FormLabel>
                    <FormControl>
                      <Input placeholder= {employee.com_name} type="text" {...field} disabled={!confirmed}/>
                    </FormControl>
                    <FormDescription>
                      Nom de l'entreprise (et nom de la branche ou du secteur) 
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-2 grid-cols-2">
                <div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" type="email" {...field} disabled={!confirmed}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input placeholder="mot de passe" type="password" {...field} disabled={!confirmed}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid gap-2 grid-cols-2">
                  <div>
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse (nom de la ville)</FormLabel>
                          <FormControl>
                            <Input placeholder="adresse" type="text" {...field} disabled={!confirmed}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="postal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code postal</FormLabel>
                        <FormControl>
                          <Input placeholder="code postal" type="number" {...field} disabled={!confirmed}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse du site internet</FormLabel>
                    <FormControl>
                        <Input placeholder="adresse du site" type="url" {...field} disabled={!confirmed}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact addtionnel</FormLabel>
                    <FormControl>
                        <Input placeholder="contact" type="text" {...field} disabled={!confirmed}/>
                    </FormControl>
                    <FormDescription>
                      Contact addtionnel comme numéro de téléphone ou courriel de responsables, etc
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="ml-auto w-fit h-fit">
                <Button type="submit" disabled={!confirmed}>Modifier</Button>
              </div>
              
            </form>
          </Form>
          <br/>
          <div className="ml-auto w-fit h-fit">
              <Button onClick={onModif} >Modification</Button>
          </div>
      </>
    )
}