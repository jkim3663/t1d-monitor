export type PrescriptionStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "STOPPED"
  | "NOT_PRESCRIBED"
  | "UNKNOWN";

export type EngagementLevel = "GOOD" | "MEDIUM" | "HIGH_RISK";

export interface EngagementResult {
  score: number;
  level: EngagementLevel;
  warnings: string[];
}

export interface NormalizedData {
  insulinPrescriptions: {
    status: string;
  }[];

  insulinAdministrations: Date[];

  glucoseObservations: Date[];
}