"use client"
import { CheckIcon, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import React from "react";
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/auth-provider"


const FormSchema = z.object({
  sector: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  com_name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  /*attachment: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),*/
  companyPresentation: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  context: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  condition: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  tool: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  contact: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  webSite: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

const schematest = z.object({
  array_field: z.array(z.string()).optional(),
});



export default function InputForm() {
  const { api } = useAuth();
  const { toast } = useToast()


  const FormCompany = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    shouldUnregister: false,
  })

  function onSubmitCompany(data: z.infer<typeof FormSchema>) {
    console.log(data);
    FormData(JSON.stringify(data, null, 2))
  }
  
  function FormData(data: string) {
    console.log(JSON.parse(data));
    
    const jsonvalue = JSON.parse(data)
  
  
    api.post('/private/offer', {
      "com_name" : jsonvalue.com_name,
      "contact": {"string" : jsonvalue.contact , "valid" : true},
      "sector": {"string" : jsonvalue.sector , "valid" : true} ,
      "name": jsonvalue.name,
      //"attachment": {"string" : jsonvalue.attachement , "valid" : true},
      "companyPresentation": jsonvalue.companyPresentation,
      "context": {"string" : jsonvalue.context , "valid" : true},
      "condition": {"string" : jsonvalue.condition , "valid" : true},
      "tools": {"string" : jsonvalue.tool , "valid" : true},
      "url": {"string" : jsonvalue.webSite , "valid" : true},
    }).then((r: any) => {
      toast({
        title: "Offre créé avec succès!",
        description: (
          "Un administrateur va vous contacter avant que votre offre soit visible aux étudiants"
        )
      })
    }).catch((e: any) => {
      if (e.response.data.error === "L'e-mail de cet utilisateur n'est pas validé") {
        toast({
          variant: "destructive",
          title: "Error : ",
          description: (
            e.response.data.error
          )
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error : Echec de la publication de l'offre",
          description: (
            e.response.data.error
          ),
        })
      }
    })
  }

  return (
    <div>
      <h1 className='text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl dark:text-white'>Formulaire d'offres</h1>
        <Form {...FormCompany}>
          <form onSubmit={FormCompany.handleSubmit(onSubmitCompany)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <FormField
              control={FormCompany.control}
              name='sector'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sector</FormLabel>
                  {/* Liste deroulante a choix multiple fonctionnelle - A rajoute plus tard en accord avec la
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className='w-full justify-start'
                        >
                          <PlusCircleIcon className='mr-2 h-4 w-4' />
                          {selectedValues?.size > 0 && (
                            <>
                              <Separator
                                orientation='vertical'
                                className='mx-2 h-4'
                              />
                              <Badge
                                variant='secondary'
                                className='rounded-sm px-1 font-normal lg:hidden'
                              >
                                {selectedValues.size}
                              </Badge>
                              <div className='flex space-x-1'>
                                {selectedValues.size > 4 ? (
                                  <Badge
                                    variant='secondary'
                                    className='rounded-sm px-1 font-normal'
                                  >
                                    {selectedValues.size} selected
                                  </Badge>
                                ) : (
                                  options
                                    .filter((option) =>
                                      selectedValues.has(option.value),
                                    )
                                    .map((option) => (
                                      <Badge
                                        variant='secondary'
                                        key={option.value}
                                        className='rounded-sm px-1 font-normal'
                                      >
                                        {option.value}
                                      </Badge>
                                    ))
                                )}
                              </div>
                            </>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-[200px] p-0' align='start'>
                      <Command>
                        <CommandInput
                          placeholder='Search array...'
                          className='h-9'
                        />
                        <CommandEmpty>No result found.</CommandEmpty>
                        <CommandGroup>
                          {options.map((option, index) => {
                            const isSelected = selectedValues.has(option.value);
                            return (
                              <CommandItem
                                key={index}
                                onSelect={() => {
                                  if (isSelected) {
                                    selectedValues.delete(option.value);
                                  } else {
                                    selectedValues.add(option.value);
                                  }
                                  const filterValues =
                                    Array.from(selectedValues);
                                  FormCompany.setValue("sector", filterValues);
                                }}
                              >
                                <div
                                  className={cn(
                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "opacity-50 [&_svg]:invisible",
                                  )}
                                >
                                  <CheckIcon className={cn("h-4 w-4")} />
                                </div>
                                <span>{option.value}</span>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                        </Popover>*/}
                  <FormControl>
                      <Input placeholder="" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={FormCompany.control}
              name="com_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'entreprise</FormLabel>
                  <FormControl>
                      <Input placeholder="" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <FormField
              control={FormCompany.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'offre</FormLabel>
                  <FormControl>
                      <Input placeholder="" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*<FormField
              control={FormCompany.control}
              name="attachment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Piece jointe</FormLabel>
                  <FormControl>
                      <Input placeholder="" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />*/}
            <FormField
              control={FormCompany.control}
              name="companyPresentation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Présentation d'entreprise</FormLabel>
                  <FormControl>
                      <Textarea placeholder=""  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={FormCompany.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contexte</FormLabel>
                  <FormControl>
                    <Textarea placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <FormField
              control={FormCompany.control}
              name="tool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outil et Langage utiliser</FormLabel>
                  <FormControl>
                      <Textarea placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={FormCompany.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>condition et resultat </FormLabel>
                  <FormControl>
                      <Textarea placeholder="" id="message-2" {...field} />   
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <FormField
              control={FormCompany.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contacte</FormLabel>
                  <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={FormCompany.control}
              name="webSite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>webSite</FormLabel>
                  <FormControl>
                      <Input placeholder="URL" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <div className="ml-auto w-fit h-fit">
              <Button type="submit">Publier</Button>
            </div>
          </form>
        </Form>
      </div>
  )
}