import { useState } from 'react';
import type { Habit } from '../types';
import { deleteHabit } from '../lib/db';
import AddHabitModal from './AddHabitModal';
import ConfirmationModal from './ConfirmationModal';

interface HabitsViewProps {
    habits: Habit[];
    onDataChange: () => void;
}

export default function HabitsView({ habits, onDataChange }: HabitsViewProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

    const handleDeleteClick = (habit: Habit) => {
        setHabitToDelete(habit);
    };

    const confirmDelete = async () => {
        if (!habitToDelete) return;

        try {
            await deleteHabit(habitToDelete.id);
            await onDataChange();
        } catch (error) {
            console.error('Error deleting habit:', error);
        } finally {
            setHabitToDelete(null);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            {/* Enhanced Header Section */}
            <div className="card-glass p-3 sm:p-4 md:p-8 shiny-element">
                {/* Shimmer overlay handled by shiny-element */}

                <div className="relative z-10 flex flex-col md:flex-row md:justify-between items-center gap-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-premium-gradient tracking-tight text-center md:text-left">Manage Habits</h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary w-full md:w-auto max-w-md px-6 py-2.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all duration-300"
                        title="Add New Habit"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-sm sm:text-base">Add New</span>
                    </button>
                </div>
            </div>

            {/* Enhanced Habit Cards */}
            <div className="grid gap-4">
                {habits.map((habit, index) => (
                    <div
                        key={habit.id}
                        className="card-glass group relative overflow-hidden hover-glow animate-slide-up-fade"
                        style={{ animationDelay: `${index * 0.08}s` }}
                    >
                        {/* Gradient border on hover */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sand-300 via-brown-200 to-sand-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '2px' }}>
                            <div className="w-full h-full bg-white/90 rounded-[14px]"></div>
                        </div>

                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>

                        <div className="relative z-10 flex items-center justify-between p-4 sm:p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-brown-500 to-brown-700 group-hover:scale-125 transition-transform duration-300"></div>
                                <div>
                                    <h3 className="text-lg font-medium text-brown-900 group-hover:text-brown-800 transition-colors">{habit.name}</h3>
                                    <p className="text-xs text-brown-500">
                                        Created {new Date(habit.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDeleteClick(habit)}
                                className="p-2 text-brown-400 hover:text-red-500 hover:bg-red-50/80 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-[0_4px_12px_rgba(239,68,68,0.25)] hover:scale-110"
                                title="Delete Habit"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {habits.length === 0 && (
                <div className="text-center py-20 card-glass relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-sand-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 animate-float">
                        <div className="text-5xl mb-4 animate-bounce-subtle">📝</div>
                        <p className="text-brown-600 text-lg font-medium">No habits found</p>
                        <p className="text-brown-500 mt-1">Start by adding your first habit!</p>
                    </div>
                </div>
            )}

            {showAddModal && (
                <AddHabitModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={onDataChange}
                />
            )}

            {habitToDelete && (
                <ConfirmationModal
                    message={
                        <>
                            Are you sure you want to delete <span className="font-bold">"{habitToDelete.name}"</span>?
                        </>
                    }
                    confirmText="Delete"
                    confirmVariant="danger"
                    onClose={() => setHabitToDelete(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
}
