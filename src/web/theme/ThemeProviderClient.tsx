// src/web/theme/ThemeProviderClient.tsx
'use client';

import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from './muiTheme'; // adjust import as in your repo
import { usePrefersDark } from './usePrefersDark';

/**
 * Client-side theme provider.
 *
 * Strategy:
 * - Read a synchronous initial theme value from document.documentElement's data-theme attribute
 *   (this attribute should be set by a tiny inline script in layout.tsx before React mounts).
 * - Initialize React state with that value (so first paint uses the same theme).
 * - Fall back to `usePrefersDark()` if no attribute present (reactively).
 * - Listen for system changes via usePrefersDark (which uses useSyncExternalStore).
 *
 * This prevents the "flash" where server markup and first client paint disagree.
 */

export default function ThemeProviderClient({ children }: { children: React.ReactNode }) {
    // Use undefined to represent "not yet decided" only if you want to delay; here we prefer a concrete initial theme.
    const systemPrefersDark = usePrefersDark(); // keeps in sync after mount

    // Read initial theme synchronously from DOM (set by inline script in layout).
    const initialThemeFromDom = typeof document !== 'undefined'
        ? document.documentElement.getAttribute('data-theme')
        : null;

    // If data-theme is explicitly 'dark' or 'light', use that. Otherwise, fall back to systemPrefersDark.
    const [isDark, setIsDark] = React.useState<boolean>(() => {
        if (initialThemeFromDom === 'dark') return true;
        if (initialThemeFromDom === 'light') return false;
        // fallback: use system pref (from useSyncExternalStore)
        return systemPrefersDark;
    });

    // Keep isDark in sync with system preference after mount only if user hasn't explicitly chosen.
    // If you allow user override (e.g. via toggle) adjust logic accordingly.
    React.useEffect(() => {
        // If initial DOM provided explicit theme, don't auto-sync (that means user or script set preference).
        if (initialThemeFromDom === 'dark' || initialThemeFromDom === 'light') {
            return;
        }
        // otherwise keep in sync with system preference changes
        if (systemPrefersDark !== isDark) {
            setIsDark(systemPrefersDark);
        }
    }, [systemPrefersDark, initialThemeFromDom, isDark]);

    const theme = React.useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

    // Optionally, if you want to persist choice when user toggles theme, write to localStorage and update documentElement attribute
    const setTheme = React.useCallback((dark: boolean) => {
        setIsDark(dark);
        try {
            if (typeof document !== 'undefined') {
                document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
            }
            if (typeof window !== 'undefined' && 'localStorage' in window) {
                window.localStorage.setItem('theme', dark ? 'dark' : 'light');
            }
        } catch (err) {
            // ignore storage errors
        }
    }, []);

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
}