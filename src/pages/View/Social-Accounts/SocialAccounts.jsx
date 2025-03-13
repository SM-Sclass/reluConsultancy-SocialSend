import React, { useState } from 'react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Instagram, Facebook, Twitter } from 'lucide-react';
import Listing from '@/components/ReactTable'
import { Checkbox } from '@/components/ui/checkbox';
import { userArray } from '../../../Data/Users';
import Breadcrumb from '../../../components/BreadCrumb'
import AddSocialAccountPopup from './AddSocialAccountPopUp'
import UserSettingsModal from './UserSettingModal'

const SocialAccounts = () => {
  const [showPopUp, setShowPopUp] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'tiktok':
        return <span className="font-bold text-lg">𝓣</span>;
      default:
        return null;
    }
  };

  const columns = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
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
      enableHiding: false
    },
    {
      accessorKey: 'platform',
      header: 'Platform',
      cell: ({ row }) => {
        return( <div className="flex items-center">
          <span className="ml-2 text-sm text-primary">{row.getValue('platform')}</span>
        </div>)
        }
    },
    {
      accessorKey: 'username',
      header: 'Username',
      cell: ({ row }) => {
        return <button onClick={()=>setSelectedUser(row.getValue('username'))}
          className="text-sm text-primary text-start hover:text-blue-500 w-full"
        >
          {row.getValue('username')}
        </button>
      }

    },
    {
      accessorKey: 'dailyMessages',
      header: 'Daily Messages'
    },
    {
      accessorKey: 'dailyConnections',
      header: 'Daily Connections'
    },
    {
      accessorKey: 'warmupEnabled',
      header: 'Warmup Enabled',
      cell: ({ row }) => (
        <span className={row.warmupEnabled ? "text-green-600" : "text-red-600"}>
          {row.warmupEnabled ? "Yes" : "No"}
        </span>
      )
    }
  ];


  const table = useReactTable({
    data: userArray || [],
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
    <div className='w-full'>
      <Breadcrumb onClickFunction={() => { setShowPopUp(true) }} pageName="Social Accounts" availableEntries="67" table={table} columns={columns} />
      <Listing
        columns={columns}
        table={table}
        isPending={false}
      />
      {/* Show Popup */}
      {showPopUp && (
        <AddSocialAccountPopup onClose={() => setShowPopUp(false)} />
      )}
      <UserSettingsModal
        username={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  )
}

export default SocialAccounts