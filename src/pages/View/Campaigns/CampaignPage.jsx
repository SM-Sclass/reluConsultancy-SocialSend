
import React, { useContext } from 'react'
import { CampaignContext } from './CampaignContext'
import Campaigns from './Campaigns'
import CreateCampaign from './CreateCampaign'
import CampaignDetail from './CampaignDetail';

export default function CampaignPage() {
  const { campaignComponent } = useContext(CampaignContext);
  return (
    <div>
      {campaignComponent === "" && <Campaigns />}
      {campaignComponent === "Create" && <CreateCampaign />}
      {campaignComponent === "CampaignDetails" && <CampaignDetail />}
    </div>
  )
}