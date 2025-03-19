/**
 * Utility functions for chart data formatting and manipulation
 */
import { ChartDataPoint } from './types';
import { CHART_COLORS } from './constants';

/**
 * Format number with commas for better readability in tooltips and labels
 * @param value - The number to format
 * @returns Formatted string with commas
 */
export const formatNumberWithCommas = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format a date string, trimming time if present
 * @param dateString - The date string to format
 * @returns Formatted date string (YYYY-MM-DD)
 */
export const formatDateString = (dateString: string): string => {
  if (!dateString) return dateString;
  
  // If it's a date with time (like TikTok's stat_time_day), extract just the date part
  if (dateString.includes(' ')) {
    return dateString.split(' ')[0];
  }
  
  return dateString;
};

/**
 * Transform raw API data into a format suitable for charting
 * @param data - Raw data from API
 * @param metrics - Metrics to include in the transformed data
 * @returns Transformed data array
 */
export const transformChartData = (data: any[], metrics: string[]): ChartDataPoint[] => {
  if (!data || data.length === 0) return [];
  
  console.log('Transforming data for metrics:', metrics);
  
  return data.map(item => {
    // Create a flat result object
    const result: Record<string, any> = {};
    
    // Handle TikTok nested data structure (metrics and dimensions)
    if (item.metrics && item.dimensions) {
      console.log('Detected TikTok data structure with nested metrics and dimensions');
      
      // Flatten dimensions
      Object.entries(item.dimensions).forEach(([key, value]) => {
        // For date fields, format them properly
        if (key === 'stat_time_day' && typeof value === 'string') {
          result[key] = formatDateString(value as string);
        } else {
          result[key] = value;
        }
      });
      
      // Flatten and convert metrics
      Object.entries(item.metrics).forEach(([key, value]) => {
        const numValue = typeof value === 'string' ? parseFloat(value as string) : value;
        result[key] = !isNaN(numValue as number) ? numValue : value;
      });
    } 
    // Handle flat structure (like Meta API)
    else {
      Object.assign(result, item);
      
      // Format date fields
      ['date', 'date_start', 'date_stop', 'stat_time_day'].forEach(dateField => {
        if (typeof result[dateField] === 'string') {
          result[dateField] = formatDateString(result[dateField]);
        }
      });
      
      // Convert string metric values to numbers
      metrics.forEach(metric => {
        if (typeof result[metric] === 'string') {
          const numValue = parseFloat(result[metric]);
          if (!isNaN(numValue)) {
            result[metric] = numValue;
          }
        }
      });
    }
    
    return result;
  });
};

/**
 * Determine the most appropriate field to use as x-axis in charts
 * @param data - Transformed data array
 * @param metrics - Metrics array to exclude from x-axis candidates
 * @param providedKey - Optional key to use if provided
 * @returns The best field to use as x-axis
 */
export const determineXAxisKey = (
  data: ChartDataPoint[], 
  metrics: string[], 
  providedKey?: string
): string => {
  if (providedKey) return providedKey;
  if (!data || data.length === 0) return '';
  
  // Try to find an appropriate x-axis key
  const firstDataItem = data[0];
  
  // If there's a time-related field, prefer that
  const timeFields = ['date', 'date_start', 'day', 'month', 'year', 'stat_time_day'];
  for (const field of timeFields) {
    if (firstDataItem[field] !== undefined) return field;
  }
  
  // Otherwise, use a categorical field
  const categoryFields = [
    'age', 'gender', 'country', 'country_code', 'region', 'dma', 
    'impression_device', 'platform_position', 'publisher_platform',
    'campaign_name', 'adgroup_name', 'ad_name'
  ];
  
  for (const field of categoryFields) {
    if (firstDataItem[field] !== undefined) return field;
  }
  
  // Default to first key that's not a metric
  const keys = Object.keys(firstDataItem);
  for (const key of keys) {
    if (!metrics.includes(key)) return key;
  }
  
  // Last resort
  return Object.keys(firstDataItem)[0];
};

/**
 * Sort data by date if the x-axis is a date field
 * @param data - Data to sort
 * @param xAxisKey - X-axis key to sort by if it's a date field
 * @returns Sorted data array
 */
export const sortChartDataByDate = (data: ChartDataPoint[], xAxisKey: string): ChartDataPoint[] => {
  if (!data || data.length === 0) return data;
  
  if (['date', 'date_start', 'stat_time_day'].includes(xAxisKey)) {
    return [...data].sort((a, b) => {
      if (!a[xAxisKey] || !b[xAxisKey]) return 0;
      return new Date(a[xAxisKey]).getTime() - new Date(b[xAxisKey]).getTime();
    });
  }
  
  return data;
};

// Export constants for reuse
export { CHART_COLORS }; 