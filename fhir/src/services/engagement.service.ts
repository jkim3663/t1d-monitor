import { EngagementResult } from "../domain/types";

const HOURS_24 = 24 * 60 * 60 * 1000;

export function calculateEngagement(data: {
  insulinAdministrations: Date[];
  glucoseObservations: Date[];
}): EngagementResult {
  let score = 100;
  const warnings: string[] = [];

  const now = new Date();

  const lastInsulin = getLast(data.insulinAdministrations);
  const lastGlucose = getLast(data.glucoseObservations);

  // No insulin in 48h
  if (!lastInsulin || now.getTime() - lastInsulin.getTime() > HOURS_24 * 2) {
    score -= 40;
    warnings.push("No insulin usage detected in last 48h");
  }

  // No glucose logs in 24h
  if (!lastGlucose || now.getTime() - lastGlucose.getTime() > HOURS_24) {
    score -= 30;
    warnings.push("No glucose data recorded in last 24h");
  }

  // Low glucose frequency (today)
  const todayCount = countToday(data.glucoseObservations);

  if (todayCount < 3) {
    score -= 30;
    warnings.push("Low glucose monitoring frequency");
  }

  // Trigger level
  let level: EngagementResult["level"] = "GOOD";
  if (score < 40) level = "HIGH_RISK";
  else if (score < 70) level = "MEDIUM";

  return { score, level, warnings };
}

// helpers
function getLast(arr: Date[]): Date | null {
  if (!arr.length) return null;
  return arr.sort((a, b) => b.getTime() - a.getTime())[0];
}

function countToday(arr: Date[]): number {
  const now = new Date();

  return arr.filter(d =>
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  ).length;
}