import { useState } from 'react';
import type { FormEvent } from 'react';
import { addHabit, getAllHabits } from '../lib/db';
import { generateId } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

interface AddHabitModalProps {
    onClose: () => void;
    onAdd: () => void;
}

export default function AddHabitModal({ onClose, onAdd }: AddHabitModalProps) {
    const [habitName, setHabitName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isBatman } = useTheme();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!habitName.trim()) return;

        setIsSubmitting(true);
        setError(null);
        try {
            // Check for potential duplicates
            const existingHabits = await getAllHabits();
            const normalize = (s: string) => s.trim().toLowerCase();
            const isDuplicate = existingHabits.some(
                h => normalize(h.name) === normalize(habitName) && h.active !== false
            );

            if (isDuplicate) {
                setError('This habit already exists!');
                setIsSubmitting(false);
                return;
            }

            await addHabit({
                id: generateId(),
                name: habitName.trim(),
                createdAt: new Date().toISOString(),
            });

            // Close modal first
            onClose();

            // Call onAdd asynchronously without awaiting to prevent errors from showing
            onAdd();
        } catch (error) {
            console.error('Error adding habit:', error);
            setError('Failed to add habit. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div
                className={`max-w-md w-full animate-scale-in p-5 sm:p-6 md:p-8 rounded-2xl shadow-2xl border-2 ${isBatman
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black border-gray-700'
                    : 'bg-white/80 backdrop-blur-xl border-sand-200'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xl sm:text-2xl font-bold ${isBatman ? 'text-gold-400' : 'text-brown-900'}`}>Add New Habit</h2>
                    <button
                        onClick={onClose}
                        className={`transition-colors ${isBatman ? 'text-gray-400 hover:text-gray-200' : 'text-brown-400 hover:text-brown-600'}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="habitName" className={`block text-sm font-medium mb-2 ${isBatman ? 'text-gray-300' : 'text-brown-700'}`}>
                            Habit Name
                        </label>
                        <input
                            id="habitName"
                            type="text"
                            value={habitName}
                            onChange={(e) => {
                                setHabitName(e.target.value);
                                setError(null);
                            }}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${error
                                ? 'border-red-500 focus:ring-red-200'
                                : isBatman
                                    ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20'
                                    : 'bg-white border-sand-300 text-brown-900 placeholder-brown-400 focus:border-brown-500 focus:ring-2 focus:ring-brown-500/20'
                                } outline-none`}
                            placeholder="e.g., Drink 8 glasses of water"
                            autoFocus
                            maxLength={50}
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </p>
                        )}
                        {!error && (
                            <p className={`mt-2 text-sm ${isBatman ? 'text-gray-400' : 'text-brown-500'}`}>
                                This habit will start tracking from today
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${isBatman
                                ? 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-300 border-gray-700 shadow-lg'
                                : 'bg-gradient-to-r from-sand-200 to-sand-300 hover:from-sand-300 hover:to-sand-400 text-brown-800 border-sand-400 shadow-md'
                                }`}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${isBatman
                                ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black border-yellow-600 shadow-lg disabled:opacity-60'
                                : 'bg-gradient-to-r from-sand-600 to-sand-700 hover:from-sand-700 hover:to-sand-800 text-white border-sand-800 shadow-md'
                                } active:scale-[0.98]`}
                            disabled={!habitName.trim() || isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Habit'}
                        </button>


                    </div>
                </form>
            </div>
        </div>
    );
}
