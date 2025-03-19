/**
 * API client for fetching data from Meta and TikTok endpoints
 */
import { 
  META_ENDPOINT, 
  TIKTOK_ENDPOINT,
  // Re-exporting constants for backwards compatibility 
  DATE_RANGE_ENUMS,
  META_METRICS,
  META_BREAKDOWNS,
  META_LEVELS,
  META_TIME_INCREMENTS,
  TIKTOK_METRICS,
  TIKTOK_DIMENSIONS,
  TIKTOK_LEVELS,
  TIKTOK_REPORT_TYPES
} from './constants';

import type { 
  MetaRequestParams, 
  TikTokRequestParams, 
  ApiResponse 
} from './types';

// Re-export types and constants for backwards compatibility
export type { 
  MetaRequestParams, 
  TikTokRequestParams 
};

export { 
  DATE_RANGE_ENUMS,
  META_METRICS,
  META_BREAKDOWNS,
  META_LEVELS,
  META_TIME_INCREMENTS,
  TIKTOK_METRICS,
  TIKTOK_DIMENSIONS,
  TIKTOK_LEVELS,
  TIKTOK_REPORT_TYPES
};

/**
 * Fetches data from the Meta API
 * @param params - The request parameters for the Meta API
 * @returns A promise containing either the data or an error message
 */
export async function fetchMetaData(params: MetaRequestParams): Promise<ApiResponse> {
  console.log('Fetching Meta data with params:', params);
  try {
    const response = await fetch(META_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

/**
 * Fetches data from the TikTok API
 * @param params - The request parameters for the TikTok API
 * @returns A promise containing either the data or an error message
 */
export async function fetchTikTokData(params: TikTokRequestParams): Promise<ApiResponse> {
  console.log('Fetching TikTok data with params:', params);
  try {
    const response = await fetch(TIKTOK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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