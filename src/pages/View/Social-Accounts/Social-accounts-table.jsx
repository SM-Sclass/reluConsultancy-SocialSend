import React, { useState, useEffect } from 'react';
import { Instagram, Facebook, Twitter, Loader2 } from 'lucide-react';
import Table from '../../../components/Table';
import { userArray } from '../../../Data/Users';

const PlatformTable = ({ buttonFunction }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      fetchAndTransformData();
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const fetchAndTransformData = () => {
    const storedCsvData = JSON.parse(localStorage.getItem('userInstaCsvCredentials')) || [];
    const storedManualData = JSON.parse(localStorage.getItem('userInstaCredentials'));

    const transformedManualData = storedManualData ? [{
      platform: 'Instagram',
      username: storedManualData.username,
      dailyMessages: '0/50',
      dailyConnections: '0/50',
      warmupEnabled: false
    }] : [];

    const transformedCsvData = storedCsvData.map(item => ({
      platform: 'Instagram',
      username: item.username,
      dailyMessages: '0/50',
      dailyConnections: '0/50',
      warmupEnabled: false
    }));

    const allData = [...data, ...transformedCsvData, ...transformedManualData];
    const uniqueData = Array.from(
      new Map(allData.map(item => [item.username, item])).values()
    );

    setData(uniqueData);
  };
  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'tiktok':
        return <span className="font-bold text-lg">𝓣</span>;
      default:
        return null;
    }
  };

  const handleClick = (username) => (e) => {
    e.preventDefault();
    buttonFunction(username);
  };
  // ...existing fetchAndTransformData and useEffect code...

  const columns = [
    {
      key: 'platform',
      header: 'Platform',
      render: (row) => (
        <div className="flex items-center">
          {getPlatformIcon(row.platform)}
          <span className="ml-2 text-sm text-primary">{row.platform}</span>
        </div>
      )
    },
    {
      key: 'username',
      header: 'Username',
      render: (row) => (
        <button
          onClick={handleClick(row.username)}
          className="text-sm text-primary text-start hover:text-blue-500 w-full"
        >
          {row.username}
        </button>
      )
    },
    {
      key: 'dailyMessages',
      header: 'Daily Messages'
    },
    {
      key: 'dailyConnections',
      header: 'Daily Connections'
    },
    {
      key: 'warmupEnabled',
      header: 'Warmup Enabled',
      render: (row) => (
        <span className={row.warmupEnabled ? "text-green-600" : "text-red-600"}>
          {row.warmupEnabled ? "Yes" : "No"}
        </span>
      )
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

  if (isLoading) {
    return (
      <div>
        <div className="bg-muted shadow-sm rounded-lg overflow-hidden min-h-[200px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

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
        data={userArray}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
        selectable={true}
        className="w-full"
      />
    </div>
  );
};

export default PlatformTable;