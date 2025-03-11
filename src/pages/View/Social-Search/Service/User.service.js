/**
 * Fetches users based on a filter ID
 * @param {string} filter_id - The ID of the filter to use
 * @returns {Promise<Object>} - Promise resolving to user data
 */
import { api } from "@/Services/Api";

export const fetchTargetByFilterId = async (filter_id) => {
  try {
    const reqBody = {
      social_account_id: "67b878d7ee1dfdb84e89c55f",
    }
    if (filter_id) {
      reqBody.filter_id = filter_id
    }

    const response = await api.post('/api/get_targets', reqBody);
    return response.data.target;
  } catch (error) {
    console.error('Error in fetchUsersByFilterId:', error);
    throw error;
  }
};

export const fetchAllFilters = async (userId) => {
  try {
    const user_id = userId ? userId : "67b878d7ee1dfdb84e89c55f";
    const response = await api.get(`/api/get_all_filters/${user_id}/`);
    return response.data.filter;
  } catch (error) {
    console.error('Error in fetchAllFilters:', error);
    throw error;
  }  
}