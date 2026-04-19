import React from "react";
import { GlucosePoint } from "../../types/glucose";

export const GlucoseChart: React.FC<{ points: GlucosePoint[] }> = ({
  points,
}) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <h4>Glucose Trend</h4>

      <div
        style={{
          height: "200px",
          border: "1px solid #ddd",
          overflow: "auto",
          padding: "10px",
        }}
      >
        {points.map((p, i) => (
          <div key={i}>
            {new Date(p.timestamp).toLocaleTimeString()} → {p.value}
          </div>
        ))}
      </div>
    </div>
  );
};