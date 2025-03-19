/**
 * Constants for API endpoints, metrics, dimensions and other configuration options
 */

// API endpoints
export const BASE_URL = 'https://bizdev.newform.ai';
export const META_ENDPOINT = `${BASE_URL}/sample-data/meta`;
export const TIKTOK_ENDPOINT = `${BASE_URL}/sample-data/tiktok`;

// Define date range enums for both platforms
export const DATE_RANGE_ENUMS = ['last7', 'last14', 'last30', 'lifetime'];

// Valid parameters for Meta API
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

// Valid parameters for TikTok API
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

// Chart configuration
export const CHART_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#0088fe',
  '#00c49f',
  '#ffbb28',
  '#ff8042',
]; 