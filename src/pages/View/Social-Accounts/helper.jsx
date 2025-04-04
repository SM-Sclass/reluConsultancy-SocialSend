
import { Checkbox } from '@/components/ui/checkbox';
import { Facebook, Instagram, Twitter } from 'lucide-react';

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

export  const columns = [
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