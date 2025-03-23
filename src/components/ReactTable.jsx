import React, {useState, useEffect, useCallback} from 'react';
import {
  flexRender
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { PlusIcon } from '@heroicons/react/24/outline';

const Listing = ({
  columns,
  table,
  isPending = false,
  className
}) => {
  const [selectionState, setSelectionState] = useState({
    isAllSelected: false,
    hasSelectedRows: false,
    selectedCount: 0
  });

  // Update selection state without causing render loops
  useEffect(() => {
    if (!table) return;
    
    // Get current selection status
    const selectedCount = table.getFilteredSelectedRowModel().rows.length;
    const isAllSelected = table.getIsAllRowsSelected();
    
    // Only update state if values have changed
    setSelectionState({
      isAllSelected,
      hasSelectedRows: selectedCount > 0,
      selectedCount
    });
  }, [table?.getState().rowSelection]);

  const handleAllRowsSelected = useCallback(() => {
    if (!table || table.getRowModel().rows.length === 0) return;
    table.toggleAllRowsSelected(!selectionState.isAllSelected);
  }, [table, selectionState.isAllSelected]);

  const handleRowSelection = () => {
    const selectedRows = table.getSelectedRowModel().rows;

    if (selectedRows.length === 0) {
      return;
    }

    // Extract data from the selected rows
    const data = selectedRows.map(row => {
      const rowData = row.original;
      // Create an object with column headers as keys
      return columns.reduce((acc, column) => {
        if (column.accessorKey && column.accessorKey !== 'select') {
          // Skip the checkbox column and use column accessor key for field names
          acc[column.header || column.accessorKey] = rowData[column.accessorKey];
        }
        return acc;
      }, {});
    });

    // Convert data to CSV
    let csvContent = "";

    // Get all unique headers
    const headers = Object.keys(data.reduce((acc, row) => {
      Object.keys(row).forEach(key => acc[key] = true);
      return acc;
    }, {}));

    // Add header row
    csvContent += headers.join(",") + "\n";

    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => {
        // Handle values with commas by wrapping in quotes
        const value = row[header] != null ? row[header].toString() : '';
        return `"${value.replace(/"/g, '""')}"`;
      });
      csvContent += values.join(",") + "\n";
    });

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    link.setAttribute("href", url);
    link.setAttribute("download", `social-search-export-${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className={`w-full flex flex-col space-y-2 ${className}`}>
      <div className='flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 '>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAllRowsSelected}
        // disabled={table.getRowModel().rows.length === 0 || isPending}
        >
          Select All Rows
        </Button>
      </div>
      <div className="relative overflow-x-auto rounded-sm border border-secondary">
        <div className="overflow-hidden">
          {isPending ? (
            <div className="space-y-1 bg-secondary rounded-lg p-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-secondary">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className={header.id === 'select' ? 'text-center text-primary' : 'font-bold text-primary'}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="dark:bg-muted">
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell key={cell.id} >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      {isPending ? (
        <div className="flex items-center justify-end space-x-2">
          <div className="flex-1 text-sm flex justify-start text-muted-foreground space-x-2">
            <Skeleton className="h-5 w-[15px]" />
            <span className="ml-2">of</span>
            <Skeleton className="h-5 w-[15px]" />
            <span className="ml-2">rows(s) selected.</span>
          </div>
          <div className="space-x-2 flex justify-end">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-end space-x-2">

          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      <div className='w-full flex mb-4 sm:mb-0 justify-end'>
        <Button
          variant="secondary"
          className="bg-blue-600 text-white cursor-pointer rounded-md hover:bg-blue-700 transition-colors"
          onClick={handleRowSelection}
          disabled={!selectionState.hasSelectedRows}
        >
          Export CSV <PlusIcon className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Listing;