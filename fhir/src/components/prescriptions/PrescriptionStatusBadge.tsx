import React from "react";
import { PrescriptionStatus } from "../../types/prescription";

export const PrescriptionStatusBadge: React.FC<{
  status: PrescriptionStatus;
}> = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "STOPPED":
        return "red";
      case "COMPLETED":
        return "gray";
      default:
        return "orange";
    }
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "12px",
        backgroundColor: getColor(),
        color: "white",
        fontSize: "12px",
      }}
    >
      {status}
    </span>
  );
};