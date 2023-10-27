"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import EventForm from "@/components/event-form";
import { useAuth } from "@/components/auth-provider"
import { Plus } from "lucide-react";
import { Event } from "@/components/events-table/type";
import { columns } from "@/components/events-table/column";
import { DataTable } from "@/components/events-table/data-table";

export default function Events() {
  const { api } = useAuth();
  const [events, setEvents] = useState([] as Event[]);

  function refresh() {
    api.get("/private/events")
      .then((r:any) => {
        setEvents(r.data.data.events as Event[]);
      })
  }

  function handleDelete(rows:any[]) {
    api.delete(`/private/events?ids=${rows.map((r:any) => r.original.id)}`)
      .then((r:any) => {
        refresh()
      })

  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div>

      <div className="flex flex-row-reverse w-full">
        <EventForm onValid={refresh}>
          <Button>
            <Plus className="mr-3" />
            Ajouter un évènement
          </Button>
        </EventForm>
      </div>
      <div className="container mx-auto">
        <DataTable columns={columns} data={events} onDelete={handleDelete} />
      </div>
    </div>
  );
}
