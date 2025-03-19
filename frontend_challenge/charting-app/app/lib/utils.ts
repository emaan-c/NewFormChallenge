import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { MetaRequestParams } from "./types";

// Combines multiple class names with tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatter utility
export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toISOString().split("T")[0]; // YYYY-MM-DD format
}

/**
 * Generate summary data for Meta breakdowns
 * @param chartData - The chart data from the API
 * @param params - The Meta request parameters that were used to fetch the data
 * @returns Object containing summary data for each breakdown
 */
export function generateMetaBreakdownSummary(chartData: any[], params: MetaRequestParams | null) {
  if (chartData.length === 0 || !params || !params.breakdowns || params.breakdowns.length === 0) {
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
} 