import React, { useState,useContext } from 'react';
import { ArrowLeft } from 'lucide-react';

const CreateCampaign = ({close}) => {
  const [campaignName, setCampaignName] = useState('Test Campaign');

  const handleNameChange = (e) => {
    setCampaignName(e.target.value);
  };


  return (
    <div className="w-full max-w-full p-4">
      <div className="flex items-start mb-8">
        <button
          className="flex items-center text-blue-600 font-medium"
          onClick={close}
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Go Back
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Let's creat a new campaign!</h1>
        <p className="text-gray-600">What would you like to name it?</p>
      </div>

      <input
        type="text"
        value={campaignName}
        onChange={handleNameChange}
        className="w-full border border-gray-300 rounded-md px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />

      <div className="grid grid-cols-2 gap-4">
        <button
          className="py-3 px-4 border border-gray-300 rounded-md text-primary font-medium hover:bg-muted"
          onClick={close}
        >
          Cancel
        </button>
        <button
          className="py-3 px-4 bg-indigo-500 text-white rounded-md font-medium hover:bg-indigo-600"
          onClick={() => alert(`Campaign name: ${campaignName}`)}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CreateCampaign;