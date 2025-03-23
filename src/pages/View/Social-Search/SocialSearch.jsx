import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useStore } from '@tanstack/react-store';
import { filterStore } from '@/store/filterStore';
import FilterSidebar from './FilterSidebar';
import Breadcrumb from '../../../components/BreadCrumb';
import Listing from '@/components/ReactTable'
import { fetchTargetByFilterId } from './Service/User.service';
import { columns, Toast, SideTab } from './helper';

const SocialSearch = () => {
  const { filterId } = useStore(filterStore);
  const { isPending, data } = useQuery({
    queryKey: ['filteredUserAccounts', filterId],
    queryFn: () => fetchTargetByFilterId(filterId),
    // refetchInterval: filterId? 10000 : false,
  })

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  const [isSideTabOpen, setIsSideTabOpen] = useState(false);
  const handleBreadcrumbClick = () => {
    setIsSideTabOpen(true);
  };
  const handleCloseSideTab = () => {
    setIsSideTabOpen(false);
  };

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
    <div className="flex flex-col h-full">
      <Breadcrumb
        onClickFunction={handleBreadcrumbClick}
        pageName="Social Search"
        table={table}
        availableEntries={data?.length || '0'}
        columns={columns}
        buttonName="Saved Filters"
      />
      <SideTab
        isOpen={isSideTabOpen}
        onClose={handleCloseSideTab}
        filterId={filterId}
        table={table}
      />

      <div className="p-3 bg-zinc-100 dark:bg-black/20">
        <div className="flex flex-col sm:flex-row rounded h-full overflow-hidden dark:border bg-background space-y-3 sm:space-y-0">
          <FilterSidebar
            table={table}
          />
          <div className="flex-1 flex-col h-full overflow-y-auto sm:py-4 px-4">
            <Listing
              columns={columns}
              table={table}
              isPending={isPending}
              className=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSearch;