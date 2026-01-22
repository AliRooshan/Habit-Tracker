import { useTheme } from '../context/ThemeContext';
import type { Habit, Completion } from '../types';
import { getAllHabitStats } from '../lib/analytics';

interface AnalyticsViewProps {
    habits: Habit[];
    completions: Completion[];
}

export default function AnalyticsView({ habits, completions }: AnalyticsViewProps) {
    const habitStats = getAllHabitStats(habits, completions);
    const { isBatman } = useTheme();

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

            {/* Habit Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {habitStats.map((stat, index) => (
                    <div
                        key={stat.habitId}
                        className={`card-gradient-border group hover-glow animate-slide-up-fade p-4 sm:p-6 md:p-8 flex flex-col items-center text-center ${isBatman ? 'card-glass bg-gray-900/60' : 'card-glass'}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>

                        <div className="relative z-10 w-full flex flex-col items-center">
                            {/* Title & Icon - Centered */}
                            <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center justify-center gap-3 ${isBatman ? 'text-gray-100' : 'text-brown-900'}`}>
                                {stat.habitName}
                            </h3>

                            {/* Completion Rate - Stacked & Centered */}
                            <div className="mb-4 sm:mb-6 w-full max-w-sm flex items-center gap-2 sm:gap-3 px-2 sm:px-4">
                                <div className={`flex-grow h-3 sm:h-3.5 rounded-full overflow-hidden shadow-inner border ${isBatman ? 'bg-gray-800 border-gray-700' : 'bg-sand-200 border-sand-300/50'}`}>
                                    <div
                                        className={`h-full transition-all duration-1000 ease-out rounded-full relative overflow-hidden ${isBatman
                                            ? 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                                            : 'bg-gradient-to-r from-sand-600 via-sand-800 to-sand-900 shadow-[0_0_12px_rgba(60,30,10,0.6)]'
                                            }`}
                                        style={{ width: `${stat.completionRate}%` }}
                                    >
                                        {/* Internal shimmer for filling effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                                    </div>
                                </div>
                                <p className={`text-base sm:text-lg font-bold min-w-[2.5rem] sm:min-w-[3rem] text-right ${isBatman ? 'text-yellow-400' : 'text-brown-900'}`}>{stat.completionRate}%</p>
                            </div>

                            {/* Stats Grid - Centered */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-6 w-full">
                                <div className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all duration-300 group/stat h-full text-center hover:-translate-y-1 hover:shadow-lg ${isBatman ? 'bg-gray-900/50 border-gray-700 backdrop-blur-md' : 'bg-white/60 border-sand-200/50 backdrop-blur-md'}`}>
                                    <p className={`text-[10px] sm:text-xs mb-1 font-bold uppercase tracking-wide ${isBatman ? 'text-gray-400' : 'text-brown-600'}`}>Total Days</p>
                                    <p className={`text-lg sm:text-xl md:text-2xl font-black stat-number group-hover/stat:scale-110 transition-transform ${isBatman ? 'text-yellow-400' : 'text-brown-900'}`}>
                                        {stat.totalDays}
                                    </p>
                                </div>
                                <div className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all duration-300 group/stat h-full text-center hover:-translate-y-1 hover:shadow-lg ${isBatman ? 'bg-gray-900/50 border-gray-700 backdrop-blur-md' : 'bg-white/60 border-sand-200/50 backdrop-blur-md'}`}>
                                    <p className={`text-[10px] sm:text-xs mb-1 font-bold uppercase tracking-wide ${isBatman ? 'text-gray-400' : 'text-brown-600'}`}>Streak</p>
                                    <div className={`flex items-baseline justify-center gap-0.5 text-lg sm:text-xl md:text-2xl font-black stat-number group-hover/stat:scale-110 transition-transform ${isBatman ? 'text-yellow-400' : 'text-brown-900'}`}>
                                        {stat.currentStreak}
                                        <span className={`text-xs font-medium ${isBatman ? 'text-gray-500' : 'text-brown-500'}`}>d</span>
                                    </div>
                                </div>
                                <div className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all duration-300 group/stat h-full text-center hover:-translate-y-1 hover:shadow-lg ${isBatman ? 'bg-gray-900/50 border-gray-700 backdrop-blur-md' : 'bg-white/60 border-sand-200/50 backdrop-blur-md'}`}>
                                    <p className={`text-[10px] sm:text-xs mb-1 font-bold uppercase tracking-wide ${isBatman ? 'text-gray-400' : 'text-brown-600'}`}>Best</p>
                                    <div className={`flex items-baseline justify-center gap-0.5 text-lg sm:text-xl md:text-2xl font-black stat-number group-hover/stat:scale-110 transition-transform ${isBatman ? 'text-yellow-400' : 'text-brown-900'}`}>
                                        {stat.longestStreak}
                                        <span className={`text-xs font-medium ${isBatman ? 'text-gray-500' : 'text-brown-500'}`}>d</span>
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

