// src/pages/View/Social-Search/hooks/useFilters.js
import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { filterUsers } from '@/pages/View/Social-Search/Service/Filter.service';

export const useFilters = (showToast) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    user: "67b8786fee1dfdb84e89c55d",
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
  const [filterId, setFilterId] = useState('');

  // Create mutation for applying filters
  const filterMutation = useMutation({
    mutationFn: filterUsers,
    onSuccess: (result) => {
      // Store the filter ID returned from the API
      const newFilterId = result.filter_id || '67cd8ea517b104152dc65c26';
      setFilterId(newFilterId);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['filters'] });
      queryClient.invalidateQueries({
        queryKey: ['filteredUserAccounts', newFilterId],
      });
      
      if (showToast) {
        showToast('Filters applied successfully', 'success');
      }
    },
    onError: (error) => {
      console.error('Error fetching filtered users:', error);
      if (showToast) {
        showToast((error.response?.data?.result || 'Unknown error'), 'error');
      }
    }
  });

  // Function to update a specific filter
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Apply filters manually when the save button is clicked
  const applyFilters = useCallback(() => {
    // Create a clean copy of the filters
    const currentFilters = { ...filters };

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

    filterMutation.mutate(filteredData);
  }, [filters, filterMutation]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    const initialFilters = {
      user: "67b8786fee1dfdb84e89c55d",
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
    };

    if (JSON.stringify(filters) === JSON.stringify(initialFilters)) {
      setFilterId(null);
      showToast('Table has been Reset', 'success');
    } else {
      setFilters(initialFilters);
      showToast('All filters have been reset', 'success');
    }
  }, [filters, showToast]);

  return {
    filters,
    updateFilter,
    filterId,
    setFilterId,
    applyFilters,
    resetFilters,
    loading: filterMutation.isPending
  };
};