import React, { useCallback, useEffect, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Listing from "@/components/ReactTable";
import { columns } from "./helper";
import CreateCampaign from "@/components/CreateCampaign";
import { api } from "@/Services/Api";
import { auth } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { onAuthStateChanged } from "@firebase/auth";
import toast from "react-hot-toast";

function Campaigns({ createCampaign, close }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

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
    </div>
  );
}

export default Campaigns;
