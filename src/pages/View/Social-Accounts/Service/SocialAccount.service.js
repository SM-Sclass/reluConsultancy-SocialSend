import { api } from "@/Services/Api";

export const addSocialAccount = async (socialAccountData) => {
  try {
    // return
    const response = await api.post('/api/add_new_social_acc', socialAccountData);
    return response.data;
  } catch (error) {
    console.error('Error in addSocialAccount:', error);
    throw error
  }
}

export const fetchSocialAccountStatistics = async (social_account_id) => {
  try {
    const pathVariable = social_account_id ? social_account_id : '67b878d7ee1dfdb84e89c55f';
    const response = await api.get(`/api/getstatistics/${pathVariable}/`);
    return response.data.graphs;
  } catch (error) {
    console.error('Error in fetchUsersByFilterId:', error);
  }
}

export const sendTemplateMessage = async (messageData) => {
  try {
    const response = await api.post('/api/send_template_msg', messageData);
    return response.data;
  } catch (error) {
    console.error('Error in fetchUsersByFilterId:', error);
  }
}

export const getTemplateMessage = async (messageData) => {
  try {
    const pathVariable = messageData ? messageData :'67b878d7ee1dfdb84e89c55f';
    const response = await api.get(`/api/get_template_msg/${pathVariable}`);
    return response.data
  } catch (error) {
    console.error('Error in fetchUsersByFilterId:', error);
  }
}