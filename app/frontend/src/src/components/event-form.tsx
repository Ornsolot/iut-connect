import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-provider"
import { CheckIcon, PlusCircleIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import * as lucide from 'lucide-react';
import Icon from "@/components/icon";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";

const FormSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    description: z.string().min(2, {
      message: "Description must be at least 2 characters.",
    }),
    parcours: z.array(z.number()).min(1, {
      message: "At least one parcours must be selected.",
    }),
    // parcours: z.number(),
    icon: z.string().min(1, {
      message: "At least one icon must be selected.",
    }),
    color: z.string().min(7, {
      message: "At least one color must be selected.",
    }),
    deadline: z.date().min(new Date(), {
      message: "At least one icon must be selected.",
    }),
});

export default function EventForm({ children, onValid }: { children: React.ReactNode, onValid?: () => void }) {
    const { api } = useAuth();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [optionsParcours, setOptionsParcours] = useState([{id: 0, name: ''}]);
    const [selectedParcours, setSelectedParcours] = useState(new Set<{id: number, name: string}>());
    const [selectedIcon, setSelectedIcon] = useState("help-circle");
    const [selectedColor, setSelectedColor] = useState("#4C8F28");
    const [icons, setIcons] = useState([{
      camel: "HelpCircle",
      kebab: "help-circle"
    }]);
  
    const form = useForm({
      resolver: zodResolver(FormSchema),
      shouldUnregister: false,
    });
  
    const colors = [
      '#4C8F28',
      '#8F6428',
      '#8F322C',
      '#8F288F',
      '#2F2D8F',
      '#28678F',
  
      '#64BD35',
      '#BD8435',
      '#BD433A',
      '#BD35BD',
      '#3D3ABD',
      '#3589BD',
  
      '#7AE640',
      '#E6A140',
      '#E65247',
      '#E640E6',
      '#4A47E6',
      '#40A6E6',
    ]

    function onSubmit(data: any) {
      setOpen(false);
      api.post('/private/event', {
        "name": data.name,
        "description": data.description,
        "deadline": data.deadline,
        "programs": data.parcours,
        "color": data.color,
        "icon": data.icon,
      }).then((r: any) => {
        toast({
          title: "Message : ",
          description: (
            r.data.message
          ),
        })
      }).catch((e: any) => {
        toast({
          variant: "destructive",
          title: "Error : ",
          description: (
            e.response.data.error
          ),
        })
      })
      form.reset();
      if (onValid) onValid()
    };
  
    function toggleParcours(parcours: {id: number, name: string}) {
      const updatedParcours = new Set(selectedParcours);
      if (updatedParcours.has(parcours)) {
        updatedParcours.delete(parcours);
      } else {
        updatedParcours.add(parcours);
      }
      setSelectedParcours(updatedParcours);
    };
    function camelToKebab(camel: string) {
      const kebabCaseStr = camel
        .replace(/([a-z])([A-Z]|[0-9])/g, '$1-$2')
        .replace(/([A-Z]|[0-9])([0-9]|[A-Z])/g, '$1-$2');
  
      return kebabCaseStr.toLowerCase();
    }
  
    function setFiltredIcons() {
      let filtredIcons = Object.keys(lucide).filter(i => !i.toUpperCase().includes('ICON') && !i.toUpperCase().includes('LUCIDE'));
      let processedIcons = filtredIcons.map(a => {
        const sameIcons = filtredIcons.filter(b => a.toUpperCase() === b.toUpperCase());
        if (sameIcons.length > 1) {
          let mostUppercaseElement = "";
          let maxUppercaseCount = 0;
  
          for (const str of sameIcons) {
            const uppercaseCount = (str.match(/[A-Z]/g) || []).length;
  
            if (uppercaseCount > maxUppercaseCount) {
              maxUppercaseCount = uppercaseCount;
              mostUppercaseElement = str;
            }
          }
          const kebab = camelToKebab(mostUppercaseElement)
          return (true && {
            camel: mostUppercaseElement,
            kebab: kebab
          })
        } else {
          const kebab = camelToKebab(sameIcons[0])
          return (true && {
            camel: sameIcons[0],
            kebab: kebab
          })
        }
      })
      setIcons(processedIcons)
    }
  
    useEffect(() => {
      form.setValue('parcours', Array.from(selectedParcours).map(p => p.id));
    }, [selectedParcours])
  
    useEffect(() => {
      form.setValue('icon', selectedIcon);
    }, [selectedIcon])
  
    useEffect(() => {
      form.setValue('color', selectedColor);
    }, [selectedColor])
  
    useEffect(() => {
      setFiltredIcons()
      api.get('/private/programs').then((r: any) => {
        setOptionsParcours(r.data.data.programs.map((p:any) => {
          return {
            id: p.program_id,
            name: (`${p.year_group.Valid ? p.year_group.String : ''} ${p.department.Valid ? p.department.String : ''} ${p.major.Valid ? p.major.String : ''}`).trim(),
            year_group: (p.year_group.Valid ? p.year_group.String : ''),
            department: (p.department.Valid ? p.department.String : ''),
            major: (p.major.Valid ? p.major.String : ''),
          }
        }))
      })
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajout d&apos;un évenement</DialogTitle>
                        <Form {...form}>
                            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col text-left gap-3">
                                <div className="flex gap-3 mt-5">
                                    <FormField
                                    name="deadline"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                        {/* <FormLabel>Date limite</FormLabel> */}
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                variant={"outline"}
                                                className="font-normal w-full"
                                                >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Choisir une date limite</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(e) => {
                                                field.onChange(e);
                                                form.setValue('deadline', e);
                                                }}
                                                disabled={(date) =>
                                                date < new Date()
                                                }
                                                initialFocus
                                            />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    name="icon"
                                    control={form.control}
                                    render={() => (
                                        <FormItem>
                                        {/* <FormLabel>Icône</FormLabel> */}
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className="w-fit px-2 justify-start">
                                                <Icon name={selectedIcon} />
                                                {/* {selectedIcon.replace('-', ' ')} */}
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[240px] p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Search icon..." className="h-9" />
                                                <CommandEmpty>No result found.</CommandEmpty>
                                                <CommandGroup className="group-grid max-h-[240px] overflow-y-auto" >
                                                {
                                                    icons.map(m =>
                                                    <CommandItem key={m.camel} className="w-fit " onSelect={() => setSelectedIcon(m.kebab)}>
                                                        <Icon name={m.kebab} size="32px" className={`p-1 rounded border border-background cursor-pointer hover:border-black hover:dark:border-white ${m.kebab === selectedIcon && 'bg-primary'}`} color={m.kebab === selectedIcon ? '#ffffff' : '#000000'}/>
                                                        <p className="hidden">{m.kebab.replace('-', ' ')}</p>
                                                    </CommandItem>
                                                    )
                                                }
                                                </CommandGroup>
                                            </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    name="color"
                                    control={form.control}
                                    render={() => (
                                        <FormItem>
                                        {/* <FormLabel>Couleur</FormLabel> */}
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className="w-fit px-2 justify-start">
                                                <div className="w-6 h-6 rounded" style={{backgroundColor: selectedColor}} ></div>
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[240px] p-0" align="start">
                                            <Command>
                                                <CommandGroup className="group-grid max-h-[240px] overflow-y-auto" >
                                                {
                                                    colors.map(c =>
                                                    <CommandItem key={c} className="w-fit " onSelect={() => setSelectedColor(c)}>
                                                        <div className="w-6 h-6 rounded cursor-pointer" style={{backgroundColor: c}} ></div>
                                                    </CommandItem>
                                                    )
                                                }
                                                </CommandGroup>
                                            </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                </div>
                                <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder=""
                                            {...field}
                                        />
                                    </FormControl>
                                    </FormItem>
                                )}
                                />
                                <FormField
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder=""
                                            {...field}
                                        />
                                    </FormControl>
                                    </FormItem>
                                )}
                                />
                                <FormField
                                name="parcours"
                                control={form.control}
                                render={() => (
                                    <FormItem>
                                    <FormLabel>Parcours</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" className="w-full justify-start">
                                            <PlusCircleIcon className="mr-2 h-4 w-4" />
                                            {selectedParcours?.size > 0 && (
                                                <>
                                                <Separator orientation="vertical" className="mx-2 h-4" />
                                                {/* <Badge
                                                    variant="secondary"
                                                    className="rounded-sm px-1 font-normal lg:hidden"
                                                >
                                                    {selectedParcours.size}
                                                </Badge> */}
                                                <div className="flex space-x-1">
                                                    {selectedParcours.size > 4 ? (
                                                    <Badge
                                                        variant="secondary"
                                                        className="rounded-sm px-1 font-normal"
                                                    >
                                                        {selectedParcours.size} selected
                                                    </Badge>
                                                    ) : (
                                                    Array.from(selectedParcours).map((parcours, index) => (
                                                        <Badge
                                                        variant="secondary"
                                                        key={index}
                                                        className="rounded-sm px-1 font-normal"
                                                        >
                                                        {parcours.name}
                                                        </Badge>
                                                    ))
                                                    )}
                                                </div>
                                                </>
                                            )}
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search parcours..." className="h-9" />
                                            <CommandEmpty>No result found.</CommandEmpty>
                                            <CommandGroup>
                                            {optionsParcours.map((parcours, index) => {
                                                const isSelected = Array.from(selectedParcours).map(p => p.id).includes(parcours.id);
                                                return (
                                                <CommandItem
                                                    key={index}
                                                    onSelect={() => toggleParcours(parcours)}
                                                >
                                                    <div
                                                    className={cn(
                                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                        isSelected
                                                        ? "bg-primary text-primary-foreground"
                                                        : "opacity-50 [&_svg]:invisible",
                                                    )}
                                                    >
                                                    <CheckIcon className={cn("h-4 w-4")} />
                                                    </div>
                                                    <span>{parcours.name}</span>
                                                </CommandItem>
                                                );
                                            })}
                                            </CommandGroup>
                                        </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                            <div className="ml-auto w-fit h-fit">
                                <Button type="submit">Submit</Button>
                            </div>
                            </form>
                        </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
