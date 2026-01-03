
export enum MoodType {
  HAPPY = 'HAPPY',
  TOUGH = 'TOUGH',
  NEUTRAL = 'NEUTRAL',
  NONE = 'NONE'
}

export interface WeekData {
  id: string; // format: year-week (e.g., 2024-12)
  note?: string;
  mood: MoodType;
  timestamp: string;
}

export interface Milestone {
  id: string;
  label: string;
  startDate: string;
}

export interface UserProfile {
  dob: string;
  name?: string;
}

export interface AppState {
  profile: UserProfile | null;
  weeks: Record<string, WeekData>;
  milestones: Milestone[];
}
