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
import { fetchTargetByFilterId } from "../../Social-Search/Service/User.service";
import { columns } from "../../Social-Search/helper";
import Listing from "@/components/ReactTable";
import { Dialog, DialogPanel } from "@headlessui/react";
import { SideTabApplyFilter } from "@/components/input/ApplyFilter";
import FilterSidebar from "../../Social-Search/FilterSidebar";
import { ApplyFilterSocialSearch } from "@/components/input/ApplyFilterSocialSearch";
import FilterSidebarLeads from "./FilterSidebarLeads";

const SocialSearchModal = ({ isOpen, setIsOpen, setLeadsData }) => {
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

  const selectedData = Object.keys(rowSelection);

  const payloadData = selectedData
    .map((index) => data[index])
    .map((item) => ({
      platform: "Instagram",
      username: item.username,
    }));

  const setPayloadData = () => {
    setLeadsData(payloadData);
    setIsOpen(false);
  };

  const handleCloseSideTab = () => {
    setIsSideTabOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/50 flex w-screen items-center justify-center p-4">
            <DialogPanel className="max-w-lg space-y-4 border bg-white rounded-md">
              <div className="flex-1 flex-col h-full overflow-y-auto sm:py-4 px-4">
                <div className="">
                  {!openNewFilter && (
                    <div className="">
                      
                    <ApplyFilterSocialSearch
                      isOpen={isSideTabOpen}
                      onClose={handleCloseSideTab}
                      filterId={filterId}
                      table={table}
                      setOpenNewFilter={setOpenNewFilter}
                    />
                    </div>
                  )}
                </div>

                {openNewFilter && (
                  <div className="h-[600px] flex-col overflow-y-auto flex justify-start">
                    <button onClick={() => setOpenNewFilter(false)}  className="flex justify-start w-full cursor-pointer">back</button>
                    <FilterSidebarLeads setOpenNewFilter={setOpenNewFilter} setIsOpen={setIsOpen} table={table} />
                  </div>
                )}

              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </>
    </div>
  );
};

export default SocialSearchModal;

// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { useStore } from "@tanstack/react-store";
// import { filterStore } from "@/store/filterStore";
// import { fetchTargetByFilterId } from "../../Social-Search/Service/User.service";
// import { columns } from "../../Social-Search/helper";
// import Listing from "@/components/ReactTable";
// import { Dialog, DialogPanel } from "@headlessui/react";

// const SocialSearchModal = ({
//   isOpen,
//   setIsOpen,
//   setLeadsData,
// }) => {
//   const { filterId } = useStore(filterStore);
//   const { isPending, data } = useQuery({
//     queryKey: ["filteredUserAccounts", filterId],
//     queryFn: () => fetchTargetByFilterId(filterId),
//     // refetchInterval: filterId? 10000 : false,
//   });

//   const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});

//   const table = useReactTable({
//     data: data || [],
//     columns: columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     onPaginationChange: setPagination,
//     getRowId: (row) => row.id,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//       pagination,
//     },
//   });

//   const selectedData = Object.keys(rowSelection);

//   const payloadData = selectedData
//     .map((index) => data[index])
//     .map((item) => ({
//       platform: "Instagram",
//       username: item.username,
//     }));

//   const setPayloadData = () => {
//     setLeadsData(payloadData);
//     setIsOpen(false);
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <>
//         <Dialog
//           open={isOpen}
//           onClose={() => setIsOpen(false)}
//           className="relative z-50"
//         >
//           <div className="fixed inset-0 bg-black/50 flex w-screen items-center justify-center p-4">
//             <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
//               <div className="flex-1 flex-col h-full overflow-y-auto sm:py-4 px-4">
//                 <Listing
//                   columns={columns}
//                   table={table}
//                   isPending={isPending}
//                   disableExport={true}
//                 />

//                 <button
//                   className="bg-red-300 w-[100px] py-2 rounded-md cursor-pointer"
//                   disabled={payloadData?.length === 0}
//                   onClick={() => setPayloadData()}
//                 >
//                   Select Data
//                 </button>
//               </div>
//             </DialogPanel>
//           </div>
//         </Dialog>
//       </>
//     </div>
//   );
// };

// export default SocialSearchModal;
