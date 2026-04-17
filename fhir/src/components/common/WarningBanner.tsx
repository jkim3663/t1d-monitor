import React from "react";

export const WarningBanner: React.FC<{ warnings: string[] }> = ({
  warnings,
}) => {
  if (!warnings.length) return null;

  return (
    <div
      style={{
        backgroundColor: "#ffe5e5",
        padding: "10px",
        borderRadius: "8px",
        marginBottom: "15px",
      }}
    >
      {warnings.map((w, i) => (
        <div key={i}>⚠️ {w}</div>
      ))}
    </div>
  );
};