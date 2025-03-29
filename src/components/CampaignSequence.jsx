import React from 'react'

function CampaignSequence() {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-64">
      <div className="bg-indigo-100 p-6 rounded-full mb-6">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 5H20M4 12H20M4 19H20" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
          <circle cx="9" cy="5" r="2" fill="#4F46E5" />
          <circle cx="14" cy="12" r="2" fill="#4F46E5" />
          <circle cx="7" cy="19" r="2" fill="#4F46E5" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Create your first sequence</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">Set up automated email sequences to nurture your leads through the sales funnel.</p>
      <button className="px-4 py-2 bg-indigo-500 text-white rounded font-medium hover:bg-indigo-600">
        Create Sequence
      </button>
    </div>
  )
}

export default CampaignSequence