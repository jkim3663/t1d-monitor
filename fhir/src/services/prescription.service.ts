import { PrescriptionStatus } from "../domain/types";

export function getPrescriptionStatus(
  prescriptions: { status: string }[]
): PrescriptionStatus {
  if (!prescriptions.length) return "NOT_PRESCRIBED";

  const active = prescriptions.find(p => p.status === "active");
  if (active) return "ACTIVE";

  const completed = prescriptions.find(p => p.status === "completed");
  if (completed) return "COMPLETED";

  const stopped = prescriptions.find(p => p.status === "stopped");
  if (stopped) return "STOPPED";

  return "UNKNOWN";
}