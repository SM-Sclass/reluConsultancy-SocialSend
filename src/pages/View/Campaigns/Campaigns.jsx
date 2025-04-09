import React, { useCallback, useEffect, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Listing from "@/components/ReactTable";
import { columns, ProgressBar } from "./helper";
import CreateCampaign from "@/components/CreateCampaign";
import { api } from "@/Services/Api";
import { auth } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { onAuthStateChanged } from "@firebase/auth";
import toast from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router";
import DeleteModal from "@/components/modals/deleteCampModal";
import EditCampModal from "@/components/modals/EditCampModal";

function Campaigns({ createCampaign, close }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const columns = [
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
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const navigate = useNavigate(); // Use navigate hook
        return (
          <div
            className="flex items-center gap-2 cursor-pointer text-blue-500 hover:underline"
            onClick={() => navigate(`/Campaigns/${row.original._id}`)} // Navigate to dynamic route
          >
            {row.getValue("name")}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <div
            className={`flex items-center px-2.5 py-1 w-fit rounded-lg ${
              row.status === "Active"
                ? "bg-blue-700 text-blue-100"
                : "bg-green-600 text-green-100"
            }`}
          >
            {row.getValue("status")}
          </div>
        );
      },
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        return <ProgressBar progress={row.getValue("progress")} />;
      },
    },
    {
      accessorKey: "sent",
      header: "Sent",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">{row.getValue("sent")}</div>
        );
      },
    },
    {
      accessorKey: "click",
      header: "Click",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">{row.getValue("click")}</div>
        );
      },
    },
    {
      accessorKey: "replied",
      header: "Replied",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            {row.getValue("replied")}
          </div>
        );
      },
    },
    {
      accessorKey: "opportunity",
      header: "Opportunity",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            {row.getValue("opportunity")}
          </div>
        );
      },
    },
    {
      accessorKey: "Action",
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setOpenEditModal(true);
                setSelectedRowData(row.original);
              }}
              className="bg-gray-200 py-.5 px-2 rounded-md cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setOpenDeleteModal(true);
                setSelectedRowData(row.original._id); // Store the selected row data
              }}
              className="bg-red-200 py-.5 px-2 rounded-md cursor-pointer"
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  //  Listen for authentication changes & prevent unnecessary re-renders
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setIsLoading(false); // Prevent infinite loading if no user
    });
    return () => unsubscribe();
  }, []);

  const getCampaigns = useCallback(async () => {
    if (!user?.uid) return; //  Ensure user is available before making API call

    setIsLoading(true); //  Set loading state when fetching

    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists() || !userDoc.data()?.user_id) {
        toast.error("Authorization error. Please try again later.");
        setIsLoading(false);
        return;
      }

      const response = await api.get(
        `/api/get_campaigns/${userDoc.data().user_id}`
      );
      setData(response.data.campaigns || []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to fetch campaigns. Please try again.");
    } finally {
      setIsLoading(false); //  Always stop loading, whether API call succeeds or fails
    }
  }, [user?.uid]); //  Dependency reduced to just `user?.uid`

  useEffect(() => {
    if (user !== null) {
      getCampaigns();
    }
  }, [user, getCampaigns]); //  Ensures it only runs when user is fully set

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

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
    <div className="p-4 border rounded-sm w-full">
      {!createCampaign && (
        <Listing columns={columns} table={table} isPending={isLoading} />
      )}

      {createCampaign && (
        <CreateCampaign getCampaigns={getCampaigns} close={close} />
      )}

      {openDeleteModal && (
        <DeleteModal
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
          setSelectedRowData={setSelectedRowData}
          selectedRowData={selectedRowData}
          getCampaigns={getCampaigns}
        />
      )}
      {openEditModal && (
        <EditCampModal
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          selectedRowData={selectedRowData}
          getCampaigns={getCampaigns}
          setSelectedRowData={setSelectedRowData}
        />
      )}
    </div>
  );
}

export default Campaigns;