export function analyzeCarePlan(carePlans: any[]) {
  if (!carePlans.length) {
    return {
      status: "NONE",
      goals: [],
      activities: [],
      warnings: ["No care plan found"],
    };
  }

  const activePlan = carePlans.find(p => p.status === "active") || carePlans[0];

  const goals = (activePlan.goals || []).map((g: any) => ({
    text: g.display || "Goal",
  }));

  const activities = (activePlan.activities || []).map((a: any) => ({
    name: a.detail?.description || "Activity",
    status: a.detail?.status || "unknown",
  }));

  const warnings: string[] = [];

  if (!activities.length) {
    warnings.push("No care activities defined");
  }

  return {
    status: activePlan.status,
    goals,
    activities,
    warnings,
  };
}