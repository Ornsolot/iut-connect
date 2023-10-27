'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/**
 * Renders the Home component.
 */
export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card>
        <CardHeader>
          <CardTitle>Bienvenu sur IUT Connect</CardTitle>
          <CardDescription>IUT Connect est une plateforme développé dans le but de facilité la recherche d'alternance aux étudiants et égalemnt de permettre aux entreprises de rapidement trouver des alternants.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Application web développé dans pour les alternances liés à l'IUT de Vannes</p>
        </CardContent>
        {/* <CardFooter>
          <p></p>
        </CardFooter> */}
      </Card>
    </main>
  );
}
