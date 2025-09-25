/**
 * src/app/page.tsx
 * Under-Construction landing page for Kanwer Polytex.
 *
 * Author: Praveen Kanwar
 * Organization: Kanwer Polytex
 *
 * Documentation:
 * - Purpose: Provide a minimal, secure, and accessible landing page while the full site is developed.
 * - Security (OWASP): No user input or dynamic scripts; static, server-rendered content minimizes attack surface.
 * - Clean Code (SonarQube): Clear naming, explicit typing, single responsibility, and self-documenting comments.
 * - Next.js Best Practices: Uses App Router metadata, server component by default, semantic markup, and accessible design.
 */

import React from 'react'; // Import React for JSX typing and component definitions
import type {Metadata} from 'next'; // Strong typing for Next.js metadata object
import Link from 'next/link'; // Next.js client-side navigation for internal links
import {Box, Button, Container, Typography} from '@mui/material'; // MUI components for a consistent UI and accessibility

// Strongly typed Next.js metadata for SEO/social platforms. Avoids leaking any sensitive info (OWASP).
export const metadata: Metadata = {
    title: 'Kanwer Polytex — Coming Soon', // Clear, user-facing title
    description:
        'Kanwer Polytex — specialty yarn dyeing. Our new site is under construction.', // Concise and meaningful description
    robots: {
        index: true, // Allow indexing; switch to false if you want to prevent temporary page indexing
        follow: true, // Allow search engines to follow links
    },
    openGraph: {
        title: 'Kanwer Polytex — Coming Soon', // Social share title
        description:
            'Kanwer Polytex — specialty yarn dyeing. Our new site is under construction.', // Social share description
        type: 'website', // The appropriate OG type for a landing page
    },
    twitter: {
        card: 'summary', // Lightweight summary card for Twitter
        title: 'Kanwer Polytex — Coming Soon', // Twitter title
        description:
            'Kanwer Polytex — specialty yarn dyeing. Our new site is under construction.', // Twitter description
    },
};

// Default export for the route's page component. Server component by default (no "use client").
export default function Page() {
    // Render-only logic; no state/effects for minimal JS and better security/performance.
    return (
        // Container marks the main content region; semantic and accessible.
        <Container
            component="main" // Semantic "main" landmark for accessibility
            role="main" // Reinforces landmark for assistive tech
            maxWidth="md" // Constrains line length for readability
            sx={{
                minHeight: '100vh', // Full viewport height for vertical centering
                display: 'flex', // Flex layout to center content
                alignItems: 'center', // Vertical centering
                justifyContent: 'center', // Horizontal centering
                textAlign: 'center', // Center-align text for a simple hero layout
                px: 2, // Horizontal padding for small screens
                gap: 2, // Spacing between stacked elements
            }}
        >
            {/* Wrapper for the page content; keeps layout predictable and centered. */}
            <Box>
                {/* Top-level heading (H1) for the page; improves SEO and accessibility. */}
                <Typography component="h1" variant="h3" gutterBottom>
                    Welcome to Kanwer Polytex
                </Typography>

                {/* Lead paragraph with reduced emphasis. Note: `paragraph` prop is deprecated; use gutterBottom or margin. */}
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Our new website is under construction. We&apos;re building something special — check back soon.
                </Typography>

                {/* Primary actions area: one external (mailto:) and one internal navigation (Next.js Link). */}
                <Box sx={{mt: 3, display: 'flex', gap: 2, justifyContent: 'center'}}>
                    {/* Email contact button: static, trusted link; no user input involved (OWASP). */}
                    <Button
                        variant="contained" // High-emphasis button
                        color="primary" // Brand-aligned color
                        href="mailto:contact@kanwerpolytex.com" // mailto scheme; no target needed
                        aria-label="Contact Kanwer Polytex by email" // Clarifies action for screen readers
                    >
                        Contact Us
                    </Button>

                    {/* Internal navigation uses Next.js Link for client-side transitions and better UX. */}
                    <Button
                        variant="outlined" // Medium-emphasis button
                        color="primary" // Consistent theming
                        component={Link} // Render Button as Next.js Link
                        href="/about" // Internal route path
                        aria-label="Learn more about Kanwer Polytex" // Accessible label describing destination
                    >
                        About Us
                    </Button>
                </Box>

                {/* Supporting caption; secondary information with subtle emphasis. */}
                <Typography
                    variant="caption" // Smaller, secondary text
                    color="text.secondary" // Subtle color from theme
                    sx={{display: 'block', mt: 4}} // Block layout with top margin
                >
                    Kanwer Polytex — Textile dyeing, specialty yarns &amp; sustainable innovation.
                </Typography>
            </Box>
        </Container>
    );
}

/**
 * Additional Notes & Rationale
 *
 * Security (OWASP):
 * - No user inputs, forms, or dynamic scripts reduce common risks (XSS, CSRF, injection).
 * - No external scripts/styles introduced here; respect global CSP via headers or middleware at the app level.
 * - No target="_blank" external links; for any future external links with target="_blank", add rel="noopener".
 *
 * Clean Code (SonarQube):
 * - Explicit typing for Metadata and component return type (JSX.Element).
 * - Descriptive names: `Page`, `metadata`, clear labels on buttons.
 * - Single-responsibility component: purely presentational, no side effects.
 * - Comments explain design intent without cluttering logic.
 *
 * Next.js Best Practices:
 * - Uses App Router metadata for SEO/social sharing.
 * - Server Component for static page: less client JS, better performance.
 * - Semantic main region and accessible landmarks (component="main", role="main").
 * - Uses `next/link` for internal navigation to avoid full page reloads.
 *
 * Accessibility:
 * - Proper heading hierarchy (H1 present).
 * - ARIA labels clarify button intents, especially for mailto and navigation.
 * - Adequate color contrast and spacing are delegated to theme; respects user preferences when the theme is configured.
 *
 * Performance:
 * - Minimal bundle impact: no state/effects, no unnecessary client components.
 * - Layout constrained to improve readability and reduce CLS risk.
 */