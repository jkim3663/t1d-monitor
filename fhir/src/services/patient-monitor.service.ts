import { normalizeFHIR } from "../fhir/adapter";
import { getPrescriptionStatus } from "./prescription.service";
import { calculateEngagement } from "./engagement.service";
import { analyzeGlucose } from "./glucose.service";
import { analyzeCarePlan } from "./careplan.service";
import { analyzeGlucoseControl } from "./glucose-control.service";
import { detectHypoglycemiaRisk } from "./risk-engine.service";


export function analyzePatient(bundle: any) {
  const normalized = normalizeFHIR(bundle);

  const prescriptionStatus = getPrescriptionStatus(
    normalized.insulinPrescriptions
  );

  const engagement = calculateEngagement({
    insulinAdministrations: normalized.insulinAdministrations,
    glucoseObservations: normalized.glucoseObservations,
  });

  const glucose = analyzeGlucose(normalized.glucoseObservations);

  const glucoseControl = analyzeGlucoseControl(
    normalized.glucoseObservations
  );

  const carePlan = analyzeCarePlan(normalized.carePlans);

  // Prescription OK, not used
  if (
    prescriptionStatus === "ACTIVE" &&
    normalized.insulinAdministrations.length === 0
  ) {
    engagement.warnings.push("Insulin prescribed but not being used");
    engagement.score -= 20;
  }

  // Plan O, no glucose data
  if (
    carePlan.status === "active" &&
    (!glucose.points || glucose.points.length === 0)
  ) {
    carePlan.warnings.push("Care plan active but no glucose data available");
  }

  // high glucose with active insulin
  if (
    prescriptionStatus === "ACTIVE" &&
    glucose.metrics &&
    glucose.metrics.high + glucose.metrics.veryHigh > 40
  ) {
    carePlan.warnings.push(
      "Glucose frequently high despite active insulin therapy"
    );
  }

  const combinedWarnings = [
    ...engagement.warnings,
    ...glucose.warnings,
    ...carePlan.warnings,
  ];

  const prescriptions = normalized.insulinPrescriptions.map((p, i) => ({
    id: `rx-${i}`,
    medication: "Insulin",
    status: p.status,
  }));

  const hypoRisk = detectHypoglycemiaRisk(
    normalized.glucoseObservations
  );

  return {
    prescription: {
      status: prescriptionStatus,
      list: prescriptions,
    },

    engagement: {
      score: engagement.score,
      level: engagement.level,
      warnings: engagement.warnings,
    },

    glucose,
    glucoseControl,
    hypoRisk,
    carePlan,
    warnings: combinedWarnings,
  };
}