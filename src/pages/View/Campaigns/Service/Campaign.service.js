import { api } from "@/Services/Api";
import toast from "react-hot-toast";

export const createCampaign = async (campaignData) => {
  try {
    const response = await api.post("/api/create_campaign", campaignData);
    return response.data;
  } catch (error) {
    console.error("Error in addCampaign:", error);
  }
};

export const createOptions = async (payload) => {
  try {
    const response = await api.post("/api/add_options", payload);
    return response.data;
  } catch (error) {
    console.error("Error in add options:", error);
    toast.error(error?.response?.data?.result);
    throw new Error(error);
  }
};

export const createSchedule = async (payload) => {
  try {
    const response = await api.post("/api/new_schedule", payload);
    console.log(response);
    response?.data?.error
      ? toast?.error(response?.data?.error)
      : toast.success("Schedule added successfully");
    return response.data;
  } catch (error) {
    if (error?.response?.data?.error) {
      toast.error(error.response.data.error);
    } else {
      console.error(error)
    }
  }
};

export const getScheduleData = async (payload) => {
  try {
    const response = await api.get(`/api/get_schedule/${payload}`);
    return response.data;
  } catch (error) {
    // console.error(error);
    throw new Error(error);
  }
};

export const createCampLeads = async (payload) => {
  try {
    const response = await api.post("/api/generate_leads", payload);
    toast.success("Leads generated successfully!");
    return response.data;
  } catch (error) {
    console.error("Error in add options:", error);
    toast.error(error?.response?.data?.result);
    throw new Error(error);
  }
};

export const getCampaignOptions = async (campaignData) => {
  try {
    const response = await api.get(`/api/get_options/${campaignData}`);
    return response.data;
  } catch (error) {
    console.log("Error in getCampaign leads:", error);
  }
};

export const editCampaign = async (campaignData) => {
  try {
    const response = await api.put("/api/create_campaign", campaignData);
    return response.data;
  } catch (error) {
    console.error("Error in edit Campaign:", error);
  }
};

export const deleteCampaign = async (campaignData) => {
  try {
    const response = await api.delete(`/api/create_campaign`, {
      data: campaignData,
    });
    return response.data;
  } catch (error) {
    console.error("Error in delete Campaign:", error);
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
