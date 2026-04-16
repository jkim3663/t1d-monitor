import React from "react";
import { Prescription } from "../../types/prescription";

export const PrescriptionCard: React.FC<{ prescription: Prescription }> = ({
  prescription,
}) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "12px",
        marginBottom: "10px",
      }}
    >
      <div style={{ fontWeight: "bold" }}>
        {prescription.medication}
      </div>

      <div>Status: {prescription.status}</div>

      {prescription.authoredOn && (
        <div>Start: {new Date(prescription.authoredOn).toLocaleDateString()}</div>
      )}
    </div>
  );
};