import React, { createContext, useState, useCallback } from 'react';
import { filterUsers } from './Service/Filter.service';
import { useQueryClient } from '@tanstack/react-query';

export const FilterContext = createContext();

export const FilterProvider = ({ children, showToast }) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    user: "67b8786fee1dfdb84e89c55d", // Hardcoded user ID
    location: [],
    hashtag: [],
    filter_name: "",
    age: null,
    keywords: [],
    social_platform: [],
    followers: null,
    following_lists: [],
    gender: [],
    interests: []
  });

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterId, setFilterId] = useState('67d849ac9b6a61db89174ab7');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to update a specific filter
  const updateFilters = useCallback((key, value) => {
    console.log(`Setting filter ${key} to:`, value);
    setFilters(prevFilters => {
      const newFilters = {
        ...prevFilters,
        [key]: value
      };
      console.log("New filters state:", newFilters);
      return newFilters;
    });
  }, []);

  // Apply filters manually when the save button is clicked
  const applyFilters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Create a clean copy of the filters
      const currentFilters = { ...filters };
      console.log("Full filters object:", currentFilters);

      // Only send non-empty filters to the API
      const filteredData = Object.entries(currentFilters).reduce((acc, [key, value]) => {
        // Always include user ID
        if (key === 'user') {
          acc[key] = value;
          return acc;
        }

        // Include arrays with length > 0
        if (Array.isArray(value) && value.length > 0) {
          acc[key] = value;
        }
        // Include numbers that aren't NaN
        else if (typeof value === 'number' && !isNaN(value)) {
          acc[key] = value;
        }
        // Include non-empty strings
        else if (typeof value === 'string' && value.trim() !== '') {
          acc[key] = value;
        }

        return acc;
      }, {});

      console.log('Sending API payload:', filteredData);

      const result = await filterUsers(filteredData);
      console.log('Filter API response:', result);

      // Store the filter ID returned from the API
      let newFilterId = null;
      if (result.filter_id) {
        newFilterId = result.filter_id;
      }
      else{
        newFilterId = '67cd8ea517b104152dc65c26';
      }

      setFilterId(newFilterId);
      // console.log('New fetched filtered accounts:', newFetchedFilteredAccounts);
      try {
        // Fixed query invalidation with proper format

        console.log('Query invalidated successfully');
      } catch (err) {
        console.error('Error invalidating query:', err);
      }
      
      if (showToast) {
        showToast('Filters applied successfully', 'success');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while filtering users');
      console.error('Error fetching filtered users:', err);

      // Show error toast if showToast function is provided
      if (showToast) {
        showToast((err.response.data.result || 'Unknown error'), 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);



  // Reset all filters
  const resetFilters = useCallback(() => {
    const initialFilters = {
      user: "67b8786fee1dfdb84e89c55d", // Keep the user ID
      location: [],
      hashtag: [],
      age: null,
      keywords: [],
      social_platform: [],
      followers: null,
      following_lists: [],
      gender: [],
      interests: []
    };

    console.log("Resetting filters to:", initialFilters);
    setFilters(initialFilters);
    setFilteredUsers([]);
    setFilterId(null);

    // Show reset toast if showToast function is provided
    if (showToast) {
      showToast('All filters have been reset', 'success');
    }
  }, [showToast]);

  const value = {
    filters,
    setFilters,
    filterId,
    setFilterId,
    updateFilters,
    filteredUsers,
    loading,
    error,
    resetFilters,
    applyFilters
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};
