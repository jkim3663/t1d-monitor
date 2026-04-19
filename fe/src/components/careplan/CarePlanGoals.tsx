import React from "react";

export const CarePlanGoals = ({ goals }: any) => {
  if (!goals.length) return <div>No goals defined</div>;

  return (
    <div>
      <h4>Goals</h4>
      {goals.map((g: any, i: number) => (
        <div key={i}>• {g.text}</div>
      ))}
    </div>
  );
};