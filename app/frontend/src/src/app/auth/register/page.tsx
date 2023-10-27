"use client"

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import React from "react";

// Contraintes de la base de données
const stringMinLength = 1
const stringMaxLength = 100

const mailMinLength = stringMinLength
const mailMaxLength = stringMaxLength

const passwordMinLength = 8
const passwordMaxLength = 50

const nameMinLength = stringMinLength
const nameMaxLength = stringMaxLength

const ubsMailMinLength = stringMinLength
const ubsMailMaxLength = stringMaxLength

const firstNameMinLength = stringMinLength
const firstNameMaxLength = stringMaxLength

const FormSchema = {
  mail: z.string().min(mailMinLength, {
    message: `L'e-mail doit contenir au moins ${mailMinLength} caractères.`,
  }).max(mailMaxLength, {
    message: `L'e-mail doit contenir au plus ${mailMaxLength} caractères.`,
  }),
  password: z.string().min(passwordMinLength, {
    message: `Le mot de passe doit contenir au moins ${passwordMinLength} caractères.`,
  }).max(passwordMaxLength, {
    message: `Le mot de passe doit contenir au plus ${passwordMaxLength} caractères.`,
  }),
  name: z.string().min(nameMinLength, {
    message: `Le nom doit contenir au moins ${nameMinLength} caractères.`,
  }).max(nameMaxLength, {
    message: `Le nom doit contenir au plus ${nameMaxLength} caractères.`,
  }),
}

const StudentFormSchema = z.object({
  ...FormSchema,
  mail_ubs: z.string().min(ubsMailMinLength, {
    message: `Le mail UBS doit contenir au moins ${ubsMailMinLength} caractères.`,
  }).max(ubsMailMaxLength, {
    message: `Le mail UBS doit contenir au plus ${ubsMailMaxLength} caractères.`,
  }),
  first_name: z.string().min(firstNameMinLength, {
    message: `Le prénom doit contenir au moins ${firstNameMinLength} caractères.`,
  }).max(firstNameMaxLength, {
    message: `Le prénom doit contenir au plus ${firstNameMaxLength} caractères.`,
  }),
})

const TutorFormSchema = z.object({
  ...FormSchema,
  mail_ubs: z.string().min(ubsMailMinLength, {
    message: `Le mail UBS doit contenir au moins ${ubsMailMinLength} caractères.`,
  }).max(ubsMailMaxLength, {
    message: `Le mail UBS doit contenir au plus ${ubsMailMaxLength} caractères.`,
  }),
  first_name: z.string().min(firstNameMinLength, {
    message: `Le nom doit contenir au moins ${firstNameMinLength} caractères.`,
  }).max(firstNameMaxLength, {
    message: `Le nom doit contenir au plus ${firstNameMaxLength} caractères.`,
  }),
})

const EmployeeFormSchema = z.object({
  ...FormSchema,
  first_name: z.string().min(firstNameMinLength, {
    message: `Le nom doit contenir au moins ${firstNameMinLength} caractères.`,
  }).max(firstNameMaxLength, {
    message: `Le nom doit contenir au plus ${firstNameMaxLength} caractères.`,
  }),
  com_name: z.string().min(firstNameMinLength, {
    message: `Le nom doit contenir au moins ${firstNameMinLength} caractères.`,
  }).max(firstNameMaxLength, {
    message: `Le nom doit contenir au plus ${firstNameMaxLength} caractères.`,
  }),
})


export default function InputForm() {
  const router = useRouter();
  const { toast } = useToast()
  const { api } = useAuth();

  // const [activeTab, setActiveTab] = React.useState("student");


  const studentForm = useForm<z.infer<typeof StudentFormSchema>>({
    resolver: zodResolver(StudentFormSchema),
    shouldUnregister: false,
  })

  const tutorForm = useForm<z.infer<typeof TutorFormSchema>>({
    resolver: zodResolver(TutorFormSchema),
    shouldUnregister: false,
  })

  const employeeForm = useForm<z.infer<typeof EmployeeFormSchema>>({
    resolver: zodResolver(EmployeeFormSchema),
    shouldUnregister: false,
  })

  function onSubmitStudent(data: z.infer<typeof StudentFormSchema>) {
    const regex = /@etud\.univ\-ubs\.fr$/;

    if (regex.test(data.mail)) {
      toast({
        variant: "destructive",
        title: "Error : ",
        description: (
          "L'adresse e-mail personnel ne peut pas être un e-mail de l'UBS."
        ),
      })
      return
    }
    register(data, "student")
  }

  function onSubmitTutor(data: z.infer<typeof TutorFormSchema>) {
    register(data, "tutor")
  }

  function onSubmitEmployee(data: z.infer<typeof EmployeeFormSchema>) {
    register(data, "employee")
  }

  function register(user: any, role: string) {
    console.log(process.env.NEXT_PUBLIC_BACKEND)
    api.post(`/auth/register`, {
      "mail": user.mail,
      "password": user.password,
      "name": user.name,
      "role": role,
      "first_name": user.first_name,
      "mail_ubs": user.mail_ubs,
      "com_name": user.com_name
    }).then((result: { data: any }) => {
      toast({
        title: "Successfuly registered !",
        description: (
          "You must confirm your email"
          // result.data.message
        ),
      })
      router.push('/auth/login')
    }).catch((error: any) => {
      toast({
        variant: "destructive",
        title: "Error : ",
        description: (
          error.response.data.error
        ),
      })
    })


  }

  return (
    <Tabs defaultValue="student" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="student">Étudiant</TabsTrigger>
        <TabsTrigger value="tutor">Tuteur</TabsTrigger>
        <TabsTrigger value="employee">Employeur</TabsTrigger>
      </TabsList>
      <TabsContent value="student">
        <Form {...studentForm}>
          <form onSubmit={studentForm.handleSubmit(onSubmitStudent)} className="space-y-6">
            <FormField
              control={studentForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                      <Input placeholder="" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={studentForm.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                      <Input placeholder="" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={studentForm.control}
              name="mail_ubs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse e-mail universitaire</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={studentForm.control}
              name="mail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse e-mail personnel</FormLabel>
                  <FormControl>
                      <Input placeholder="" type="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    Pas l'e-mail universitaire
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={studentForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="ml-auto w-fit h-fit">
              <Button type="submit">S'inscrire</Button>
            </div>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="tutor">
        <Form {...tutorForm}>
            <form onSubmit={tutorForm.handleSubmit(onSubmitTutor)} className="space-y-6">
            <FormField
                control={tutorForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                        <Input placeholder="" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={tutorForm.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                        <Input placeholder="" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={tutorForm.control}
                name="mail_ubs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse e-mail universitaire</FormLabel>
                    <FormControl>
                        <Input placeholder="" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={tutorForm.control}
                name="mail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse e-mail personnel</FormLabel>
                    <FormControl>
                        <Input placeholder="" type="email" {...field} />
                    </FormControl>
                    <FormDescription>
                      Pas l'e-mail universitaire
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={tutorForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                        <Input placeholder="" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="ml-auto w-fit h-fit">
                <Button type="submit">S'inscrire</Button>
              </div>
            </form>
          </Form>
      </TabsContent>
      
      <TabsContent value="employee">

        <Form {...employeeForm}>
          <form onSubmit={employeeForm.handleSubmit(onSubmitEmployee)} className="space-y-6">
          <FormField
              control={employeeForm.control}
              name="name"
              render={({ field }) => (
               <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="" type="text" {...field} />
                </FormControl>
                <FormMessage />
               </FormItem>
              )}
            />
            <FormField
              control={employeeForm.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={employeeForm.control}
              name="mail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse e-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={employeeForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={employeeForm.control}
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

            <div className="ml-auto w-fit h-fit">
              <Button type="submit">S'inscrire</Button>
            </div>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  )
}
