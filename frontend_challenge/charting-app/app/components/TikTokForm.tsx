import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import MultiSelect from './MultiSelect';
import DateRangeSelector from './DateRangeSelector';
import { 
  TIKTOK_METRICS,
  TIKTOK_DIMENSIONS,
  TIKTOK_LEVELS,
  TIKTOK_REPORT_TYPES,
  TikTokRequestParams,
  fetchTikTokData
} from '../lib/api';

interface TikTokFormProps {
  onDataFetched: (data: any[], params: TikTokRequestParams) => void;
  onLoading: (isLoading: boolean) => void;
  onError: (error: string | null) => void;
}

const TikTokForm: React.FC<TikTokFormProps> = ({ onDataFetched, onLoading, onError }) => {
  const [metrics, setMetrics] = useState<string[]>(['spend', 'impressions', 'clicks', 'ctr']);
  const [dimensions, setDimensions] = useState<string[]>(['stat_time_day']);
  const [level, setLevel] = useState<string>('AUCTION_ADVERTISER');
  const [reportType, setReportType] = useState<string>('BASIC');
  const [dateRangeEnum, setDateRangeEnum] = useState<string | null>('last30');
  const [dateRange, setDateRange] = useState<{ from: string; to: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (metrics.length === 0) {
      onError('At least one metric must be selected');
      return;
    }
    
    if (dimensions.length === 0) {
      onError('At least one dimension must be selected');
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
    const params: TikTokRequestParams = {
      metrics,
      dimensions,
      level: level as 'AUCTION_ADVERTISER' | 'AUCTION_AD' | 'AUCTION_CAMPAIGN',
      reportType: reportType as 'BASIC' | 'AUDIENCE',
      dateRangeEnum: dateRange ? undefined : dateRangeEnum as any,
      dateRange: dateRange || undefined,
    };
    
    console.log('TikTokForm: Submitting request with params:', params);
    
    try {
      // Fetch data
      const { data, error } = await fetchTikTokData(params);
      
      console.log('TikTokForm: Received response:', { data, error });
      
      if (error) {
        console.error('TikTokForm: Error fetching data:', error);
        onError(error);
      } else if (!data || data.length === 0) {
        console.error('TikTokForm: No data returned from API');
        onError('No data returned from the API. Please try different parameters.');
      } else {
        console.log('TikTokForm: Setting data with', data.length, 'records');
        onDataFetched(data, params);
      }
    } catch (error) {
      console.error('TikTokForm: Exception during fetch:', error);
      onError('Failed to fetch data. Please try again.');
    } finally {
      setIsSubmitting(false);
      onLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>TikTok Ad Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Metrics Selection */}
          <MultiSelect
            label="Metrics"
            options={TIKTOK_METRICS}
            selectedValues={metrics}
            onChange={setMetrics}
            minSelected={1}
          />
          
          {/* Dimensions Selection */}
          <div>
            <MultiSelect
              label="Dimensions"
              options={TIKTOK_DIMENSIONS}
              selectedValues={dimensions}
              onChange={setDimensions}
              minSelected={1}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tip: "stat_time_day" works best for time-based charts. Some dimension combinations may not return data.
            </p>
          </div>
          
          {/* Level Selection */}
          <div className="space-y-2">
            <Label>Level</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {TIKTOK_LEVELS.map((lvl) => (
                  <SelectItem key={lvl} value={lvl}>
                    {lvl.replace('AUCTION_', '')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Report Type Selection */}
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BASIC">Basic</SelectItem>
                <SelectItem value="AUDIENCE">Audience</SelectItem>
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
            {isSubmitting ? 'Fetching Data...' : 'Fetch TikTok Data'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TikTokForm; 