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
import { 
  formatNumberWithCommas, 
  formatDateString, 
  transformChartData, 
  determineXAxisKey, 
  sortChartDataByDate, 
  CHART_COLORS 
} from '../lib/chartUtils';
import type { ChartDataPoint } from '../lib/types';

/**
 * Component for displaying data in chart format (bar or line)
 */
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
  // Transform data for charting
  const transformedData = useMemo(() => 
    transformChartData(data, metrics), 
    [data, metrics]
  );

  // Log component rendering info
  useEffect(() => {
    console.log('ChartComponent: Rendering with data', data?.length ? `(${data.length} records)` : '(no data)');
    console.log('ChartComponent: Metrics to display:', metrics);
    console.log('ChartComponent: Chart type:', chartType);
    if (data && data.length > 0) {
      console.log('ChartComponent: Sample data record:', data[0]);
      console.log('ChartComponent: Transformed sample record:', transformedData[0]);
    }
  }, [data, metrics, chartType, transformedData]);

  // Show empty state when no data is available
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

  // Determine which field to use for x-axis
  const xKey = determineXAxisKey(transformedData, metrics, xAxisKey);
  console.log('ChartComponent: Using x-axis key:', xKey);

  // Sort data by date if applicable
  const sortedData = useMemo(() => 
    sortChartDataByDate(transformedData, xKey), 
    [transformedData, xKey]
  );

  // Render line chart
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

  // Render bar chart (default)
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