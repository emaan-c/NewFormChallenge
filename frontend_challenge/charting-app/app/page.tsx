"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import MetaForm from './components/MetaForm';
import TikTokForm from './components/TikTokForm';
import ChartComponent from './components/ChartComponent';
import { MetaRequestParams, TikTokRequestParams } from './lib/api';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('meta');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [lastRequestParams, setLastRequestParams] = useState<MetaRequestParams | TikTokRequestParams | null>(null);
  
  // Handle data fetched from Meta form
  const handleMetaDataFetched = (data: any[], params: MetaRequestParams) => {
    console.log('Page: handleMetaDataFetched called with', data.length, 'records');
    console.log('Page: First few data records:', data.slice(0, 3));
    setChartData(data);
    setSelectedMetrics(params.metrics);
    setLastRequestParams(params);
    setError(null);
    console.log('Page: State updated with chart data');
  };

  // Handle data fetched from TikTok form
  const handleTikTokDataFetched = (data: any[], params: TikTokRequestParams) => {
    console.log('Page: handleTikTokDataFetched called with', data.length, 'records');
    console.log('Page: First few data records:', data.slice(0, 3));
    setChartData(data);
    setSelectedMetrics(params.metrics);
    setLastRequestParams(params);
    setError(null);
    console.log('Page: State updated with chart data');
  };

  // Function to create summary for Meta breakdowns
  const generateMetaBreakdownSummary = () => {
    if (chartData.length === 0 || !lastRequestParams || 'dimensions' in lastRequestParams) {
      return {};
    }

    // Check if there are any breakdowns
    const params = lastRequestParams as MetaRequestParams;
    if (!params.breakdowns || params.breakdowns.length === 0) {
      return {};
    }

    // Create summaries for all breakdowns
    const breakdownSummaries: Record<string, any[]> = {};
    
    // Process each breakdown
    params.breakdowns.forEach(breakdown => {
      // Group data by the breakdown value
      const groupedData: Record<string, any[]> = {};
      chartData.forEach(item => {
        // Skip if breakdown doesn't exist in this item
        if (item[breakdown] === undefined) return;
        
        const breakdownValue = item[breakdown] || 'Unknown';
        if (!groupedData[breakdownValue]) {
          groupedData[breakdownValue] = [];
        }
        groupedData[breakdownValue].push(item);
      });
      
      // Skip if no data was grouped for this breakdown
      if (Object.keys(groupedData).length === 0) {
        return;
      }
      
      // Calculate summaries for each breakdown value
      const summaries = Object.entries(groupedData).map(([breakdownValue, items]) => {
        const summarized: Record<string, any> = { [breakdown]: breakdownValue };
        
        // Calculate sums for numeric metrics
        params.metrics.forEach(metric => {
          // Make sure the first item has this metric and it's a number
          if (items[0] && typeof items[0][metric] === 'number') {
            summarized[metric] = items.reduce((sum, item) => sum + (Number(item[metric]) || 0), 0);
            // For averages like CTR, calculate weighted average
            if (metric === 'ctr' || metric === 'conversion_rate') {
              const totalImpressions = items.reduce((sum, item) => sum + (Number(item['impressions']) || 1), 0);
              summarized[metric] = summarized[metric] / totalImpressions * 100;
            }
          } else {
            // For non-numeric metrics, just use a placeholder
            summarized[metric] = items[0]?.[metric] || '-';
          }
        });
        
        return summarized;
      });
      
      // Add this breakdown's summaries to the result
      breakdownSummaries[breakdown] = summaries;
    });
    
    return breakdownSummaries;
  };

  return (
    <main className="container px-4 py-8 mx-auto">
      {/* Platform Selection Tabs */}
      <Tabs 
        defaultValue="meta" 
        className="w-full" 
        onValueChange={(value) => {
          setActiveTab(value);
          // Reset data when switching platforms
          setChartData([]);
          setError(null);
        }}
      >
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="meta">Meta</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
          </TabsList>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-destructive/15 text-destructive p-4 mb-6 rounded-md">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <TabsContent value="meta" className="mt-0">
              <MetaForm
                onDataFetched={handleMetaDataFetched}
                onLoading={setLoading}
                onError={setError}
              />
            </TabsContent>
            <TabsContent value="tiktok" className="mt-0">
              <TikTokForm
                onDataFetched={handleTikTokDataFetched}
                onLoading={setLoading}
                onError={setError}
              />
            </TabsContent>
          </div>
          
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Chart Options</CardTitle>
                <CardDescription>Select chart type and metrics to visualize</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow flex flex-col justify-end">
                    <label className="text-sm font-medium mb-2">Chart Type</label>
                    <Select value={chartType} onValueChange={(value) => setChartType(value as 'bar' | 'line')}>
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
                      onClick={() => {
                        console.log('Page: Clearing chart data');
                        setChartData([]);
                      }}
                      disabled={chartData.length === 0}
                    >
                      Clear Chart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Loading State */}
            {loading ? (
              <Card className="w-full h-96 flex items-center justify-center">
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">Loading data...</p>
                  </div>
                </CardContent>
              </Card>
            ) : chartData.length > 0 ? (
              <ChartComponent
                data={chartData}
                metrics={selectedMetrics}
                chartType={chartType}
              />
            ) : (
              <Card className="w-full h-96 flex items-center justify-center">
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Select parameters and click "Fetch Data" to generate a chart
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Breakdown Summary for Meta */}
            {activeTab === 'meta' && chartData.length > 0 && lastRequestParams && !('dimensions' in lastRequestParams) && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Breakdown Summary</CardTitle>
                  <CardDescription>
                    Summary metrics for selected breakdowns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const breakdownSummaries = generateMetaBreakdownSummary();
                    const breakdownKeys = Object.keys(breakdownSummaries);
                    
                    if (breakdownKeys.length === 0) {
                      return (
                        <p className="text-center text-muted-foreground mt-4">
                          No breakdown data available. Try selecting breakdowns in your Meta query.
                        </p>
                      );
                    }
                    
                    return (
                      <div className="space-y-8">
                        {breakdownKeys.map(breakdown => {
                          const summaries = breakdownSummaries[breakdown];
                          
                          return (
                            <div key={breakdown} className="space-y-3">
                              <h3 className="text-lg font-medium">
                                {breakdown
                                  .split('_')
                                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(' ')} Breakdown
                              </h3>
                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-sm">
                                  <thead>
                                    <tr className="border-b">
                                      {summaries.length > 0 && Object.keys(summaries[0]).map((key) => (
                                        <th key={key} className="p-2 text-left font-medium">
                                          {key === breakdown ? 
                                            key.split('_')
                                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                              .join(' ') : 
                                            key
                                          }
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {summaries.map((row, index) => (
                                      <tr key={index} className="border-b">
                                        {Object.entries(row).map(([key, value], i) => (
                                          <td key={i} className="p-2">
                                            {key === breakdown && typeof value === 'string' ? 
                                              // Format breakdown values if they contain underscores
                                              String(value).includes('_') ? 
                                                String(value)
                                                  .split('_')
                                                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                  .join(' ') :
                                                String(value) :
                                              typeof value === 'number' ? 
                                                (key.includes('rate') || key === 'ctr' ? 
                                                  `${value.toFixed(2)}%` : 
                                                  value.toLocaleString()) : 
                                                String(value)}
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
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Tabs>
    </main>
  );
}
