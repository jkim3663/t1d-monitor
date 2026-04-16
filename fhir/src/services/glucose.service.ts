export function analyzeGlucose(observations: { value: number; date: Date }[]) {
  if (!observations.length) {
    return {
      metrics: null,
      warnings: ["No glucose data available"],
      points: [],
    };
  }

  let sum = 0;

  let veryLow = 0;
  let low = 0;
  let target = 0;
  let high = 0;
  let veryHigh = 0;

  for (const o of observations) {
    const v = o.value;
    sum += v;

    if (v < 54) veryLow++;
    else if (v < 70) low++;
    else if (v <= 180) target++;
    else if (v <= 250) high++;
    else veryHigh++;
  }

  const total = observations.length;

  const metrics = {
    average: Math.round(sum / total),
    veryLow: pct(veryLow, total),
    low: pct(low, total),
    target: pct(target, total),
    high: pct(high, total),
    veryHigh: pct(veryHigh, total),
  };

  const warnings: string[] = [];

  if (metrics.low + metrics.veryLow > 10) {
    warnings.push("Frequent hypoglycemia detected");
  }

  if (metrics.high + metrics.veryHigh > 40) {
    warnings.push("Frequent hyperglycemia detected");
  }

  return {
    metrics,
    warnings,
    points: observations.map(o => ({
      value: o.value,
      timestamp: o.date.toISOString(),
    })),
  };
}

function pct(n: number, total: number) {
  return Math.round((n / total) * 100);
}