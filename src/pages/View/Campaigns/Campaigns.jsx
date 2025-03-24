import React, { useState } from 'react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import Listing from '@/components/ReactTable'
import { columns } from './helper'
import CreateCampaign from '@/components/CreateCampaign'

function Campaigns({ createCampaign, close }) {
  const [data, setData] = useState([{
    "id": 1,
    "name": "Campaign 1",
    "status": "Active",
    "progress": 80,
    "sent": 100,
    "click": 50,
    "replied": 20,
    "opportunity": 10
  },
  ])

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: data || [],
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getRowId: (row) => row.id,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })
  return (
    <div className='p-4 border rounded-sm'>
      {!createCampaign &&
        <Listing
          columns={columns}
          table={table}
          isPending={false}
        />}
      {createCampaign && <CreateCampaign close={close} />}
    </div>
  )
}

export default Campaigns