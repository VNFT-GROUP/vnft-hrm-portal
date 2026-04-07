# VNFT Group — HRM Portal

## Project Overview

This is the **VNFT Group Human Resource Management Portal** — a web-based HR management system for a logistics/freight transportation company. The application is built with React + TypeScript + Vite, using Tailwind CSS v4, shadcn/ui components, and follows modern SPA architecture.

- **Company**: VNFT Group (Vietnam Freight Transport)
- **Slogan**: "Your Success, Our Target"
- **Industry**: Logistics, Freight, Transportation
- **Application Language**: Vietnamese (vi-VN)

## Brand Identity & Color Palette

The design must strictly follow the VNFT Group brand colors, derived from the company logo located at `/public/logo/Logo-VNFT-1024x1024.webp`.

### Primary Colors

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Brand Blue (Primary)** | Deep Navy Blue | `#2E3192` | Primary actions, headings, navigation, sidebar, key UI elements |
| **Brand Orange (Accent)** | Vibrant Orange | `#F7941D` | CTA buttons, highlights, active states, badges, important indicators |

### Extended Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Brand Blue Dark | Darker Navy | `#1E2062` | Hover states, sidebar background, dark surfaces |
| Brand Blue Light | Light Blue | `#4A4FC7` | Secondary text on dark, hover accents |
| Brand Blue Subtle | Faded Blue | `#E8E9F5` | Light backgrounds, cards on blue theme |
| Brand Orange Dark | Deep Orange | `#D4780F` | Hover state for orange buttons |
| Brand Orange Light | Light Orange | `#FBBD6A` | Soft highlights, progress bars, tags |
| Brand Orange Subtle | Pale Orange | `#FEF3E2` | Light background accents, notification badges bg |
| Neutral 900 | Near Black | `#111827` | Body text, headings |
| Neutral 700 | Dark Gray | `#374151` | Secondary text, labels |
| Neutral 500 | Mid Gray | `#6B7280` | Muted text, placeholders |
| Neutral 200 | Light Gray | `#E5E7EB` | Borders, dividers |
| Neutral 50 | Off White | `#F9FAFB` | Page backgrounds, input fields |
| Success | Green | `#10B981` | Success states, confirmations |
| Error | Red | `#EF4444` | Error states, destructive actions |
| Warning | Amber | `#F59E0B` | Warning states |

### Gradient Guidelines

- **Primary gradient**: `linear-gradient(135deg, #2E3192 0%, #1E2062 100%)` — for hero sections, sidebar, login visuals
- **Accent gradient**: `linear-gradient(135deg, #F7941D 0%, #D4780F 100%)` — for CTA buttons, active state
- **Background gradient (light)**: `linear-gradient(135deg, #F0F1FA 0%, #FEF3E2 30%, #F8FAFC 70%, #EFF6FF 100%)` — for page backgrounds
- **Blue-to-Orange accent**: `linear-gradient(135deg, rgba(46,49,146,0.15), rgba(247,148,29,0.15))` — for decorative blurred shapes

### Dark Mode

When implementing dark mode, use these as base reference:
- Background: `#0F1117`
- Card/Surface: `#1A1D2E`
- Primary: `#6B6FD6` (lighter version of Brand Blue)
- Accent: `#FBBD6A` (lighter version of Brand Orange)
- Text: `#F3F4F6`
- Muted Text: `#9CA3AF`

## Typography

- **Font**: `Geist Variable` (already imported via `@fontsource-variable/geist`)
- **Headings**: Bold (700–800), use Brand Blue `#2E3192` for headings on light backgrounds
- **Body**: Regular (400), `#111827` on light, `#F3F4F6` on dark
- **Label/Caption**: Semi-bold (600), `#374151`

## Design Principles

1. **Professional & Trustworthy**: This is an enterprise HR system. The design should feel corporate, polished, and premium—not playful.
2. **Blue-dominant with orange accents**: Blue is the primary workhorse color (nav, headers, primary buttons). Orange is used sparingly for high-emphasis CTAs, active states, and visual interest.
3. **Clean with subtle depth**: Use glassmorphism and soft shadows. Avoid flat or overly busy designs.
4. **Logistics-inspired visuals**: Incorporate subtle logistics motifs (speed, precision, global reach) where appropriate.
5. **Vietnamese localization**: All user-facing text should be in Vietnamese. Date format `DD/MM/YYYY`, currency `VND`.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 + vanilla CSS |
| UI Components | shadcn/ui (base-ui) |
| Routing | React Router DOM v7 |
| State Management | Zustand |
| Forms | React Hook Form + Zod validation |
| Data Fetching | TanStack React Query + Axios |
| i18n | i18next + react-i18next |
| Icons | Lucide React |
| Notifications | Sonner |

## File Structure Conventions

```
src/
├── components/
│   ├── ui/          # shadcn/ui components (do not modify directly)
│   └── custom/      # Custom reusable components
├── pages/
│   ├── public-routes/   # Unauthenticated pages (Login, Register)
│   └── app-routes/      # Authenticated pages (Dashboard, HR modules)
│       └── layout/      # App layouts
│           ├── components/ # Granular layout components (Sidebar, Topbar, Modals)
│           ├── AppLayout.tsx
│           └── ...
├── lib/             # Utilities, API clients, helpers (e.g., i18n.ts)
├── store/           # Zustand global stores (e.g., useLayoutStore.ts)
├── App.tsx          # Root component with routing
├── main.tsx         # Entry point
└── index.css        # Global styles + Tailwind theme
```

## Component & CSS Conventions

- Use **CSS Modules** or **co-located `.css` files** for component-specific styles (e.g., `LoginPage.css` alongside `LoginPage.tsx`)
- Follow **BEM-like naming** for CSS classes: `.login-card`, `.login-form-section`, `.visuals-logo-wrapper`
- Use Tailwind utilities for layout and spacing in JSX; use custom CSS for animations and complex visual effects
- All interactive elements must have **unique `id` attributes** for testing
- Components should be properly **memoized** where performance matters

## Architecture, Theming & Navigation
1. **Layout Encapsulation**: Structural UI pieces (Topbar, Sidebar, floating modals like ChangePasswordModal) strictly belong to `layout/components/` to follow a clean Domain-Driven organization instead of cluttering global `components/`.
2. **Scroll Restoration**: A specialized `ScrollArea` component manages SPA overscrolling constraints. We strictly intercept generic navigation via `[location.pathname]` at the `AppLayout` layer to cleanly trigger viewport `.scrollTo({ top: 0 })` resets.
3. **Multi-language Support (i18n)**: Integrated completely at the Topbar level, modifying global state cleanly without external page reloads. Default fallback is `vi`.
4. **Logistics Micro-Interactions**: The public-facing entry points (Login, Loading) implement dynamic SVG backdrops via `AnimatedLogisticsBackground.tsx`. We scale complexity using pure CSS `animation-delay` and `animation-duration` inline mapped to static `.bg-ship`, `.bg-truck`, `.bg-airplane` tracks, allowing rich, cheap pseudo-random traffic generation without JS overhead. The Loading UI features a micro progress trucking system that anchors an SVG to dynamic width percentages.

## Global Standard Shortcuts
To ensure highly productive navigation, the HR Portal utilizes the following standard global shortcuts:
1. **`Ctrl + B`** (or Cmd + B): Quick toggle Left Sidebar Menu
2. **`Ctrl + I`** (or Cmd + I): Quick toggle Profile Menu (Top Right)
3. **`Alt + I`** (or Option + I): Navigate directly to User Profile page
4. **`Shift + K`**: Navigate to User Guide & Auto-scroll to Shortcuts list
5. **`Esc`**: General close hook for overlays, popups, profile menus
