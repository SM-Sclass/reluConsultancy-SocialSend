import { api } from "@/Services/Api";

export const createCampaign = async (campaignData) => {
  try {
    const response = await api.post("/api/create_campaign", campaignData);
    return response.data;
  } catch (error) {
    console.error("Error in addCampaign:", error);
  }
};

export const editCampaign = async (campaignData) => {
  try {
    const response = await api.put("/api/create_campaign", campaignData);
    return response.data;
  } catch (error) {
    console.error("Error in addCampaign:", error);
  }
};

export const deleteCampaign = async (campaignData) => {
  try {
    console.log(campaignData);
    const response = await api.delete(`/api/create_campaign`,campaignData);
    return response.data;
  } catch (error) {
    console.error("Error in deleteCampaign:", error);
    throw new Error(error);
    
  }
};

export const getCampaign = async (campaignData) => {
  try {
    const response = await api.get(`/api/create_campaign/${campaignData}`);
    return response.data;
  } catch (error) {
    console.error("Error in getCampaign:", error);
  }
};

export const getCampaignLeads = async (campaignData) => {
  try {
    const response = await api.get(`api/get_leads/${campaignData}`);
    return response.data;
  } catch (error) {
    console.log("Error in getCampaign leads:", error);
  }
};
