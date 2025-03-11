import React, { createContext, useState } from 'react';


export const CampaignContext = createContext();

export const CampaignProvider = ({ children }) => {
  const [campaignComponent, setCampaignComponent] = useState("");
  const [campaignData, setCampaignData] = useState([]);

  return (
    <CampaignContext.Provider value={{ campaignComponent, setCampaignComponent, campaignData, setCampaignData }}>
      {children}
    </CampaignContext.Provider>
  );
}