import React, { useState } from 'react';
import { Checkbox } from './ui/checkbox';

const Table = ({
  columns,
  data,
  onRowSelect,
  onSelectAll,
  selectable = true,
}) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    const newSelected = new Set();

    if (checked) {
      data.forEach((row, index) => newSelected.add(index));
    }

    setSelectedRows(newSelected);
    if (onSelectAll) {
      onSelectAll(checked ? data : []);
    }
  };

  // Updated to receive checked state directly
  const handleSelectRow = (index) => (checked) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(index);
      newSelected.size === data.length && setSelectAll(true);
    } else {
      newSelected.delete(index);
      setSelectAll(false);
    }

    setSelectedRows(newSelected);
    if (onRowSelect) {
      onRowSelect(data[index], checked);
    }
  };

  return (
    <div className="w-full">
      <div className="relative overflow-x-auto shadow-sm rounded-lg">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-muted">
                <tr className='h-12'>
                  {selectable && (
                    <th className="sticky left-0 z-10 px-3 py-3 flex items-center justify-center h-12">
                      <Checkbox
                        className="w-4 h-4 rounded text-primary bg-secondary border-gray-300"
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                  )}
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className={`px-2 py-3 text-left text-sm font-medium text-primary ${column.headerClassName}`}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-secondary">
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className=" h-11">
                    {selectable && (
                      <td className="sticky left-0 z-10  px-3 py-2 flex items-center justify-center h-11">
                        <Checkbox
                          className="table-checkbox w-4 h-4 rounded border-gray-300 text-primary accent-primary"
                          checked={selectedRows.has(rowIndex)}
                          onCheckedChange={handleSelectRow(rowIndex)}
                        />
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="whitespace-nowrap px-3 py-2 text-primary">
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;