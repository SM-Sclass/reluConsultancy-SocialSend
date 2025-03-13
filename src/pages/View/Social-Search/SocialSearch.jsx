import React, { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import FilterSidebar from './FilterSidebar';
import Breadcrumb from '../../../components/BreadCrumb';
import { FilterContext } from './FilterContext';
import Listing from '@/components/ReactTable'
import { fetchTargetByFilterId } from './Service/User.service';
import { columns, Toast, SideTab } from './helper';

const SocialSearch = ({ toast, handleCloseToast }) => {
  const { resetFilters, loading, applyFilters, filterId } = useContext(FilterContext);
  const { isPending, data } = useQuery({
    queryKey: ['filteredUserAccounts', filterId],
    queryFn: () => fetchTargetByFilterId(filterId),
  })

  const [pagination, setPagination] = useState({pageIndex: 0, pageSize: 10})
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  const handleApplyFilters = () => {
    applyFilters();
  };

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
      />
      <SideTab
        isOpen={isSideTabOpen}
        onClose={handleCloseSideTab}
      />

      <div className="flex flex-col sm:flex-row bg-muted rounded h-full overflow-hidden">
        <FilterSidebar
          resetFilters={resetFilters}
          loading={loading}
          applyFilters={applyFilters}
          handleApplyFilters={handleApplyFilters}
        />
        <div className="flex-1 h-full overflow-y-auto">
          <Listing
            columns={columns}
            table={table}
            isPending={isPending}
            className="p-2"
          />
        </div>
      </div>
    </div>
  );
};

export default SocialSearch;