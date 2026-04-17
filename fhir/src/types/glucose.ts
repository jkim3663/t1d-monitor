export interface GlucosePoint {
  value: number;
  timestamp: string;
}

export interface GlucoseMetrics {
  average: number;
  veryLow: number;
  low: number;
  target: number;
  high: number;
  veryHigh: number;
}

export interface GlucoseDashboardData {
  metrics: GlucoseMetrics;
  points: GlucosePoint[];
  warnings: string[];
}