import React, { useState } from "react";
import { Search } from "lucide-react";
import search1 from "../../../assets/Search1.svg";
import CsvUploader from "@/components/input/CsvUploader";
import { useParams } from "react-router";
import { api } from "@/Services/Api";

export default function CampaignLeads() {
  const [openAddLeads, setOpenAddLeads] = useState(false);
  const parms = useParams();

  return (
    <div className="p-4 rounded-sm w-full">
      {!openAddLeads ? (
        <div className="flex flex-col items-center justify-center p-8 min-h-64">
          <div className="bg-indigo-100 p-6 rounded-full mb-6">
            <Search className="w-12 h-12 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">
            Add some leads to get started!
          </h2>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            Import your contacts or add them manually to begin building your
            lead database.
          </p>
          <button
            onClick={() => setOpenAddLeads(true)}
            className="px-4 py-2 bg-indigo-500 text-white rounded font-medium hover:bg-indigo-600"
          >
            Add Leads
          </button>
        </div>
      ) : (
        <div className="flex flex-col min-h-64">
          <div className="flex flex-col items-center py-10 ">
            <div className=""></div>
            <div className="flex space-x-10">
              <div className="flex space-x-5 cursor-pointer items-center bg-gray-100 px-10 py-5 rounded-2xl">
                <CsvUploader />
              </div>
              <div className="flex space-x-5 items-center bg-gray-100 px-10 py-5 rounded-2xl">
                <img src={search1} alt="" className="w-10 h-10 bg-cover" />
                <span className="font-medium">Social Search </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
