import React, { useState } from 'react';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { DATE_RANGE_ENUMS } from '../lib/api';
import { formatDate } from '../lib/utils';

interface DateRangeSelectorProps {
  onDateRangeChange: (dateRange: { from: string; to: string } | null) => void;
  onDateRangeEnumChange: (dateRangeEnum: string | null) => void;
  dateRangeEnum: string | null;
  dateRange: { from: string; to: string } | null;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onDateRangeChange,
  onDateRangeEnumChange,
  dateRangeEnum,
  dateRange,
}) => {
  const [customFrom, setCustomFrom] = useState<string>(
    dateRange?.from || formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
  );
  const [customTo, setCustomTo] = useState<string>(
    dateRange?.to || formatDate(new Date())
  );

  const handleDateRangeEnumChange = (value: string) => {
    if (value === 'custom') {
      onDateRangeEnumChange(null);
    } else {
      onDateRangeEnumChange(value);
      onDateRangeChange(null);
    }
  };

  const handleCustomRangeApply = () => {
    onDateRangeEnumChange(null);
    onDateRangeChange({
      from: customFrom,
      to: customTo,
    });
  };

  // Format date range enum for display
  const formatDateRangeEnum = (value: string): string => {
    switch (value) {
      case 'last7':
        return 'Last 7 Days';
      case 'last14':
        return 'Last 14 Days';
      case 'last30':
        return 'Last 30 Days';
      case 'lifetime':
        return 'Lifetime';
      default:
        return value;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Date Range</Label>
        <Select value={dateRangeEnum || 'custom'} onValueChange={handleDateRangeEnumChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a preset date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Custom Range</SelectItem>
            {DATE_RANGE_ENUMS.map((value) => (
              <SelectItem key={value} value={value}>
                {formatDateRangeEnum(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(!dateRangeEnum || dateRangeEnum === 'custom') && (
        <Card className="border border-input">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-from">From</Label>
                <input
                  id="date-from"
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="w-full p-2 rounded border border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to">To</Label>
                <input
                  id="date-to"
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="w-full p-2 rounded border border-input"
                />
              </div>
            </div>
            <Button onClick={handleCustomRangeApply} type="button">
              Apply Custom Range
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-muted-foreground">
        {dateRangeEnum ? (
          <span>Using preset: {formatDateRangeEnum(dateRangeEnum)}</span>
        ) : dateRange ? (
          <span>
            Custom range: {dateRange.from} to {dateRange.to}
          </span>
        ) : (
          <span>No date range selected</span>
        )}
      </div>
    </div>
  );
};

export default DateRangeSelector; 