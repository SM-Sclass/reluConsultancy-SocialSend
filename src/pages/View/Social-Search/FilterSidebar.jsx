import React from 'react';
import { RefreshCcw, Loader, Save } from 'lucide-react';
import FilterSection from './FilterSection';
import { FILTERS_CONFIG } from './FilterFieldConfig';
import { Button } from '@/components/ui/button';

const FilterSidebar = ({ filters, updateFilter, resetFilters, loading, applyFilters }) => {

  return (
    <div className="w-full sm:w-64  sm:border-r  sm:border-gray-200 p-4 h-full overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <div className="flex gap-2">
            <Button
              className="hover:bg-secondary rounded cursor-pointer w-fit"
              onClick={resetFilters}
              title="Reset filters"
              variant="ghost"
            >
              <RefreshCcw className="w-5 h-5" />
            </Button>
            <Button
              className="hover:bg-secondary rounded text-blue-600 cursor-pointer"
              onClick={applyFilters}
              title="Apply filters"
              disabled={loading}
              variant="ghost"
            >
              <Save className="w-5 h-5" />
            </Button>
            <div className="p-1 rounded">
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                ""
              )}
            </div>  
          </div>
        </div>
        
        {FILTERS_CONFIG.map((filterConfig) => (
          <FilterSection 
          key={filterConfig.id} 
          config={filterConfig}
            filters={filters} 
            updateFilter={updateFilter}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;