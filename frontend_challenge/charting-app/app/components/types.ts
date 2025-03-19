/**
 * Type definitions for component props
 */
import type { MetaRequestParams, TikTokRequestParams } from '../lib/types';

/**
 * Props for the MetaForm component
 */
export interface MetaFormProps {
  onDataFetched: (data: any[], params: MetaRequestParams) => void;
  onLoading: (isLoading: boolean) => void;
  onError: (error: string | null) => void;
}

/**
 * Props for the TikTokForm component
 */
export interface TikTokFormProps {
  onDataFetched: (data: any[], params: TikTokRequestParams) => void;
  onLoading: (isLoading: boolean) => void;
  onError: (error: string | null) => void;
}

/**
 * Props for the DateRangeSelector component
 */
export interface DateRangeSelectorProps {
  dateRangeEnum: string | null;
  dateRange: { from: string; to: string } | null;
  onDateRangeEnumChange: (value: string | null) => void;
  onDateRangeChange: (range: { from: string; to: string } | null) => void;
}

/**
 * Props for the MultiSelect component
 */
export interface MultiSelectProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  minSelected?: number;
}

/**
 * Props for the ChartComponent
 */
export interface ChartComponentProps {
  data: any[];
  metrics: string[];
  chartType?: 'bar' | 'line';
  xAxisKey?: string;
}

/**
 * Props for the BreakdownSummary component
 */
export interface BreakdownSummaryProps {
  chartData: any[];
  params: MetaRequestParams | null;
} 