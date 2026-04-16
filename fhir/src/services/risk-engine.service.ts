export function detectHypoglycemiaRisk(
  observations: { value: number; date: Date }[]
) {
  if (!observations.length) {
    return {
      risk: "UNKNOWN",
      score: 0,
      reasons: ["No glucose data"],
    };
  }

  const values = observations.map(o => o.value);

  const total = values.length;

  //Count lows
  const lows = values.filter(v => v < 70).length;
  const lowRatio = lows / total;

  //Mean
  const mean =
    values.reduce((sum, v) => sum + v, 0) / total;

  //CV
  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
    total;

  const sd = Math.sqrt(variance);
  const cv = (sd / mean) * 100;

  //Detect downward trend (last 5 points)
  let trendDown = false;
  if (values.length >= 5) {
    const last = values.slice(-5);
    trendDown = last[4] < last[0];
  }

  //Risk scoring
  let score = 0;
  const reasons: string[] = [];

  if (lowRatio > 0.1) {
    score += 40;
    reasons.push("Frequent low glucose (<70 mg/dL)");
  }

  if (cv > 36) {
    score += 20;
    reasons.push("High glucose variability");
  }

  if (mean < 110) {
    score += 15;
    reasons.push("Low average glucose");
  }

  if (trendDown) {
    score += 15;
    reasons.push("Recent downward glucose trend");
  }

  //Risk level
  let risk: "LOW" | "MID" | "HIGH";

  if (score >= 50) risk = "HIGH";
  else if (score >= 25) risk = "MID";
  else risk = "LOW";

  return {
    risk,
    score,
    reasons,
    metrics: {
      lowRatio: Math.round(lowRatio * 100),
      cv: Math.round(cv),
      mean: Math.round(mean),
    },
  };
}