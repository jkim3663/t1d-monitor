export function analyzeGlucoseControl(
  observations: { value: number; date: Date }[]
) {
  if (!observations.length) {
    return {
      level: "UNKNOWN",
      score: 0,
      cv: 0,
      warnings: ["No glucose data"],
    };
  }

  const values = observations.map(o => o.value);

  // Mean
  const mean =
    values.reduce((sum, v) => sum + v, 0) / values.length;

  // Standard deviation
  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
    values.length;

  const sd = Math.sqrt(variance);

  // Coefficient of variation (CV)
  const cv = Math.round((sd / mean) * 100);

  // Time in range
  let inRange = 0;
  let high = 0;
  let low = 0;

  for (const v of values) {
    if (v >= 70 && v <= 180) inRange++;
    else if (v > 180) high++;
    else low++;
  }

  const total = values.length;
  const tir = Math.round((inRange / total) * 100);

  // Score
  let score = tir;

  if (cv > 36) score -= 20; // high variability penalty
  if (low / total > 0.1) score -= 20; // hypo penalty

  score = Math.max(0, score);

  // 🧠 Level classification
  let level: "GREAT" | "GOOD" | "NG";

  if (score >= 70) level = "GREAT";
  else if (score >= 50) level = "GOOD";
  else level = "NG";

  // Warnings
  const warnings: string[] = [];

  if (cv > 36) {
    warnings.push("High glucose variability (CV > 36%)");
  }

  if (low / total > 0.1) {
    warnings.push("Frequent hypoglycemia");
  }

  if (tir < 50) {
    warnings.push("Low time in range");
  }

  return {
    level,
    score,
    tir,
    cv,
    mean: Math.round(mean),
    warnings,
  };
}