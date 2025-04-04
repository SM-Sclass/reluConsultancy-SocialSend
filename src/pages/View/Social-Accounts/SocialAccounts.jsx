import React, { useCallback, useEffect, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Instagram, Facebook, Twitter } from "lucide-react";
import Listing from "@/components/ReactTable";
import { Checkbox } from "@/components/ui/checkbox";
import { userArray } from "../../../Data/Users";
import Breadcrumb from "../../../components/BreadCrumb";
import AddSocialAccountPopup from "./AddSocialAccountPopUp";
import UserSettingsModal from "./UserSettingModal";
import { auth, db } from "@/lib/firebase/config";
import { onAuthStateChanged } from "@firebase/auth";
import toast from "react-hot-toast";
import { doc, getDoc } from "@firebase/firestore";
import { api } from "@/Services/Api";

const SocialAccounts = () => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  // ----
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

  const getSocialAccount = useCallback(async () => {
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
        `/api/get_social_account/${userDoc.data().user_id}`
      );
      setData(response?.data?.social_accounts || []);
    } catch (error) {
      console.error("Error fetching social account:", error);
      toast.error("Failed to fetch social account. Please try again.");
    } finally {
      setIsLoading(false); //  Always stop loading, whether API call succeeds or fails
    }
  }, [user?.uid]); //  Dependency reduced to just `user?.uid`

  useEffect(() => {
    if (user !== null) {
      getSocialAccount();
    }
  }, [user, getSocialAccount]); //  Ensures it only runs when user is fully set

  // ----

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      case "facebook":
        return <Facebook className="w-5 h-5" />;
      case "twitter":
        return <Twitter className="w-5 h-5" />;
      case "tiktok":
        return <span className="font-bold text-lg">𝓣</span>;
      default:
        return null;
    }
  };

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
      accessorKey: "platform",
      header: "Platform",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <span className="ml-2 text-sm text-primary flex items-center space-x-1">
              {/* {row.getValue("platform") ? } */}
              {getPlatformIcon("Instagram")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        return (
          <button
            onClick={() => setSelectedUser(row.getValue("username"))}
            className="text-sm text-primary flex  hover:text-blue-500 w-full"
          >
            {row.getValue("username")}
          </button>
        );
      },
    },
    {
      accessorKey: "daily_messages",
      header: "Daily Messages",
      cell: ({ row }) => {
        return (
          <span className="text-primary flex">
            {row.getValue("daily_messages")}
          </span>
        );
      },
    },
    {
      accessorKey: "daily_connections",
      header: "Daily Connections",
      cell: ({ row }) => {
        return (
          <span className="text-primary flex">
            {row.getValue("daily_connections")}
          </span>
        );
      },
    },
    {
      accessorKey: "warmup_enabled",
      header: "Warmup Enabled",
      cell: ({ row }) => {
        return (
          <span
            className={`flex ${
              row.getValue("warmup_enabled") ? "text-green-600" : "text-red-600"
            }`}
          >
            {row.getValue("warmup_enabled") ? "Yes" : "No"}
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    // data: userArray || [],
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
    <div className="w-full">
      <Breadcrumb
        onClickFunction={() => {
          setShowPopUp(true);
        }}
        pageName="Social Accounts"
        availableEntries={userArray?.length || "0"}
        table={table}
        buttonName="Add New"
      />
      <div className="p-3 bg-zinc-100 dark:bg-black/20">
        <Listing
          columns={columns}
          table={table}
          isPending={isLoading}
          className="bg-background p-4 rounded-sm dark:border"
        />
      </div>
      {/* Show Popup */}
      {showPopUp && (
        // <AddSocialAccountPopup onClose={() => setShowPopUp(false)} />
        <AddSocialAccountPopup
          onClose={() => {
            setShowPopUp(false);
            getSocialAccount();
          }}
        />
      )}
      <UserSettingsModal
        username={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
};

export default SocialAccounts;
