import React from "react";

export const CarePlanActivities = ({ activities }: any) => {
  if (!activities.length) return <div>No activities</div>;

  return (
    <div style={{ marginTop: "10px" }}>
      <h4>📋 Activities</h4>
      {activities.map((a: any, i: number) => (
        <div key={i}>
          {a.name} — {a.status}
        </div>
      ))}
    </div>
  );
};