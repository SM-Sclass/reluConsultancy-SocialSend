import { useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

export default function CampaignLeads({ initialLeads }) {
  const [leads, setLeads] = useState(initialLeads || []);
  const [addLeadsOpen, setAddLeadsOpen] = useState(false);

  // Function to add a lead
  const addLead = useCallback((newLead) => {
    setLeads((prevLeads) => [...prevLeads, newLead]);
  }, []);

  // Function to add multiple leads (e.g., from CSV)
  const addMultipleLeads = useCallback((newLeads) => {
    setLeads((prevLeads) => [...prevLeads, ...newLeads]);
  }, []);

  // Function to handle CSV upload
  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').slice(1); // Skip headers
        const parsedLeads = rows
          .filter((row) => row.trim() !== '')
          .map((row) => {
            const [name, email] = row.split(',').map((value) => value.trim());
            return { id: Date.now() + Math.random(), name, email };
          });
        addMultipleLeads(parsedLeads);
      };
      reader.readAsText(file);
    }
  };

  // Function to add a lead from social search
  const addLeadFromSocialSearch = (socialLead) => {
    addLead({ id: Date.now(), ...socialLead });
  };

  return (
    <>
      <div className="flex flex-col items-center min-h-64">
        {addLeadsOpen ? (
          <div className='flex flex-col items-center justify-start w-full'>
            <div className="flex items-start mb-8 w-full">
              <Button
                variant="ghost"
                className="flex items-center text-blue-600 font-medium"
                onClick={() => setAddLeadsOpen(false)}
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </Button>
            </div>
            <div>
            </div>
          </div>
        ) :
          leads.length === 0 ? (
            <div className='p-8'>
              <h2 className="text-2xl font-semibold mb-4">Add some leads to get started!</h2>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                Import your targets or add them manually to begin building your lead database.
              </p>
              <button
                onClick={() => setAddLeadsOpen(true)}
                className="px-4 py-2 bg-indigo-500 text-white rounded font-medium hover:bg-indigo-600"
              >
                Add Leads
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Leads ({leads.length})</h2>
              <ul className="mb-6">
                {leads.map((lead) => (
                  <li key={lead.id} className="flex justify-between items-center mb-2">
                    <span>{lead.name}</span>
                    <span className="text-gray-500 text-sm">{lead.email}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setAddLeadsOpen(true)}
                className="px-4 py-2 bg-indigo-500 text-white rounded font-medium hover:bg-indigo-600"
              >
                Add More Leads
              </button>
            </div>
          )}
      </div>


    </>
  );
}