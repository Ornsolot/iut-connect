"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Divide } from "lucide-react";
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

    const FormSchema = z.object({
        com_id: z
          .string({
            required_error: "Aucune entreprise séléctionnée.",
          })
      })

      export default function SelectForm({ company }: { company: any[] }) {
        const { api } = useAuth();
        const { toast } = useToast()
        const router = useRouter()
        const params = useParams(); // retrieves the URL parameters
        const form = useForm<z.infer<typeof FormSchema>>({
          resolver: zodResolver(FormSchema),
        })
    
      function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
          title: "You submitted the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
          ),
        })
        //const jsonvalue = JSON.parse(data)
        if (params.id) { 
            api.patch(`/private/employee/assign/${params.id}/${data.com_id}`) 
                .then (
                  toast({
                  title: "Entreprise assignée avec succès!",
                })
                )
                .catch((e:any) => {
                    toast({
                        variant: "destructive",
                        title: "Error : assign fail!",
                        description: (
                            e.response.data.error
                        ),
                    })
            })
        }
      }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="com_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigner une entreprise</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une Entreprise"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <div className="flex flex-col">
                            {
                            company?.map(c =>
                                {
                                    return (
                                        <SelectItem value={c.com_id.Int64}>{c.com_name}</SelectItem>
                                    )}
                            )}
                            <SelectItem value = "1" >Aucune</SelectItem>
                        </div>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Enregistrer</Button>
          </form>
        </Form>
      )
}
