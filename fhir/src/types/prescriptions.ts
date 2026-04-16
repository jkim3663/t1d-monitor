export type PrescriptionStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "STOPPED"
  | "NOT_PRESCRIBED"
  | "UNKNOWN";

export interface Prescription {
  id: string;
  medication: string;
  status: string;
  authoredOn?: string;
}

export interface PrescriptionDashboardData {
  prescriptionStatus: PrescriptionStatus;
  prescriptions: Prescription[];
  warnings: string[];
}