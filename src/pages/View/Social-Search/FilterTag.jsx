import React from 'react';
import { X } from 'lucide-react';

const FilterTag = ({ value, onRemove }) => (
  <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded text-sm">
    <span>{value}</span>
    <button onClick={onRemove} className="hover:bg-gray-200 rounded-full">
      <X className="w-3 h-3" />
    </button>
  </div>
);

export default FilterTag;