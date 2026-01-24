import { useState } from 'react';
import type { Habit, Completion } from '../types';
import { getTodayString, calculateDailyCompletion, getDayData } from '../lib/analytics';
import { toggleCompletion } from '../lib/db';
import HabitItem from './HabitItem';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { useTheme } from '../context/ThemeContext';

interface TodayViewProps {
    habits: Habit[];
    completions: Completion[];
    onDataChange: () => void;
}

export default function TodayView({ habits, completions, onDataChange }: TodayViewProps) {
    const [togglingHabit, setTogglingHabit] = useState<string | null>(null);
    const { isBatman } = useTheme();

    const today = getTodayString();
    const todayCompletions = completions.filter(c => c.date === today);
    const completionPercentage = calculateDailyCompletion(habits, todayCompletions);

    // Get current month days for mini calendar
    const currentDate = new Date();
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const getCompletionStatus = (date: Date): 'none' | 'partial' | 'full' | 'future' => {
        if (date > currentDate) return 'future';
        const dateString = format(date, 'yyyy-MM-dd');
        const dayData = getDayData(dateString, habits, completions);
        if (dayData.habits.length === 0) return 'none';
        if (dayData.completionPercentage === 100) return 'full';
        if (dayData.completionPercentage > 0) return 'partial';
        return 'none';
    };

    const handleToggle = async (habitId: string) => {
        setTogglingHabit(habitId);
        try {
            await toggleCompletion(habitId, today);
            await onDataChange();
        } catch (error) {
            console.error('Error toggling habit:', error);
        } finally {
            setTogglingHabit(null);
        }
    };

    const isHabitCompleted = (habitId: string): boolean => {
        const completion = todayCompletions.find(c => c.habitId === habitId);
        return completion?.completed || false;
    };

    return (
        <div className="animate-fade-in">
            {/* Enhanced Stats Card */}
            {/* Enhanced Stats Card */}
            {/* Enhanced Stats Card */}
            <div className="card-glass mb-6 sm:mb-8 shiny-element py-4 px-3 sm:py-6 sm:px-8 group">
                {/* Subtle shimmer overlay handled by shiny-element class */}

                <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 items-center gap-4 md:gap-8">
                    {/* Center Column: Text (Date) - Mobile: Top Left (Order 1) */}
                    <div className="order-1 md:order-2 col-span-2 md:col-span-1 text-center">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-premium-gradient tracking-tight mb-0.5 sm:mb-1">
                            {format(new Date(), 'EEEE')}
                        </h2>
                        <h3 className={`text-md sm:text-xl md:text-2xl font-bold mb-0.5 sm:mb-1 ${isBatman ? 'text-gray-300' : 'text-brown-600'}`}>
                            {format(new Date(), 'MMMM do')}
                        </h3>
                    </div>

                    {/* Right Column: Ring - Mobile: Top Right (Order 2) */}
                    <div className="order-3 md:order-3 col-span-1 md:col-span-1 flex justify-center items-center">
                        {/* Completion Ring */}
                        <div className="relative w-30 h-30 sm:w-40 sm:h-40 md:w-48 md:h-48 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                            {/* Enhanced Glow */}
                            <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-700 ${completionPercentage === 100
                                ? isBatman ? 'bg-yellow-300/40' : 'bg-amber-200/50'
                                : isBatman ? 'bg-yellow-400/20' : 'bg-amber-300/30'
                                }`}></div>

                            <svg className="transform -rotate-90 w-full h-full relative z-10 drop-shadow-lg" viewBox="0 0 120 120">
                                {/* Background circle */}
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className={`transition-colors duration-300 ${isBatman ? 'text-gray-800' : 'text-stone-200'}`}
                                />
                                {/* Progress circle */}
                                {completionPercentage > 0 && (
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="50"
                                        stroke={isBatman ? 'url(#progressGradientDarkLight)' : 'url(#progressGradientLight)'}
                                        strokeWidth="12"
                                        fill="transparent"
                                        strokeDasharray={`${2 * Math.PI * 50}`}
                                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - completionPercentage / 100)}`}
                                        className="transition-all duration-1000 ease-out"
                                        strokeLinecap={completionPercentage < 2 ? "round" : "round"}
                                    />
                                )}
                                <defs>
                                    <linearGradient id="progressGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#e6c9a8" /> {/* Lighter beige/brown */}
                                        <stop offset="100%" stopColor="#bfa07a" />
                                    </linearGradient>
                                    <linearGradient id="progressGradientDarkLight" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#fff5cc" /> {/* Very light gold */}
                                        <stop offset="100%" stopColor="#ffeb99" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <span className={`text-xl sm:text-4xl md:text-5xl font-black tracking-tighter ${isBatman ? 'text-yellow-200 drop-shadow-md' : 'text-stone-600'
                                    }`}>
                                    {Math.round(completionPercentage)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Left Column: Mini Calendar - Mobile: Bottom (Order 3, Full Width) */}
                    <div className="order-2 md:order-1 col-span-1 md:col-span-1 flex justify-center items-center">
                        <div className="flex flex-col items-center gap-2">

                            <div className={`p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-xl shadow-xl border-2 backdrop-blur-md ${isBatman
                                ? 'bg-gray-900/50 border-gray-700 hover:border-gold-500/50'
                                : 'bg-white/50 border-stone-200 hover:border-brown-400/50'
                                } transition-colors duration-300`}>
                                <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-1.5">
                                    {/* Empty cells for days before month starts */}
                                    {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                                        <div key={`empty-${index}`} className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                    ))}
                                    {/* Days of the month */}
                                    {daysInMonth.map((date, index) => {
                                        const status = getCompletionStatus(date);
                                        const isToday = isSameDay(date, currentDate);
                                        const future = status === 'future';

                                        // Determine styles based on status and theme matching CalendarView exactly
                                        let bgClass = '';
                                        let ringClass = '';
                                        let shadowClass = '';
                                        let borderClass = 'border';

                                        if (future) {
                                            bgClass = isBatman ? 'bg-transparent' : 'bg-transparent';
                                            borderClass = isBatman ? 'border border-gray-800' : 'border border-sand-200';
                                            shadowClass = '';
                                        } else if (status === 'full') {
                                            // 100% / Full / Perfect
                                            bgClass = isBatman
                                                ? 'bg-yellow-400' // Dark: Yellow
                                                : 'bg-sand-800';  // Light: Dark Brown
                                            borderClass = isBatman ? 'border-yellow-500' : 'border-sand-900';
                                            shadowClass = isBatman
                                                ? 'shadow-[0_4px_12px_rgba(250,204,21,0.4)]'
                                                : 'shadow-md';
                                        } else if (status === 'partial') {
                                            // Partial
                                            bgClass = isBatman
                                                ? 'bg-black'      // Dark: Black
                                                : 'bg-sand-400';  // Light: Light Brown
                                            borderClass = isBatman ? 'border-gray-700' : 'border-sand-500';
                                            shadowClass = 'shadow-sm';
                                        } else {
                                            // None
                                            bgClass = isBatman
                                                ? 'bg-gray-800'   // Dark: Grey
                                                : 'bg-sand-100';  // Light: Beige
                                            borderClass = isBatman ? 'border-gray-700' : 'border-sand-200';
                                            shadowClass = 'hover:shadow-md';
                                        }

                                        if (isToday) {
                                            ringClass = isBatman
                                                ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-black z-20'
                                                : 'ring-2 ring-brown-600 ring-offset-2 ring-offset-sand-50 z-20';
                                        }

                                        return (
                                            <div
                                                key={index}
                                                className={`
                                            w-4.5 h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-md transition-all duration-300 flex items-center justify-center
                                            ${bgClass} ${shadowClass} ${ringClass} ${borderClass}
                                            ${future ? 'opacity-40 cursor-default' : 'cursor-pointer hover:scale-110'}
                                        `}
                                                title={format(date, 'yyyy-MM-dd')}
                                            >
                                                {/* Optional: Add dot or simplified content if needed, but simple color block is requested */}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Habits List */}
            <div className="space-y-4 mb-6">
                {habits.map((habit, index) => (
                    <div
                        key={habit.id}
                        className="animate-slide-up-fade"
                        style={{ animationDelay: `${index * 0.08}s` }}
                    >
                        <HabitItem
                            habit={habit}
                            completed={isHabitCompleted(habit.id)}
                            onToggle={() => handleToggle(habit.id)}
                            disabled={togglingHabit === habit.id}
                        />
                    </div>
                ))}
            </div>



            {
                habits.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-brown-500">No habits for today. Go to the Habits tab to add some!</p>
                    </div>
                )
            }
        </div >
    );
}

