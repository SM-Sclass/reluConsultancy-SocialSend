import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { setFilterId } from "@/store/filterStore";
// import { fetchAllFilters } from './Service/User.service';
import { fetchAllFilters } from "../../pages/View/Social-Search/Service/User.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SideTabApplyFilter = ({
  isOpen,
  onClose,
  filterId,
  table,
  setOpenNewFilter,
}) => {
  const queryClient = useQueryClient();

  const [selectedFilter, setSelectedFilter] = useState(filterId);
  const [searchFilter, setSearchFilter] = useState("");

  const { isPending, data } = useQuery({
    queryKey: ["filters"],
    queryFn: () => fetchAllFilters(),
  });

  const sideRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the sidebar is open and the click is outside the sidebar
      if (
        isOpen &&
        sideRef.current &&
        !sideRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    // Add the event listener when the component mounts and sidebar is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener when the component unmounts or sidebar closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter._id);
  };

  // Function to apply the selected filter
  const handleApplyFilter = async () => {
    try {
      // Fixed query invalidation with proper format
      if (typeof table !== "undefined") {
        table.resetRowSelection();
      }
      await queryClient.invalidateQueries({
        queryKey: ["filteredUserAccounts", selectedFilter],
      });

      setFilterId(selectedFilter);
      setOpenNewFilter(true);
      setSelectedFilter("");
    } catch (err) {
      console.error("Error invalidating query:", err);
    }
    onClose();
  };

  const filteredData = data?.filter((filter) =>
    filter.filter_name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div
      className={` h-full w-full  flex shadow-lg transform transition-transform duration-300 ease-in-out  z-40`}
    >
      <div className="w-full">
        <div
          ref={sideRef}
          className="flex flex-col self-end h-full dark:bg-black/70 backdrop-blur-2xl ml-auto"
        >
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between dark:bg-black/40">
            <h2 className="text-xl font-bold text-primary">Saved Filters</h2>
          </div>

          <div className="p-4 space-y-1">
            <Input
              type="text"
              placeholder="Search filters..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-3 py-2  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-primary"
            />
            <p className="text-sm text-gray-500">
              Select a filter to apply to your search:
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-1 dark:bg-black/20">
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

            {filteredData && filteredData.length > 0 && (
              <div className="space-y-1 rounded-md border h-[200px] p-2">
                {filteredData.map((filter) => (
                  <div
                    key={filter._id}
                    onClick={() => handleFilterSelect(filter)}
                    className={`
                    p-3 rounded-lg cursor-pointer transition-colors
                    ${
                      selectedFilter === filter._id &&
                      selectedFilter === filterId
                        ? "bg-blue-800/30 dark:bg-blue-900/40 "
                        : "dark:bg-black/30  hover:dark:bg-white/10 hover:bg-white/40"
                    }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-primary">
                        {filter.filter_name}
                      </span>
                      {selectedFilter === filter._id && (
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredData && filteredData.length === 0 && (
              <div className="text-center py-8 text-primary bg-black/10 dark:bg-white/10 rounded-lg">
                No saved filters found.
              </div>
            )}
          </div>

          {/* Footer with action buttons */}
          <div className="p-4  flex justify-end space-x-2 dark:bg-black/40">
            <Button
              onClick={() => setSelectedFilter("")}
              className={`px-4 py-2 rounded-md text-primary hover:bg-white/10  ${selectedFilter ? "":"hidden"}` }
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleApplyFilter();
              }}
              disabled={!selectedFilter}
              className={`px-4 py-2 rounded-md text-white 
                ${
                  selectedFilter
                    ? "bg-blue-600/80 cursor-pointer hover:bg-blue-700/80"
                    : "dark:bg-gray-600/50 cursor-not-allowed"
                }`}
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
