// TagInput.tsx
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';


export const TagInput = React.forwardRef(
  ({ value = [], onChange, placeholder, disabled, name, className }, ref) => {
    const [inputValue, setInputValue] = React.useState('');

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault();
        // Add the tag
        const newValue = [...value, inputValue.trim()];
        onChange(newValue);
        setInputValue('');
      } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
        // Remove the last tag when backspace is pressed on empty input
        const newValue = [...value];
        newValue.pop();
        onChange(newValue);
      }
    };

    const removeTag = (index) => {
      const newValue = value.filter((_, i) => i !== index);
      onChange(newValue);
    };

    return (
      <div
        className={cn(
          "flex flex-wrap items-center gap-1 p-1 border rounded-md min-h-10 focus-within:ring-1 focus-within:ring-ring focus-within:border-input",
          disabled && "opacity-50 ",
          className
        )}
      >
        {value.map((tag, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {tag}
            {!disabled && (
              <span
                onClick={() => removeTag(index)}
              >
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                />
              </span>

            )}
          </Badge>
        ))}
        <Input
          ref={ref}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          name={name}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[60px] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2 h-7 border-none"
        />
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';