/**
 * src/app/page.tsx
 * Temporary landing page for Kanwer Polytex.
 * Author: Praveen Kanwar
 * Organization: Kanwer Polytex
 *
 * Overview:
 * - This is a minimal, secure, and accessible landing page that renders on the server (default in Next.js App Router).
 * - It uses Material UI (MUI) for layout and typography, adhering to semantic HTML and accessibility best practices.
 * - Security-conscious choices: no dynamic user input, no inline event handlers, and least-privilege markup.
 * - Metadata conforms to Next.js App Router recommendations for SEO/social previews.
 * - Code comments and structure align with SonarQube clean code guidance (clear naming, single responsibility, explicit typing).
 *
 * Notes:
 * - This component is a server component (no "use client" directive), which suits static content and avoids unnecessary client JS.
 * - If future interactivity is added (state, effects, or event handlers), convert to a client component at that time.
 */

import React, {JSX} from 'react'; // React import for JSX typings and component definitions
import type {Metadata} from 'next'; // Explicit import of Next.js Metadata type for strong typing
import {Box, Button, Container, Typography} from '@mui/material'; // MUI components for accessible UI primitives

// Export strongly typed Next.js page metadata.
// The following Next.js best practices: descriptive, consistent, and inclusive of social/robots hints.
// No sensitive data is exposed here (OWASP: avoid leaking secrets via metadata).
export const metadata: Metadata = {
    title: 'Kanwer Polytex — Under Construction', // Clear page title for SEO and users
    description: 'Welcome to Kanwer Polytex. Our new website is coming soon.', // Human-readable description for SEO/snippets
    robots: {
        index: true, // Allow indexing; set to false if you do not want this temporary page indexed
        follow: true, // Allow the following links
    },
    openGraph: {
        title: 'Kanwer Polytex — Under Construction', // Consistent with the main title
        description: 'Welcome to Kanwer Polytex. Our new website is coming soon.', // Consistent with meta-description
        type: 'website', // The appropriate OG type for a landing page
    },
    twitter: {
        card: 'summary', // Lightweight Twitter card
        title: 'Kanwer Polytex — Under Construction', // Consistent titling
        description: 'Welcome to Kanwer Polytex. Our new website is coming soon.', // Consistent description
    },
};

// Define the page component with an explicit function type.
// Using a named function improves stack traces and readability (SonarQube: clarity, self-documenting code).
export default function HomePage(): JSX.Element {
    // Render-only logic to keep the component pure and safe (OWASP: minimize attack surface).
    return (
        // Main content wrapper: semantic element and ARIA role support accessibility tools.
        <Container
            component="main" // Semantic HTML to mark a main content region
            role="main" // Reinforces semantics for assistive technologies
            maxWidth="md" // Keeps content readable and centered on large screens
            sx={{
                minHeight: '100vh', // Full viewport height to vertically center content
                display: 'flex', // Flex layout for vertical centering
                flexDirection: 'column', // Stack children vertically
                justifyContent: 'center', // Center content vertically
                textAlign: 'center', // Center text for a simple hero-style layout
                gap: 2, // Consistent spacing across elements
                // Avoids overly complex inline styles; use tokens and theme where applicable for consistency.
            }}
        >
            {/* Accessible and semantic heading for the page (H1). */}
            <Typography variant="h2" component="h1" gutterBottom>
                Welcome to Kanwer Polytex
            </Typography>

            {/* Secondary lead text with reduced emphasis using theme's text.secondary color. */}
            <Typography variant="h5" color="text.secondary" gutterBottom>
                Our new website is under construction. Stay tuned for updates!
            </Typography>

            {/* Action area for primary call-to-action. */}
            <Box sx={{mt: 2, display: 'flex', justifyContent: 'center'}}>
                {/*
                  Contact action:
                  - Using a Button with href renders an accessible anchor under the hood.
                  - mailto: a scheme is safe here and does not require target or rel.
                  - aria-label improves clarity for screen reader users.
                */}
                <Button
                    variant="contained" // High-emphasis button style
                    color="primary" // Uses theme primary color for brand consistency
                    href="mailto:contact@kanwerpolytex.com" // Static, non-user-controlled link (OWASP: no user input interpolation)
                    aria-label="Contact Kanwer Polytex by email"
                >
                    Contact Us
                </Button>
            </Box>
        </Container>
    );
}