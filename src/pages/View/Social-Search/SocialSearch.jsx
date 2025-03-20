import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useFilters } from '@/hooks/useFilters';
import FilterSidebar from './FilterSidebar';
import Breadcrumb from '../../../components/BreadCrumb';
import Listing from '@/components/ReactTable'
import { fetchTargetByFilterId } from './Service/User.service';
import { columns, Toast, SideTab } from './helper';

const SocialSearch = ({ toast, handleCloseToast, showToast }) => {
  const {
    filters,
    updateFilter,
    filterId,
    setFilterId,
    applyFilters,
    resetFilters,
    loading
  } = useFilters(showToast);
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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}

      <Breadcrumb
        onClickFunction={handleBreadcrumbClick}
        pageName="Social Search"
        availableEntries=""
        table={table}
        columns={columns}
        buttonName="Saved Filters"
      />
      <SideTab
        isOpen={isSideTabOpen}
        onClose={handleCloseSideTab}
        filterId={filterId}
        setFilterId={setFilterId}
        table={table}
      />

      <div className="flex flex-col sm:flex-row rounded h-full overflow-hidden">
        <FilterSidebar
        table={table}
          filters={filters}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
          loading={loading}
          applyFilters={applyFilters}
        />
        <div className="flex-1 flex-col h-full overflow-y-auto">
          <Listing
            columns={columns}
            table={table}
            isPending={isPending}
            className="pl-0 sm:pl-4 "
          />
        </div>
      </div>
    </div>
  );
};

export default SocialSearch;