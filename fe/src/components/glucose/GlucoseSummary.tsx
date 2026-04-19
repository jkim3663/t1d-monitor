import React from "react";
import { GlucoseMetrics } from "../../types/glucose";

export const GlucoseSummary: React.FC<{ metrics: GlucoseMetrics }> = ({
  metrics,
}) => {
  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <Stat label="Avg" value={metrics.average} />
      <Stat label="Target %" value={metrics.target} />
      <Stat label="Low %" value={metrics.low + metrics.veryLow} />
      <Stat label="High %" value={metrics.high + metrics.veryHigh} />
    </div>
  );
};

const Stat = ({ label, value }: any) => (
  <div
    style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "10px",
      minWidth: "80px",
    }}
  >
    <div style={{ fontSize: "12px" }}>{label}</div>
    <div style={{ fontWeight: "bold" }}>{value}</div>
  </div>
);