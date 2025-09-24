// src/web/theme/ThemeProviderClient.tsx
'use client'

import React from 'react'
import {CacheProvider} from '@emotion/react'
import {ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import createEmotionCache from './createEmotionCache'
import {darkTheme, lightTheme} from '@/web/theme/muiTheme'
import {usePrefersDark} from '@/web/theme/usePrefersDark'

/**
 * File: src/web/theme/ThemeProviderClient.tsx
 * Purpose: Client-side provider wiring Emotion (with CSP nonce support) and MUI theming with system preference detection.
 *
 * Author: Praveen Kanwar
 * Organization: Kanwer Polytex
 *
 * Overview:
 * - Creates an Emotion cache that can include per-request CSP nonce so injected <style> tags comply with a strict CSP.
 * - Picks the MUI theme based on the user's prefers-color-scheme media query (light/dark).
 * - Applies CssBaseline to normalize styles and supports color-scheme propagation for better native UI integration.
 *
 * Security & Best Practices (OWASP, SonarQube, Next.js):
 * - OWASP: Avoid 'unsafe-inline' by using CSP nonce. If not passed as a prop, sanitized nonce is read from a <meta>
 *   tag in the document head (e.g., <meta name="csp-nonce" content="...">).
 * - SonarQube: Keep components small and pure; validate input (nonce) defensively; avoid console logging secrets.
 * - Next.js: This file is a client component; keep side effects minimal and deterministic, using useMemo for caches and themes.
 */

// Runtime-safe base64 check for nonces (defensive validation; do not transform nonce values)
const BASE64_REGEX = /^[A-Za-z0-9+/=]+$/

/**
 * getNonceFromDOM
 * Attempts to read CSP nonce from a <meta name="csp-nonce" content="..."> tag.
 * Returns undefined if missing or invalid. This is a client-side fallback when nonce is not provided as a prop.
 */
function getNonceFromDOM(): string | undefined {
    // Access to document is safe in a client component
    const meta = document.querySelector('meta[name="csp-nonce"]') as HTMLMetaElement | null
    const value = meta?.content?.trim()
    if (!value || !BASE64_REGEX.test(value)) return undefined
    return value
}

type Props = {
    children: React.ReactNode
    /**
     * nonce: Optional CSP nonce provided by the server during SSR/streaming.
     * If omitted, sanitized nonce will be read from <meta name="csp-nonce" /> at runtime.
     */
    nonce?: string
}

// Create client-side providers with Emotion cache and MUI theme.
// Note:
// - We generate a new cache when nonce changes to ensure <style nonce = "..."> matches the CSP in effect.
// - We do not log or expose the nonce further to avoid leaking secrets.
export default function ThemeProviderClient({children, nonce}: Props) {
    // Resolve safe nonce: prefer the prop; otherwise, try to read from the DOM meta-tag on the client
    const resolvedNonce = React.useMemo(() => {
        if (typeof nonce === 'string' && BASE64_REGEX.test(nonce.trim())) return nonce.trim()
        // Reading from DOM only after mount; guard against SSR mismatch by lazy fallback in a layout effect below.
        return undefined
    }, [nonce])

    // Lazy state to hold meta-derived nonce after mount (when DOM is available)
    const [metaNonce, setMetaNonce] = React.useState<string | undefined>(undefined)
    React.useEffect(() => {
        if (!resolvedNonce) {
            // Read once after mount; do not update again to keep Emotion cache stable
            const fromMeta = getNonceFromDOM()
            if (fromMeta) setMetaNonce(fromMeta)
        }
        // We intentionally ignore deps for one-time read when resolvedNonce is absent
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Final nonce selection: prop nonce (preferred) -> meta nonce -> undefined
    const effectiveNonce = resolvedNonce ?? metaNonce

    // Create Emotion cache with CSP nonce (if present). prepend ensures predictable override order for MUI styles.
    const cache = React.useMemo(() => createEmotionCache(effectiveNonce), [effectiveNonce])

    // Detect system preference (dark/light) and memoize the theme to avoid unnecessary re-renders
    const prefersDark = usePrefersDark()
    const theme = React.useMemo(() => (prefersDark ? darkTheme : lightTheme), [prefersDark])

    // Keep <html data-theme = "..."> in sync with the active theme (works even if an inline script was missing)
    React.useEffect(() => {
        const next = prefersDark ? 'dark' : 'light'
        try {
            document.documentElement.setAttribute('data-theme', next)
            // Optional persistence (uncomment if you want to remember user choice later):
            // localStorage.setItem('kp_theme', next)
            // document.cookie = `kp_theme=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
        } catch {
            /* no-op */
        }
    }, [prefersDark])

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                {/* CssBaseline normalizes styles and, with enableColorScheme, sets the color-scheme CSS property for native UI */}
                <CssBaseline enableColorScheme/>
                {children}
            </ThemeProvider>
        </CacheProvider>
    )
}