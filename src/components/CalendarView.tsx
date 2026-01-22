import { useState } from 'react';
import type { Habit, Completion } from '../types';
import { getDayData } from '../lib/analytics';
import { getMonthName } from '../lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import DayDetailModal from './DayDetailModal';
import { useTheme } from '../context/ThemeContext';

interface CalendarViewProps {
    habits: Habit[];
    completions: Completion[];
}

export default function CalendarView({ habits, completions }: CalendarViewProps) {
    const { isBatman } = useTheme();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = monthStart.getDay();

    const handlePrevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const handleDateClick = (date: Date) => {
        const dateString = format(date, 'yyyy-MM-dd');
        setSelectedDate(dateString);
    };

    const getCompletionStatus = (date: Date): 'none' | 'partial' | 'full' => {
        const dateString = format(date, 'yyyy-MM-dd');
        const dayData = getDayData(dateString, habits, completions);

        if (dayData.habits.length === 0) return 'none';
        if (dayData.completionPercentage === 100) return 'full';
        if (dayData.completionPercentage > 0) return 'partial';
        return 'none';
    };

    const isToday = (date: Date): boolean => {
        return isSameDay(date, new Date());
    };

    const isFutureDate = (date: Date): boolean => {
        return date > new Date();
    };

    // Calculate month stats
    const monthStats = daysInMonth.reduce((acc, date) => {
        if (!isFutureDate(date)) {
            const status = getCompletionStatus(date);
            if (status === 'full') acc.perfect++;
            if (status === 'partial') acc.partial++;
            acc.total++;
        }
        return acc;
    }, { perfect: 0, partial: 0, total: 0 });

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header Card with Stats */}
            <div className={`card-glass card-gradient-border p-4 sm:p-6 md:p-8 relative overflow-hidden group ${isBatman ? 'border-gray-800' : 'border-stone-200'}`}>
                {/* Shimmer overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none ${isBatman ? 'opacity-20' : 'opacity-40'}`}></div>

                <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-4 sm:gap-6">
                    {/* Month Navigation */}
                    <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
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
                            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${isBatman ? 'text-gradient-gold' : 'text-premium-gradient'}`}>
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

                    {/* Mini Stats */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full sm:w-auto text-center">
                        {/* Perfect */}
                        <div className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 border ${isBatman
                            ? 'bg-gray-800 text-gray-300 border-gray-700 shadow-sm'
                            : 'bg-sand-100 text-brown-900 border-sand-200 shadow-sm'
                            }`}>
                            <p className="text-xl sm:text-2xl md:text-3xl font-bold stat-number">
                                {monthStats.perfect}
                            </p>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Perfect</p>
                        </div>
                        {/* Partial */}
                        <div className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 border ${isBatman
                            ? 'bg-black text-white border-gray-800 shadow-md'
                            : 'bg-sand-400 text-brown-900 border-sand-500 shadow-sm'
                            }`}>
                            <p className="text-xl sm:text-2xl md:text-3xl font-bold stat-number">
                                {monthStats.partial}
                            </p>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Partial</p>
                        </div>
                        {/* Success */}
                        <div className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 border ${isBatman
                            ? 'bg-yellow-400 text-black border-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                            : 'bg-sand-800 text-white border-sand-900 shadow-md'
                            }`}>
                            <p className="text-xl sm:text-2xl md:text-3xl font-bold stat-number">
                                {monthStats.total > 0 ? Math.round((monthStats.perfect / monthStats.total) * 100) : 0}%
                            </p>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Success</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Grid Card */}
            <div className={`card-glass relative overflow-hidden p-3 sm:p-4 md:p-6 group ${isBatman ? 'border-gray-800' : 'border-stone-200'}`}>
                {/* Background decoration */}
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20 ${isBatman ? 'bg-gold-500/10' : 'bg-brown-200/20'}`}></div>
                <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 ${isBatman ? 'bg-purple-900/20' : 'bg-sand-300/20'}`}></div>

                {/* Day Labels */}
                <div className="relative z-10 grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2 mb-3 sm:mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                        <div
                            key={idx}
                            className={`text-center text-xs sm:text-sm font-bold uppercase tracking-wider py-3 rounded-lg ${isBatman
                                ? 'text-gold-500 bg-gray-900/40'
                                : 'text-brown-500 bg-sand-100/50'
                                }`}
                        >
                            <span className="sm:hidden">{day.charAt(0)}</span>
                            <span className="hidden sm:inline">{day}</span>
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="relative z-10 grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-3">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: firstDayOfWeek }).map((_, index) => (
                        <div key={`empty-${index}`} className="aspect-square" />
                    ))}

                    {/* Days of the month */}
                    {daysInMonth.map((date, index) => {
                        const status = getCompletionStatus(date);
                        const today = isToday(date);
                        const future = isFutureDate(date);

                        // Determine styles based on status and theme
                        let bgClass = '';
                        let textClass = '';
                        let ringClass = '';
                        let shadowClass = '';
                        let borderClass = 'border';

                        if (future) {
                            bgClass = isBatman ? 'bg-transparent' : 'bg-transparent';
                            borderClass = isBatman ? 'border border-gray-800' : 'border border-sand-200';
                            textClass = isBatman ? 'text-gray-700' : 'text-brown-300';
                            shadowClass = '';
                        } else if (status === 'full') {
                            // 100% / Full / Perfect
                            bgClass = isBatman
                                ? 'bg-yellow-400' // Dark: Yellow
                                : 'bg-sand-800';  // Light: Dark Brown
                            textClass = isBatman ? 'text-black' : 'text-white';
                            borderClass = isBatman ? 'border-yellow-500' : 'border-sand-900';
                            shadowClass = isBatman
                                ? 'shadow-[0_4px_12px_rgba(250,204,21,0.4)]'
                                : 'shadow-md';
                        } else if (status === 'partial') {
                            // Partial
                            bgClass = isBatman
                                ? 'bg-black'      // Dark: Black
                                : 'bg-sand-400';  // Light: Light Brown
                            textClass = isBatman ? 'text-white' : 'text-brown-900';
                            borderClass = isBatman ? 'border-gray-700' : 'border-sand-500';
                            shadowClass = 'shadow-sm';
                        } else {
                            // None
                            bgClass = isBatman
                                ? 'bg-gray-800'   // Dark: Grey
                                : 'bg-sand-100';  // Light: Beige
                            textClass = isBatman ? 'text-gray-400' : 'text-brown-500';
                            borderClass = isBatman ? 'border-gray-700' : 'border-sand-200';
                            shadowClass = 'hover:shadow-md';
                        }

                        if (today) {
                            ringClass = isBatman
                                ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-black z-20'
                                : 'ring-2 ring-brown-600 ring-offset-2 ring-offset-sand-50 z-20';
                        }

                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => !future && handleDateClick(date)}
                                disabled={future}
                                style={{ animationDelay: `${index * 0.02}s` }}
                                className={`
                                    group/day relative aspect-square rounded-xl sm:rounded-2xl p-1 transition-all duration-300 animate-scale-in flex flex-col items-center justify-center
                                    ${bgClass} ${textClass} ${shadowClass} ${ringClass} ${borderClass}
                                    ${future ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:scale-110 hover:-translate-y-1 hover:z-30'}
                                `}
                            >
                                {/* Day number */}
                                <span className={`text-sm sm:text-base font-bold relative z-10`}>
                                    {format(date, 'd')}
                                </span>

                                {/* Completion visual indicator if needed, but background color is primary now */}
                            </button>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className={`relative z-10 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t ${isBatman ? 'border-gray-800' : 'border-sand-200/50'}`}>
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
                        {/* 100% */}
                        <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 border ${isBatman
                            ? 'bg-gray-900 border-yellow-500/50'
                            : 'bg-white border-sand-800'
                            }`}>
                            <div className={`w-3 h-3 rounded-full ${isBatman ? 'bg-yellow-400' : 'bg-sand-800'}`}></div>
                            <span className={`text-xs sm:text-sm font-bold ${isBatman ? 'text-gray-300' : 'text-brown-900'}`}>100%</span>
                        </div>
                        {/* Partial */}
                        <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 border ${isBatman
                            ? 'bg-gray-900 border-gray-700'
                            : 'bg-white border-sand-400'
                            }`}>
                            <div className={`w-3 h-3 rounded-full ${isBatman ? 'bg-black border border-gray-600' : 'bg-sand-400'}`}></div>
                            <span className={`text-xs sm:text-sm font-semibold ${isBatman ? 'text-gray-400' : 'text-brown-700'}`}>Partial</span>
                        </div>
                        {/* None */}
                        <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 border ${isBatman
                            ? 'bg-gray-900 border-gray-800'
                            : 'bg-white border-sand-200'
                            }`}>
                            <div className={`w-3 h-3 rounded-full border ${isBatman ? 'border-gray-600 bg-gray-800' : 'border-sand-300 bg-sand-100'}`}></div>
                            <span className={`text-xs sm:text-sm font-medium ${isBatman ? 'text-gray-500' : 'text-brown-600'}`}>None</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Day Detail Modal */}
            {selectedDate && (
                <DayDetailModal
                    date={selectedDate}
                    habits={habits}
                    completions={completions}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </div>
    );
}

