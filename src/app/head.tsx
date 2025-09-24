/**
 * File: app/head.tsx
 * Purpose: Server component to define global <head> metadata and assets (favicons, manifest, meta tags).
 *
 * Author: Praveen Kanwar
 * Organization: Kanwer Polytex
 *
 * Best Practices:
 * - Next.js App Router: head.tsx runs on the server and should render static, deterministic tags.
 * - OWASP: Expose a CSP nonce (if set by middleware) via a meta-tag; avoid unsafe inline code patterns.
 * - SonarQube: Keep code small, consistent, and maintainable; avoid duplication and magic strings.
 * - Accessibility: Do not disable zoom; provide a clear viewport; ensure social previews have alt text.
 *
 * Note:
 * - Security headers like Content-Security-Policy (CSP) should be set in middleware or platform headers.
 *   This file focuses on presentation metadata and static assets.
 */

import {headers} from 'next/headers' // Synchronous in App Router, but may be awaited safely if toolchain types differ.

// Use async to gracefully support environments where headers() is typed Promise-like; awaiting a sync value is a no-op.
export default async function Head() {
    // Read request headers. If middleware injected per-request CSP nonce, expose it below for client libraries.
    const readOnlyHeaders = await headers()
    const nonce = readOnlyHeaders.get('x-csp-nonce') ?? undefined

    return (
        <>
            {/* Expose CSP nonce in the DOM so client-side libraries (e.g., Emotion) can read it if needed */}
            {nonce ? <meta name="csp-nonce" content={nonce}/> : null}

            {/* Character encoding ensures consistent text rendering across platforms */}
            <meta charSet="utf-8"/>

            {/* Viewport: preserve user zoom for accessibility; include viewport-fit for modern devices with safe areas */}
            <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>

            {/* Human-readable description for SEO and link previews */}
            <meta
                name="description"
                content="Kanwer Polytex — Specialists in Nylon & Polyester FDY/HDY yarn. Based in Bhiwandi, Thane. Batch sizes 15kg–240kg. Any colour, any quantity."
            />

            {/* Application name helps UAs and OS integrations label the app (mirror in site.webmanifest) */}
            <meta name="application-name" content="Kanwer Polytex"/>

            {/* Robot's directive: index the site and follow links; tune in non-production if needed */}
            <meta
                name="robots"
                content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
            />

            {/* Privacy-preserving referrer policy aligns with OWASP guidance */}
            <meta name="referrer" content="strict-origin-when-cross-origin"/>

            {/* Prefer consistent color scheme support for user agents (dark/light UI); keep in sync with theme-color */}
            <meta name="color-scheme" content="light dark"/>

            {/* Theme colors help the browser UI (address bar, task switcher) feel consistent */}
            <meta name="theme-color" content="#0086C1"/>
            <meta name="msapplication-TileColor" content="#0086C1"/>

            {/* Canonical URL: helps SEO prevent duplicate content issues */}
            <link rel="canonical" href="https://kanwerpolytex.com"/>

            {/* ---- Favicons & Icons ---- */}
            {/* ICO fallback for legacy browsers */}
            <link rel="icon" href="/favicon.ico" sizes="any"/>
            {/* SVG favicon for modern browsers (reuses Safari pinned mask asset) */}
            <link rel="icon" type="image/svg+xml" href="/safari-pinned-tab.svg"/>
            {/* PNG icons for various device contexts */}
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png"/>
            <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png"/>
            <link rel="icon" type="image/png" sizes="128x128" href="/favicon-128x128.png"/>
            {/* Apple touch icons for iOS home screen (include 180 and 152 for broader Safari coverage) */}
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon.png"/>

            {/* ---- Android / PWA icons & manifest ---- */}
            <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png"/>
            <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png"/>
            {/* PWA Manifest: ensure scope/start_url/display/name/short_name and icons are correct */}
            <link rel="manifest" href="/site.webmanifest"/>

            {/* ---- Safari pinned tab (mask-icon) ---- */}
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0086C1"/>

            {/* Prevents iOS from auto-linking numbers to phone links if undesired */}
            <meta name="format-detection" content="telephone=no"/>

            {/* iOS PWA meta: enable standalone mode, title, and status bar styling */}
            <meta name="apple-mobile-web-app-capable" content="yes"/>
            <meta name="apple-mobile-web-app-title" content="Kanwer Polytex"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="default"/>

            {/* ---- Open Graph (Facebook, LinkedIn) ---- */}
            <meta property="og:title" content="Kanwer Polytex – Nylon & Polyester Yarn Dyeing"/>
            <meta
                property="og:description"
                content="Specialists in Nylon & Polyester FDY/HDY yarn. Based in Bhiwandi, Thane."
            />
            <meta property="og:type" content="website"/>
            <meta property="og:url" content="https://kanwerpolytex.com/"/>
            {/* Prefer an absolute URL; ensure the image is large enough (1200x630 recommended) */}
            <meta property="og:image" content="https://kanwerpolytex.com/android-chrome-512x512.png"/>
            <meta property="og:image:alt" content="Kanwer Polytex logo"/>
            <meta property="og:site_name" content="Kanwer Polytex"/>
            {/* Locale tags (extend if multilingual) */}
            <meta property="og:locale" content="en_IN"/>
            <meta property="og:locale:alternate" content="en_US"/>

            {/* ---- Twitter Card ---- */}
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content="Kanwer Polytex – Nylon & Polyester Yarn Dyeing"/>
            <meta
                name="twitter:description"
                content="Specialists in Nylon & Polyester FDY/HDY yarn. Based in Bhiwandi, Thane."
            />
            <meta name="twitter:image" content="https://kanwerpolytex.com/android-chrome-512x512.png"/>
            <meta name="twitter:image:alt" content="Kanwer Polytex logo"/>

            {/* JSON-LD: Organization structured data for rich results (kept static and deterministic server-side).
               - Uses a script[type="application/ld+json"] tag.
               - Injected via dangerouslySetInnerHTML to provide raw JSON (required by spec).
               - nonce is applied to satisfy strict CSP (style/script nonces). */}
            <script
                type="application/ld+json"
                // Attach CSP nonce if available to comply with a strict Content-Security-Policy
                nonce={nonce}
                // Provide strictly serialized JSON (no trailing commas, no functions).
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        name: "Kanwer Polytex",
                        legalName: "Kanwer Polytex",
                        url: "https://kanwerpolytex.com",
                        logo: "https://kanwerpolytex.com/android-chrome-512x512.png",
                        foundingDate: "1999",
                        description: "We are a yarn-dyeing company established in 1999, specialising in Polyester and Nylon yarns. Trusted worldwide for package dyeing technology, consistent colour matching, and mergeable lots.",
                        address: {
                            "@type": "PostalAddress",
                            addressLocality: "Bhiwandi",
                            addressRegion: "Maharashtra",
                            addressCountry: "IN",
                        },
                        contactPoint: [
                            {
                                "@type": "ContactPoint",
                                contactType: "sales",
                                areaServed: "IN",
                                availableLanguage: ["en"],
                                telephone: "+91-8850615547",
                                email: "leads@kanwerpolytex.com",
                            },
                        ],
                        sameAs: [
                            "https://www.kanwerpolytex.com",
                            "https://www.instagram.com/kanwer.polytex/",
                            "https://www.facebook.com/profile.php?id=61581091737474",
                            "https://www.linkedin.com/company/kanwerpolytex/",
                        ],
                    }),
                }}
            />

            {/* Performance hints (optional): preconnect to analytics/CDN if used; keep deterministic on server */}
            {/* Example: <link rel="preconnect" href="https://cdn.example.com" crossOrigin="" /> */}
        </>
    )
}