import { NormalizedData } from "../domain/types";

export function normalizeFHIR(bundle: any): NormalizedData {
  const entries = bundle.entry || [];

  const insulinPrescriptions: any[] = [];
  const insulinAdministrations: Date[] = [];
  const glucoseObservations: { value: number; date: Date }[] = [];
  const carePlans: any[] = [];



  for (const e of entries) {
    const r = e.resource;

    if (!r) continue;

    // MedicationRequest
    if (r.resourceType === "MedicationRequest") {
      if (r.medicationCodeableConcept?.text?.toLowerCase().includes("insulin")) {
        insulinPrescriptions.push({
          status: r.status,
        });
      }
    }

    // MedicationAdministration
    if (r.resourceType === "MedicationAdministration") {
      if (r.medicationCodeableConcept?.text?.toLowerCase().includes("insulin")) {
        if (r.effectiveDateTime) {
          insulinAdministrations.push(new Date(r.effectiveDateTime));
        }
      }
    }

    // Observation
    if (r.resourceType === "Observation") {
        const code = r.code?.text?.toLowerCase() || "";

        if (code.includes("glucose")) {
          if (r.valueQuantity?.value && r.effectiveDateTime) {
            glucoseObservations.push({
              value: r.valueQuantity.value,
              date: new Date(r.effectiveDateTime),
            });
          }
        }
      }

    if (r.resourceType === "CarePlan") {
      carePlans.push({
        status: r.status,
        title: r.title,
        description: r.description,
        activities: r.activity || [],
        goals: r.goal || [],
      });
    }


  }

  return {
    insulinPrescriptions,
    insulinAdministrations,
    glucoseObservations,
    carePlans
  };
}