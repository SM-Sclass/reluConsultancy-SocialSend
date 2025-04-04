import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import search1 from "../../../assets/Search1.svg";
import CsvUploader from "@/components/input/CsvUploader";
import { useParams } from "react-router";
import { api } from "@/Services/Api";
import { getCampaignLeads } from "./Service/Campaign.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { columns } from "./Leads/helper";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Listing from "@/components/ReactTable";
import SocialSearchModal from "./Leads/leadsModal";

export default function CampaignLeads() {
  const [openAddLeads, setOpenAddLeads] = useState(false);
  const { id: campaignId } = useParams();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  let [isOpenModal, setIsOpenModal] = useState(false);
  const [leadsData, setLeadsData] = useState([]);

  const getCampaignLeads = async (campaignId) => {
    const res = await api.get(`api/get_leads/${campaignId}`);
    return res.data;
  };

  const {
    data: leads,
    isLoading,
    error,
    refetch: refetchLeads, // used after creation
  } = useQuery({
    queryKey: ["campaignLeads", campaignId],
    queryFn: () => getCampaignLeads(campaignId),
    enabled: !!campaignId,
    onSuccess: () => toast.success("Leads fetched successfully!"),
    onError: () => toast.error("Failed to fetch leads."),
  });


  const { mutate: createLeads, isPending: isCreatingLeads } = useMutation({
    mutationFn: async () => {
      const payload = {
        campaign_id: campaignId,
        leads: leadsData,
      };
      const res = await api.post("api/generate_leads", payload);
      return res;
    },
    onSuccess: () => {
      toast.success("Leads created successfully!");
      refetchLeads(); // Refresh data after creation
      setLeadsData([]); // Optional: reset selected data
    },
    onError: () => toast.error("Failed to create leads."),
  });


  const table = useReactTable({
    data: leads?.leads || [],
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

  const handleCreateLeads = () => {
    if (leadsData?.length === 0) {
      toast.error("No leads data to create!");
      return;
    }
    createLeads();
  };


  // const getCampaignLeads = async (campaignId) => {
  //   return toast.promise(
  //     api.get(`api/get_leads/${campaignId}`).then((res) => res.data),
  //     {
  //       loading: "Fetching campaign leads...",
  //       success: "Leads fetched successfully!",
  //       // error: "Failed to fetch leads.",
  //     }
  //   );
  // };

  // const createLeadsPayload = {
  //   campaign_id: campaignId,
  //   leads: leadsData,
  // };

  // const createLeads = async () => {
  //   try {
  //     const response = await api.post("api/generate_leads", createLeadsPayload);
  //     getCampaignLeads(campaignId); // Refetch leads after creation
  //     console.log(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // // Fetch campaign leads using React Query
  // const {
  //   data: leads,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["campaignLeads", campaignId],
  //   queryFn: () => getCampaignLeads(campaignId),
  //   enabled: !!campaignId, // Only run if campaignId exists
  // });


  // const table = useReactTable({
  //   data: leads?.leads || [],
  //   columns: columns,
  //   onSortingChange: setSorting,
  //   onColumnFiltersChange: setColumnFilters,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   onColumnVisibilityChange: setColumnVisibility,
  //   onRowSelectionChange: setRowSelection,
  //   onPaginationChange: setPagination,
  //   getRowId: (row) => row.id,
  //   state: {
  //     sorting,
  //     columnFilters,
  //     columnVisibility,
  //     rowSelection,
  //     pagination,
  //   },
  // });

  // const handleCreateLeads = () => {
  //   if (leadsData?.length === 0) {
  //     toast.error("No leads data to create!");
  //     return;
  //   }
  //   createLeads();
  // };

  return (
    <div className="p-4 rounded-sm w-full">
      {leads?.leads?.length > 0 && (
        <div className="">
          {leads && leads?.leads?.length > 0 && (
            <div className="">
              <Listing columns={columns} table={table} isPending={false}  />
            </div>
          )}
        </div>
      )}
      <div className={`${leads?.leads?.length > 0 ? "hidden" : ""}`}>
        {!openAddLeads ? (
          <div className="flex flex-col items-center justify-center p-8 min-h-64">
            <div className="bg-indigo-100 p-6 rounded-full mb-6">
              <Search className="w-12 h-12 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">
              Add some leads to get started!
            </h2>
            <div className="flex-1 flex-col h-full overflow-y-auto sm:py-4 px-4"></div>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Import your contacts or add them manually to begin building your
              lead database.
            </p>
            <button
              onClick={() => setOpenAddLeads(true)}
              className="px-4 py-2 bg-indigo-500 text-white rounded font-medium hover:bg-indigo-600"
            >
              Add Leads
            </button>
          </div>
        ) : (
          <div className="flex flex-col min-h-64">
            <div className="flex flex-col items-center py-10 ">
              <div className=""></div>
              <div className="flex space-x-10">
                <div className="flex space-x-5 cursor-pointer items-center bg-gray-100 px-10 py-5 rounded-2xl">
                  <CsvUploader />
                </div>
                <div className="flex space-x-5 items-center bg-gray-100 px-10 py-5 rounded-2xl">
                  <div
                    onClick={() => setIsOpenModal(true)}
                    className="flex items-center space-x-5"
                  >
                    <img src={search1} alt="" className="w-10 h-10 bg-cover" />
                    <span className="font-medium">Social Search </span>
                  </div>
                  {isOpenModal && (
                    <SocialSearchModal
                      isOpen={isOpenModal}
                      setIsOpen={setIsOpenModal}
                      setLeadsData={setLeadsData}
                      handleCreateLeads={handleCreateLeads}
                    />
                  )}
                  <div
                    onClick={handleCreateLeads}
                    className={`${
                      leadsData?.length > 0 ? "bg-green-200 px-5 py-2" : "hidden"
                    } `}
                  >
                    Add Selected Data
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}