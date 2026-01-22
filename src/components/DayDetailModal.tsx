import type { Habit, Completion } from '../types';
import { getDayData } from '../lib/analytics';
import { useTheme } from '../context/ThemeContext';

interface DayDetailModalProps {
    date: string;
    habits: Habit[];
    completions: Completion[];
    onClose: () => void;
}

export default function DayDetailModal({ date, habits, completions, onClose }: DayDetailModalProps) {
    const dayData = getDayData(date, habits, completions);
    const { isBatman } = useTheme();

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={onClose}
        >
            <div
                className={`
                    relative w-full max-w-xs sm:max-w-sm rounded-[24px] overflow-hidden shadow-2xl animate-scale-in
                    ${isBatman
                        ? 'bg-gray-900/90 border border-gray-700/50 text-gray-100'
                        : 'bg-white/90 border border-white/50 text-brown-900'}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Premium Background Effects */}
                <div className={`absolute inset-0 z-0 pointer-events-none ${isBatman
                    ? 'bg-gradient-to-br from-gray-800/50 via-transparent to-black/50'
                    : 'bg-gradient-to-br from-sand-100/50 via-white/30 to-sand-200/30'
                    }`}></div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent z-0 pointer-events-none"></div>

                <div className="relative z-10 p-5 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isBatman ? 'text-gold-500' : 'text-brown-500'}`}>
                                {new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}
                            </p>
                            <h2 className={`text-xl sm:text-2xl font-black tracking-tight leading-none ${isBatman ? 'text-gold-500' : 'text-brown-500'}`}>
                                {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </h2>
                            <div className="flex items-center gap-2 mt-2">
                                <div className={`h-1.5 w-16 rounded-full overflow-hidden ${isBatman ? 'bg-gray-800' : 'bg-sand-200'}`}>
                                    <div
                                        className={`h-full rounded-full ${isBatman ? 'bg-gold-400' : 'bg-brown-500'}`}
                                        style={{ width: `${dayData.completionPercentage}%` }}
                                    ></div>
                                </div>
                                <span className={`text-xs font-medium ${isBatman ? 'text-gray-400' : 'text-brown-400'}`}>
                                    {Math.round(dayData.completionPercentage)}% done
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${isBatman
                                ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                                : 'bg-sand-100 text-brown-400 hover:text-brown-700 hover:bg-sand-200'}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Habits List */}
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                        {dayData.habits.length === 0 ? (
                            <div className={`text-center py-8 rounded-xl border-2 border-dashed ${isBatman ? 'border-gray-800 bg-gray-900/50' : 'border-sand-200 bg-sand-50/50'}`}>
                                <p className="text-2xl mb-2">😴</p>
                                <p className={`text-xs font-medium ${isBatman ? 'text-gray-500' : 'text-brown-400'}`}>
                                    No habits scheduled
                                </p>
                            </div>
                        ) : (
                            dayData.habits.map((habit) => (
                                <div
                                    key={habit.id}
                                    className={`
                                        group relative overflow-hidden p-3 rounded-xl border transition-all duration-300
                                        ${habit.completed
                                            ? isBatman
                                                ? 'bg-gradient-to-r from-gray-800 to-gray-800/80 border-gold-500/30'
                                                : 'bg-gradient-to-r from-white to-sand-100 border-sand-200'
                                            : isBatman
                                                ? 'bg-gray-900/50 border-gray-800 opacity-60'
                                                : 'bg-sand-100 border-transparent opacity-70'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div
                                            className={`
                                                w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all
                                                ${habit.completed
                                                    ? isBatman
                                                        ? 'bg-gold-500 border-gold-500 text-black shadow-[0_0_10px_rgba(250,204,21,0.3)]'
                                                        : 'bg-sand-600 border-sand-600 text-white shadow-md'
                                                    : isBatman
                                                        ? 'border-gray-600 group-hover:border-gray-400'
                                                        : 'border-sand-300 group-hover:border-brown-400'
                                                }
                                            `}
                                        >
                                            {habit.completed && (
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span
                                            className={`text-sm font-semibold truncate ${habit.completed
                                                ? isBatman ? 'text-gray-100' : 'text-sand-800'
                                                : isBatman ? 'text-gray-500' : 'text-sand-400'
                                                }`}
                                        >
                                            {habit.name}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
