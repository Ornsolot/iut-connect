"use client"

import { useToast } from "@/components/ui/use-toast"
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from "react"
import { useAuth } from '@/components/auth-provider';

/**
 * This function confirms the email by making an API call
 * @returns JSX.Element
 */
export default function ConfirmMail() {
  const router = useRouter(); // retrieves the router object from the React Router
  const params = useParams(); // retrieves the URL parameters
  const { toast } = useToast(); // retrieves the toast object from the ToastProvider
  const { api } = useAuth(); // retrieves the api object from the AuthProvider

  useEffect(() => {
    if (params.token) { // checks if the token parameter exists in the URL
      api.post(`/auth/email-confirmation/${params.token}`) // makes a POST request to confirm the email with the token
        .then((r: any) => { // handles the successful response
          toast({
            title: "Adresse e-mail",
            description: r.data.message,
          });
          router.push('/auth/login'); // redirects the user to the login page
        })
        .catch((e: any) => { // handles the error response
          toast({
            variant: "destructive",
            title: "Error:",
            description: e.response.data.error,
          });
        });
    }
  }, []);

  return (
    <>
      <p>Validation de l'e-mail en cours...</p>
    </>
  );
}
