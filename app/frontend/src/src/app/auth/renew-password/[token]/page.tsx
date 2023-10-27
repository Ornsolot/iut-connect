"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/components/auth-provider';
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useParams } from 'next/navigation';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// Contraintes de la base de données
const passwordMinLength = 8
const passwordMaxLength = 50

const FormSchema = z.object({
  password: z.string().min(passwordMinLength, {
    message: `Le mot de passe doit contenir au moins ${passwordMinLength} caractères.`,
  }).max(passwordMaxLength, {
    message: `Le mot de passe doit contenir au plus ${passwordMaxLength} caractères.`,
  }),
  confirm_password: z.string().min(passwordMinLength, {
    message: `Le mot de passe doit contenir au moins ${passwordMinLength} caractères.`,
  }).max(passwordMaxLength, {
    message: `Le mot de passe doit contenir au plus ${passwordMaxLength} caractères.`,
  }),
})

/**
 * Component for confirming email and changing password.
 */
export default function ConfirmMail() {
  const router = useRouter(); // Access the router object
  const { api } = useAuth(); // Access the authentication API
  const params = useParams(); // Get the URL parameters
  const { toast } = useToast(); // Access the toast notification utility

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema), // Set up form validation using zod schema
    shouldUnregister: false, // Disable automatic unregistration of form fields
  });

  /**
   * Handle form submission.
   * @param data - Form data
   */
  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (params.token && data.password === data.confirm_password) {
      api
        .post(`/auth/renew-password/${params.token}`, {
          password: data.password,
        })
        .then((r: any) => {
          toast({
            title: "Mail for renew password successfully sent!",
            description: r.data.message,
          });
          router.push("/auth/login"); // Redirect to the login page
        })
        .catch((e: any) => {
          toast({
            variant: "destructive",
            title: "Error: ",
            description: e.response.data.error,
          });
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input placeholder="new password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <Input
                  placeholder="confirm new password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="ml-auto w-fit h-fit">
          <Button type="submit">Change</Button>
        </div>
      </form>
    </Form>
  );
}
