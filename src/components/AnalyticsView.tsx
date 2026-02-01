import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, parseISO, startOfDay, format, addMonths, subMonths } from 'date-fns';
import type { Habit, Completion } from '../types';
import { getAllMonthlyHabitStats } from '../lib/analytics';
import { getMonthName } from '../lib/utils';

interface AnalyticsViewProps {
    habits: Habit[];
    completions: Completion[];
}

export default function AnalyticsView({ habits, completions }: AnalyticsViewProps) {
    const { isBatman } = useTheme();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const habitStats = getAllMonthlyHabitStats(habits, completions, currentMonth);

    const today = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const handlePrevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className={`text-center mb-8 card-gradient-border shiny-element hover-glow p-4 sm:p-6 md:p-8 relative overflow-hidden group ${isBatman ? 'card-glass bg-gray-900/80' : 'card-glass'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-premium-gradient tracking-tight">
                        Your Journey
                    </h2>
                </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-2">
                <button
                    onClick={handlePrevMonth}
                    className={`p-2 sm:p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-x-0.5 ${isBatman
                        ? 'bg-gray-800/50 hover:bg-gray-700 hover:shadow-[0_4px_20px_rgba(250,204,21,0.15)] text-gold-400'
                        : 'bg-white/50 hover:bg-white/80 hover:shadow-[0_4px_20px_rgba(155,130,100,0.25)] text-brown-700'
                        }`}
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="text-center min-w-[200px]">
                    <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isBatman ? 'text-gradient-gold' : 'text-premium-gradient'}`}>
                        {getMonthName(currentMonth)}
                    </h2>
                </div>

                <button
                    onClick={handleNextMonth}
                    className={`p-2 sm:p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:translate-x-0.5 ${isBatman
                        ? 'bg-gray-800/50 hover:bg-gray-700 hover:shadow-[0_4px_20px_rgba(250,204,21,0.15)] text-gold-400'
                        : 'bg-white/50 hover:bg-white/80 hover:shadow-[0_4px_20px_rgba(155,130,100,0.25)] text-brown-700'
                        }`}
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Habit Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-2 sm:gap-6">
                {habitStats.map((stat, index) => (
                    <div
                        key={stat.habitId}
                        className={`card-gradient-border group hover-glow animate-slide-up-fade p-2 sm:p-6 md:p-8 flex flex-col items-center text-center ${isBatman ? 'card-glass bg-gray-900/60' : 'card-glass'}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>

                        <div className="relative z-10 w-full flex flex-col items-center">
                            {/* Title & Icon - Centered at Top */}
                            <h3 className={`text-xs sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 flex items-center justify-center gap-1 sm:gap-3 ${isBatman ? 'text-gray-100' : 'text-brown-900'}`}>
                                {stat.habitName}
                            </h3>

                            <div className="w-full flex flex-row items-stretch gap-2 sm:gap-4">
                                {/* Left Side: Progress, Stats */}
                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                    <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-3 w-full">
                                        <div className="grid grid-cols-2 gap-1 w-full">
                                            <div className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all duration-300 group/stat h-full text-center hover:-translate-y-1 hover:shadow-lg ${isBatman ? 'bg-gray-900/50 border-gray-700 backdrop-blur-md' : 'bg-white/60 border-sand-200/50 backdrop-blur-md'}`}>
                                                <p className={`text-[6px] sm:text-xs mb-0.5 font-bold tracking-wide ${isBatman ? 'text-gray-400' : 'text-brown-600'}`}>Total</p>
                                                <p className={`text-xs sm:text-lg font-black stat-number ${isBatman ? 'text-yellow-400' : 'text-brown-900'}`}>
                                                    {stat.totalDays}
                                                </p>
                                            </div>
                                            <div className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all duration-300 group/stat h-full text-center hover:-translate-y-1 hover:shadow-lg ${isBatman ? 'bg-gray-900/50 border-gray-700 backdrop-blur-md' : 'bg-white/60 border-sand-200/50 backdrop-blur-md'}`}>
                                                <p className={`text-[6px] sm:text-xs mb-0.5 font-bold tracking-wide ${isBatman ? 'text-gray-400' : 'text-brown-600'}`}>Done</p>
                                                <p className={`text-xs sm:text-lg font-black stat-number ${isBatman ? 'text-yellow-400' : 'text-brown-900'}`}>
                                                    {stat.completedDays}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="w-full flex items-center gap-1 sm:gap-3 px-1">
                                            <div className={`flex-grow h-1.5 sm:h-3.5 rounded-full overflow-hidden shadow-inner border ${isBatman ? 'bg-gray-800 border-gray-700' : 'bg-sand-200 border-sand-300/50'}`}>
                                                <div
                                                    className={`h-full transition-all duration-1000 ease-out rounded-full relative overflow-hidden ${isBatman
                                                        ? 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                                                        : 'bg-gradient-to-r from-sand-600 via-sand-800 to-sand-900 shadow-[0_0_12px_rgba(60,30,10,0.6)]'
                                                        }`}
                                                    style={{ width: `${stat.completionRate}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Calendar */}
                                <div className="flex flex-col items-center justify-center min-w-[35%] py-0 relative">
                                    <div className={`flex flex-col items-center justify-center p-2 rounded-xl border w-full h-full transition-all duration-300 group/stat hover:shadow-lg ${isBatman ? 'bg-gray-900/50 border-gray-700 backdrop-blur-md' : 'bg-white/60 border-sand-200/50 backdrop-blur-md'}`}>
                                        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 place-items-center">
                                            {/* Empty cells for days before month starts */}
                                            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                                                <div key={`empty-${index}`} className="w-1.5 h-1.5 sm:w-3.5 sm:h-3.5" />
                                            ))}
                                            {monthDays.map((day, dIndex) => {
                                                const habit = habits.find(h => h.id === stat.habitId);
                                                const habitCreated = habit ? startOfDay(parseISO(habit.createdAt)) : today;
                                                const archiveDate = habit?.archivedAt ? startOfDay(parseISO(habit.archivedAt)) : null;

                                                const isBeforeStart = isBefore(day, habitCreated);
                                                const isAfterArchive = archiveDate ? isBefore(archiveDate, day) : false;

                                                const isDateCompleted = completions.some(c => c.habitId === stat.habitId && c.completed && isSameDay(parseISO(c.date), day));
                                                const isMissed = !isDateCompleted && !isBeforeStart && !isAfterArchive && isBefore(day, startOfDay(today));

                                                let bgClass = isBatman ? 'bg-gray-800' : 'bg-sand-300';

                                                if (isBeforeStart || isAfterArchive) {
                                                    bgClass = isBatman ? 'bg-white opacity-10' : 'bg-sand-200 opacity-40'; // Dimmer for invalid days
                                                    // Optionally make them invisible or completely different style
                                                }
                                                else if (isDateCompleted) bgClass = 'bg-green-300 border border-green-700';
                                                else if (isMissed) bgClass = 'bg-red-300 border border-red-700';

                                                const isToday = isSameDay(day, today);

                                                return (
                                                    <div
                                                        key={dIndex}
                                                        className={`w-2 h-2 sm:w-3.5 sm:h-3.5 rounded-[2px] sm:rounded-sm ${bgClass} ${isToday ? 'ring-1 ring-offset-1 ring-brown-400' : ''}`}
                                                        title={format(day, 'MMM d')}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {habitStats.length === 0 && (
                <div className="text-center py-16 card-glass">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="text-brown-500 text-lg">No analytics yet. Start tracking habits to see your progress!</p>
                </div>
            )}
        </div>
    );
}
