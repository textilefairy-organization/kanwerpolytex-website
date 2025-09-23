'use client' // Declare this as a Client Component to safely use hooks like usePrefersDark (Next.js best practice).

/**
 * RootLayout
 *
 * Overview:
 * - Top-level application layout that applies a Material UI theme based on the user's
 *   system preference (dark or light), using a robust client-side hook.
 * - Keeps SSR output deterministic and handles client preference changes after hydration.
 *
 * Author: Praveen Kanwar
 * Organization: Kanwer Polytex
 *
 * Documentation and Practices:
 * - OWASP:
 *   - Avoids unsafe inline scripts and event handlers.
 *   - No dynamic code evaluation (eval) or string-to-code conversions.
 *   - Limits browser-only API usage to client components to prevent SSR errors.
 * - SonarQube:
 *   - Explicit typing and clear separation of concerns.
 *   - Avoids redundant variables and ensures proper resource cleanup (handled by hook).
 * - Next.js Best Practices:
 *   - Client-only behavior isolated behind 'use client'.
 *   - Deterministic SSR markup; prefers-light default on server, then updates on a client.
 *   - Optional suppressHydrationWarning used to prevent false-positive hydration warnings
 *     when the theme flips immediately on the client.
 */

import React, {useMemo} from 'react' // Import React for JSX and useMemo for efficient memoization.
// Material UI ThemeProvider to supply theme context to the app tree.
import {ThemeProvider} from '@mui/material/styles'
// Material UI CssBaseline to apply a consistent, sensible CSS reset across browsers.
import CssBaseline from '@mui/material/CssBaseline'
// Application theme objects for light and dark modes (preconfigured separately).
import {darkTheme, lightTheme} from '@/web/theme/muiTheme'
// Hook that reports whether the user's system prefers dark mode (client-safe).
import {usePrefersDark} from '@/web/theme/usePrefersDark'

// Define a prop type for the layout children for clarity and type safety.
type RootLayoutProps = {
    children: React.ReactNode // React nodes that will be rendered inside the themed layout.
}

// Export the default layout component to wrap the entire application.
export default function RootLayout({children}: RootLayoutProps) {
    // Read the user's system preference (true => dark, false => light).
    // The hook is SSR-safe and returns a deterministic default on the server.
    const prefersDark = usePrefersDark()

    // Memoize the selected theme so it only recalculates when the preference changes.
    // This avoids unnecessary re-renders of components consuming the theme.
    const theme = useMemo(() => (prefersDark ? darkTheme : lightTheme), [prefersDark])

    // Return the root HTML structure. In the App Router, this layout wraps every page.
    return (
        // Set the language attribute for accessibility and SEO; suppress hydration warnings
        // because the theme (and therefore CSS) may differ between server and client.
        <html lang="en" suppressHydrationWarning>
        {/* The document body contains the themed application tree. */}
        {/* data-theme attribute can help CSS or tooling distinguish the current theme (non-sensitive). */}
        <body data-theme={prefersDark ? 'dark' : 'light'}>
        {/* Provide the selected MUI theme to all descendants via React Context. */}
        <ThemeProvider theme={theme}>
            {/* Apply Material UI's CSS baseline for consistent cross-browser rendering. */}
            <CssBaseline/>
            {/* Render child routes/pages inside the themed provider. */}
            {children}
        </ThemeProvider>
        </body>
        </html>
    )
}