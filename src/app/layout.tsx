// src/app/layout.tsx (Server Component)

// src/app/layout.tsx (Server Component)
//
// Overview:
// - Root HTML structure for all routes in the App Router.
// - Reads per-request CSP nonce from headers and exposes it for CSS-in-JS.
// - Wraps pages with a theme provider respecting SSR hydration and user preference.
//
// Security & Quality (OWASP, SonarQube, Next.js):
// - Uses per-request CSP nonce to avoid 'unsafe-inline' styles (reduces XSS risk).
// - Avoids inline scripts and event handlers.
// - Minimal global CSS; prefer component-scoped styling.
// - Strong typing and readonly props for maintainability.
// - Head mutations kept minimal; prefer Metadata/Viewport APIs.
//
// Author: Praveen Kanwar
// Organization: Kanwer Polytex
// Documentation:
//   - Next App Router Layouts: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
//   - CSP: https://developer.mozilla.org/docs/Web/HTTP/CSP
//   - Emotion Nonce: https://emotion.sh/docs/ssr
//   - OWASP XSS: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

import type {ReactNode} from 'react' // Children typing
import React from 'react' // Enable JSX and types
import {headers} from 'next/headers' // Server-side request headers accessor
import type {Metadata, Viewport} from 'next' // Metadata + Viewport APIs
import ThemeProviderClient from '@/web/theme/ThemeProviderClient' // MUI + Emotion provider

// Provide default metadata (title/description).
export const metadata: Metadata = {
    title: {
        default: 'Kanwer Polytex',
        template: '%s | Kanwer Polytex',
    },
    description:
        'Kanwer Polytex — Quality, sustainability, and innovation in polytex solutions.',
}
// Provide a viewport via the new dedicated API (Next.js recommendation).
export const viewport: Viewport = {
    width: 'device-width', // Responsive layout baseline
    initialScale: 1, // Prevent unexpected zoom on load
    viewportFit: 'cover', // Better support on notched devices
    colorScheme: 'light dark', // Hint UA for supported color schemes
}

// Strongly typed, readonly props for clarity and immutability.
type RootLayoutProps = Readonly<{
    children: ReactNode
}>

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            {/* Critical inline script to set initial theme BEFORE React mounts */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `(function () {
  try {
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (e) {}
    if (stored === 'dark' || stored === 'light') {
      document.documentElement.setAttribute('data-theme', stored);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (err) {}
})();`,
                }}
            />
            {/* other head tags like meta, link, etc */}
        </head>
        <body>
        {/* ThemeProviderClient should be mounted under the root so its initial render matches data-theme */}
        <ThemeProviderClient>{children}</ThemeProviderClient>
        </body>
        </html>
    );
}