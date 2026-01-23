import { useState } from 'react';
import type { Habit } from '../types';
import { deleteHabit, restoreHabit } from '../lib/db';
import AddHabitModal from './AddHabitModal';
import { useTheme } from '../context/ThemeContext';

interface HabitsViewProps {
    habits: Habit[];
    onDataChange: () => void;
}

export default function HabitsView({ habits, onDataChange }: HabitsViewProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
    const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');

    const { isBatman } = useTheme();

    const activeHabits = habits.filter(h => h.active !== false);
    const archivedHabits = habits.filter(h => h.active === false);

    let displayedHabits = viewMode === 'active' ? activeHabits : archivedHabits;



    const handleDeleteClick = (habit: Habit) => {
        setHabitToDelete(habit);
    };

    const handleRestore = async (habit: Habit) => {
        try {
            await restoreHabit(habit.id);
            await onDataChange();
        } catch (error) {
            console.error('Error restoring habit:', error);
        }
    };

    const confirmDelete = async (hardDelete: boolean) => {
        if (!habitToDelete) return;

        try {
            await deleteHabit(habitToDelete.id, hardDelete);
            await onDataChange();
        } catch (error) {
            console.error('Error deleting habit:', error);
        } finally {
            setHabitToDelete(null);
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            {/* Enhanced Header Section used to be space-y-8, reducing gap for tabs */}
            <div className="card-glass p-3 sm:p-4 md:p-6 shiny-element flex flex-col gap-4 sm:gap-6">

                <div className="relative z-10 flex flex-col md:flex-row md:justify-between items-center gap-4">
                    <h2 className="order-1 text-3xl sm:text-4xl md:text-5xl font-black text-premium-gradient tracking-tight text-center md:text-left">
                        Manage Habits
                    </h2>

                    {/* Tabs for Active / Archived */}
                    <div className="order-3 md:order-2 relative z-10 flex p-1 bg-black/5 dark:bg-white/5 rounded-xl self-center border border-black/5">
                        <button
                            onClick={() => setViewMode('active')}
                            className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${viewMode === 'active'
                                ? isBatman
                                    ? 'bg-gray-800 text-gold-400 shadow-md ring-1 ring-gold-400/20'
                                    : 'bg-white text-brown-900 shadow-md ring-1 ring-black/5'
                                : isBatman
                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                    : 'text-brown-600 hover:text-brown-800 hover:bg-black/5'
                                }`}
                        >
                            Active <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${viewMode === 'active' ? 'bg-black/10' : 'bg-transparent'}`}>{activeHabits.length}</span>
                        </button>
                        <button
                            onClick={() => setViewMode('archived')}
                            className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${viewMode === 'archived'
                                ? isBatman
                                    ? 'bg-gray-800 text-gold-400 shadow-md ring-1 ring-gold-400/20'
                                    : 'bg-white text-brown-900 shadow-md ring-1 ring-black/5'
                                : isBatman
                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                    : 'text-brown-600 hover:text-brown-800 hover:bg-black/5'
                                }`}
                        >
                            Archived <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${viewMode === 'archived' ? 'bg-black/10' : 'bg-transparent'}`}>{archivedHabits.length}</span>
                        </button>
                    </div>

                    <div className="order-2 md:order-3 flex items-center justify-center w-full md:w-auto">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="btn-primary w-full max-w-xs md:w-auto px-6 py-2.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            title="Add New Habit"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-sm sm:text-base">Add New</span>
                        </button>
                    </div>
                </div>


            </div>

            {/* Enhanced Habit Cards */}
            <div className="grid gap-4">
                {displayedHabits.map((habit, index) => (
                    <div
                        key={habit.id}
                        className="card-glass group relative overflow-hidden hover-glow animate-slide-up-fade"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        {/* Gradient border on hover */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sand-300 via-brown-200 to-sand-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '2px' }}>
                            <div className="w-full h-full bg-white/90 rounded-[14px]"></div>
                        </div>

                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>

                        <div className="relative z-10 flex items-center justify-between p-4 sm:p-5">
                            <div className="flex items-center gap-3">
                                {habit.active !== false && (
                                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-brown-500 to-brown-700 transition-transform duration-300 group-hover:scale-125"></div>
                                )}
                                <div>
                                    <h3 className={`text-lg font-medium transition-colors ${habit.active !== false
                                        ? 'text-brown-900 group-hover:text-brown-800'
                                        : 'text-brown-500/80'
                                        }`}>{habit.name}</h3>
                                    <p className="text-xs text-brown-500">
                                        Created {new Date(habit.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Restore Button for Archived Habits */}
                                {habit.active === false && (
                                    <button
                                        onClick={() => handleRestore(habit)}
                                        className="p-2 text-brown-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 hover:scale-110"
                                        title="Restore Habit"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDeleteClick(habit)}
                                    className="p-2 text-brown-400 hover:text-red-500 hover:bg-red-50/80 rounded-xl opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-[0_4px_12px_rgba(239,68,68,0.25)] hover:scale-110"
                                    title={habit.active === false ? "Delete Permanently" : "Delete Habit"}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {displayedHabits.length === 0 && (
                <div className="text-center py-20 card-glass relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-sand-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 animate-float">
                        <p className="text-brown-600 text-lg font-medium">No {viewMode} habits found</p>
                        {viewMode === 'active' && (
                            <p className="text-brown-500 mt-1">Start by adding your first habit!</p>
                        )}
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className={`max-w-md w-full animate-scale-in p-6 rounded-2xl shadow-2xl border-2 ${isBatman ? 'bg-gray-900 border-gray-700' : 'bg-white/80 border-sand-200 backdrop-blur-xl'
                        }`}>
                        <h3 className={`text-xl font-bold mb-3 ${isBatman ? 'text-gold-400' : 'text-brown-900'}`}>
                            {habitToDelete.active !== false ? 'Delete Habit' : 'Delete Permanently'}
                        </h3>
                        <p className={`mb-6 text-lg ${isBatman ? 'text-gray-300' : 'text-brown-700'}`}>
                            {habitToDelete.active !== false ? (
                                <>Do you want to archive or permanently delete <span className="font-bold">"{habitToDelete.name}"</span>?</>
                            ) : (
                                <>Are you sure you want to permanently delete <span className="font-bold">"{habitToDelete.name}"</span>? This action cannot be undone.</>
                            )}
                        </p>

                        <div className="flex flex-col gap-3">
                            {habitToDelete.active !== false && (
                                <button
                                    onClick={() => confirmDelete(false)}
                                    className={`w-full py-3 rounded-xl font-semibold border-2 transition-all ${isBatman
                                        ? 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700'
                                        : 'bg-sand-100 border-sand-300 text-brown-800 hover:bg-sand-200'
                                        }`}>
                                    Archive
                                </button>
                            )}
                            <button
                                onClick={() => confirmDelete(true)}
                                className={`w-full py-3 rounded-xl font-semibold border-2 transition-all ${isBatman
                                    ? 'bg-red-900/30 border-red-800 text-red-400 hover:bg-red-900/50'
                                    : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                                    }`}>
                                Delete {habitToDelete.active !== false ? 'Completely' : 'Permanently'}
                            </button>
                            <button
                                onClick={() => setHabitToDelete(null)}
                                className={`mt-2 w-full py-2 rounded-xl font-medium transition-all ${isBatman ? 'text-gray-400 hover:text-gray-200' : 'text-brown-400 hover:text-brown-600'
                                    }`}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
