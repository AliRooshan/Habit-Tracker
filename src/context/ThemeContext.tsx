import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ThemeContextType {
    isBatman: boolean;
    toggleBatman: () => void;
    enableBatman: () => void;
    disableBatman: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isBatman, setIsBatman] = useState(false);

    useEffect(() => {
        // Check local storage on mount
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'batman') {
            setIsBatman(true);
            document.body.classList.add('batman-theme');
        }
    }, []);

    const enableBatman = () => {
        setIsBatman(true);
        localStorage.setItem('theme', 'batman');
        document.body.classList.add('batman-theme');
    };

    const disableBatman = () => {
        setIsBatman(false);
        localStorage.setItem('theme', 'light');
        document.body.classList.remove('batman-theme');
    };

    const toggleBatman = () => {
        if (isBatman) {
            disableBatman();
        } else {
            enableBatman();
        }
    };

    return (
        <ThemeContext.Provider value={{ isBatman, toggleBatman, enableBatman, disableBatman }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}