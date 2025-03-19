"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent } from './components/ui/card';
import MetaForm from './components/MetaForm';
import TikTokForm from './components/TikTokForm';
import ChartComponent from './components/ChartComponent';
import ChartOptions from './components/ChartOptions';
import BreakdownSummary from './components/BreakdownSummary';
import type { MetaRequestParams, TikTokRequestParams } from './lib/types';

/**
 * Main application component
 */
export default function Home() {
  // Track active platform tab
  const [activeTab, setActiveTab] = useState<string>('meta');
  
  // Loading and error states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Chart data and configuration
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  
  // Store last request parameters for reference (needed for breakdown summary)
  const [lastRequestParams, setLastRequestParams] = useState<MetaRequestParams | TikTokRequestParams | null>(null);
  
  // Handle data fetched from Meta form
  const handleMetaDataFetched = (data: any[], params: MetaRequestParams) => {
    console.log('Page: handleMetaDataFetched called with', data.length, 'records');
    setChartData(data);
    setSelectedMetrics(params.metrics);
    setLastRequestParams(params);
    setError(null);
  };

  // Handle data fetched from TikTok form
  const handleTikTokDataFetched = (data: any[], params: TikTokRequestParams) => {
    console.log('Page: handleTikTokDataFetched called with', data.length, 'records');
    setChartData(data);
    setSelectedMetrics(params.metrics);
    setLastRequestParams(params);
    setError(null);
  };

  // Clear chart data
  const handleClearChart = () => {
    console.log('Page: Clearing chart data');
    setChartData([]);
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
            {/* Chart Options */}
            <ChartOptions 
              chartType={chartType}
              onChartTypeChange={setChartType}
              onClearChart={handleClearChart}
              hasData={chartData.length > 0}
            />
            
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
            {activeTab === 'meta' && chartData.length > 0 && lastRequestParams && 
             !('dimensions' in lastRequestParams) && (
              <BreakdownSummary 
                chartData={chartData} 
                params={lastRequestParams as MetaRequestParams} 
              />
            )}
          </div>
        </div>
      </Tabs>
    </main>
  );
}
