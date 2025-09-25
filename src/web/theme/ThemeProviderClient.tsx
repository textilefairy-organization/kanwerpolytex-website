// src/web/theme/ThemeProviderClient.tsx
'use client'

import React from 'react'
import {ThemeProvider} from '@mui/material/styles'
import {darkTheme, lightTheme} from '@/web/theme/muiTheme'
import {usePrefersDark} from '@/web/theme/usePrefersDark'

/**
 * File: src/web/theme/ThemeProviderClient.tsx
 * Purpose: Client-side provider for MUI theming with system preference detection.
 *
 * Author: Praveen Kanwar
 * Organization: Kanwer Polytex
 *
 * Overview:
 * - Picks the MUI theme based on the user's prefers-color-scheme media query (light/dark).
 * - Applies CssBaseline to normalize styles and supports color-scheme propagation for better native UI integration.
 *
 * Security & Best Practices (OWASP, SonarQube, Next.js):
 * - OWASP: Avoid inline styles/scripts; CSP nonce handling is managed centrally in ThemeRegistry.
 * - SonarQube: Keep components small and pure; validate input (nonce) defensively; avoid console logging secrets.
 * - Next.js: This file is a client component; keep side effects minimal and deterministic, using useMemo for themes.
 */

type Props = {
    children: React.ReactNode
}

// Client-side MUI theme provider (Emotion cache & SSR handled by ThemeRegistry).
export default function ThemeProviderClient({children}: Props) {

    // Detect system preference (dark/light) and memoize the theme to avoid unnecessary re-renders
    const prefersDark = usePrefersDark()
    const theme = React.useMemo(() => (prefersDark ? darkTheme : lightTheme), [prefersDark])

    return (
        <ThemeProvider theme={theme}>
            {/* <CssBaseline enableColorScheme /> */}
            {children}
        </ThemeProvider>
    )
}