import React from 'react'

function CampaignAnalytic() {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-64">
      <div className="bg-indigo-100 p-10 rounded-full mb-6">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 9H6V19H8V9Z" fill="#4F46E5" />
          <path d="M13 5H11V19H13V5Z" fill="#4F46E5" />
          <path d="M18 13H16V19H18V13Z" fill="#4F46E5" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold mb-4">No analytics data yet</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">Start adding leads and running campaigns to see your performance metrics here.</p>
      <button className="px-4 py-2 bg-indigo-500 text-white rounded font-medium hover:bg-indigo-600">
        View Sample Report
      </button>
    </div>
  )
}

export default CampaignAnalytic