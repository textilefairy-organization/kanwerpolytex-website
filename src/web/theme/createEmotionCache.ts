// src/web/theme/createEmotionCache.ts
import createCache, {type EmotionCache} from '@emotion/cache'

/**
 * File: src/web/theme/createEmotionCache.ts
 * Purpose: Factory for creating a configured Emotion cache with optional CSP nonce support.
 *
 * Author: Praveen Kanwar
 * Organization: Kanwer Polytex
 *
 * Overview:
 * - Provides a single place to configure Emotion cache (key, ordering, and security-related nonce).
 * - Integrates with CSP hardening by adding nonce to Emotion's injected <style> tags.
 *
 * Security & Best Practices (OWASP, SonarQube, Next.js):
 * - OWASP: Prefer nonce's over 'unsafe-inline' for styles/scripts. This function accepts a CSP nonce and applies it to
 *   Emotion's <style> tags so they pass style-src 'nonce-...'.
 * - SonarQube: Avoid magic strings by centralizing a cache key; validate inputs defensively; keep function small and pure.
 * - Next.js: Use on both server and client. On the server, pass the nonce generated per request by middleware; on the
 *   client, you typically don't need to pass nonce unless you also enforce it client-side.
 */

// Centralized cache key to avoid "magic strings" and potential collisions across style systems
const MUI_EMOTION_CACHE_KEY = 'mui' as const

// Basic Base64 validation for CSP nonce values (defensive; avoids passing unexpected input to the DOM)
const BASE64_REGEX = /^[A-Za-z0-9+/=]+$/

/**
 * sanitizeNonce
 * Ensures the provided nonce is a non-empty Base64 string. Returns undefined if invalid.
 * Note: Do not transform the nonce, as CSP requires exact value matching.
 */
function sanitizeNonce(nonce?: string): string | undefined {
    if (typeof nonce !== 'string') return undefined
    const trimmed = nonce.trim()
    if (trimmed.length === 0) return undefined
    // Nonces are commonly Base64; adjust if your generation scheme differs.
    if (!BASE64_REGEX.test(trimmed)) return undefined
    return trimmed
}

/**
 * createEmotionCache
 * Factory that returns an EmotionCache configured for MUI with optional CSP nonce support.
 *
 * Params:
 * - nonce?: string
 *   A cryptographically random, per-request nonce (e.g., generated in middleware). When provided and valid,
 *   Emotion will set nonce="<value>" on injected <style> tags, satisfying a strict style-src CSP.
 *
 * Returns:
 * - EmotionCache instance suitable for SSR and client rendering.
 */
export default function createEmotionCache(nonce?: string): EmotionCache {
    // Validate the nonce defensively; pass through only if it matches basic expectations.
    const safeNonce = sanitizeNonce(nonce)

    // prepend: true makes Emotion's styles load before other styles so component overrides remain predictable.
    // key: ensures separation from other potential Emotion instances.
    return createCache({
        key: MUI_EMOTION_CACHE_KEY,
        nonce: safeNonce,
        prepend: true,
    })
}