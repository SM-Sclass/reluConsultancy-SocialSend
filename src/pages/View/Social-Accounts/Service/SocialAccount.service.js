import { api } from "@/Services/Api";
import { Trophy } from "lucide-react";

export const fetchSocialAccountStatistics = async (social_account_id) => {
  try {
    const pathVariable = social_account_id ? social_account_id : '67b878d7ee1dfdb84e89c55f';
    const response = await api.get(`/api/getstatistics/${pathVariable}/`);
    return response.data.graphs;
  } catch (error) {
    console.error('Error in fetchUsersByFilterId:', error);
    throw error;
  }
}

export const sendTemplateMessage = async (messageData) => {
  try {
    const response = await api.post('/api/send_template_msg', messageData);
    return response.data;
  } catch (error) {
    console.error('Error in fetchUsersByFilterId:', error);
    throw error;
  }
}