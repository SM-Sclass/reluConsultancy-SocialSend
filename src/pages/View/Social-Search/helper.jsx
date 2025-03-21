import React, { useState } from 'react';
import { Instagram } from 'lucide-react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { fetchAllFilters } from './Service/User.service';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

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
    accessorKey: 'platform',
    header: 'Platform',
    cell: () => {
      return <div className="flex items-center gap-2">
        <Instagram size={16} />
        Instagram
      </div>
    }
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => {
      return <div className="flex items-center gap-2">
        {row.getValue('username')}
      </div>
    }
  },
  {
    accessorKey: 'followers_count',
    header: 'Followers',
    cell: ({ row }) => {
      return <div className="flex items-center gap-2">
        {row.getValue('followers_count')}
      </div>
    }

  },
  {
    accessorKey: 'following_count',
    header: 'Following',
    cell: ({ row }) => {
      return <div className="flex items-center gap-2">
        {row.getValue('following_count')}
      </div>
    }
  },
  {
    accessorKey: 'keywords in bio',
    header: 'Keywords in Bio',
    cell: ({ row }) => {
      const value = row.getValue('keywords in bio');
      const truncatedValue = value?.length > 30 ? `${value.slice(0, 30)}...` : value;

      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap">
              {truncatedValue}
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="text-sm">{value}</div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: 'urls_in_bio',
    header: 'Url in Bio',
    cell: ({ row }) => {
      const value = row.getValue('urls_in_bio');
      const maxVisibleItems = 1; // Maximum number of items to display before truncating

      // Truncate the array if it exceeds the maxVisibleItems
      const truncatedValue =
        Array.isArray(value) && value.length > maxVisibleItems
          ? `${value.slice(0, maxVisibleItems).join(', ')}...`
          : Array.isArray(value)
            ? value.join(', ')
            : '';
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap text-start">
              {truncatedValue || 'No URLs'}
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="text-sm space-y-1">
              {Array.isArray(value) && value.length > 0 ? (
                value.map((url, index) => (
                  <div key={index} className="truncate">
                    {url}
                  </div>
                ))
              ) : (
                <div>No URLs available</div>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: 'bio_email',
    header: 'Bio Email',
    cell: ({ row }) => {
      return <HoverCard>
        <HoverCardTrigger asChild>
          <div className="text-sm text-start">{row.getValue('bio_email') || 'Not Available'}</div>
        </HoverCardTrigger>
        {row.getValue("bio_email") && <HoverCardContent className="w-80">
          <div className="text-sm">{row.getValue('bio_email')}</div>
        </HoverCardContent>}
      </HoverCard>
    }
  },
  {
    accessorKey: 'no_of_posts',
    header: 'No. of Posts',
    cell: ({ row }) => {
      return <div className="flex items-center gap-2">
        {row.getValue('no_of_posts')}
      </div>
    }

  }
]

export const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-4 right-4 flex items-center p-4 mb-4 ${bgColor} text-white rounded-lg shadow-md z-50`}>
      <div className="mr-2 text-sm font-medium">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 text-white hover:text-gray-200 rounded-lg p-1.5 inline-flex h-6 w-6"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  );
};

export const SideTab = ({ isOpen, onClose, filterId, setFilterId, table }) => {
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState(filterId);
  const [searchFilter, setSearchFilter] = useState('');
  const { isPending, data } = useQuery({
    queryKey: ['filters'],
    queryFn: () => fetchAllFilters()
  });

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter._id);
  };

  // Function to apply the selected filter
  const handleApplyFilter = async () => {
    try {
      // Fixed query invalidation with proper format
      if (typeof table !== 'undefined') {
        table.resetRowSelection();
      }

      await queryClient.invalidateQueries({
        queryKey: ['filteredUserAccounts', selectedFilter]
      });
      if (selectedFilter) {
        setFilterId(selectedFilter); // Close the side tab after selection
      }
    } catch (err) {
      // console.error('Error invalidating query:', err);
    }
    onClose();
  };

  const filteredData = data?.filter((filter) =>
    filter.filter_name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full  flex shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
        } z-40`}
    >
      <div className='w-1/5 sm:w-1/2'
        onClick={onClose}
      />
      <div className="flex flex-col h-full w-4/5 sm:w-1/2 bg-background">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-muted">
          <h2 className="text-xl font-bold">Saved Filters</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 cursor-pointer"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 border-b space-y-4">
          <Input
            type="text"
            placeholder="Search filters..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500">
            Select a filter to apply to your search:
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isPending && (
            <div className="space-y-1 bg-secondary rounded-lg p-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}

          {filteredData && (
            <div className="space-y-2">
              {filteredData.map((filter) => (
                <div
                  key={filter._id}
                  onClick={() => handleFilterSelect(filter)}
                  className={`
                      p-3 rounded-lg cursor-pointer transition-colors
                      ${selectedFilter === filter._id && selectedFilter === filterId
                      ? 'bg-secondary border-2 border-blue-500'
                      : 'bg-secondary border hover:bg-muted'
                    }
                    `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-primary">{filter.filter_name}</span>
                    {selectedFilter === filter._id && (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredData && filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No saved filters found.
            </div>
          )}
        </div>

        {/* Footer with action buttons */}
        <div className="p-4 border-t flex justify-end space-x-2 bg-muted">
          <Button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-500 rounded-md text-primary hover:bg-secondary"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApplyFilter}
            disabled={!selectedFilter}
            className={`px-4 py-2 rounded-md text-white 
                ${selectedFilter
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-500 cursor-not-allowed'
              }`}
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

