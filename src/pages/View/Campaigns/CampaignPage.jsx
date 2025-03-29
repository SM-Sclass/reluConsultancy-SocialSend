
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Breadcrumb from '../../../components/BreadCrumb'
import Campaigns from './Campaigns'
import CampaignDetail from './CampaignDetail';

export default function CampaignPage() {
  const [createCampaign, setCreateCampaign] = useState(false)
  const [data, setData] = useState([{
    "id": 1,
    "name": "Campaign 1",
    "status": "Active",
    "progress": 80,
    "sent": 100,
    "click": 50,
    "replied": 20,
    "opportunity": 10
  },
  ])

  return (
    <div>
      <Breadcrumb
        onClickFunction={() => setCreateCampaign(true)}
        pageName="Campaigns"
        availableEntries="54"
        buttonName="Add Campaign"
      />
      <div className='p-3 flex justify-center'>
        <Routes>
          <Route path="/" element={<Campaigns
            createCampaign={createCampaign}
            close={() => setCreateCampaign(false)}
            data={data}
          />
          } />
          <Route path="/:id" element={<CampaignDetail />} />
        </Routes>
      </div>

    </div>
  )
}