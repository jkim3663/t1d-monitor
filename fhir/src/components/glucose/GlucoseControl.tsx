import React from "react";
import { WarningBanner } from "../common/WarningBanner";

export const GlucoseControl = ({ data }: any) => {
  if (!data) return null;

  const getColor = () => {
    switch (data.level) {
      case "GREAT":
        return "green";
      case "OK":
        return "orange";
      case "NG":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        marginTop: "20px",
      }}
    >
      <h3>Glucose Control</h3>

      <div style={{ marginBottom: "10px" }}>
        <strong>Status:</strong>{" "}
        <span style={{ color: getColor(), fontWeight: "bold" }}>
          {data.level}
        </span>
      </div>

      <div>Score: {data.score}</div>
      <div>Time in Range: {data.tir}%</div>
      <div>Average: {data.mean} mg/dL</div>
      <div>CV: {data.cv}%</div>

      <WarningBanner warnings={data.warnings || []} />
    </div>
  );
};