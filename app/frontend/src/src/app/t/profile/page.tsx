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
	const { user, api, refresh } = useAuth();
	const [parcours, setParcours] = React.useState([]);
	const [tutor, setTutor] = React.useState();
	const [edit, setEdit] = React.useState(false);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		shouldUnregister: false,
	  })

	useEffect(() => {
		api.get('/private/programs').then((r: any) => {
			setParcours(r.data.data.programs.map((p:any) => {
				return {
						id: p.program_id,
						name: (`${p.year_group.Valid ? p.year_group.String : ''} ${p.department.Valid ? p.department.String : ''} ${p.major.Valid ? p.major.String : ''}`).trim()
					}
			}))
		})

		if (user?.tutor_id?.Valid) {
			api.get(`/private/user/${user.tutor_id.Int64}`).then((r: any) => {
				setTutor(r.data.data.user);
			})
		}
	}, [])

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		api.patch(`/private/student/${user.id}`, {
		  ...data
		}).then((r: any) => {
		  setEdit(false);
		  refresh();
		})
	  }

	const handleEdit = () => {
		setEdit(!edit);
	}

	useEffect(() => {
		if (edit) {
			form.setValue('name', user?.name);
			form.setValue('first_name', user?.first_name);
		}
	}, [edit])

  return (
    <div>
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-[400px]">
			<div className="flex flex-wrap gap-3">
				<Card className="flex flex-col p-6 gap-6">
					<div>
						<div className="flex justify-between">
							{
								edit ?
								<div className="flex gap-1">
									<Button variant="ghost" className="w-fit h-fit p-0" onClick={handleEdit} ><X /></Button>
									<Button variant="ghost" className="w-fit h-fit p-0" type="submit" ><Check /></Button>
								</div> :
								<Button variant="ghost" className="w-fit h-fit p-0" onClick={handleEdit}><Pen /></Button>
							}
						</div>
						<div className="flex gap-6">
							<UserIcon user={user} size="8rem" className="text-4xl" />
							<div className="flex flex-col justify-around">
								{
									!edit ?
									<h1 className="font-extrabold text-lg">{user?.name} {user?.first_name}</h1> :
									<div className="flex flex-col gap-2">
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														placeholder=""
														type="text"
														defaultValue={user?.name}
														onChange={(e) => {
															field.onChange(e.target.value)
														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="first_name"
											render={({ field }) => (
											<FormItem>
												<FormControl>
												<Input
													placeholder=""
													type="text"
													defaultValue={user?.first_name}
													onChange={(e) => {
														field.onChange(e.target.value)
													}}
												/>
												</FormControl>
												<FormMessage />
											</FormItem>
											)}
										/>
									</div>
								}
								<Badge className="w-fit">{(parcours.find((p:any) => p.id === user?.program_id) as any )?.name}</Badge>
							</div>
						</div>
					</div>
					<div>
						<h1 className="font-extrabold font-kodchasan text-primary text-lg">Contacts</h1>
						<p>
							{user?.mail}
						</p>
					</div>
				</Card>
			</div>
			</form>
		</Form>
    </div>
  )
}

