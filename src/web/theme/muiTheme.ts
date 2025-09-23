/**
 * File: src/web/theme/muiTheme.ts
 * Author: Praveen Kanwar
 * Organization: Kanwer Polytex
 * Description:
 *   Centralized MUI theme configuration for light and dark modes with strongly typed custom tokens.
 *   Follows best practices recommended by Next.js community, and coding quality/security guidance
 *   inspired by OWASP and SonarQube (immutability, clear typing, avoiding adhoc mutations).
 *
 * Key goals:
 *   - Strong typing (ThemeOptions over Partial<Theme>, module augmentation for custom tokens)
 *   - No post-creation mutation of theme (build once via createTheme)
 *   - Accessibility-first colors (ensure readable text contrasts, expose success/warning palettes)
 *   - Minimal surface area and maintainable structure (single source-of-truth tokens)
 *
 * Safe usage notes:
 *   - Do not mutate exported theme objects at runtime; prefer overrides via createTheme composition.
 *   - Avoid dynamic eval or runtime string building in style values.
 *   - Keep color tokens and constants local to this module to prevent unintended re-use/mutation.
 */

// Import theme factory and types from the canonical source to ensure correct typings. // OWASP/Sonar: explicit imports, avoid wildcard.
import {createTheme, type PaletteOptions, type ThemeOptions} from '@mui/material/styles' // Next.js/MUI recommended an import path

// Module augmentation to add a typed `custom` field in Theme and ThemeOptions. // Ensures type-safe access in sx(), styled(), and components.
declare module '@mui/material/styles' {
    // Custom design tokens interface (extend as needed).
    interface CustomTokens {
        tokens: {
            primaryLight: string
            primaryMain: string
            primaryDark: string
            surface: string
            background: string
            error: string
            success: string
            warning: string
            primaryContainer?: string
            onPrimary?: string
            onPrimaryContainer?: string
            surfaceVariant?: string
        }
    }

    // Make `custom` available on Theme at runtime (non-optional).
    interface Theme {
        custom: CustomTokens
    }

    // Allow providing `custom` when building ThemeOptions (optional).
    interface ThemeOptions {
        custom?: CustomTokens
    }
}

// -----------------------
// Brand color tokens (logo-derived)
// Keep constants top-level and immutable to prevent accidental mutation.
// -----------------------
const PRIMARY_LIGHT = '#00A89B' // teal-ish
const PRIMARY_MAIN = '#0086C1'  // cyan/blue midpoint (brand)
const PRIMARY_DARK = '#005FAD'  // deep blue
const NEUTRAL_TEXT = '#1E293B'  // dark text
const NEUTRAL_MUTED = '#475569' // secondary text
const SURFACE = '#FFFFFF'
const BACKGROUND = '#F8FAFC'
const ERROR = '#B3261E'
const SUCCESS = '#0F9D58'
const WARNING = '#F59E0B'

// Construct the light palette using MUI's PaletteOptions shape. // Sonar: explicit typing.
const lightPalette: PaletteOptions = {
    mode: 'light', // MUI color scheme mode.
    primary: {
        main: PRIMARY_MAIN, // Brand main color (text/controls).
        light: PRIMARY_LIGHT, // Light variant for hover/tones.
        dark: PRIMARY_DARK, // Dark variant for active/tones.
        contrastText: '#FFFFFF', // Ensure readable text on primary; verify with a11y tools.
    },
    secondary: {
        main: NEUTRAL_MUTED, // Secondary accents / less emphasis.
    },
    error: {
        main: ERROR, // Error color slot to align components (e.g., TextField error).
    },
    success: {
        main: SUCCESS, // Expose success palette for consistent semantics.
    },
    warning: {
        main: WARNING, // Expose a warning palette for consistent semantics.
    },
    background: {
        default: BACKGROUND, // App background.
        paper: SURFACE, // Surfaces like Paper, Cards.
    },
    text: {
        primary: NEUTRAL_TEXT, // Primary text on background.
        secondary: NEUTRAL_MUTED, // Secondary text on background.
    },
} as const // Immutable shape (helps avoid accidental runtime mutation).

// Construct the dark palette. // Ensure contrastText values remain readable against dark tones.
const darkPalette: PaletteOptions = {
    mode: 'dark',
    primary: {
        main: '#C4DFFF', // Lighter blue for dark mode readability.
        light: '#E7F3FF', // Subtle light variant in a dark scheme.
        dark: PRIMARY_DARK, // Keep the deep brand anchor for consistency.
        contrastText: '#0B1320', // Dark contrast text to ensure readability over light-blue primary.
    },
    secondary: {
        main: '#9FB6C9', // Muted secondary for a dark scheme.
    },
    error: {
        main: ERROR,
    },
    success: {
        main: SUCCESS,
    },
    warning: {
        main: WARNING,
    },
    background: {
        default: '#0B0D12', // App background in dark mode.
        paper: '#111318', // Elevated surface in dark mode.
    },
    text: {
        primary: '#E3E2E6', // High-contrast text on dark backgrounds.
        secondary: '#C9C9D2', // Secondary text for reduced emphasis.
    },
} as const // Immutable.

// Base theme options shared by both schemes. // Use ThemeOptions (not Partial<Theme>) for correct typing.
const baseOptions: ThemeOptions = {
    shape: {
        borderRadius: 12, // Rounded corners for cohesive design.
    },
    typography: {
        // Provide robust font fallbacks for broad script support and platform consistency.
        fontFamily: [
            '"Noto Sans"',
            '"Inter"',
            '"Roboto"',
            '"Helvetica Neue"',
            'Arial',
            'system-ui',
            '-apple-system',
            '"Segoe UI"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
            'sans-serif',
        ].join(','), // Join to a single CSS font-family string.
        h1: {fontWeight: 700, fontSize: '2.25rem'}, // Prominent page titles.
        h2: {fontWeight: 700, fontSize: '1.75rem'}, // Section headings.
        h3: {fontWeight: 600, fontSize: '1.25rem'}, // Subsection headings.
        body1: {fontSize: '1rem'}, // Default body text size.
        button: {textTransform: 'none', fontWeight: 600}, // Preserve case and provide weight for clarity.
    },
    components: {
        // Button style normalization: consistent radius & padding.
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10, // Slightly less than the global radius for optical balance.
                    paddingLeft: 18, // Horizontal padding tuned for label readability.
                    paddingRight: 18,
                },
            },
        },
        // Intentionally omit empty overrides to reduce noise and confusion.
    },
} as const // Immutable.

// Helper to build a fully typed theme with custom tokens, without post-creation mutation. // Sonar: single-responsibility function.
const buildTheme = (
    palette: PaletteOptions, // Palette for the specific color scheme.
    custom: NonNullable<import('@mui/material/styles').ThemeOptions['custom']> // Strongly typed a custom token bag.
) =>
    createTheme({
        ...baseOptions, // Spread shared options first for predictable override order.
        palette, // Apply color palette for the current scheme.
        custom, // Provide custom tokens at creation time (no later mutation).
    }) // Returns a MUI Theme with augmented `custom` property.

// Construct typed custom token sets (light). // Grouping helps consistency across the app.
const lightCustom = {
    tokens: {
        primaryLight: PRIMARY_LIGHT,
        primaryMain: PRIMARY_MAIN,
        primaryDark: PRIMARY_DARK,
        surface: SURFACE,
        background: BACKGROUND,
        error: ERROR,
        success: SUCCESS,
        warning: WARNING,
        // Optional extended tokens (M3-inspired).
        primaryContainer: '#DCE6FF',
        onPrimary: '#FFFFFF',
        onPrimaryContainer: '#041033',
        surfaceVariant: '#F2F3F8',
    },
} as const // Immutable shape.

// Construct typed custom token sets (dark). // Keep only the necessary overrides for dark.
const darkCustom = {
    tokens: {
        primaryLight: '#E7F3FF', // Provide a sensible light variant in dark mode if needed.
        primaryMain: '#C4DFFF',
        primaryDark: PRIMARY_DARK,
        surface: '#111318',
        background: '#0B0D12',
        error: ERROR,
        success: SUCCESS,
        warning: WARNING,
        // Optional dark-specific tokens can be added here if required.
    },
} as const // Immutable shape.

// Create theme instances for light and dark without mutating afterward. // Next.js best practice: pure objects, no side effects.
export const lightTheme = buildTheme(lightPalette, lightCustom) // Export light theme for general use.
export const darkTheme = buildTheme(darkPalette, darkCustom) // Export dark theme for dark mode toggles.

// Default export points to the light theme, matching common UX defaults. // Consumers can import darkTheme separately when needed.
export default lightTheme