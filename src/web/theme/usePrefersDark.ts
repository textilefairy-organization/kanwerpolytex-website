// src/web/theme/usePrefersDark.ts

/**
 * usePrefersDark
 *
 * Overview:
 * - A robust, SSR-safe React hook that reports whether the user's system
 *   prefers a dark color scheme by subscribing to the relevant media query.
 * - Implemented using React's useSyncExternalStore to ensure consistent output
 *   across server and client, preventing hydration mismatches and avoiding
 *   side effects during render.
 *
 * Author: Praveen Kanwar
 * Organization: Kanwer Polytex
 *
 * Documentation and Practices:
 * - OWASP:
 *   - No use of eval or dynamic code execution.
 *   - Safe access to browser-only APIs guarded with typeof window checks.
 *   - Defensive coding: gracefully degrades in unsupported environments.
 * - SonarQube:
 *   - Explicit typing, no implicit any.
 *   - Feature detection instead of exception-driven control flow.
 *   - Proper cleanup for subscribed listeners to avoid memory leaks.
 * - Next.js Best Practices:
 *   - SSR-friendly design: getServerSnapshot returns a deterministic value (false).
 *   - No side effects during render; subscription is managed by React.
 *   - Stable constants and pure functions to maintain predictable hydration.
 */

import {useSyncExternalStore} from 'react' // Import the stable external store subscription API from React

// MEDIA_QUERY: string constant for the dark-mode preference query (stable reference)
const MEDIA_QUERY = '(prefers-color-scheme: dark)'

// --- ADD THIS: legacy interface to avoid deprecation warnings while keeping typesafe ---
interface LegacyMediaQueryList extends MediaQueryList {
    // The legacy APIs are marked deprecated in lib.dom.d.ts but still exist in older browsers (Safari).
    addListener(listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void): void

    removeListener(listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void): void
}

/**
 * getSnapshot
 * - Reads the current value (boolean) of whether the system prefers dark mode on the client.
 * - Returns false if the environment is SSR or matchMedia is unavailable.
 */
function getSnapshot(): boolean {
    // Ensure this only runs in a browser environment; SSR has no window.
    // Verify that matchMedia exists (older or non-standard environments may not support it).
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        // Returning false on the server ensures deterministic markup (avoids hydration mismatch).
        // If unsupported, choose a conservative default (light).
        return false
    }

    // Query the current media status for dark-mode preference and return the boolean result.
    return window.matchMedia(MEDIA_QUERY).matches
}

/**
 * getServerSnapshot
 * - Provides the value used during server-side rendering.
 * - Always returns false for deterministic and stable server markup.
 */
function getServerSnapshot(): boolean {
    // Next.js SSR: do not rely on client-specific state during render.
    return false
}

/**
 * subscribe
 * - Registers a listener for changes to the '(prefers-color-scheme: dark)' media query.
 * - Calls onStoreChange whenever the preference flips, so React can re-read getSnapshot and re-render.
 * - Returns an unsubscribe function that removes the listener, preventing memory leaks.
 */
function subscribe(onStoreChange: () => void): () => void {
    // If we're not in the browser or matchMedia is unavailable, no subscription is possible.
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        // Return a no-op cleanup function to satisfy the subscribed contract.
        return () => {
            /* no browser environment to unsubscribe from */
        }
    }

    // Create the MediaQueryList instance for the dark-mode query.
    // Keep a typed alias for legacy APIs but keep the runtime object as the browser provides it.
    const mql = window.matchMedia(MEDIA_QUERY)
    const legacyMql = mql as LegacyMediaQueryList

    // Define a simple handler that triggers React to re-read the snapshot.
    const handler = () => onStoreChange()

    // Prefer modern addEventListener/removeEventListener when available (standards-compliant browsers).
    const hasModernAPI =
        typeof mql.addEventListener === 'function' && typeof mql.removeEventListener === 'function'

    // If a modern API is available, use it to subscribe and provide matching cleanup.
    if (hasModernAPI) {
        mql.addEventListener('change', handler)
        return () => {
            mql.removeEventListener('change', handler)
        }
    }

    // Fallback for older Safari versions that only support addListener/removeListener.
    // Using feature detection avoids reliance on exceptions for control flow (SonarQube-friendly).
    // These methods are deprecated but still necessary for compatibility.
    // eslint comments are avoided to prevent unknown rule errors.
    legacyMql.addListener(handler)

    // Return a cleanup function using the corresponding legacy removal API.
    return () => {
        legacyMql.removeListener(handler)
    }
}

/**
 * usePrefersDark
 * - Public hook returning a boolean:
 *   - true → system prefers dark mode
 *   - false → system prefers light mode
 *
 * Implementation details:
 * - useSyncExternalStore provides:
 *   - subscribe: how to listen to changes
 *   - getSnapshot: how to read current value on the client
 *   - getServerSnapshot: what to return during SSR
 * - This approach keeps server and client renders consistent (Next.js best practice),
 *   while ensuring updates propagate efficiently and safely.
 */
export function usePrefersDark(): boolean {
    // Return the subscription result directly to avoid a redundant local variable (SonarQube cleanliness).
    // React will re-read getSnapshot whenever subscribe triggers, ensuring up-to-date value.
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}