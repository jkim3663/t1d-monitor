import React from "react";
import { Prescription } from "../../types/prescription";
import { PrescriptionCard } from "./PrescriptionCard";

export const PrescriptionList: React.FC<{
  prescriptions: Prescription[];
}> = ({ prescriptions }) => {
  if (!prescriptions.length) {
    return <div>No prescriptions found</div>;
  }

  return (
    <div>
      {prescriptions.map(p => (
        <PrescriptionCard key={p.id} prescription={p} />
      ))}
    </div>
  );
};