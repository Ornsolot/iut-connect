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
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from "@/components/auth-provider"
import { AxiosError } from "axios"

// Contraintes de la base de données
const stringMinLength = 1
const stringMaxLength = 100

const mailMinLength = stringMinLength
const mailMaxLength = stringMaxLength

const passwordMinLength = 8
const passwordMaxLength = 50

const FormSchema = z.object({
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
})

/**
 * Renders the Login form component.
 */
export default function Login() {
  const router = useRouter();
  const { api, login } = useAuth();
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    shouldUnregister: false,
  })

  /**
   * Handles form submission.
   *
   * @param data - The form data.
   */
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    api.post('/auth/login', {
      "mail": data.mail,
      "password": data.password,
    }).then((r: any) => {
      if (r.name === "AxiosError") {
        toast({
          variant: "destructive",
          title: "Error : ",
          description: r.response.data.error,
        })
      }
      login(r.data.data.user)
      router.push('/');
    }).catch((e: any) => {
      if (e.response.data.error === "L'e-mail de cet utilisateur n'est pas validé") {
        toast({
          variant: "destructive",
          title: "Error : ",
          description: (
            e.response.data.error
          ),
          action: (
            <Button onClick={() => router.push('/auth/confirm-mail')}>Send a new email</Button>
          )
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error : ",
          description: (
            e.response.data.error
          ),
        })
      }
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-[400px]">
          <FormField
            control={form.control}
            name="mail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse e-mail</FormLabel>
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
            control={form.control}
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
          <div className="w-full text-center">
            <Link className="underline" href="/auth/renew-password">Mot de passe oublié ?</Link>
          </div>
          <div className="ml-auto w-fit h-fit">
            <Button type="submit">Se connecter</Button>
          </div>
        </form>
      </Form>
    </>
  )
}
