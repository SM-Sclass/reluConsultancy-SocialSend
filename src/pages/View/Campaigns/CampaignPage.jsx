import React, { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Breadcrumb from "../../../components/BreadCrumb";
import Campaigns from "./Campaigns";
import CampaignDetail from "./CampaignDetail";
import CampaignLeads from "./CampaignLeads";

export default function CampaignPage() {
  const [createCampaign, setCreateCampaign] = useState(false);
  
  return (
    <div>
      <Breadcrumb
        onClickFunction={() => setCreateCampaign(true)}
        pageName="Campaigns"
        availableEntries="54"
        buttonName="Add Campaign"
      />
      <div className="flex space-x-5 my-1 border-gray-100 border-b ">
        <ul className="flex space-x-5">
        </ul>
      </div>

      <div className="p-3 flex ">
        <Routes>
          <Route
            index
            element={
              <Campaigns
                createCampaign={createCampaign}
                close={() => setCreateCampaign(false)}
              />
            }
          />
          <Route path=":id" element={<CampaignDetail />} />
        </Routes>
      </div>
    </div>
  );
}
