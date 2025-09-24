// src/web/theme/usePrefersDark.ts
import { useSyncExternalStore } from 'react';

/**
 * SSR-safe hook that reports whether the user prefers dark color scheme.
 * - getServerSnapshot(): return `false` (light) during SSR to avoid unpredictable server HTML
 *   (you can change to `true` if you prefer dark default on server).
 * - getSnapshot() reads current window.matchMedia on client.
 * - subscribe() listens to changes and triggers updates.
 *
 * Important: returning a stable server snapshot avoids hydration mismatches.
 */

function getSnapshot(): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
        return false; // server fallback: assume light mode
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getServerSnapshot(): boolean {
    // Keep SSR deterministic. Choose false (light) or true (dark) according to your preference.
    // Using `false` reduces surprises for most users and keeps markup consistent.
    return false;
}

function subscribe(callback: () => void) {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
        return () => {};
    }

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    // Newer API: mql.addEventListener. Fallback to addListener for older browsers.
    const handler = () => callback();

    try {
        if (typeof mql.addEventListener === 'function') {
            mql.addEventListener('change', handler);
            return () => mql.removeEventListener('change', handler);
        } else if (typeof (mql as any).addListener === 'function') {
            (mql as any).addListener(handler);
            return () => (mql as any).removeListener(handler);
        }
    } catch (err) {
        // If any error, still return cleanup function
    }

    return () => {};
}

export function usePrefersDark(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}