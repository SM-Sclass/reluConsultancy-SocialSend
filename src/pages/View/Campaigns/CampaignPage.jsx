import React, { useState, useContext } from "react";
import { Routes, Route, Link, NavLink, useLocation } from "react-router-dom";
import Breadcrumb from "../../../components/BreadCrumb";
import Campaigns from "./Campaigns";
import CampaignDetail from "./CampaignDetail";
import CampaignLeads from "./CampaignLeads";
import CampaignSequence from "./CampaignSequence";
import CampaignSchedule from "./CampaignSchedule";
import CampaignOptions from "./CampaignOptions";
import CampaignAnalytic from "./CampaignAnalytic";

const Tabs = [
  {
    name: "Analytics",
    path: "/Campaigns",
  },
  {
    name: "Leads",
    path: "/Campaigns/leads",
  },
  {
    name: "Sequences",
    path: "/Campaigns/sequences",
  },
  {
    name: "Schedule",
    path: "/Campaigns/schedule",
  },
  {
    name: "Options",
    path: "/Campaigns/options",
  },
];

export default function CampaignPage() {
  const [createCampaign, setCreateCampaign] = useState(false);
  const location = useLocation();
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
          {Tabs.map((route, index) => (
            <li key={index}>
              <NavLink
                to={route.path}
                end={route.path === route.path}
                className={({ isActive }) =>
                  `flex items-center justify-start px-4 py-2  transition ${
                    isActive
                      ? " font-semibold border-b-[2px] border-blue-500"
                      : " text-black"
                  }`
                }
              >
                {route.name}
              </NavLink>
            </li>
          ))}
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
          <Route path="leads" element={<CampaignLeads />} />
          <Route path="analytics" element={<CampaignAnalytic />} />
          <Route path="sequences" element={<CampaignSequence />} />
          <Route path="schedule" element={<CampaignSchedule />} />
          <Route path="options" element={<CampaignOptions />} />
        </Routes>
      </div>
      {/* {campaignComponent === "" && <Campaigns />}
      {campaignComponent === "Create" && <CreateCampaign />}
      {campaignComponent === "CampaignDetails" && <CampaignDetail />} */}
    </div>
  );
}
