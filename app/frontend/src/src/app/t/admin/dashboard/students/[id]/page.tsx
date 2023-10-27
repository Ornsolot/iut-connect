'use client'

import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import UserIcon from "@/components/user-icon"
import React, { useEffect } from 'react'
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
import { Check, Cross, Pen, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useParams } from "next/navigation"

// Contraintes de la base de données
const stringMinLength = 1
const stringMaxLength = 100

const FormSchema = z.object({
	name: z.string().min(stringMinLength, {
	  message: `Le nom doit contenir au moins ${stringMinLength} caractères.`,
	}).max(stringMaxLength, {
	  message: `Le nom doit contenir au plus ${stringMaxLength} caractères.`,
	}),
	first_name: z.string().min(stringMinLength, {
	  message: `Le prénom doit contenir au moins ${stringMinLength} caractères.`,
	}).max(stringMaxLength, {
	  message: `Le prénom doit contenir au plus ${stringMaxLength} caractères.`,
	}),
	bio: z.string().max(stringMaxLength, {
		message: `La bio doit contenir au plus ${stringMaxLength} caractères.`,
	  }).optional(),
	master_name: z.string().max(stringMaxLength, {
		message: `Le nom du maître d'alternance doit contenir au plus ${stringMaxLength} caractères.`,
	}).optional(),
	master_first_name: z.string().max(stringMaxLength, {
		message: `Le prénom du maître d'alternance doit contenir au plus ${stringMaxLength} caractères.`,
	}).optional(),
	master_function: z.string().max(stringMaxLength, {
		message: `La fonction du maître d'alternance doit contenir au plus ${stringMaxLength} caractères.`,
	}).optional(),
	master_mail: z.string().max(stringMaxLength, {
		message: `Le mail du maître d'alternance doit contenir au plus ${stringMaxLength} caractères.`,
	}).optional(),
	master_phone: z.string().max(stringMaxLength, {
		message: `Le téléphone du maître d'alternance doit contenir au plus ${stringMaxLength} caractères.`,
	}).optional(),
  });


export default function Profile() {
    const params = useParams(); //¬retrieves the URL parameters
	const { api, refresh } = useAuth();
	const [parcours, setParcours] = React.useState([]);
    const [user, setUser] = React.useState<any>();
	const [tutor, setTutor] = React.useState<any>();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		shouldUnregister: false,
    })

	useEffect(() => {
        console.log('params', params.id)
		api.get('/private/programs').then((r: any) => {
			setParcours(r.data.data.programs.map((p:any) => {
				return {
						id: p.program_id,
						name: (`${p.year_group.Valid ? p.year_group.String : ''} ${p.department.Valid ? p.department.String : ''} ${p.major.Valid ? p.major.String : ''}`).trim()
					}
			}))
		})

        api.get(`/private/user/${params.id}`).then((r: any) => {
            console.log('e', r)
            setUser(r.data.data.user);
        }).catch((e: any) => {
            console.log(e);
        })

	}, [])

    useEffect(() => {
        console.log('user', user)
        if (user?.tutor_id?.Valid) {
            api.get(`/private/user/${user.tutor_id.Int64}`).then((r: any) => {
                setTutor(r.data.data.user);
            })
        }
    }, [user])

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		api.patch(`/private/student/${user.id}`, {
		  ...data
		}).then((r: any) => {
		  refresh();
		})
	  }
	

  return (
    
        user ?
        (
            <>
            {
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-[400px]">
                        <div className="flex flex-wrap gap-3">
                            <Card className="flex flex-col p-6 gap-6">
                                <div>
                                    <div className="flex justify-between">
                                    </div>
                                    <div className="flex gap-6">
                                        <UserIcon user={user} size="8rem" className="text-4xl" />
                                        <div className="flex flex-col justify-around">
                                            
                                                
                                            <h1 className="font-extrabold text-lg">{user?.name} {user?.first_name}</h1> 
                                            <div className="flex flex-col gap-2">
                                                    
                                        </div>
                                        
                                            <Badge className="w-fit">{(parcours.find((p:any) => p.id === user?.program_id) as any )?.name}</Badge>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="font-extrabold font-kodchasan text-primary text-lg">Biographie</h1>
                                    
                                </div>
                                <div>
                                    <h1 className="font-extrabold font-kodchasan text-primary text-lg">Contacts</h1>
                                    <p>
                                        {user?.mail}
                                    </p>
                                </div>
                            </Card>
            
                            {
                                user?.state?.Valid && user.state.String === "ALTERNANT" &&
                                <>
                                    {
                                        tutor &&
                                        <Card className="flex flex-col p-6 gap-6 w-auto">
                                            <div>
                                                <p>Tuteur d&apos;alternance</p>
                                                <div className="flex gap-6">
                                                    <UserIcon user={tutor} size="4rem" className="text-xl" />
                                                    <div className="flex flex-col justify-around">
                                                        <h1 className="font-extrabold text-lg">{tutor?.name} {tutor?.first_name}</h1>
                                                        {tutor?.mail}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    }
                                    <Card className="flex flex-col p-6 gap-6">
                                        <div>
                                            <p>Maître d&apos;alternance</p>
                                            <div className="flex gap-6">
                                                <UserIcon user={{id: user.id, mail: (user?.master_mail.Valid ? user?.master_mail.String : ''), name: (user?.master_name.Valid ? user?.master_name.String : '') }} size="4rem" className="text-4xl" />
                        
                                            </div>
                                        </div>
                                    </Card>
                                </>
                            }
                        </div>
                        </form>
                    </Form>
                </div>
            }
            </>

        ) : 
        <p>Chargement...</p>
    
  )
}