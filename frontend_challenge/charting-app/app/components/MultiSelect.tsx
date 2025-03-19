import React, { useState } from 'react';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent } from './ui/card';

interface MultiSelectProps {
  options: string[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  label: string;
  className?: string;
  minSelected?: number;
  maxSelected?: number;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  label,
  className = '',
  minSelected = 0,
  maxSelected = Infinity,
}) => {
  const handleToggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      // Prevent deselection if we're at the minimum
      if (selectedValues.length <= minSelected) {
        return;
      }
      onChange(selectedValues.filter((item) => item !== option));
    } else {
      // Prevent selection if we're at the maximum
      if (selectedValues.length >= maxSelected) {
        return;
      }
      onChange([...selectedValues, option]);
    }
  };

  // Format option display name
  const formatOptionName = (option: string): string => {
    return option
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <Card className="border border-input">
        <CardContent className="p-2 max-h-60 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2 p-2 hover:bg-accent hover:text-accent-foreground rounded">
              <Checkbox
                id={`${label}-${option}`}
                checked={selectedValues.includes(option)}
                onCheckedChange={() => handleToggleOption(option)}
                disabled={!selectedValues.includes(option) && selectedValues.length >= maxSelected}
              />
              <Label
                htmlFor={`${label}-${option}`}
                className="text-sm cursor-pointer flex-grow"
              >
                {formatOptionName(option)}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        Selected: {selectedValues.length} {minSelected > 0 && `(min: ${minSelected})`} {maxSelected < Infinity && `(max: ${maxSelected})`}
      </p>
    </div>
  );
};

export default MultiSelect; 