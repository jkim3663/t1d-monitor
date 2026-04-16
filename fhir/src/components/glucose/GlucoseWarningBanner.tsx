import React from "react";

export const GlucoseWarningBanner: React.FC<{ warnings: string[] }> = ({
  warnings,
}) => {
  if (!warnings.length) return null;

  return (
    <div style={{ background: "#fff3cd", padding: "10px", borderRadius: "8px" }}>
      {warnings.map((w, i) => (
        <div key={i}>⚠️ {w}</div>
      ))}
    </div>
  );
};