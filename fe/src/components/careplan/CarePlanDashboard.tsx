import React from "react";
import { WarningBanner } from "../common/WarningBanner";
import { CarePlanSummary } from "./CarePlanSummary";
import { CarePlanGoals } from "./CarePlanGoals";
import { CarePlanActivities } from "./CarePlanActivities";

export const CarePlanDashboard = ({ carePlan }: any) => {
  if (!carePlan) return null;

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Diabetes Care Plan</h2>

      <CarePlanSummary status={carePlan.status} />

      <WarningBanner warnings={carePlan.warnings || []} />

      <CarePlanGoals goals={carePlan.goals || []} />

      <CarePlanActivities activities={carePlan.activities || []} />
    </div>
  );
};