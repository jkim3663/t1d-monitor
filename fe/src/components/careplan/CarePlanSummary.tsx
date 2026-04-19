import React from "react";

export const CarePlanSummary = ({ status }: { status: string }) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      <strong>Status:</strong> {status}
    </div>
  );
};