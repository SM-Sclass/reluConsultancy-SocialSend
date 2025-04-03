import React, { useState } from 'react';
import CampaignAnalytic from '../../../components/CampaignAnalytic';
import CampaignLeads from '../../../components/CampaignLeads';
import CampaignSequence from '../../../components/CampaignSequence';
import CampaignSchedule from '../../../components/CampaignSchedule';
import CampaignOptions from '../../../components/CampaignOptions';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

const CampaignDetail = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const navigate = useNavigate();
  // const tabs = [
  //   { id: 'analytics', label: 'Analytics' },
  //   { id: 'leads', label: 'Leads' },
  //   { id: 'sequences', label: 'Sequences' },
  //   { id: 'schedule', label: 'Schedule' },
  //   { id: 'options', label: 'Options' }
  // ];
  
  const renderTabContent = () => {
    switch(activeTab) {
      case 'analytics':
        return <CampaignAnalytic />;
      case 'leads':
        return <CampaignLeads />;
      case 'sequences':
        return <CampaignSequence />;
      case 'schedule':
        return <CampaignSchedule />;
      case 'options':
        return <CampaignOptions />;
      default:
        return <CampaignLeads />;
    }
  };
  
  return (
    <div className="w-full p-2 rounded-lg shadow-sm border border-secondary">
      <div className="flex items-start mb-8">
        <button
          className="flex items-center text-blue-600 font-medium"
          // onClick={()=>setCampaignComponent("analytics")}
          onClick={()=> navigate("/Campaigns")}
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
      </div>
      <div className="w-full">
        {/* <nav className="flex w-full overflow-x-auto">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              className={`px-4 py-3 text-sm font-medium rounded-none cursor-pointer ${
                activeTab === tab.id 
                  ? 'text-primary border-b-2 border-indigo-600' 
                  : 'text-neutral-400 '
              }`}
              onClick={() => setActiveTab(tab.id)}
              variant="secondary"
            >
              {tab.label}
            </Button>
          ))}
        </nav> */}
      </div>
      <div className="p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CampaignDetail;