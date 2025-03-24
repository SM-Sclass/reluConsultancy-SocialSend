import { Checkbox } from '@/components/ui/checkbox';

const ProgressBar = ({ progress }) => {
  const getProgressColor = (value) => {
    if (value < 50) return 'bg-orange-500';
    else if (value >= 80) return 'bg-green-500';
    else if (value > 70) return 'bg-green-400';
    return 'bg-yellow-500';
  };

  return (
    <div className="flex items-center gap-1 w-full">
      <span className="text-sm text-primary min-w-[30px]">{progress}%</span>
      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${getProgressColor(progress)} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};


export const columns = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        className="text-primary border border-neutral-500"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
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
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <div className="flex items-center gap-2">
        {row.getValue('name')}
      </div>
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return <div className={`flex items-center px-2.5 py-1 rounded-lg ${row.status === 'Active'
        ? 'bg-blue-700 text-blue-100'
        : 'bg-green-700 text-green-100'
        }`}>
        {row.getValue('status')}
      </div>
    }
  },
  {
    accessorKey: 'progress',
    header: 'Progress',
    cell: ({ row }) => {
      return <ProgressBar progress={row.getValue('progress')} />
    }

  },
  {
    accessorKey: 'sent',
    header: 'Sent',
    cell: ({ row }) => {
      return <div className="flex items-center gap-2">
        {row.getValue('sent')}
      </div>
    }
  },
  {
    accessorKey: 'click',
    header: 'Click',
    cell: ({ row }) => {
      return <div className="flex items-center gap-2">
        {row.getValue('click')}
      </div>
    }
  },
  {
    accessorKey: 'replied',
    header: 'Replied',
    cell: ({ row }) => {
      return <div className="flex items-center gap-2">
        {row.getValue('replied')}
      </div>
    }
  },
  {
    accessorKey: 'opportunity',
    header: 'Opportunity',
    cell: ({ row }) => {
      return <div className="flex items-center gap-2">
        {row.getValue('opportunity')}
      </div>
    }
  }
]