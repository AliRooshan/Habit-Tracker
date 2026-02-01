import { format, subDays, startOfDay, parseISO, differenceInDays, startOfMonth, endOfMonth, isBefore } from 'date-fns';
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

    const todayStr = formatDate(new Date());
    const yesterdayStr = formatDate(subDays(new Date(), 1));
    const lastCompletionDate = habitCompletions[0].date;

    // Check if the streak is active (completed today OR yesterday)
    const isStreakActive = lastCompletionDate === todayStr || lastCompletionDate === yesterdayStr;

    let currentStreak = 0;

    if (isStreakActive) {
        let expectedDate = new Date(lastCompletionDate);

        for (const completion of habitCompletions) {
            const expectedDateStr = formatDate(expectedDate);

            if (completion.date === expectedDateStr) {
                currentStreak++;
                expectedDate = subDays(expectedDate, 1);
            } else {
                break;
            }
        }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    // Sort ascending for longest streak calculation
    const ascendingCompletions = [...habitCompletions].sort((a, b) => a.date.localeCompare(b.date));

    for (const completion of ascendingCompletions) {
        const completionDate = parseISO(completion.date);

        if (lastDate === null) {
            tempStreak = 1;
        } else {
            const daysDiff = differenceInDays(completionDate, lastDate);
            if (daysDiff === 1) {
                tempStreak++;
            } else if (daysDiff > 1) {
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

// Get statistics for a specific habit for a specific month
// Get statistics for a specific habit for a specific month
export function getMonthlyHabitStats(
    habit: Habit,
    completions: Completion[],
    monthDate: Date
): HabitStats {
    const monthStart = startOfMonth(monthDate);
    // Use startOfDay for monthEnd to ensure consistent day difference calculation
    const monthEnd = startOfDay(endOfMonth(monthDate));
    const today = startOfDay(new Date());

    // Determine cutoff date (archive date or null)
    const archiveDate = habit.archivedAt ? startOfDay(parseISO(habit.archivedAt)) : null;

    // Filter completions for this month
    // Note: We use endOfMonth(monthDate) (original 23:59) for filtering to include the whole last day
    const completionMonthEnd = endOfMonth(monthDate);
    const habitCompletions = completions.filter(c => {
        if (c.habitId !== habit.id || !c.completed) return false;
        const completionDate = parseISO(c.date);

        // If archived, don't count completions after archive date
        if (archiveDate && completionDate > archiveDate) return false;

        return completionDate >= monthStart && completionDate <= completionMonthEnd;
    });

    const completedDays = habitCompletions.length;

    // Calculate total days
    // Start count from either the 1st of the month OR the habit creation date (whichever is later)
    const habitCreatedDate = startOfDay(parseISO(habit.createdAt));
    const effectiveStartDate = habitCreatedDate > monthStart ? habitCreatedDate : monthStart;

    // For current month, we want count up to today. For past months, up to end of month.
    let effectiveEndDate = monthEnd;
    if (isBefore(today, monthEnd)) {
        effectiveEndDate = today;
    }

    // If habit is archived, cap the effectiveEndDate at the archive date
    if (archiveDate && archiveDate < effectiveEndDate) {
        effectiveEndDate = archiveDate;
    }

    // If habit was created after the month ended (or after effective end), returns 0
    if (effectiveStartDate > effectiveEndDate) {
        return {
            habitId: habit.id,
            habitName: habit.name,
            totalDays: 0,
            completedDays: 0,
            currentStreak: 0,
            longestStreak: 0,
            completionRate: 0
        };
    }

    // If we are viewing future months
    if (monthStart > today) {
        return {
            habitId: habit.id,
            habitName: habit.name,
            totalDays: 0,
            completedDays: 0,
            currentStreak: 0,
            longestStreak: 0,
            completionRate: 0
        };
    }

    // If the entire relevant period is after archive date (e.g. viewing next month after archive)
    if (archiveDate && effectiveStartDate > archiveDate) {
        return {
            habitId: habit.id,
            habitName: habit.name,
            totalDays: 0,
            completedDays: 0,
            currentStreak: 0,
            longestStreak: 0,
            completionRate: 0
        };
    }

    let totalDays = differenceInDays(effectiveEndDate, effectiveStartDate) + 1;
    if (totalDays < 0) totalDays = 0;

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

// Get all habit statistics for a specific month
export function getAllMonthlyHabitStats(
    habits: Habit[],
    completions: Completion[],
    monthDate: Date
): HabitStats[] {
    return habits.map(habit => getMonthlyHabitStats(habit, completions, monthDate));
}

// Get all habit statistics (Legacy/All-time)
export function getAllHabitStats(
    habits: Habit[],
    completions: Completion[]
): HabitStats[] {
    return habits.map(habit => getHabitStats(habit, completions));
}
