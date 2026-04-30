import { fhirR4 } from '@smile-cdr/fhirts';

export type RiskSeverity = 'high' | 'warning';

export interface RiskFlag {
    severity: RiskSeverity;
    title: string;
    detail: string;
}

export function evaluateHypoglycemiaRisk(
    glucoseObs: fhirR4.Observation[],
    a1cObs: fhirR4.Observation[]
): RiskFlag[] {
    const flags: RiskFlag[] = [];

    const hypoReadings = glucoseObs.filter((o) => (o.valueQuantity?.value ?? 999) < 70);
    const severeReadings = glucoseObs.filter((o) => (o.valueQuantity?.value ?? 999) < 54);

    if (hypoReadings.length >= 2) {
        flags.push({
            severity: 'high',
            title: 'Multiple hypoglycemic episodes',
            detail: `${hypoReadings.length} blood glucose readings below 70 mg/dL detected. Values: ${hypoReadings.map((o) => `${o.valueQuantity?.value} mg/dL`).join(', ')}.`,
        });
    }

    if (severeReadings.length > 0) {
        flags.push({
            severity: 'high',
            title: 'Severe hypoglycemia detected',
            detail: `${severeReadings.length} reading(s) below 54 mg/dL (clinical threshold for severe hypoglycemia): ${severeReadings.map((o) => `${o.valueQuantity?.value} mg/dL`).join(', ')}.`,
        });
    }

    const nocturnalHypo = hypoReadings.filter((o) => {
        if (!o.effectiveDateTime) return false;
        const hour = new Date(String(o.effectiveDateTime)).getHours();
        return hour >= 22 || hour < 6;
    });
    if (nocturnalHypo.length > 0) {
        flags.push({
            severity: 'warning',
            title: 'Nocturnal hypoglycemia pattern',
            detail: `${nocturnalHypo.length} low glucose reading(s) occurred between 10 PM and 6 AM. Consider reviewing basal insulin (Glargine) dose.`,
        });
    }

    const sortedA1C = [...a1cObs].sort(
        (a, b) => new Date(String(a.effectiveDateTime)).getTime() - new Date(String(b.effectiveDateTime)).getTime()
    );
    if (sortedA1C.length >= 2) {
        const prev   = sortedA1C.at(-2)?.valueQuantity?.value ?? 0;
        const latest = sortedA1C.at(-1)?.valueQuantity?.value ?? 0;
        if (prev - latest >= 1) {
            flags.push({
                severity: 'warning',
                title: 'Rapid A1C decline',
                detail: `HbA1c dropped ${(prev - latest).toFixed(1)}% (${prev}% → ${latest}%) across the last two readings. Rapid glycemic tightening is associated with increased hypoglycemia risk.`,
            });
        }
    }

    return flags;
}
