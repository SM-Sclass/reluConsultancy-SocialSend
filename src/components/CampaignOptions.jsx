import React, { useState } from 'react'

function CampaignOptions() {
  const [accountAdded, setAccountAdded] = useState(false);
  const [stopOnReply, setStopOnReply] = useState(true);
  const [trackOpens, setTrackOpens] = useState(false);
  const [linkTracking, setLinkTracking] = useState(false);
  const [disableOpenTracking, setDisableOpenTracking] = useState(false);
  const [textOnly, setTextOnly] = useState(false);

  return (
    <div className="w-full p-4 = rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Section */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">Account to use</h2>
          <div className="flex items-center gap-2">
            {!accountAdded ? (
              <>
                <input
                  type="text"
                  placeholder="Add at least 1 account"
                  className="flex-grow p-2 border rounded-md"
                />
                <button className="text-blue-600 font-medium">
                  Add Account
                </button>
              </>
            ) : (
              <div className="flex justify-between w-full">
                <span>account@example.com</span>
                <button className="text-red-500">Remove</button>
              </div>
            )}
          </div>
        </div>

        {/* Stop Sending Message Section */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">Stop sending message on reply</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Stop sending message to a lead if a reply has received</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={stopOnReply}
                onChange={() => setStopOnReply(!stopOnReply)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>

        {/* Open Tracking Section */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">Open tracking</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Track message opens</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={trackOpens}
                  onChange={() => setTrackOpens(!trackOpens)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Link tracking</span>
              <input
                type="checkbox"
                checked={linkTracking}
                onChange={() => setLinkTracking(!linkTracking)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Delivery Optimization Section */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Delivery Optimization</h2>
            <span className="text-xs px-2 py-1 bg-pink-100 text-pink-500 rounded">Recommended</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">Disable open tracking</span>
              <input
                type="checkbox"
                checked={disableOpenTracking}
                onChange={() => setDisableOpenTracking(!disableOpenTracking)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Send messages as text-only (no HTML)</span>
              <input
                type="checkbox"
                checked={textOnly}
                onChange={() => setTextOnly(!textOnly)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex justify-end mt-8 gap-4">
        <button className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          Save
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Launch
        </button>
      </div>
    </div>
  )
}

export default CampaignOptions