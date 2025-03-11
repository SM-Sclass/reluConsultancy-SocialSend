import React, { useState, useContext } from 'react';
import { Instagram } from 'lucide-react';
import Table from '../../../components/Table';
import { useQuery } from '@tanstack/react-query';
import { fetchTargetByFilterId } from './Service/User.service';
import { FilterContext } from './FilterContext';

const columns = [
  {
    key: 'platform',
    header: 'Platform',
    render: () => (
      <div className="flex items-center gap-2">
        <Instagram size={16} />
        Instagram
      </div>
    ),
  },
  {
    key: 'username',
    header: 'Username',
  },
  {
    key: 'followers_count',
    header: 'Followers',
  },
  {
    key: 'following_count',
    header: 'Following',
  },
  {
    key: 'keywords in bio',
    header: 'Keywords in Bio',
  }
]


const UserTable = () => {
  const {filterId} = useContext(FilterContext);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  const { isPending, error, data } = useQuery({
    queryKey: ['filteredUserAccounts',filterId],
    queryFn: () => fetchTargetByFilterId(filterId),
  })

  if (isPending) {
    return <div className="p-4 text-center">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

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
        data={data || []}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
        selectable={true}
        className="w-full"
      />
    </div>
  );
};

export default UserTable;