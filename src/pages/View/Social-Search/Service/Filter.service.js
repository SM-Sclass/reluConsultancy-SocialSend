// filterService.js
import { api } from "@/Services/Api";

export const filterUsers = async(filterData) => {
    try {
        const response = await api.post('/api/filter', {
            user: "67b8786fee1dfdb84e89c55d", // Hardcoded user ID
            ...filterData
        });
        
        if (response.status !== 200) {
            throw new Error('Filter request failed');
        }

        return response.data;
    } catch (error) {
        console.error('Error filtering users:', error);
        throw error;
    }
};