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
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const stringMinLength = 1
const stringMaxLength = 100

const mailMinLength = stringMinLength
const mailMaxLength = stringMaxLength

const FormSchema = z.object({
  mail: z.string().min(mailMinLength, {
    message: `L'e-mail doit contenir au moins ${mailMinLength} caractères.`,
  }).max(mailMaxLength, {
    message: `L'e-mail doit contenir au plus ${mailMaxLength} caractères.`,
  })
})

/**
 * Renders a form to allow the user to re-send a confirmation email to confirm their account.
 */
export default function ConfirmMail() {
  const router = useRouter();
  const { toast } = useToast();
  const { api } = useAuth();

  // Create the form using react-hook-form
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    shouldUnregister: false,
  });

  /**
   * Handles form submission.
   * Sends a request to the API to re-send a confirmation email.
   * Displays a success toast message if the email is sent successfully,
   * otherwise displays an error toast message.
   * Redirects the user to the login page after sending the email.
   */
  function onSubmit(data: z.infer<typeof FormSchema>) {
    api.post("/auth/send-confirmation-email", {
       mail: data.mail
      })
      .then((r: any) => {
        toast({
          title: 'Confirmation mail successfully sent!',
          description: r.data.message,
        });
        router.push('/auth/login');
      })
      .catch((e: any) => {
        toast({
          variant: 'destructive',
          title: 'Error:',
          description: e.response.data.error,
        });
      });
  }

  return (
    <>
      <p>Saisissez vote adresse e-mail pour réenvoyer un e-mail de confirmation de compte.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="mail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse e-mail</FormLabel>
                <FormControl>
                  <Input placeholder="" type="email" {...field} />
                </FormControl>
                <FormDescription>Pas l'e-mail universitaire</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="ml-auto w-fit h-fit">
            <Button type="submit">Recevoir l'e-mail</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
