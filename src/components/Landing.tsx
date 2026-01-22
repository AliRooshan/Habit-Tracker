import { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import type { FormEvent } from 'react';

interface LandingProps {
    onLogin: () => void;
}

const CORRECT_PASSWORD = 'rooshybazinga';

export default function Landing({ onLogin }: LandingProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Use global theme state
    const { isBatman, enableBatman, disableBatman } = useTheme();

    const hLogoRef = useRef<HTMLDivElement>(null);

    const handleBatClick = () => {
        enableBatman();
    };

    const handleHClick = () => {
        if (isBatman) {
            disableBatman();
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (password === CORRECT_PASSWORD) {
            localStorage.setItem('isAuthenticated', 'true');
            onLogin();
        } else {
            setError('Incorrect password');
            setIsShaking(true);
            setTimeout(() => {
                setIsShaking(false);
                setError('');
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated Gradient Background */}
            <div className={`absolute inset-0 z-0 bg-gradient-to-br transition-colors duration-1000 ${isBatman ? 'from-stone-900 via-gray-900 to-stone-800' : 'from-sand-100 via-stone-100 to-sand-200'} animate-gradient-shift`}></div>

            {/* Shimmer Overlay */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] bg-[length:200%_100%] animate-shimmer"></div>

            {/* Floating Particles */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full animate-float-particle transition-colors duration-1000 ${isBatman ? 'bg-gray-600/30' : 'bg-brown-400/20'}`}
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 3) * 25}%`,
                            animationDelay: `${i * 0.8}s`,
                            animationDuration: `${4 + i * 0.5}s`
                        }}
                    />
                ))}
                {/* Floating bat silhouettes */}
                {[...Array(3)].map((_, i) => (
                    <img
                        key={`bat-${i}`}
                        src="/batman-logo.png"
                        alt=""
                        className="absolute w-6 h-6 opacity-10 animate-float-bat"
                        style={{
                            left: `${10 + i * 35}%`,
                            top: `${15 + i * 20}%`,
                            animationDelay: `${i * 1.5}s`,
                            animationDuration: `${6 + i}s`
                        }}
                    />
                ))}
            </div>

            {/* Ambient Glow Orbs - Enhanced */}
            <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] bg-gradient-radial from-sand-400/30 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-radial from-brown-300/30 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-gradient-radial from-gold-400/20 to-transparent rounded-full blur-2xl animate-float-slow"></div>

            <div className="w-full max-w-md px-4 sm:px-6 relative z-10">
                {/* Glass Card with Enhanced Depth & Separation */}
                <div className="relative group perspective-1000">
                    {/* Card Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-sand-300/40 via-sand-200/50 to-sand-300/40 rounded-[28px] blur-xl opacity-70 group-hover:opacity-90 transition-all duration-700 animate-glow-pulse"></div>

                    {/* Main Card */}
                    <div className="relative bg-gradient-to-br from-white/95 via-sand-50/70 to-white/95 backdrop-blur-2xl border-2 border-sand-200/50 rounded-3xl p-5 sm:p-8 shadow-[0_30px_60px_-12px_rgba(140,94,53,0.15),0_18px_36px_-18px_rgba(166,115,66,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-sand-100/30 hover:shadow-[0_40px_70px_-10px_rgba(140,94,53,0.2),0_0_30px_rgba(166,115,66,0.08)] transition-all duration-500 shiny-element">
                        <div className="text-center mb-6">
                            {/* Logo with Glow */}
                            <div
                                className={`relative inline-block mb-4 group/logo transform transition-transform hover:scale-110 duration-500 ${isBatman ? 'cursor-pointer' : 'cursor-default'}`}
                                ref={hLogoRef}
                                onClick={handleHClick}
                                title={isBatman ? "Return to Light" : ""}
                            >
                                <div className={`absolute inset-0 blur-2xl rounded-full scale-150 animate-pulse-slow transition-colors duration-1000 ${isBatman ? 'bg-gold-500/20' : 'bg-gradient-to-br from-sand-400/30 to-brown-500/30'}`}></div>
                                <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-2xl overflow-hidden transition-all duration-1000 border-2 border-sand-200/40 ${isBatman ? 'bg-gradient-to-br from-black to-gray-900 rotate-180 scale-110' : 'bg-gradient-to-br from-sand-600 via-brown-600 to-sand-700 rotate-0 scale-100'}`}>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-transparent opacity-50"></div>
                                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isBatman ? 'opacity-0 rotate-180 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
                                        <span className="text-white drop-shadow-md">H</span>
                                    </div>
                                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isBatman ? 'opacity-100 rotate-180 scale-100' : 'opacity-0 -rotate-180 scale-50'}`}>
                                        <img src="/batman-logo.png" alt="Bat" className="w-12 h-auto opacity-100 invert brightness-0 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                                    </div>
                                </div>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight text-brown-900">
                                Heyyy Rooshy
                            </h1>
                            <p className="text-sm sm:text-base text-brown-700 font-medium">
                                Welcome back to your habit tracker
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-bold text-brown-800 ml-1 uppercase tracking-wider text-xs">
                                    Password
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute inset-0 bg-gradient-to-r from-sand-200 to-sand-300 rounded-xl blur opacity-15 group-hover/input:opacity-30 transition-opacity"></div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`relative w-full px-4 py-3 rounded-xl bg-white border-2 border-sand-200 focus:border-brown-500 focus:ring-4 focus:ring-brown-500/10 outline-none transition-all duration-300 text-brown-900 placeholder-brown-300 font-medium shadow-sm ${isShaking ? 'animate-shake border-red-400 bg-red-50' : ''}`}
                                        placeholder="••••••••"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-700 transition-colors p-1"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {error && (
                                    <p className="mt-3 text-sm text-red-500 font-bold animate-pulse ml-1 flex items-center gap-2 bg-red-50 p-2 rounded-lg border border-red-200">
                                        <span>⚠️</span> {error}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl text-base btn-primary shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group/btn"
                            >
                                <span className="relative z-10 font-bold tracking-wide">Sign In</span>
                            </button>
                        </form>
                        <img
                            src="/batman-logo.png"
                            alt="Batman Logo"
                            onClick={handleBatClick}
                            className={`relative w-14 sm:w-16 h-auto mx-auto mt-5 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:scale-110 cursor-pointer hover:drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300 ${isBatman ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
                    20%, 40%, 60%, 80% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .animate-shimmer {
                    animation: shimmer 8s ease-in-out infinite;
                }
                @keyframes float-particle {
                    0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
                    50% { transform: translateY(-30px) translateX(10px) scale(1.2); opacity: 0.6; }
                }
                .animate-float-particle {
                    animation: float-particle 4s ease-in-out infinite;
                }
                @keyframes float-bat {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-15px) rotate(-5deg); }
                    75% { transform: translateY(10px) rotate(5deg); }
                }
                .animate-float-bat {
                    animation: float-bat 6s ease-in-out infinite;
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-20px) translateX(10px); }
                }
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
                @keyframes glow-pulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }
                .animate-glow-pulse {
                    animation: glow-pulse 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
