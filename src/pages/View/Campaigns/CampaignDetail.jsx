import React, { useState } from 'react';
import CampaignAnalytic from '../../../components/CampaignAnalytic';
import CampaignLeads from '../../../components/CampaignLeads';
import CampaignSequence from '../../../components/CampaignSequence';
import CampaignSchedule from '../../../components/CampaignSchedule';
import CampaignOptions from '../../../components/CampaignOptions';
import { Button } from '@/components/ui/button';

const CampaignDetail = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const tabs = [
    { id: 'analytics', label: 'Analytics' },
    { id: 'leads', label: 'Leads' },
    { id: 'sequences', label: 'Sequences' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'options', label: 'Options' }
  ];
  
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
      <div className="w-full">
        <nav className="flex w-full overflow-x-auto">
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
        </nav>
      </div>
      <div className="p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CampaignDetail;