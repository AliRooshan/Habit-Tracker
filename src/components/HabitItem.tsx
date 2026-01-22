import type { Habit } from '../types';

interface HabitItemProps {
    habit: Habit;
    completed: boolean;
    onToggle: () => void;
    onDelete?: () => void;
    disabled?: boolean;
}

import { useTheme } from '../context/ThemeContext';

interface HabitItemProps {
    habit: Habit;
    completed: boolean;
    onToggle: () => void;
    onDelete?: () => void;
    disabled?: boolean;
}

export default function HabitItem({ habit, completed, onToggle, onDelete, disabled }: HabitItemProps) {
    const { isBatman } = useTheme();

    return (
        <div
            className={`
                relative group cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden border backdrop-blur-md
                ${disabled ? 'opacity-50 cursor-wait' : 'hover:scale-[1.01] hover:-translate-y-0.5'}
                ${completed
                    ? isBatman
                        ? 'bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-gold-500/30 shadow-[0_4px_12px_rgba(250,204,21,0.05)]'
                        : 'bg-gradient-to-r from-stone-50 to-stone-100/50 bg-premium-texture border-stone-200 shadow-sm opacity-90'
                    : isBatman
                        ? 'bg-gray-800/40 border-gray-700 hover:border-gray-600 hover:bg-gray-800/60 shadow-lg'
                        : 'bg-white/60 bg-premium-texture border-stone-200 hover:border-brown-300/50 hover:bg-white/80 shadow-sm hover:shadow-md'
                }
            `}
            onClick={!disabled ? onToggle : undefined}
        >
            {/* Card Content */}
            <div className="relative p-4 sm:p-5 transition-all duration-300">
                <div className="relative z-10 flex items-center space-x-4">
                    {/* Modern Checkbox */}
                    <div className="relative flex-shrink-0">
                        <input
                            type="checkbox"
                            checked={completed}
                            onChange={onToggle}
                            disabled={disabled}
                            className="sr-only"
                        />
                        <div
                            className={`
                                relative w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-500
                                ${completed
                                    ? isBatman
                                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-[0_0_10px_rgba(250,204,21,0.4)] scale-110'
                                        : 'bg-gradient-to-br from-sand-700 to-sand-900 shadow-lg shadow-sand-800/40 scale-110'
                                    : isBatman
                                        ? 'border-2 border-gray-600 bg-gray-800/50 hover:border-gold-500/50 group-hover:bg-gray-700'
                                        : 'border-2 border-stone-300 bg-white/50 hover:border-brown-400 group-hover:bg-white'
                                }
                            `}
                        >
                            {completed && (
                                <svg
                                    className={`w-4 h-4 transform transition-all duration-500 text-white`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    style={{ animation: 'check-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Habit Name */}
                    <div className="flex-1 min-w-0">
                        <h3
                            className={`
                                text-base sm:text-lg font-bold transition-all duration-300 truncate tracking-tight
                                ${completed
                                    ? isBatman
                                        ? 'text-gray-500 line-through decoration-yellow-600/50 decoration-2'
                                        : 'text-stone-500 line-through decoration-stone-400/50 decoration-2'
                                    : isBatman
                                        ? 'text-gray-100 group-hover:text-white'
                                        : 'text-brown-900 group-hover:text-brown-700'
                                }
                            `}
                        >
                            {habit.name}
                        </h3>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                className={`
                                    p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200
                                    ${isBatman
                                        ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/20'
                                        : 'text-stone-400 hover:text-red-600 hover:bg-red-50'
                                    }
                                `}
                                title="Delete habit"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

