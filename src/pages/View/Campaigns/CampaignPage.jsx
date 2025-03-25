
import React, { useState, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Breadcrumb from '../../../components/BreadCrumb'
import Campaigns from './Campaigns'
import CampaignDetail from './CampaignDetail';

export default function CampaignPage() {
  const [createCampaign, setCreateCampaign] = useState(false)
  return (
    <div>
      <Breadcrumb onClickFunction={() => setCreateCampaign(true)} pageName="Campaigns" availableEntries="54" buttonName="Add Campaign" />
      <div className='p-3 flex justify-center'>

      <Routes>
        <Route path="/" element={<Campaigns createCampaign={createCampaign} close={() => setCreateCampaign(false)}/>} />
        <Route path="/:id" element={<CampaignDetail />} />
      </Routes>
      </div>
      {/* {campaignComponent === "" && <Campaigns />}
      {campaignComponent === "Create" && <CreateCampaign />}
      {campaignComponent === "CampaignDetails" && <CampaignDetail />} */}
    </div>
  )
}