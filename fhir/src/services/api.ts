export async function fetchPrescriptionDashboard(): Promise<any> {
  const res = await fetch("/api/analyze");

  if (!res.ok) {
    throw new Error("Failed to fetch prescription data");
  }

  return res.json();
}