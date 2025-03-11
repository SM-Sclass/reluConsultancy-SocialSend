import React, { useContext } from 'react';
import { RefreshCcw, Filter, Loader, Save } from 'lucide-react';
import FilterSection from './FilterSection';
import { FilterContext } from './FilterContext';
import { FILTERS_CONFIG } from './FilterFieldConfig';

const FilterSidebar = () => {
  const { resetFilters, loading, applyFilters, filters } = useContext(FilterContext);
  
  const handleApplyFilters = () => {
    console.log("Current filters before applying:", filters);
    applyFilters();
  };

  return (
    <div className="w-full sm:w-64  sm:border-r  sm:border-gray-200 p-4 h-full overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <div className="flex gap-2">
            <button
              className="p-1 hover:bg-secondary rounded"
              onClick={resetFilters}
              title="Reset filters"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
            <button
              className="p-1 hover:bg-secondary rounded text-blue-600"
              onClick={handleApplyFilters}
              title="Apply filters"
              disabled={loading}
            >
              <Save className="w-4 h-4" />
            </button>
            <div className="p-1 rounded">
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Filter className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>
        
        {FILTERS_CONFIG.map((filterConfig) => (
          <FilterSection key={filterConfig.id} config={filterConfig} />
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;