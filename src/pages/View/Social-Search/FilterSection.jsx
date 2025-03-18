import React, { useState, useEffect, useContext } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import FilterTag from './FilterTag';
import { FilterContext } from './FilterContext';
import { FILTER_TYPES } from './FilterFieldConfig';

const FilterSection = ({ config }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [value, setValue] = useState('');
  const [tags, setTags] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { filters, updateFilters } = useContext(FilterContext);

  const { id, title, type, options, placeholder } = config;

  useEffect(() => {
    const contextValue = filters[id];
    if (contextValue !== undefined) {
      if (type === FILTER_TYPES.TAG || type === FILTER_TYPES.DROPDOWN) {
        setTags(Array.isArray(contextValue) ? contextValue : []);
      } else {
        setValue(contextValue?.toString() || '');
      }
    }
  }, [filters, id, type]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    
    if (type === FILTER_TYPES.NUMERIC) {
      if (newValue === '' || /^\d+$/.test(newValue)) {
        setValue(newValue);
        updateFilters(id, newValue ? parseInt(newValue, 10) : null);
      }
    } else {
      setValue(newValue);
      updateFilters(id, newValue);
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      const newTags = [...tags, value.trim()];
      setTags(newTags);
      setValue('');
      updateFilters(id, newTags);
    }
    
    if (e.key === 'Backspace' && !value && tags.length > 0) {
      const newTags = [...tags];
      newTags.pop();
      setTags(newTags);
      updateFilters(id, newTags);
    }
  };

  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    updateFilters(id, newTags);
  };

  const handleDropdownSelect = (option) => {
    const newTags = tags.includes(option) 
      ? tags.filter(tag => tag !== option)
      : [...tags, option];
    setTags(newTags);
    updateFilters(id, newTags);
    setIsDropdownOpen(false);
  };

  const renderFilterInput = () => {
    switch (type) {
      case FILTER_TYPES.DROPDOWN:
        return (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full pl-3 pr-10 py-2 border border-secondary rounded text-left text-sm flex items-center justify-between"
            >
              {tags.length > 0 ? tags.join(', ') : `Select ${title}`}
              {isDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-secondary text-primary border border-gray-200 rounded shadow-lg">
                {options?.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleDropdownSelect(option)}
                    className={`px-3 py-2 text-primary bg-secondary hover:bg-muted cursor-pointer text-sm 
                      ${tags.includes(option) ? 'bg-blue-50 text-blue-600' : ''}`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case FILTER_TYPES.NUMERIC:
      case FILTER_TYPES.TEXT:
        return (
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            className="w-full pl-3 pr-3 py-2 border border-secondary rounded focus:ring-1 focus:ring-blue-500 text-sm"
            placeholder={placeholder || `Enter ${title.toLowerCase()}`}
          />
        );

      case FILTER_TYPES.TAG:
        return (
          <div className="min-h-[38px] w-full pl-3 pr-3 py-1 border border-secondary rounded focus-within:ring-1 focus-within:ring-blue-500 flex flex-wrap gap-1 items-center">
            {tags.map((tag, index) => (
              <FilterTag
                key={index}
                value={tag}
                onRemove={() => removeTag(index)}
              />
            ))}
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleTagInput}
              className="flex-1 min-w-[60px] outline-none text-sm py-1"
              placeholder={tags.length === 0 ? `Filter by ${title.toLowerCase()}` : ''}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full"
      >
        <span className="text-sm font-medium text-primary">{title}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="relative">
          {renderFilterInput()}
        </div>
      )}
    </div>
  );
};

export default FilterSection;