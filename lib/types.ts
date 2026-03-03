export type Category = 'DSA' | 'Jobs' | 'Book' | 'Learning' | 'Insta' | 'Personal';

export interface Task {
  id: string;
  title: string;
  category: Category;
  reminderTime: string; // HH:mm
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  recurring: boolean;
  date: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: number;
  parentId?: string; // used for recurring tasks to track origin
}

export interface UserSettings {
  mode: 'WFO' | 'WFH';
  productivityScore: number;
}

export interface WeeklyReview {
  weekStarting: string; // YYYY-MM-DD (usually a Monday)
  tasksCompleted: number;
  dsaCount: number;
  jobAppCount: number;
  wordsWritten: number;
  consistency: number;
  reflection: string;
  createdAt: number;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string; // YYYY-MM-DD
}

export interface NightPlan {
  date: string; // YYYY-MM-DD
  mit1: string;
  mit2: string;
  mit3: string;
  tomorrowFocus: string;
  notes: string;
  createdAt: number;
}
