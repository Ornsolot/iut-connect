"use client"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";

// Contraintes de la base de données
const stringMinLength = 1
const stringMaxLength = 100

const mailMinLength = stringMinLength
const mailMaxLength = stringMaxLength

// Define the form schema using Zod
const formSchema = z.object({
  mail: z.string().min(mailMinLength, {
    message: `L'e-mail doit contenir au moins ${mailMinLength} caractères.`,
  }).max(mailMaxLength, {
    message: `L'e-mail doit contenir au plus ${mailMaxLength} caractères.`,
  }),
});

/**
 * Component for renewing password
 */
export default function RenewPassword() {
  const router = useRouter();
  const { api } = useAuth();
  const { toast } = useToast();

  // Create a form using react-hook-form and the form schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
  });

  /**
   * Handle form submission
   * @param formData - The form data
   */
  function onSubmit(formData: z.infer<typeof formSchema>) {
    api.post("/auth/renew-password", {
      mail: formData.mail,
    })
    .then((r: any) => {
      toast({
        title: "Mail for renew password successfully sent!",
        description: r.data.message,
      });
      router.push("/auth/login");
    })
    .catch((e: any) => {
      toast({
        variant: "destructive",
        title: "Error: ",
        description: e.response.data.error,
      });
    });
  }

  return (
    <div>
      <p>Saisissez votre adresse e-mail.</p>
      <Form {...form}>
        {/* Render the form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="mail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse e-mail</FormLabel>
                <FormControl>
                  {/* Render the input field */}
                  <Input placeholder="" type="email" {...field} />
                </FormControl>
                <FormDescription>Pas l'e-mail universitaire</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <p>Vous allez recevoir un e-mail de réinitialisation de mot de passe.</p>
          <Button type="submit">Recevoir l'e-mail</Button>
        </form>
      </Form>
    </div>
  );
}