import { format, subDays, startOfDay, parseISO, differenceInDays } from 'date-fns';
import type { Habit, Completion, DayData, HabitStats } from '../types';

// Get today's date in YYYY-MM-DD format
export function getTodayString(): string {
    return format(new Date(), 'yyyy-MM-dd');
}

// Format date to YYYY-MM-DD
export function formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}

// Calculate daily completion percentage
export function calculateDailyCompletion(
    habits: Habit[],
    completions: Completion[]
): number {
    if (habits.length === 0) return 0;

    const completedCount = completions.filter(c => c.completed).length;
    return Math.round((completedCount / habits.length) * 100);
}

// Get day data for a specific date
export function getDayData(
    date: string,
    habits: Habit[],
    completions: Completion[]
): DayData {
    const dayCompletions = completions.filter(c => c.date === date);

    const habitData = habits
        .filter(h => {
            // Only include habits that existed on this date
            const habitCreatedDate = startOfDay(parseISO(h.createdAt));
            const targetDate = startOfDay(parseISO(date));
            return habitCreatedDate <= targetDate;
        })
        .map(habit => {
            const completion = dayCompletions.find(c => c.habitId === habit.id);
            return {
                id: habit.id,
                name: habit.name,
                completed: completion?.completed || false,
            };
        });

    const completionPercentage = calculateDailyCompletion(
        habits.filter(h => {
            const habitCreatedDate = startOfDay(parseISO(h.createdAt));
            const targetDate = startOfDay(parseISO(date));
            return habitCreatedDate <= targetDate;
        }),
        dayCompletions
    );

    return {
        date,
        habits: habitData,
        completionPercentage,
    };
}



// Calculate streak for a habit
export function calculateStreak(
    habitId: string,
    completions: Completion[]
): { current: number; longest: number } {
    const habitCompletions = completions
        .filter(c => c.habitId === habitId && c.completed)
        .sort((a, b) => b.date.localeCompare(a.date)); // Sort descending

    if (habitCompletions.length === 0) {
        return { current: 0, longest: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let expectedDate = new Date();

    // Calculate current streak
    for (const completion of habitCompletions) {
        const expectedDateStr = formatDate(expectedDate);

        if (completion.date === expectedDateStr) {
            currentStreak++;
            expectedDate = subDays(expectedDate, 1);
        } else {
            break;
        }
    }

    // Calculate longest streak
    let lastDate: Date | null = null;
    for (const completion of habitCompletions) {
        const completionDate = parseISO(completion.date);

        if (lastDate === null) {
            tempStreak = 1;
        } else {
            const daysDiff = differenceInDays(lastDate, completionDate);
            if (daysDiff === 1) {
                tempStreak++;
            } else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
            }
        }

        lastDate = completionDate;
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { current: currentStreak, longest: longestStreak };
}

// Get statistics for a specific habit
export function getHabitStats(
    habit: Habit,
    completions: Completion[]
): HabitStats {
    const habitCompletions = completions.filter(c => c.habitId === habit.id);
    const completedDays = habitCompletions.filter(c => c.completed).length;

    const createdDate = startOfDay(parseISO(habit.createdAt));
    const today = startOfDay(new Date());
    const totalDays = differenceInDays(today, createdDate) + 1;

    const streaks = calculateStreak(habit.id, completions);

    return {
        habitId: habit.id,
        habitName: habit.name,
        totalDays,
        completedDays,
        currentStreak: streaks.current,
        longestStreak: streaks.longest,
        completionRate: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0,
    };
}

// Get all habit statistics
export function getAllHabitStats(
    habits: Habit[],
    completions: Completion[]
): HabitStats[] {
    return habits.map(habit => getHabitStats(habit, completions));
}
