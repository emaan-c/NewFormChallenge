import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { generateMetaBreakdownSummary } from '../lib/utils';
import type { BreakdownSummaryProps } from './types';

/**
 * Component to display summary metrics for Meta breakdowns
 */
const BreakdownSummary: React.FC<BreakdownSummaryProps> = ({ chartData, params }) => {
  // Generate the breakdown summaries using the utility function
  const breakdownSummaries = generateMetaBreakdownSummary(chartData, params);
  const breakdownKeys = Object.keys(breakdownSummaries);
  
  // If no breakdowns are available, show a message
  if (breakdownKeys.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Breakdown Summary</CardTitle>
          <CardDescription>
            Summary metrics for selected breakdowns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mt-4">
            No breakdown data available. Try selecting breakdowns in your Meta query.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Format number for display
  const formatNumber = (value: any) => {
    if (typeof value !== 'number') return value;
    
    // Format as percentage for rate metrics
    if (typeof value === 'number' && (String(value).includes('rate') || String(value).includes('ctr'))) {
      return `${value.toFixed(2)}%`;
    }
    
    // Format with commas for large numbers
    return value.toLocaleString(undefined, { 
      maximumFractionDigits: 2 
    });
  };
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Breakdown Summary</CardTitle>
        <CardDescription>
          Summary metrics for selected breakdowns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {breakdownKeys.map(breakdown => {
            const summaries = breakdownSummaries[breakdown];
            
            return (
              <div key={breakdown} className="space-y-3">
                <h3 className="text-lg font-medium">
                  {breakdown.charAt(0).toUpperCase() + breakdown.slice(1).replace(/_/g, ' ')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-1 text-left">{breakdown}</th>
                        {params?.metrics.map(metric => (
                          <th key={metric} className="py-2 px-2 text-right">
                            {metric.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {summaries.map((row, i) => (
                        <tr key={i} className="border-b border-muted">
                          <td className="py-2 px-1">
                            {row[breakdown]}
                          </td>
                          {params?.metrics.map(metric => (
                            <td key={metric} className="py-2 px-2 text-right">
                              {formatNumber(row[metric])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BreakdownSummary; 