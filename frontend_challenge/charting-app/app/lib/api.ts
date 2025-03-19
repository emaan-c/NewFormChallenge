// API endpoints
const BASE_URL = 'https://bizdev.newform.ai';
const META_ENDPOINT = `${BASE_URL}/sample-data/meta`;
const TIKTOK_ENDPOINT = `${BASE_URL}/sample-data/tiktok`;

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

export interface ApiResponse {
  data?: any[];
  error?: string;
}

// Define date range enums for both platforms
export const DATE_RANGE_ENUMS = ['last7', 'last14', 'last30', 'lifetime'];

// Valid parameters for Meta and TikTok APIs
export const META_METRICS = [
  'spend',
  'impressions',
  'clicks',
  'ctr',
  'cpc',
  'reach',
  'frequency',
  'conversions',
  'cost_per_conversion',
  'conversion_rate',
  'actions',
  'cost_per_action_type',
];

export const META_BREAKDOWNS = [
  'age',
  'gender',
  'country',
  'region',
  'dma',
  'impression_device',
  'platform_position',
  'publisher_platform',
];

export const META_LEVELS = ['account', 'campaign', 'adset', 'ad'];

export const META_TIME_INCREMENTS = [
  '1',
  '7',
  '28',
  'monthly',
  'quarterly',
  'yearly',
  'all_days',
];

export const TIKTOK_METRICS = [
  'spend',
  'impressions',
  'clicks',
  'conversions',
  'cost_per_conversion',
  'conversion_rate',
  'ctr',
  'cpc',
  'reach',
  'frequency',
  'skan_app_install',
  'skan_cost_per_app_install',
  'skan_purchase',
  'skan_cost_per_purchase',
];

export const TIKTOK_DIMENSIONS = [
  'ad_id',
  'campaign_id',
  'adgroup_id',
  'advertiser_id',
  'stat_time_day',
  'campaign_name',
  'adgroup_name',
  'ad_name',
  'country_code',
  'age',
  'gender',
  'province_id',
  'dma_id',
];

export const TIKTOK_LEVELS = [
  'AUCTION_ADVERTISER',
  'AUCTION_CAMPAIGN',
  'AUCTION_AD',
];

export const TIKTOK_REPORT_TYPES = ['BASIC', 'AUDIENCE'];

// API functions
export async function fetchMetaData(params: MetaRequestParams): Promise<ApiResponse> {
  console.log('Fetching Meta data with params:', params);
  try {
    const response = await fetch(META_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // The assignment mentions no token required for now
        // 'Authorization': 'Bearer NEWFORMCODINGCHALLENGE',
      },
      body: JSON.stringify(params),
    });

    console.log('Meta API response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Meta API error:', errorData);
      return { data: [], error: errorData.message || 'Failed to fetch Meta data' };
    }

    const data = await response.json();
    console.log('Meta API data received:', data);
    
    // Check if data has the expected structure
    if (data && data.data) {
      return { data: data.data };
    } else if (Array.isArray(data)) {
      return { data };
    } else {
      console.error('Unexpected data format from Meta API:', data);
      return { data: [], error: 'Unexpected data format received from API' };
    }
  } catch (error) {
    console.error('Error fetching Meta data:', error);
    return { 
      data: [], 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

export async function fetchTikTokData(params: TikTokRequestParams): Promise<ApiResponse> {
  console.log('Fetching TikTok data with params:', params);
  try {
    const response = await fetch(TIKTOK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // The assignment mentions no token required for now
        // 'Authorization': 'Bearer NEWFORMCODINGCHALLENGE',
      },
      body: JSON.stringify(params),
    });

    console.log('TikTok API response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('TikTok API error:', errorData);
      return { data: [], error: errorData.message || 'Failed to fetch TikTok data' };
    }

    const data = await response.json();
    console.log('TikTok API data received:', data);
    
    // Check if data has the expected structure
    if (data && data.data) {
      return { data: data.data };
    } else if (Array.isArray(data)) {
      return { data };
    } else {
      console.error('Unexpected data format from TikTok API:', data);
      return { data: [], error: 'Unexpected data format received from API' };
    }
  } catch (error) {
    console.error('Error fetching TikTok data:', error);
    return { 
      data: [], 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
} 