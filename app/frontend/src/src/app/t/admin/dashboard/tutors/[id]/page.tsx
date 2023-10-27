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
import { useParams, useRouter } from "next/navigation"
import { toast, useToast } from "@/components/ui/use-toast"

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
  });


export default function Profile() {
    const params = useParams(); //¬retrieves the URL parameters
	const { api, refresh } = useAuth();
    const { toast } = useToast()
	const [parcours, setParcours] = React.useState([]);
    const [user, setUser] = React.useState<any>();
    const [students, setStudents] = React.useState<any>();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		shouldUnregister: false,
    })
    const router = useRouter()

	useEffect(() => {
		api.get('/private/programs').then((r: any) => {
			setParcours(r.data.data.programs.map((p:any) => {
				return {
						id: p.program_id,
						name: (`${p.year_group.Valid ? p.year_group.String : ''} ${p.department.Valid ? p.department.String : ''} ${p.major.Valid ? p.major.String : ''}`).trim()
					}
			}))
		})

        api.get(`/private/user/${params.id}`).then((r: any) => {
            setUser(r.data.data.user);
        }).catch((e: any) => {
            console.log(e);
        })

	}, [])


    useEffect(() => {
        console.log('user', user)
        if (user) {
            api.get(`/private/tutor/${user.id}/students`)
            .then((r: any) => {
                setStudents(r.data.data.students);
            }).catch((e: any) => {
                toast({
                    variant: "destructive",
                    title: "Error : ",
                    description: (
                        e.response.data.error
                    ),
                })
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
                                <Card className="flex flex-col p-6 gap-6">
                                <div className="flex flex-col gap-3">
                                    <h1 className="font-extrabold font-kodchasan text-primary text-lg">Étudiants</h1>
                                    {
                                        students && students.map((d: any) => {
                                        return (
                                        <div className="flex gap-5" >
                                            <UserIcon user={d} />
                                            <div className="flex-auto flex justify-between flex-col"> 
                                                <p className="font-semibold  text-l cursor-pointer" onClick={() => router.push(`/t/students/${d.id}`)}>{d.name} {d.first_name}</p>
                                            </div>
                                            <div className="flex-none flex justify-between flex-col text-right">
                                                {
                                                    d.state && d.state.Valid ?
                                                        <>
                                                            <p className="font-kodchasan text-xs">{d.state.String }</p>
                                                        </>  
                                                : ""}
                                            </div>
                                        </div>
                                        )
                                        })
                                    }
                                </div>
                                </Card>
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