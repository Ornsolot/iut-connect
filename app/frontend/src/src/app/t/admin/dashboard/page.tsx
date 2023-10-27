'use client'

import Events from '@/components/boards/events'
import Students from '@/components/boards/students'
import Tutors from '@/components/boards/tutors'
import Offers from '@/components/boards/offers'
import Companies from '@/components/boards/companies'
import Employees from '@/components/boards/employees'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs'
import React from 'react'

export default function Dashboard() {
  return (
    <div>
        <Tabs defaultValue="events">
            <TabsList className='flex bg-card rounded p-2 gap-3 justify-around'>
                <TabsTrigger value="events" className='bg-background rounded px-3 w-full hover:bg-input'>Évènements</TabsTrigger>
                <TabsTrigger value="students" className='bg-background rounded px-3 w-full hover:bg-input'>Étudiants</TabsTrigger>
                <TabsTrigger value="tutors" className='bg-background rounded px-3 w-full hover:bg-input'>Tuteurs</TabsTrigger>
                <TabsTrigger value="offers" className='bg-background rounded px-3 w-full hover:bg-input'>Offres</TabsTrigger>
                <TabsTrigger value="companies" className='bg-background rounded px-3 w-full hover:bg-input'>Entreprises</TabsTrigger>
                <TabsTrigger value="employees" className='bg-background rounded px-3 w-full hover:bg-input'>Employeurs</TabsTrigger>
            </TabsList>
            <Card className='mt-4 p-4'>
                <TabsContent value="events"><Events /></TabsContent>
                <TabsContent value="students"><Students /></TabsContent>
                <TabsContent value="tutors"><Tutors /></TabsContent>
                <TabsContent value="offers"><Offers /></TabsContent>
                <TabsContent value="companies"><Companies /></TabsContent>
                <TabsContent value="employees"><Employees /></TabsContent>
            </Card>
        </Tabs>
    </div>
  )
}
