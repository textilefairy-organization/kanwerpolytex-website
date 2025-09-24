/**
 * File: middleware.ts
 * Purpose: Centralized, hardened security middleware applying HTTP response headers and CSP with per-request nonce.
 *          Aligns with OWASP, SonarQube, and Next.js best practices. Designed for Edge runtime compatibility.
 *
 * Author: Praveen Kanwar
 * Organization: Kanwer Polytex
 *
 * Key Enhancements:
 * - CSP nonce flow: Generate a cryptographically strong nonce per request, pass it to the app via request header,
 *   and enforce a strict style-src without 'unsafe-inline'.
 * - Curated allowlists for third-party hosts. Keep minimal to reduce supply-chain risk.
 * - Optional CSP report-only mode and report endpoint to observe violations before enforcing.
 * - Scoped middleware matcher to skip static assets for performance.
 *
 * Usage for nonce in the app (high-level):
 * - In your server components/SSR (e.g., layout), read the nonce from request headers (headers().get('x-csp-nonce')).
 * - Inject the nonce into Emotion/MUI SSR so generated <style nonce = "..."> is accepted by CSP.
 * - Optionally mirror the nonce in a <meta name="csp-nonce" content="..."> tag for client libraries that need it.
 *
 * Note:
 * - HSTS assumes HTTPS in production. Ensure all environments use TLS, especially when enabling 'preload'.
 * - Avoid wildcards in CSP directives. Only add domains you fully trust.
 */

import {type NextRequest, NextResponse} from 'next/server'

/**
 * Environment toggles for strictness and telemetry.
 * SonarQube: Centralized environment access improves testability and consistency.
 */
const isProd: boolean = process.env.NODE_ENV === 'production'
const cspReportUri: string | undefined = process.env.CSP_REPORT_URI // e.g., https://example.report-uri.com/r/d/csp/enforce
const useReportOnly: boolean = process.env.CSP_REPORT_ONLY === 'true' // set true during initial rollout

/**
 * Per-request cryptographic nonce generator.
 * - Uses Web Crypto API available in the Edge runtime.
 * - Outputs Base64 (not URL-safe) as recommended for CSP nonce's.
 */
function generateNonce(bytesLength = 16): string {
    const bytes = new Uint8Array(bytesLength)
    crypto.getRandomValues(bytes)
    // Convert to base64 using btoa on a binary string; Edge runtime provides btoa.
    let binary = ''
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
    return btoa(binary)
}

/**
 * Third-party allowlists.
 * Keep lists tight. Add entries intentionally with explanatory comments.
 */
const ALLOWED_SCRIPT_HOSTS: string[] = [
    "'self'",
    // Example: 'https://www.googletagmanager.com',
    // Example: 'https://www.google-analytics.com',
]

const ALLOWED_STYLE_HOSTS: string[] = [
    "'self'",
    // Font stylesheet host if used:
    'https://fonts.googleapis.com',
    // No 'unsafe-inline' here — we're using nonce instead.
]

const ALLOWED_IMG_HOSTS: string[] = [
    "'self'",
    'data:', // For inline placeholders/small embeds; remove if not required.
    // Add your image CDN(s) if used:
    // 'https://images.example-cdn.com'
]

const ALLOWED_FONT_HOSTS: string[] = [
    "'self'",
    'https://fonts.gstatic.com',
]

const ALLOWED_CONNECT_HOSTS: string[] = [
    "'self'",
    // Add your API endpoints/domains used by fetch/XHR/WebSocket:
    // 'https://api.example.com',
]

/**
 * Build a strict CSP string using the per-request nonce.
 * - style-src uses nonce to permit SSR-injected styles from Emotion/MUI.
 * - Remove or replace any directive with caution; test in Report-Only mode first.
 */
function buildCSP(nonce: string): string {
    const directives: string[] = [
        // Fallback for unspecified resource types
        `default-src 'self'`,

        // Scripts: allow self, any allowed script hosts, and the per-request nonce
        `script-src ${ALLOWED_SCRIPT_HOSTS.join(' ')} 'nonce-${nonce}'`,

        // Styles: allow self + nonce; include font stylesheet host if used
        `style-src ${ALLOWED_STYLE_HOSTS.join(' ')} 'nonce-${nonce}'`,

        // Images: self, data, and optional CDNs
        `img-src ${ALLOWED_IMG_HOSTS.join(' ')}`,

        // Fonts: self-plus trusted font CDN
        `font-src ${ALLOWED_FONT_HOSTS.join(' ')}`,

        // Fetch/XHR/WebSocket endpoints
        `connect-src ${ALLOWED_CONNECT_HOSTS.join(' ')}`,

        // No plugins/Flash
        `object-src 'none'`,

        // Prevent clickjacking
        `frame-ancestors 'none'`,

        // Mitigate base tag attacks
        `base-uri 'self'`,

        // Restrict form submissions
        `form-action 'self'`,

        // In production, upgrade insecure requests (optional but recommended if all assets are HTTPS)
        ...(isProd ? [`upgrade-insecure-requests`] : []),
    ]

    // Add reporting for visibility during rollout
    if (cspReportUri) {
        directives.push(`report-uri ${cspReportUri}`)
    }

    return directives.join('; ')
}

/**
 * Apply standardized security headers.
 * Headers are kept modern and unopinionated to reduce breakage.
 */
function applySecurityHeaders(res: NextResponse, cspValue: string, nonce: string): void {
    // Modern privacy-preserving referrer policy
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Clickjacking protection (aligns with frame-ancestors)
    res.headers.set('X-Frame-Options', 'DENY')

    // MIME-type sniffing protection
    res.headers.set('X-Content-Type-Options', 'nosniff')

    // Disable DNS prefetch unless explicitly needed
    res.headers.set('X-DNS-Prefetch-Control', 'off')

    // HSTS for 2 years plus preload (ensure HTTPS everywhere)
    res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')

    // Least-privilege feature policy (Permissions-Policy)
    res.headers.set(
        'Permissions-Policy',
        [
            "accelerometer=()",
            "ambient-light-sensor=()",
            "autoplay=()",
            "battery=()",
            "camera=()",
            "display-capture=()",
            "document-domain=()",
            "encrypted-media=()",
            "fullscreen=(self)", // allow same-origin fullscreen only
            "geolocation=()",
            "gyroscope=()",
            "hid=()",
            "magnetometer=()",
            "microphone=()",
            "midi=()",
            "payment=()",
            "picture-in-picture=(self)",
            "publickey-credentials-get=()",
            "screen-wake-lock=()",
            "sync-xhr=()",
            "usb=()",
            "vr=()",
            "xr-spatial-tracking=()",
        ].join(', ')
    )

    // Disallow Adobe cross-domain policy files
    res.headers.set('X-Permitted-Cross-Domain-Policies', 'none')

    // Conservative resource policy; adjust if you serve cross-origin static assets
    res.headers.set('Cross-Origin-Resource-Policy', 'same-origin')

    // CSP: either enforce or report-only
    if (useReportOnly) {
        res.headers.set('Content-Security-Policy-Report-Only', cspValue)
    } else {
        res.headers.set('Content-Security-Policy', cspValue)
    }

    // Expose the nonce to downstream (optional header for SSR frameworks to read).
    // Server components can read this via headers() and inject into Emotion SSR.
    res.headers.set('x-csp-nonce', nonce)
}

/**
 * Middleware entry point: generates a per-request nonce, forwards it via request headers,
 * and applies hardened security headers including CSP with that nonce.
 */
export function middleware(req: NextRequest): NextResponse {
    // Generate fresh nonce for this request
    const nonce = generateNonce()

    // Forward the nonce to the application layer via a request header.
    // Server components can access it with headers().get('x-csp-nonce').
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-csp-nonce', nonce)

    // Create a pass-through response with the modified request headers
    const res = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })

    // Build CSP using the generated nonce
    const csp = buildCSP(nonce)

    // Apply all security headers, including CSP
    applySecurityHeaders(res, csp, nonce)

    // Continue the chain
    return res
}

/**
 * Matcher: exclude Next.js internals and common static assets for performance.
 * Adjust patterns to suit your deployment and static asset paths.
 *
 * Platform note:
 * - On Vercel, many static headers can be set via vercel.json for performance.
 *   Middleware remains ideal for dynamic headers like CSP nonce's and conditional policies.
 */
export const config = {
    matcher:
        '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|manifest\\.json|assets|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|css|js|map|txt|xml|json)$).*)',
}