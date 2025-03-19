import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ChartOptionsProps {
  chartType: 'bar' | 'line';
  onChartTypeChange: (value: 'bar' | 'line') => void;
  onClearChart: () => void;
  hasData: boolean;
}

/**
 * Component for chart options like chart type and clearing chart
 */
const ChartOptions: React.FC<ChartOptionsProps> = ({
  chartType,
  onChartTypeChange,
  onClearChart,
  hasData
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Chart Options</CardTitle>
        <CardDescription>Select chart type and metrics to visualize</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow flex flex-col justify-end">
            <label className="text-sm font-medium mb-2">Chart Type</label>
            <Select 
              value={chartType} 
              onValueChange={(value) => onChartTypeChange(value as 'bar' | 'line')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-grow flex flex-col justify-end">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={onClearChart}
              disabled={!hasData}
            >
              Clear Chart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartOptions; 