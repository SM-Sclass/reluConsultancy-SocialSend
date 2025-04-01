import React, { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import csv from "../../../assets/csv.svg";
import search1 from "../../../assets/Search1.svg";
import CsvUploader from "@/components/input/CsvUploader";

export default function CampaignLeads() {
  const [openAddLeads, setOpenAddLeads] = useState(false);

  return (
    <div className="p-4 border rounded-sm w-full">
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
          <button
            className="flex items-center text-blue-600 cursor-pointer font-medium"
            onClick={() => setOpenAddLeads(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Go Back
          </button>
          <div className="flex flex-col items-center py-10 ">
            <div className=""></div>
            <div className="flex space-x-10">
              <div className="flex space-x-5 items-center bg-gray-100 px-10 py-5 rounded-2xl">
                {/* <img src={csv} alt="" className="w-10 h-10 bg-cover" />
                <span className="font-medium">Upload CSV </span> */}
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
