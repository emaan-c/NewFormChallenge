/**
 * Type definitions for the API requests and responses
 */

// META types
export interface MetaRequestParams {
  metrics: string[];
  level: 'account' | 'campaign' | 'adset' | 'ad';
  breakdowns?: string[];
  timeIncrement?: '1' | '7' | '28' | 'monthly' | 'quarterly' | 'yearly' | 'all_days';
  dateRangeEnum?: 'last7' | 'last14' | 'last30' | 'lifetime';
  dateRange?: {
    from: string;
    to: string;
  };
}

// TIKTOK types
export interface TikTokRequestParams {
  metrics: string[];
  dimensions: string[];
  level: 'AUCTION_ADVERTISER' | 'AUCTION_AD' | 'AUCTION_CAMPAIGN';
  dateRangeEnum?: 'last7' | 'last14' | 'last30' | 'lifetime';
  dateRange?: {
    from: string;
    to: string;
  };
  reportType?: 'BASIC' | 'AUDIENCE';
}

// Generic API response
export interface ApiResponse {
  data?: any[];
  error?: string;
}

// Chart data types
export interface ChartDataPoint {
  [key: string]: any;
}

// Component props types
export interface DateRange {
  from: string;
  to: string;
} 