import React, { useState } from 'react'
import Table from '../../../components/Table'
import { Ellipsis, Play } from 'lucide-react'
// import {ReactComponent as Pause} from "../../../Assets/Play.svg"

const ProgressBar = ({ progress }) => {
  const getProgressColor = (value) => {
    if (value < 50) return 'bg-orange-500';
    if (value > 70) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="flex items-center gap-1 w-full">
      <span className="text-sm text-gray-600 min-w-[30px]">{progress}%</span>
      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${getProgressColor(progress)} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const ActionCell = () => {
  const [playPause, setPlayPause] = React.useState(false)

  return (
    <div className="flex items-center space-x-2 justify-center">
      <button
        className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
        onClick={() => setPlayPause(!playPause)}
      >
        {playPause ?
          <Play className='text-green-500' /> : <Play className="w-4 h-4 text-green-600" />}
      </button>
      <div>
        <Ellipsis className="w-4 h-4 text-gray-600" />
      </div>
    </div>
  )
}

function CampaignTable() {
  const [data, setData] = useState([{
    "id": 1,
    "name": "Campaign 1",
    "status": "Active",
    "progress": 80,
    "sent": 100,
    "click": 50,
    "replied": 20,
    "opportunity": 10
  },
  ])
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  const columns = [
    {
      key: 'name',
      header: "Name",
      render: (row) => (
        <span className="flex items-center text-sm font-medium text-primary">
          {row.name}
        </span>
      )
    },
    {
      key: 'status',
      header: "Status",
      render: (row) => (
        <div className={`
          px-2.5 py-1 rounded-lg text-xs font-medium w-fit
          ${row.status === 'Active'
            ? 'bg-blue-700 text-blue-100'
            : 'bg-green-700 text-green-100'
          }
        `}>
          {row.status}
        </div>
      )
    },
    {
      key: 'progress',
      header: "Progress",
      render: (row) => <ProgressBar progress={row.progress} />
    },
    {
      key: 'sent',
      header: "Sent",
      render: (row) => (
        <span className="text-sm text-primary">{row.sent}</span>
      )
    },
    {
      key: 'click',
      header: "Click",
      render: (row) => (
        <span className="text-sm text-primary">{row.click}</span>
      )
    },
    {
      key: 'replied',
      header: "Replied",
      render: (row) => (
        <span className="text-sm text-primary">{row.replied}</span>
      )
    },
    {
      key: 'opportunity',
      header: "Opportunity",
      render: (row) => (
        <span className="text-sm text-primary">{row.opportunity}</span>
      )
    },
    {
      key: 'action',
      header: "Action",
      headerClassName: 'text-center',
      render: (row) => <ActionCell row={row} />
    }
  ];


  const handleRowSelect = (row, isSelected) => {
    setSelectedAccounts(prev =>
      isSelected
        ? [...prev, row]
        : prev.filter(account => account.username !== row.username)
    );
  };

  const handleSelectAll = (rows) => {
    setSelectedAccounts(rows);
  };
  return (
    <div>
      {selectedAccounts.length > 0 && (
        <div className="mb-4 p-3 bg-mutede border rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium text-primary">
            {selectedAccounts.length} account(s) selected
          </span>
        </div>
      )}
      <Table
        columns={columns}
        data={data}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
        selectable={true}
        className='w-full'
      />
    </div>
  )
}

export default CampaignTable