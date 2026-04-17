import React, { useEffect, useState } from "react";
import { fetchPrescriptionDashboard } from "../services/api";

import { PrescriptionStatusBadge } from "../components/prescriptions/PrescriptionStatusBadge";
import { PrescriptionList } from "../components/prescriptions/PrescriptionList";
import { GlucoseSummary } from "../components/glucose/GlucoseSummary";
import { GlucoseChart } from "../components/glucose/GlucoseChart";
import { CarePlanDashboard } from "../components/careplan/CarePlanDashboard";
import { GlucoseControl } from "../components/glucose/GlucoseControl";
import { HypoRiskCard } from "../components/risk/HypoRiskCard";

import { WarningBanner } from "../components/common/WarningBanner";



export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchPrescriptionDashboard().then(setData).catch(console.error);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Prescription Dashboard</h2>

      {/* Status */}
      <div style={{ marginBottom: "15px" }}>
        Status:{" "}
        <PrescriptionStatusBadge status={data.prescription?.status} />
      </div>

      {/* Warnings */}
      <WarningBanner warnings={data.warnings || []} />

      {/* List */}
      <PrescriptionList prescriptions={data.prescription?.list || []} />

      <h2>Glucose Dashboard</h2>

      <HypoRiskCard data={data.hypoRisk} />

      {data.glucose?.metrics && (
        <>
          <GlucoseSummary metrics={data.glucose.metrics} />
          <WarningBanner warnings={data.glucose?.warnings || []} />
          <GlucoseChart points={data.glucose.points} />
          <GlucoseControl data={data.glucoseControl} />
        </>
      )}

      {/* Care Plan */}
      <CarePlanDashboard carePlan={data.carePlan} />
    </div>
  );
}