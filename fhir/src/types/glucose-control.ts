export interface GlucoseControl {
  level: "GREAT" | "OK" | "NG" | "UNKNOWN";
  score: number;
  tir: number;
  cv: number;
  mean: number;
  warnings: string[];
}