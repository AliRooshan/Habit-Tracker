import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import type { Habit, Completion } from '../types';
import { getAllHabits, getAllCompletions, initializeDefaultHabits } from '../lib/db';
import TodayView from './TodayView';
import AnalyticsView from './AnalyticsView';
import CalendarView from './CalendarView';
import HabitsView from './HabitsView';
import ConfirmationModal from './ConfirmationModal';

interface DashboardProps {
    onLogout: () => void;
}

type View = 'today' | 'analytics' | 'calendar' | 'habits';

export default function Dashboard({ onLogout }: DashboardProps) {
    const [currentView, setCurrentView] = useState<View>(() => {
        const saved = localStorage.getItem('currentView');
        return (saved as View) || 'today';
    });
    const [habits, setHabits] = useState<Habit[]>([]);
    const [completions, setCompletions] = useState<Completion[]>([]);
    const [dashboardBatTransform, setDashboardBatTransform] = useState({ x: 0, y: 0 });
    const [isReturning, setIsReturning] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const { isBatman, enableBatman, disableBatman } = useTheme();

    const dashboardHLogoRef = useRef<HTMLDivElement>(null);
    const dashboardBatRef = useRef<HTMLDivElement>(null); // Ref type changed to Div

    const handleDashboardBatClick = () => {
        if (!dashboardHLogoRef.current || !dashboardBatRef.current) return;

        // Calculate flight path to H logo
        const hRect = dashboardHLogoRef.current.getBoundingClientRect();
        const batRect = dashboardBatRef.current.getBoundingClientRect();

        const deltaY = hRect.top - batRect.top + (hRect.height / 2 - batRect.height / 2);
        const deltaX = hRect.left - batRect.left + (hRect.width / 2 - batRect.width / 2);

        // Fly!
        setIsAnimating(true);
        // Ensure state is set before transform
        requestAnimationFrame(() => {
            setDashboardBatTransform({ x: deltaX, y: deltaY });
        });

        // Infect!
        setTimeout(() => {
            enableBatman();
            setIsAnimating(false);

            // Reset position but keep hidden (since isBatman will be true)
            setTimeout(() => {
                setDashboardBatTransform({ x: 0, y: 0 });
            }, 100);
        }, 800);
    };

    const handleReturnFlight = () => {
        if (!isBatman || !dashboardHLogoRef.current || !dashboardBatRef.current) return;

        // 1. Disable animation for teleport
        setIsAnimating(false);
        setDashboardBatTransform({ x: 0, y: 0 }); // Reset to measured base

        setTimeout(() => {
            // 2. Measure positions
            const hRect = dashboardHLogoRef.current!.getBoundingClientRect();
            const batRect = dashboardBatRef.current!.getBoundingClientRect(); // Natural bottom-right pos

            const deltaY = hRect.top - batRect.top + (hRect.height / 2 - batRect.height / 2);
            const deltaX = hRect.left - batRect.left + (hRect.width / 2 - batRect.width / 2);

            // 3. Teleport to H
            setDashboardBatTransform({ x: deltaX, y: deltaY });
            setIsReturning(true);

            // 4. Fly Back
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimating(true);
                    setDashboardBatTransform({ x: 0, y: 0 });
                });
            });

            // 5. Cleanup
            setTimeout(() => {
                disableBatman();
                setIsReturning(false);
                setIsAnimating(false);
            }, 1000);
        }, 10);
    };

    // Persist current view to localStorage
    useEffect(() => {
        localStorage.setItem('currentView', currentView);
    }, [currentView]);

    // Load data
    useEffect(() => {
        loadData();
    }, []);



    const loadData = async () => {
        try {
            await initializeDefaultHabits();
            const habitsData = await getAllHabits();
            const completionsData = await getAllCompletions();
            setHabits(habitsData);
            setCompletions(completionsData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

    // ... (keep loadData) ...

    const handleLogout = () => {
        setShowSignOutConfirm(true);
    };

    const performLogout = () => {
        localStorage.removeItem('isAuthenticated');
        onLogout();
    };


    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-transparent relative">
            {/* Floating Decorative Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="orb orb-1" style={{ top: '-10%', left: '-5%' }}></div>
                <div className="orb orb-2" style={{ bottom: '-5%', right: '-10%' }}></div>
                <div className="orb orb-3" style={{ top: '40%', left: '70%' }}></div>

                {/* Floating Particles */}
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="particle bg-brown-400/20"
                        style={{
                            left: `${10 + i * 12}%`,
                            top: `${15 + (i % 4) * 20}%`,
                            animationDelay: `${i * 0.7}s`,
                            animationDuration: `${5 + i * 0.5}s`
                        }}
                    />
                ))}
            </div>

            {/* Floating Glass Header */}
            {/* Floating Glass Header */}
            <div className={`sticky z-20 px-3 sm:px-6 lg:px-8 mb-4 sm:mb-8 transition-all duration-700 ease-out ${isScrolled ? 'top-2' : 'top-6 sm:top-7'
                }`}>
                <div className="relative max-w-7xl mx-auto group">
                    {/* Subtle outer glow - only when not scrolled (glass mode) */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-sand-200/20 via-white/30 to-sand-200/20 rounded-2xl blur transition duration-500 ${isScrolled ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                        }`}></div>

                    <header className={`relative transition-all duration-500 hover:translate-y-0 rounded-2xl ${isScrolled
                        ? isBatman
                            ? 'bg-black/60 backdrop-blur-md border border-white/5 shadow-lg'
                            : 'bg-white/30 backdrop-blur-md border border-white/20 shadow-sm'
                        : 'card-glass shiny-element'
                        }`}>
                        <div className="px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
                            <div className="flex flex-col gap-2 sm:gap-4 md:flex-row md:items-center md:justify-between md:gap-0">

                                {/* Logo & Greeting + Mobile Sign Out */}
                                <div className="flex items-center justify-between w-full md:w-auto">
                                    <div className="flex items-center gap-3">
                                        <div
                                            ref={dashboardHLogoRef}
                                            onClick={handleReturnFlight}
                                            className={`relative w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold shadow-sm transition-all duration-500 overflow-hidden ${isBatman ? 'bg-gradient-to-br from-gray-800 to-black cursor-pointer hover:scale-110' : 'bg-gradient-to-br from-sand-600 via-brown-600 to-sand-700 text-white cursor-default'}`}
                                        >
                                            {isBatman ? (
                                                <img src="/batman-logo.png" alt="Bat" className="w-5 h-auto invert brightness-0 opacity-90" />
                                            ) : (
                                                "H"
                                            )}
                                        </div>
                                        <h1 className="text-base sm:text-3xl font-bold tracking-tight text-premium-gradient drop-shadow-sm">Habit Tracker</h1>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="md:hidden p-1.5 sm:p-2 text-brown-600 hover:text-brown-900 hover:bg-brown-100/50 rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                                        title="Sign Out"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Center Navigation */}
                                <nav className="flex items-center bg-sand-100/50 p-1 sm:p-1.5 rounded-xl border border-white/50 w-full md:w-auto justify-between md:justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                                    <button
                                        onClick={() => setCurrentView('today')}
                                        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 flex-1 md:flex-none ${currentView === 'today'
                                            ? isBatman
                                                ? 'bg-gray-900 text-gold-400 shadow-[0_2px_8px_rgba(230,194,0,0.2)] scale-105 -translate-y-0.5'
                                                : 'bg-white text-brown-900 shadow-[0_2px_8px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] scale-105 -translate-y-0.5'
                                            : isBatman
                                                ? 'text-gray-400 hover:text-gold-400 hover:bg-gray-800/50'
                                                : 'text-brown-600 hover:text-brown-900 hover:bg-white/50 hover:shadow-[0_1px_4px_rgba(0,0,0,0.06)]'
                                            }`}
                                        title="Today"
                                    >
                                        <svg className={`w-5 h-5 sm:w-4 sm:h-4 ${currentView === 'today' ? 'stroke-2' : 'stroke-1.5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                        <span className="hidden sm:inline">Today</span>
                                    </button>
                                    <button
                                        onClick={() => setCurrentView('analytics')}
                                        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 flex-1 md:flex-none ${currentView === 'analytics'
                                            ? isBatman
                                                ? 'bg-gray-900 text-gold-400 shadow-[0_2px_8px_rgba(230,194,0,0.2)] scale-105'
                                                : 'bg-white text-brown-900 shadow-sm scale-105'
                                            : isBatman
                                                ? 'text-gray-400 hover:text-gold-400 hover:bg-gray-800/50'
                                                : 'text-brown-600 hover:text-brown-900 hover:bg-white/50'
                                            }`}
                                        title="Analytics"
                                    >
                                        <svg className={`w-5 h-5 sm:w-4 sm:h-4 ${currentView === 'analytics' ? 'stroke-2' : 'stroke-1.5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="hidden sm:inline">Analytics</span>
                                    </button>
                                    <button
                                        onClick={() => setCurrentView('calendar')}
                                        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 flex-1 md:flex-none ${currentView === 'calendar'
                                            ? isBatman
                                                ? 'bg-gray-900 text-gold-400 shadow-[0_2px_8px_rgba(230,194,0,0.2)] scale-105'
                                                : 'bg-white text-brown-900 shadow-sm scale-105'
                                            : isBatman
                                                ? 'text-gray-400 hover:text-gold-400 hover:bg-gray-800/50'
                                                : 'text-brown-600 hover:text-brown-900 hover:bg-white/50'
                                            }`}
                                        title="Calendar"
                                    >
                                        <svg className={`w-5 h-5 sm:w-4 sm:h-4 ${currentView === 'calendar' ? 'stroke-2' : 'stroke-1.5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="hidden sm:inline">Calendar</span>
                                    </button>
                                    <button
                                        onClick={() => setCurrentView('habits')}
                                        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 flex-1 md:flex-none ${currentView === 'habits'
                                            ? isBatman
                                                ? 'bg-gray-900 text-gold-400 shadow-[0_2px_8px_rgba(230,194,0,0.2)] scale-105'
                                                : 'bg-white text-brown-900 shadow-sm scale-105'
                                            : isBatman
                                                ? 'text-gray-400 hover:text-gold-400 hover:bg-gray-800/50'
                                                : 'text-brown-600 hover:text-brown-900 hover:bg-white/50'
                                            }`}
                                        title="Habits"
                                    >
                                        <svg className={`w-5 h-5 sm:w-4 sm:h-4 ${currentView === 'habits' ? 'stroke-2' : 'stroke-1.5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="hidden sm:inline">Habits</span>
                                    </button>
                                </nav>

                                {/* Desktop Sign Out */}
                                <button
                                    onClick={handleLogout}
                                    className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-brown-600 hover:text-brown-900 hover:bg-white/50 rounded-xl transition-all"
                                >
                                    <span>Sign Out</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </header>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {currentView === 'today' && (
                    <TodayView
                        habits={habits}
                        completions={completions}
                        onDataChange={loadData}
                    />
                )}
                {currentView === 'analytics' && (
                    <AnalyticsView habits={habits} completions={completions} />
                )}
                {currentView === 'calendar' && (
                    <CalendarView habits={habits} completions={completions} />
                )}
                {currentView === 'habits' && (
                    <HabitsView habits={habits} onDataChange={loadData} />
                )}
            </main>

            {showSignOutConfirm && (
                <ConfirmationModal
                    message="Are you sure you want to sign out?"
                    confirmText="Sign Out"
                    confirmVariant="danger"
                    onClose={() => setShowSignOutConfirm(false)}
                    onConfirm={performLogout}
                />
            )}

            {/* Dashboard Bat Widget - Always in DOM for ref access, but hidden via opacity */}
            <div
                ref={dashboardBatRef} // Ref on container for position calculation and flight transform
                onClick={handleDashboardBatClick}
                style={{
                    transform: `translate(${dashboardBatTransform.x}px, ${dashboardBatTransform.y}px)`
                }}
                className={`fixed bottom-6 right-6 cursor-pointer z-50 ease-in-out duration-1000 ${isAnimating ? 'transition-[transform,opacity]' : 'transition-opacity'} ${(!isBatman || isReturning) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                title="Infect Dashboard"
            >
                <img
                    src="/batman-logo.png"
                    alt="Dark Mode"
                    className="w-12 h-auto opacity-80 hover:opacity-100 drop-shadow-lg hover:scale-110 transition-all duration-300 animate-bounce-subtle"
                />
            </div>
        </div>
    );
}
