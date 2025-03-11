import React from "react";
import { Button } from "./ui/button";

const Breadcrumb = ({ onClickFunction, pageName, availableEntries }) => {
  return (
    <div className="flex flex-col mb-4 py-2 px-3 sm:flex-row items-center justify-between bg-secondary shadow-sm rounded-md gap-4">
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <h2 className="text-lg font-medium truncate">
          {pageName} ({availableEntries || '0'})
        </h2>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 justify-center w-full sm:w-auto">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button className="flex items-center justify-center w-8 h-8 text-gray-500 border rounded-md hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M18.3332 2.5H1.6665L8.33317 10.3833V15.8333L11.6665 17.5V10.3833L18.3332 2.5Z" 
                stroke="#6E8295" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Search"
            className="w-full sm:w-auto px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col space-y-2 sm:items-center sm:justify-center space-x-2 w-full sm:w-auto sm:flex-row sm:space-y-0">
          <Button 
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-primary bg-muted hover:text-secondary rounded-md border transition-colors" 
            onClick={onClickFunction}
          >
            Add New
          </Button>
          <Button className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors">
            Get Leads
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;