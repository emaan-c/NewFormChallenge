import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import MultiSelect from './MultiSelect';
import DateRangeSelector from './DateRangeSelector';
import { 
  META_METRICS,
  META_BREAKDOWNS,
  META_LEVELS,
  META_TIME_INCREMENTS,
  fetchMetaData
} from '../lib/api';
import type { MetaRequestParams } from '../lib/types';
import type { MetaFormProps } from './types';

/**
 * Form component for Meta ad data parameters
 */
const MetaForm: React.FC<MetaFormProps> = ({ onDataFetched, onLoading, onError }) => {
  const [metrics, setMetrics] = useState<string[]>(['spend', 'impressions', 'clicks']);
  const [breakdowns, setBreakdowns] = useState<string[]>(['age']);
  const [level, setLevel] = useState<string>('campaign');
  const [timeIncrement, setTimeIncrement] = useState<string>('7');
  const [dateRangeEnum, setDateRangeEnum] = useState<string | null>('last30');
  const [dateRange, setDateRange] = useState<{ from: string; to: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Handle form submission - validate and fetch data from API
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (metrics.length === 0) {
      onError('At least one metric must be selected');
      return;
    }
    
    if (!dateRangeEnum && !dateRange) {
      onError('Please select a date range');
      return;
    }
    
    // Clear any previous errors
    onError(null);
    
    // Set loading state
    setIsSubmitting(true);
    onLoading(true);
    
    // Prepare request parameters
    const params: MetaRequestParams = {
      metrics,
      level: level as 'account' | 'campaign' | 'adset' | 'ad',
      breakdowns: breakdowns.length > 0 ? breakdowns : undefined,
      timeIncrement: timeIncrement !== 'none' ? timeIncrement as any : undefined,
      dateRangeEnum: dateRange ? undefined : dateRangeEnum as any,
      dateRange: dateRange || undefined,
    };
    
    console.log('MetaForm: Submitting request with params:', params);
    
    try {
      // Fetch data
      const { data, error } = await fetchMetaData(params);
      
      console.log('MetaForm: Received response:', { data, error });
      
      if (error) {
        console.error('MetaForm: Error fetching data:', error);
        onError(error);
      } else if (!data || data.length === 0) {
        console.error('MetaForm: No data returned from API');
        onError('No data returned from the API. Please try different parameters.');
      } else {
        console.log('MetaForm: Setting data with', data.length, 'records');
        onDataFetched(data, params);
      }
    } catch (error) {
      console.error('MetaForm: Exception during fetch:', error);
      onError('Failed to fetch data. Please try again.');
    } finally {
      setIsSubmitting(false);
      onLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meta Ad Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Metrics Selection */}
          <MultiSelect
            label="Metrics"
            options={META_METRICS}
            selectedValues={metrics}
            onChange={setMetrics}
            minSelected={1}
          />
          
          {/* Breakdowns Selection */}
          <MultiSelect
            label="Breakdowns"
            options={META_BREAKDOWNS}
            selectedValues={breakdowns}
            onChange={setBreakdowns}
          />
          
          {/* Level Selection */}
          <div className="space-y-2">
            <Label>Level</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {META_LEVELS.map((lvl) => (
                  <SelectItem key={lvl} value={lvl}>
                    {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Time Increment Selection */}
          <div className="space-y-2">
            <Label>Time Increment</Label>
            <Select value={timeIncrement} onValueChange={setTimeIncrement}>
              <SelectTrigger>
                <SelectValue placeholder="Select time increment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {META_TIME_INCREMENTS.map((inc) => (
                  <SelectItem key={inc} value={inc}>
                    {inc === '1' ? 'Daily' :
                     inc === '7' ? 'Weekly' :
                     inc === 'all_days' ? 'All Days' :
                     inc.charAt(0).toUpperCase() + inc.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Range Selection */}
          <DateRangeSelector
            dateRangeEnum={dateRangeEnum}
            dateRange={dateRange}
            onDateRangeEnumChange={setDateRangeEnum}
            onDateRangeChange={setDateRange}
          />
          
          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Fetching Data...' : 'Fetch Meta Data'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MetaForm; 