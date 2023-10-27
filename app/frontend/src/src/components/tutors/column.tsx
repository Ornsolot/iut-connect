"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Tutor } from "@/components/tutors/type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import UserIcon from "../user-icon";
import { Badge } from "../ui/badge";
 

export const columns: ColumnDef<Tutor>[] = [

  {
    id: "icon",
    cell: ({ row }) => {
      const user = row.original
      const id = row.original.id
      return (
        <div className="rounded p-1 w-[32px] h-[32px]" >
          <UserIcon user={user} />
        </div>
      )
    },
    // enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell : ({ row }) => {
      const id = row.original.id
      return (
        <Link href={`/t/admin/dashboard/tutors/${id}`}>{row.getValue("name")}</Link>
      )
    },
  },

  
  
  {
    accessorKey: "first_name", 
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prénom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

  {
    id: "program",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Parcours
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const year_group = (row.original.year_group as any)?.Valid ? (row.original.year_group as any).String : ''
      const major = (row.original.major as any)?.Valid ? (row.original.major as any).String : ''
      const department = (row.original.department as any)?.Valid ? (row.original.department as any).String : ''  
      return <Badge>{year_group} {department} {major}</Badge>
    },
  },

  {
    accessorKey: "mail_ubs",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mail universitaire
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "mail",
    header: "Adresse e-mail",
  },


]

