import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useStore } from "@tanstack/react-store";
import { filterStore } from "@/store/filterStore";
import FilterSidebar from "./FilterSidebar";
import Breadcrumb from "../../../components/BreadCrumb";
import Listing from "@/components/ReactTable";
import { fetchTargetByFilterId } from "./Service/User.service";
import { columns, SideTab } from "./helper";
import SocialSearchImage from "../../../assets/socialSearchImage.svg";
import { SideTabApplyFilter } from "@/components/input/ApplyFilter";

const SocialSearch = () => {
  const { filterId } = useStore(filterStore);
  const { isPending, data } = useQuery({
    queryKey: ["filteredUserAccounts", filterId],
    queryFn: () => fetchTargetByFilterId(filterId),
    // refetchInterval: filterId? 10000 : false,
  });

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [openNewFilter, setOpenNewFilter] = useState(false);

  const [isSideTabOpen, setIsSideTabOpen] = useState(false);
  const handleBreadcrumbClick = () => {
    // setIsSideTabOpen(true);
    setOpenNewFilter(false);
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
      pagination,
    },
  });

  return (
    <div className="flex flex-col h-full">
      <Breadcrumb
        onClickFunction={handleBreadcrumbClick}
        pageName="Social Search"
        table={table}
        availableEntries={data?.length || "0"}
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
        <div
          className={`flex justify-center items-center flex-col ${
            openNewFilter ? "hidden" : ""
          }`}
        >
          <img
            src={SocialSearchImage}
            className="h-[200px] w-[300px] bg-cover"
            alt=""
          />
          <div
            className=" bg-gray-50 hover:bg-gray-500 px-5 py-2 rounded-2xl cursor-pointer"
            onClick={() => setOpenNewFilter(true)}
          >
            Create New Filter
          </div>
          <p className="font-normal text-sm my-2 pb-5 border-gray-50 border-b-[1px]">
            Start your search by applying filters or directly type your query
            below. You can also use presets.
          </p>
          <div className="my-5 grid grid-cols-2 w-full px-10 ">
            <div className="bg-white/90">
            <SideTabApplyFilter
              isOpen={isSideTabOpen}
              onClose={handleCloseSideTab}
              filterId={filterId}
              table={table}
              setOpenNewFilter={setOpenNewFilter}
            />
            </div>
            <div className=""></div>
          </div>
        </div>

        <div
          className={`flex flex-col sm:flex-row rounded h-full overflow-hidden dark:border bg-background space-y-3 sm:space-y-0 ${
            openNewFilter ? "" : "hidden"
          }`}
        >
          <FilterSidebar table={table} />
          <div className="flex-1 flex-col h-full overflow-y-auto sm:py-4 px-4">
            <Listing columns={columns} table={table} isPending={isPending} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSearch;
