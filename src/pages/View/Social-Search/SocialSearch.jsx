import React, { useState, useContext } from 'react';
import {useQueryClient, useQuery } from '@tanstack/react-query';
import FilterSidebar from './FilterSidebar';
import UserTable from './UserTable';
import Breadcrumb from '../../../components/BreadCrumb';
import { FilterProvider } from './FilterContext';
import { fetchAllFilters } from './Service/User.service';
import { FilterContext } from './FilterContext';


const Toast = ({ message, type, onClose }) => {
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

const SideTab = ({ isOpen, onClose }) => {
  const { filterId, setFilterId } = useContext(FilterContext);
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState(filterId);
  const { isPending, data, error } = useQuery({
    queryKey: ['filters'],
    queryFn: () => fetchAllFilters()
  });

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter._id);
  };

  // Function to apply the selected filter
  const handleApplyFilter = async() => {
    try {
      // Fixed query invalidation with proper format
      await queryClient.invalidateQueries({ 
        queryKey: ['filteredUserAccounts', selectedFilter] 
      });
      if (selectedFilter) {
        console.log('Applying filter:', selectedFilter);
        setFilterId(selectedFilter); // Close the side tab after selection
      }
      console.log('Query invalidated successfully');
    } catch (err) {
      console.error('Error invalidating query:', err);
    }
    onClose();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-4/5 sm:w-1/2 bg-secondary shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
        } z-40`}
    >
      <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-muted">
            <h2 className="text-xl font-bold">Saved Filters</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
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
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isPending && (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Failed to load filters: {error.message || 'Unknown error'}
              </div>
            )}
            
            {data  && (
              <div className="space-y-1">
                <p className="text-sm text-gray-500 mb-3">
                  Select a filter to apply to your search:
                </p>
                
                {data.map((filter) => (
                  <div 
                    key={filter._id}
                    onClick={() => handleFilterSelect(filter)}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-colors
                      ${selectedFilter === filter._id 
                        ? 'bg-secondary border-2 border-blue-500' 
                        : 'bg-secondary border hover:bg-muted border-gray-200'
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
            
            {data && data.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No saved filters found.
              </div>
            )}
          </div>
          
          {/* Footer with action buttons */}
          <div className="p-4 border-t flex justify-end space-x-2 bg-muted">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilter}
              disabled={!selectedFilter}
              className={`px-4 py-2 rounded-md text-white 
                ${selectedFilter
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-300 cursor-not-allowed'
                }`}
            >
              Apply Filter
            </button>
          </div>
        </div>
    </div>
  );
};

const SocialFilterInterface = () => {
  const [toast, setToast] = useState(null);
  const [isSideTabOpen, setIsSideTabOpen] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  const handleBreadcrumbClick = () => {
    setIsSideTabOpen(true);
  };

  const handleCloseSideTab = () => {
    setIsSideTabOpen(false);
  };

  return (
    <FilterProvider showToast={showToast}>
      <div className="flex flex-col h-full">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={handleCloseToast}
          />
        )}

        <Breadcrumb onClickFunction={handleBreadcrumbClick} pageName="Social Search" availableEntries="" />

        <SideTab
          isOpen={isSideTabOpen}
          onClose={handleCloseSideTab}
        />

        <div className="flex flex-col sm:flex-row bg-muted rounded h-full overflow-hidden">
          <FilterSidebar />
          <div className="flex-1 h-full overflow-y-auto">
            <UserTable />
          </div>
        </div>
      </div>
    </FilterProvider>
  );
};

export default SocialFilterInterface;