import { api } from "@/Services/Api";

export const createCampaign = async (campaignData) => {
  
  try {
    const response = await api.post('/api/create_campaign', campaignData);
    return response.data;
  } catch (error) {
    console.error('Error in addCampaign:', error);
  }
}

export const getCampaign = async (campaignData) => {
  
  try {
    const response = await api.get(`/api/create_campaign/${campaignData}`);
    return response.data;
  } catch (error) {
    console.error('Error in addCampaign:', error);
  }
}