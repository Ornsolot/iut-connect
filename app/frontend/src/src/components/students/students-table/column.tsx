"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Student } from "@/components/students/students-table/type";
import Icon from "../../icon";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import UserIcon from "../../user-icon";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
        <Link href={`/t/admin/dashboard/students/${id}`}>{row.getValue("name")}</Link>
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
    accessorKey: "state",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          État
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },    cell: ({ row }) => {
      const state = row.getValue("state")
      return <div>{(state as any)?.Valid && <span>{(state as any).String}</span>}</div>
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
