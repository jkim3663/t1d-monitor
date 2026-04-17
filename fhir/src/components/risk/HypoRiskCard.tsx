import React from "react";
import { WarningBanner } from "../common/WarningBanner";

export const HypoRiskCard = ({ data }: any) => {
  if (!data) return null;

  const getColor = () => {
    switch (data.risk) {
      case "HIGH":
        return "red";
      case "MID":
        return "orange";
      case "LOW":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <div
      style={{
        border: "2px solid",
        borderColor: getColor(),
        borderRadius: "10px",
        padding: "15px",
        marginTop: "20px",
      }}
    >
      <h3>⚠Hypoglycemia Risk</h3>

      <div>
        <strong>Status:</strong>{" "}
        <span style={{ color: getColor(), fontWeight: "bold" }}>
          {data.risk}
        </span>
      </div>

      <div>Risk Score: {data.score}</div>
      <div>Low Events: {data.metrics.lowRatio}%</div>
      <div>Average Glucose: {data.metrics.mean}</div>
      <div>CV: {data.metrics.cv}%</div>

      <WarningBanner warnings={data.reasons || []} />
    </div>
  );
};