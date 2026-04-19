import { useState } from "react";

const PatientMonitorPage = () => {
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resourceType: "Bundle",
        entry: [],
      }),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h1>Patient Monitor</h1>
      <button onClick={handleAnalyze}>Run Analysis</button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
};

export default PatientMonitorPage;