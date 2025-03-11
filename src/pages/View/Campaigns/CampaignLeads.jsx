import React from 'react'
import { Search } from 'lucide-react';

export default function CampaignLeads() {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-64">
      <div className="bg-indigo-100 p-6 rounded-full mb-6">
        <Search className="w-12 h-12 text-indigo-500" />
      </div>
      <h2 className="text-2xl font-semibold mb-4">Add some leads to get started!</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">Import your contacts or add them manually to begin building your lead database.</p>
      <button className="px-4 py-2 bg-indigo-500 text-white rounded font-medium hover:bg-indigo-600">
        Add Leads
      </button>
    </div>
  );
}
