import React, { useState, useEffect, useRef } from "react";
import { Instagram } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";


export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="text-primary border border-neutral-500"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="text-primary border border-neutral-500"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      return (
        <div className="flex items-center  gap-2">
          {row.getValue("username")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="flex items-center  gap-2">
          {row.getValue("status")}
        </div>
      );
    },
  },
  {
    accessorKey: "platform",
    header: "Platform",
    cell: ({ row }) => {
      return (
        <div className="flex items-center  gap-2">
          {row.getValue("platform")}
        </div>
      );
    },
  },
];