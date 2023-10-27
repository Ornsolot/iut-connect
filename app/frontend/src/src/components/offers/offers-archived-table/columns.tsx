"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Offer } from "@/components/offers/offers-archived-table/type";
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
 

export const columns: ColumnDef<Offer>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sujet
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell : ({ row }) => {
      const id = row.original.id
      return (
        <Link href={`/s/offers/${id}`}>{row.getValue("name")}</Link>
      )
    },
  },

  
  
  {
    accessorKey: "sector", 
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Secteur
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const sector = row.getValue("sector")
      return <div>{(sector as any)?.Valid && <span>{(sector as any).String}</span>}</div>

    },
    
  },
  {
    accessorKey: "com_name",
    header: "Entreprise",
    /*header: () => <div className="text-right">Entreprise</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },*/
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date de création
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div>{format(new Date(row.getValue("date")), "dd/MM/yyyy")}</div>
    },
  },

  /*{
    id: "actions",
    cell: ({ row }) => {
      const offer = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(offer.sujet)} >
              Modifier l'offre
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },*/
]