import { supabase } from './supabase';
import type { Habit, Completion } from '../types';

// Habit CRUD operations
export async function getAllHabits(): Promise<Habit[]> {
    const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching habits:', error);
        return [];
    }

    // Map snake_case DB to camelCase TS
    return (data || []).map((h: any) => ({
        id: h.id,
        name: h.name,
        createdAt: h.created_at,
        active: h.active ?? true
    }));
}

export async function getHabit(id: string): Promise<Habit | undefined> {
    const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching habit:', error);
        return undefined;
    }

    return {
        id: data.id,
        name: data.name,
        createdAt: data.created_at
    };
}

export async function addHabit(habit: Habit): Promise<void> {
    // Check if habit exists (even if archived) to restore it
    const { data: existing } = await supabase
        .from('habits')
        .select('*')
        .eq('name', habit.name)
        .maybeSingle();

    if (existing) {
        // Restore existing habit
        const { error } = await supabase
            .from('habits')
            .update({ active: true })
            .eq('id', existing.id);

        if (error) console.error('Error restoring habit:', error);
        return;
    }

    // Create new habit
    const { error } = await supabase
        .from('habits')
        .insert([{
            name: habit.name,
            created_at: habit.createdAt,
            active: true
        }]);

    if (error) {
        console.error('Error adding habit:', error);
    }
}

export async function deleteHabit(id: string, hardDelete: boolean = false): Promise<void> {
    if (hardDelete) {
        // Hard delete: Remove from DB completely
        await supabase.from('completions').delete().eq('habit_id', id);
        const { error } = await supabase.from('habits').delete().eq('id', id);

        if (error) console.error('Error deleting habit:', error);
    } else {
        // Soft delete: Mark as inactive
        const { error } = await supabase
            .from('habits')
            .update({ active: false })
            .eq('id', id);

        if (error) console.error('Error archiving habit:', error);
    }
}

export async function restoreHabit(id: string): Promise<void> {
    const { error } = await supabase
        .from('habits')
        .update({ active: true })
        .eq('id', id);

    if (error) console.error('Error restoring habit:', error);
}

// Completion CRUD operations
export async function getCompletion(habitId: string, date: string): Promise<Completion | undefined> {
    const { data, error } = await supabase
        .from('completions')
        .select('*')
        .eq('habit_id', habitId)
        .eq('date', date)
        .maybeSingle();

    if (error || !data) return undefined;

    return {
        id: data.id,
        habitId: data.habit_id,
        date: data.date,
        completed: data.completed
    };
}

export async function getCompletionsByDate(date: string): Promise<Completion[]> {
    const { data, error } = await supabase
        .from('completions')
        .select('*')
        .eq('date', date);

    if (error) {
        console.error('Error fetching completions by date:', error);
        return [];
    }

    return (data || []).map((c: any) => ({
        id: c.id,
        habitId: c.habit_id,
        date: c.date,
        completed: c.completed
    }));
}

export async function getCompletionsByHabit(habitId: string): Promise<Completion[]> {
    const { data, error } = await supabase
        .from('completions')
        .select('*')
        .eq('habit_id', habitId);

    if (error) {
        console.error('Error fetching completions by habit:', error);
        return [];
    }

    return (data || []).map((c: any) => ({
        id: c.id,
        habitId: c.habit_id,
        date: c.date,
        completed: c.completed
    }));
}

export async function getAllCompletions(): Promise<Completion[]> {
    const { data, error } = await supabase
        .from('completions')
        .select('*');

    if (error) {
        console.error('Error fetching all completions:', error);
        return [];
    }

    return (data || []).map((c: any) => ({
        id: c.id,
        habitId: c.habit_id,
        date: c.date,
        completed: c.completed
    }));
}

export async function toggleCompletion(habitId: string, date: string): Promise<boolean> {
    const existing = await getCompletion(habitId, date);
    const newStatus = existing ? !existing.completed : true;
    const id = existing?.id || `${habitId}-${date}`;

    const { error } = await supabase
        .from('completions')
        .upsert({
            id: id,
            habit_id: habitId,
            date: date,
            completed: newStatus
        });

    if (error) {
        console.error('Error toggling completion:', error);
        return existing ? existing.completed : false;
    }

    return newStatus;
}

// Deprecated or Unused
export async function initializeDefaultHabits(): Promise<void> {
    // No-op for Supabase
}
