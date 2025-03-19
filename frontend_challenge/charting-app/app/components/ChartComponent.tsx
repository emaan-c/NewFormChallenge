import React, { useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent } from './ui/card';

// Custom colors for the chart
const CHART_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#0088fe',
  '#00c49f',
  '#ffbb28',
  '#ff8042',
];

// Helper function to format numbers with commas
const formatNumberWithCommas = (value: number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Helper function to format date strings, trimming time if present
const formatDateString = (dateString: string) => {
  if (!dateString) return dateString;
  
  // If it's a date with time (like TikTok's stat_time_day), extract just the date part
  if (dateString.includes(' ')) {
    return dateString.split(' ')[0];
  }
  
  return dateString;
};

interface ChartComponentProps {
  data: any[];
  metrics: string[];
  chartType?: 'bar' | 'line';
  xAxisKey?: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  data,
  metrics,
  chartType = 'bar',
  xAxisKey,
}) => {
  // Transform data to ensure metric values are numeric and flatten nested objects
  const transformedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    console.log('ChartComponent: Transforming data for metrics:', metrics);
    
    return data.map(item => {
      // Create a flat result object
      const result: Record<string, any> = {};
      
      // Handle TikTok nested data structure (metrics and dimensions)
      if (item.metrics && item.dimensions) {
        console.log('ChartComponent: Detected TikTok data structure with nested metrics and dimensions');
        
        // Flatten dimensions
        Object.entries(item.dimensions).forEach(([key, value]) => {
          // For date fields, format them properly
          if (key === 'stat_time_day' && typeof value === 'string') {
            result[key] = formatDateString(value);
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
  }, [data, metrics]);

  useEffect(() => {
    console.log('ChartComponent: Rendering with data', data?.length ? `(${data.length} records)` : '(no data)');
    console.log('ChartComponent: Metrics to display:', metrics);
    console.log('ChartComponent: Chart type:', chartType);
    if (data && data.length > 0) {
      console.log('ChartComponent: Sample data record:', data[0]);
      console.log('ChartComponent: Transformed sample record:', transformedData[0]);
    }
  }, [data, metrics, chartType, transformedData]);

  if (!transformedData || transformedData.length === 0) {
    console.log('ChartComponent: No data available, showing empty state');
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <CardContent>
          <p className="text-center text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Determine x-axis key if not provided
  const determineXAxisKey = (): string => {
    if (xAxisKey) return xAxisKey;
    
    // Try to find an appropriate x-axis key
    const firstDataItem = transformedData[0];
    
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

  const xKey = determineXAxisKey();
  console.log('ChartComponent: Using x-axis key:', xKey);

  // Sort data by date if the x-axis is a date field
  const sortedData = useMemo(() => {
    if (['date', 'date_start', 'stat_time_day'].includes(xKey)) {
      return [...transformedData].sort((a, b) => {
        if (!a[xKey] || !b[xKey]) return 0;
        return new Date(a[xKey]).getTime() - new Date(b[xKey]).getTime();
      });
    }
    return transformedData;
  }, [transformedData, xKey]);

  // Customize chart based on chart type
  if (chartType === 'line') {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sortedData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={xKey} 
                  angle={-45} 
                  textAnchor="end" 
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip formatter={formatNumberWithCommas} />
                <Legend />
                {metrics.map((metric, index) => (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stroke={CHART_COLORS[index % CHART_COLORS.length]}
                    activeDot={{ r: 8 }}
                    name={metric.replace(/_/g, ' ')}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={xKey} 
                angle={-45} 
                textAnchor="end" 
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip formatter={formatNumberWithCommas} />
              <Legend />
              {metrics.map((metric, index) => (
                <Bar
                  key={metric}
                  dataKey={metric}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  name={metric.replace(/_/g, ' ')}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartComponent; 