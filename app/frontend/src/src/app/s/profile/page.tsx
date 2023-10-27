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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

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
	state: z.string().max(stringMaxLength, {
		message: `La state doit contenir au plus ${stringMaxLength} caractères.`,
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
	const { user, api, refresh } = useAuth();
	const [parcours, setParcours] = React.useState([]);
	const [tutor, setTutor] = React.useState();
	const [edit, setEdit] = React.useState(false);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		shouldUnregister: false,
	  })

	useEffect(() => {
		console.log('user', user);
		
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
		console.log(data);
		api.patch(`/private/student/${user.id}`, {
		  ...data
		}).then((r: any) => {
		  console.log(r)
		  setEdit(false);
		  refresh();
		}).catch((e: any) => {
		  console.log(e)
		})
	  }

	const handleEdit = () => {
		setEdit(!edit);
	}

	useEffect(() => {
		if (edit) {
			form.setValue('name', user?.name);
			form.setValue('first_name', user?.first_name);
			form.setValue('bio',(user?.bio.Valid? user.bio.String : ''));
			form.setValue('state',(user?.state.Valid? user.state.String : ''));

			form.setValue('master_name', (user?.master_name.Valid ? user.master_name.String : ''));
			form.setValue('master_first_name', (user?.master_first_name.Valid ? user.master_first_name.String : ''));
			form.setValue('master_function', (user?.master_function.Valid ? user.master_function.String : ''));
			form.setValue('master_mail', (user?.master_mail.Valid ? user.master_mail.String : ''));
			form.setValue('master_phone', (user?.master_phone.Valid ? user.master_phone.String : ''));
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
								<div>
									{
										!edit ?
										<p>{user?.state.Valid ? user?.state.String : "État non définit"}</p>:
										<FormField
											control={form.control}
											name="state"
											render={({ field }) => (
												<FormItem>
												<Select onValueChange={field.onChange} defaultValue={user?.state.Valid ? user?.state.String : ''}>
													<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Sélectionné un état" />
													</SelectTrigger>
													</FormControl>
													<SelectContent>
													<SelectItem value="ALTERNANT">Alternant</SelectItem>
													<SelectItem value="INTÉRESSÉ">Intéressé</SelectItem>
													<SelectItem value="PAS INTÉRESSÉ">Pas Intéressé</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
												</FormItem>
											)}
											/>
									}
								</div>
							</div>
						</div>
					</div>
					<div>
						<h1 className="font-extrabold font-kodchasan text-primary text-lg">Biographie</h1>
						{
							!edit ?
							<p>{user?.bio.Valid ? user?.bio.String : "Aucune biographie"}</p>:
							<FormField
								name="bio"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea
												placeholder=""
												defaultValue={user?.bio.Valid ? user?.bio.String : ''} 
												onChange={(e) => {
													field.onChange(e.target.value);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						}
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
											<h1 className="font-extrabold text-lg">{(tutor as any )?.name} {(tutor as any )?.first_name}</h1>
											{(tutor as any )?.mail}
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
									<div className="flex flex-col justify-around">
										{
											!edit ?
											<>
												<h1 className="font-extrabold text-lg">{user?.master_name.Valid ? user?.master_name.String : "Non définit"} {user?.master_first_name.Valid ? user?.master_first_name.String : "Non définit"}</h1>
												<p>{user?.master_function.Valid ? user?.master_function.String : "Non définit"}</p>
												<p>{user?.master_mail.Valid ? user?.master_mail.String : "Non définit"}</p>
												<p>{user?.master_phone.Valid ? user?.master_phone.String : "Non définit"}</p>
											</> :
											<div className="flex flex-col gap-2">
												<FormField
													name="master_name"
													control={form.control}
													render={({ field }) => (
													<FormItem>
														<FormControl>
														<Input
															placeholder="nom"
															type="text"
															defaultValue={user?.master_name.Valid ? user?.master_name.String : ''}
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
													name="master_first_name"
													control={form.control}
													render={({ field }) => (
													<FormItem>
														<FormControl>
														<Input
															placeholder="prénoms"
															type="text"
															defaultValue={user?.master_first_name.Valid ? user?.master_first_name.String : ''}
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
													name="master_function"
													control={form.control}
													render={({ field }) => (
													<FormItem>
														<FormControl>
														<Input
															placeholder="fonction"
															type="text"
															defaultValue={user?.master_function.Valid ? user?.master_function.String : ''}
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
													name="master_mail"
													control={form.control}
													render={({ field }) => (
													<FormItem>
														<FormControl>
														<Input
															placeholder="mail"
															type="email"
															defaultValue={user?.master_mail.Valid ? user?.master_mail.String : ''}
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
													name="master_phone"
													control={form.control}
													render={({ field }) => (
													<FormItem>
														<FormControl>
														<Input
															placeholder="téléphone"
															type="phone"
															defaultValue={user?.master_phone.Valid ? user?.master_phone.String : ''}
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
									</div>
								</div>
							</div>
						</Card>
					</>
				}
			</div>
			</form>
		</Form>
    </div>
  )
}

