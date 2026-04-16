export interface CarePlanGoal {
  text: string;
}

export interface CarePlanActivity {
  name: string;
  status: string;
}

export interface CarePlanData {
  status: string;
  goals: CarePlanGoal[];
  activities: CarePlanActivity[];
  warnings: string[];
}