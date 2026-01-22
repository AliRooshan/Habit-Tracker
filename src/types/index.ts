// Type definitions for the Habit Tracker app

export interface Habit {
    id: string;
    name: string;
    createdAt: string; // ISO date string
}

export interface Completion {
    id: string;
    habitId: string;
    date: string; // ISO date string (YYYY-MM-DD)
    completed: boolean;
}

export interface DayData {
    date: string;
    habits: {
        id: string;
        name: string;
        completed: boolean;
    }[];
    completionPercentage: number;
}



export interface HabitStats {
    habitId: string;
    habitName: string;
    totalDays: number;
    completedDays: number;
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
}
