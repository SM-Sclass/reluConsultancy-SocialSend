// MultiSelectDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';


export const MultiSelectDropdown = React.forwardRef(
  ({ value = [], onChange, options = [], title, disabled, className }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle outside click to close dropdown
    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleOutsideClick);
      }

      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, [isOpen]);

    const toggleOption = (option) => {
      const newValue = [...value];
      const index = newValue.indexOf(option);
      
      if (index > -1) {
        // Remove if already selected
        newValue.splice(index, 1);
      } else {
        // Add if not selected
        newValue.push(option);
      }
      
      onChange(newValue);
    };

    return (
      <div ref={dropdownRef} className={cn("relative w-full", className)}>
        <Button
          ref={ref}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal text-left",
            isOpen && "border-ring"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="truncate overflow-hidden w-40">
            {value.length > 0 ? value.join(', ') : `Select ${title}`}
          </div>
          {isOpen ? (
            <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 rounded-md border bg-background shadow-md">
            <div className="max-h-60 overflow-auto p-1 space-y-1">
              {options.map((option) => (
                <div
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                    value.includes(option) ? "bg-accent text-accent-foreground" : ""
                  )}
                >
                  <span className="flex-1">{option}</span>
                  {value.includes(option) && (
                    <Check className="absolute h-4 w-4 ml-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

MultiSelectDropdown.displayName = 'MultiSelectDropdown';