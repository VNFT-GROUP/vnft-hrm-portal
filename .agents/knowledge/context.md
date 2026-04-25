# VNFT Group — Portal Platform

## Project Overview

This is the **VNFT Group Portal Platform** — a Turborepo-powered monorepo containing multiple web applications for a logistics/freight transportation company. Each application is built with React + TypeScript + Vite, using Tailwind CSS v4, shadcn/ui components, and follows modern SPA architecture.

- **Company**: VNFT Group (Vietnam Freight Transport)
- **Slogan**: "Your Success, Our Target"
- **Industry**: Logistics, Freight, Transportation
- **Application Languages**: Vietnamese (vi-VN), English (en-US), Chinese Simplified (zh-CN)

## Monorepo Structure (Turborepo)

```
vnft-portal/
├── apps/
│   ├── hrm/               # HRM Portal (Human Resource Management)
│   ├── crm/               # CRM Portal (Customer Relationship Management) — planned
│   └── fms/               # FMS Portal (Fleet Management System) — planned
├── packages/
│   ├── ui/                # Shared UI components (shadcn/ui base)
│   ├── eslint-config/     # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
├── .agents/               # AI agent instructions, skills & knowledge
├── turbo.json             # Turborepo pipeline configuration
└── package.json           # Root workspace configuration (npm workspaces)
```

### Key Commands
- `npm run dev` — Start all apps in development mode
- `npm run build` — Build all apps
- `npm run lint` — Lint all apps and packages
- `turbo run dev --filter=hrm` — Start only HRM app

---

## HRM Portal (`apps/hrm/`)

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

- **Primary gradient**: `linear-gradient(135deg, #2E3192 0%, #1E2062 100%)` â€” for hero sections, sidebar, login visuals
- **Accent gradient**: `linear-gradient(135deg, #F7941D 0%, #D4780F 100%)` â€” for CTA buttons, active state
- **Background gradient (light)**: `linear-gradient(135deg, #F0F1FA 0%, #FEF3E2 30%, #F8FAFC 70%, #EFF6FF 100%)` â€” for page backgrounds
- **Blue-to-Orange accent**: `linear-gradient(135deg, rgba(46,49,146,0.15), rgba(247,148,29,0.15))` â€” for decorative blurred shapes

### Dark Mode

When implementing dark mode, use these as base reference:
- Background: `#0F1117`
- Card/Surface: `#1A1D2E`
- Primary: `#6B6FD6` (lighter version of Brand Blue)
- Accent: `#FBBD6A` (lighter version of Brand Orange)
- Text: `#F3F4F6`
- Muted Text: `#9CA3AF`
- **Implementation**: Managed globally via `next-themes` and CSS root variables (following OKLCH token mapping). Theme toggle is placed in `Topbar`.

## Typography

- **Font**: `Geist Variable` (already imported via `@fontsource-variable/geist`)
- **Headings**: Bold (700â€“800), use Brand Blue `#2E3192` for headings on light backgrounds
- **Body**: Regular (400), `#111827` on light, `#F3F4F6` on dark
- **Label/Caption**: Semi-bold (600), `#374151`

## Design Principles

1. **Professional & Trustworthy**: This is an enterprise HR system. The design should feel corporate, polished, and premiumâ€”not playful.
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

## File Structure Conventions (HRM)

```
apps/hrm/
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn/ui components (do not modify directly)
│   │   └── custom/      # Custom reusable components
│   ├── pages/
│   │   ├── public-routes/   # Unauthenticated pages (Login, Register)
│   │   └── app-routes/      # Authenticated pages (Dashboard, HR modules)
│   │       └── layout/      # App layouts
│   │           ├── components/ # Granular layout components (Sidebar, Topbar, Modals)
│   │           ├── AppLayout.tsx
│   │           └── ...
│   ├── lib/             # Utilities, API clients, helpers (e.g., i18n.ts)
│   ├── store/           # Zustand global stores (e.g., useLayoutStore.ts)
│   ├── App.tsx          # Root component with routing
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles + Tailwind theme
├── public/              # Static assets (logos, fonts)
├── package.json         # HRM-specific dependencies
├── vite.config.ts       # HRM Vite configuration
├── .env                 # Environment variables
└── index.html           # Vite entry HTML
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
3. **Multi-language Support (i18n)**: Integrated comprehensively across the Topbar, Sidebar, Profile tabs, and core Dashboard modules. Translation mapping utilizes `react-i18next` with local objects (`vi`, `en`, `zh`) unified synchronously at the root `translation` namespace to eliminate fetch delays and scope collision. The `t()` hook handles text toggles instantly without page reloads. Only pure mock data (Names, IDs, addresses) is intentionally exempt from translations.
4. **Logistics Micro-Interactions & Viewport Control**: The public-facing entry points (Login, Loading) implement dynamic SVG backdrops via `AnimatedLogisticsBackground.tsx`. We scale complexity using pure CSS `animation-delay` and `animation-duration` inline mapped to static `.bg-ship`, `.bg-truck`, `.bg-airplane` tracks. To enhance immersion, we enforce realistic logistics iconography, replacing abstract shapes with custom `ContainerTruck` and `ContainerShip` SVG components detailing explicit container corrugations and brand-colored cargo blocks. The scenery incorporates a bright sky-blue gradient, flattened stratus clouds, and a pulsating sun glow. For viewport rigidity and an app-like feel, the login screen explicitly utilizes `height: 100dvh` and `position: fixed` to prevent arbitrary overflow and scroll-bleeding. To secure visual hierarchy on bright canvases, core typography enforces Brand Orange (`#D4780F`) for high-contrast readability.
5. **Lazy Loading**: Entire application is chunked utilizing `React.lazy()` with `Suspense` inside `AppLayout.tsx` for optimal bundle delivery, removing initial boot lag.
6. **Settings & Global UI Sync**: Modular system under `/app/settings/` integrated with Zustand (`useLayoutStore`). E.g. `showEmployeeLegend` enables user-preference synced context legends dynamically unmounting via state without reload. We also implemented a dynamic **Custom Cursor** switching system defined entirely via global state presets.
7. **Smart Tables & Context Menus**: Advanced interaction model generalized across core management modules (**Employee**, **Department**, and **Position** Management). Implements Shadcn UI ContextMenu at the Table level interacting intelligently with `onContextMenu` ID traps replacing structural HTML reflows inside `<tbody>` for seamless CRUD operation triggers.
8. **Form & Data UX**: Form submissions adhere to standardized "Enter-key" catching (wrapped in explicit `<form>` tags alongside `type="submit"` buttons). Instant visual feedback guarantees are universally configured via `sonner` Toast success/error callbacks triggered immediately upon save resolution.
9. **Navigation Pruning & Legend Standardization**: The global Sidebar configuration explicitly limits the Management modules to absolute essentials (Dashboard, Profile, Calendar, Requests, Management, and underlying sub-modules). Legacy translations and unused menu items have been stripped from the architecture (`vi`, `en`, `zh`). Management UI legends have been standardized across sub-modules using a vertical stack separated by a border to present actionable tooltips (e.g. "Máº¹o: Click chuá»™t pháº£i..."). Both `Giá» vÃ o` (Default Check-In 08:00) and `Giá» ra` (Default Check-Out 17:30) are native, required time fields heavily integrated within the Employee Form builder.
10. **Secure Native Onboarding Flow**: Implemented a forced `FirstTimePasswordModal` dedicated to tracking initial authentications by interpreting `passwordChangedAt` utilizing the global Zustand `useAuthStore` session as a fallback against missing API states. The form incorporates decorative multi-layered visual depth (e.g., pure CSS bloomed keyframes `ftpm-shoot-left`/`right`), prevents native UI overlay blockage (Sidebar locked statically to `z-index: 40` vs standard modals at `z-index: 50`), and guarantees viewport scale resilience via native structural boundaries (`max-h-[90vh]` layered with encapsulated `overflow-y-auto`).
11. **API Client Unification**: All API calls utilize a unified Axios instance (`apiClient.ts`) strictly mapped with Interceptors handling automated `Authorization` headers mapping towards backend environments.
12. **Domain-Driven DTOs**: TypeScript definitions heavily correspond to backend Domain DTOs organized granularly within `src/types/user/`, `src/types/auth/`, etc. (e.g. `UpdateUserProfileRequest`, `UserResponse`).
13. **Terminology Standardization**: "Role" has been fully refactored across UI, APIs, and translations to mean "Job Title" (`Chá»©c vá»¥`). The previous "Role" security mapping module is now correctly referred to as "Group Management" (`NhÃ³m quyá»n`). The generic Dashboard/Overview modules for Management were intentionally pruned to streamline admin workflows.
14. **Sheet-Based Forms UX**: All Employee sub-management flows (Change Password, Groups, Work Information, Basic Profile) avoid disruptive navigation by sliding `<Sheet>` panels overlaid atop the primary `EmployeeTable.tsx`. Specifically, `BasicInformationSheet` intelligently mimics the full-screen layout of `EditProfilePage`, embedding nested arrays (Banks, Dependents, Experiences) cleanly into horizontal/vertical tabs, while locking states using localized `isEditingMode` triggers seamlessly coupled with Shadcn `Switch` toggles.
15. **Centralized Display Settings**: All UI preferences (App Font, Sidebar Themes, Custom Cursors, Toggleable Legends, and Sidebar Menu Visibility Filters) are fully decoupled from redundant popups and rest entirely inside `src/pages/app-routes/settings`. This acts as the global hub for UI manipulation synced permanently to `localStorage` via Zustand middleware (`useLayoutStore`).
16. **Sidebar Navigation & Routing Simplification**: Non-essential features (e.g. `Calendar`) and redundant UI components (e.g. `QuickCustomizeSheet.tsx`, or shortcut references in the Topbar) have been actively pruned from the Core Routing array (`routes/index.tsx`) and standard modules to ensure a cleaner administrative workspace experience.

17. **Global Layout Standardization**: All core application pages (Dashboard, Profile, Settings, Management Modules, etc.) enforce a dynamic full-width fluid layout. Rigid page-level constraints (`max-w-*`) on `.tsx` route entries and container `mx-auto` structures have been fully eradicated to maximize data rendering real estate on large viewports.
18. **Backend Form Localization & Fuzzy Search**: Distinct profile form dropdown selections dependent on Vietnamese standard keys (Nationality, Religion, Ethnicity) are explicitly tracked with UI Info alerts dictating that they will bypass UI language toggles, persisting identically to backend datasets in native Vietnamese to prevent data parsing fragmentation. To optimize UX alongside strict database constraints, dropdown components are structured via a generalized `ProfileSearchableSelect` that aggregates both English and Vietnamese translations natively into the `CommandItem` index, facilitating dual-language fuzzy searching.
19. **Form Validation Tiers**: The system decouples frontend validations depending on contexts. Administrative updates (`UpdateUserProfileRequest` mounted inside `BasicInformationSheet`) completely strip UI required validations (Asterisks, Submission Blocks) unblocking partial payload saves dynamically. Conversely, strictly-owned personal profiles (`UpdateCurrentUserProfileRequest` mapped via `EditProfilePage`) tightly enforce required field validations to maintain robust employee data completeness.

## Global Standard Shortcuts
To ensure highly productive navigation, the HR Portal utilizes the following standard global shortcuts:
1. **`Ctrl + B`** (or Cmd + B): Quick toggle Left Sidebar Menu
2. **`Ctrl + I`** (or Cmd + I): Quick toggle Profile Menu (Top Right)
3. **`Alt + I`** (or Option + I): Navigate directly to User Profile page
4. **`Alt + S`** (or Option + S): Navigate directly to System Settings page
5. **`Alt + P`** (or Option + P): Quick open 'Change Password' modal globally
6. **`Shift + K`**: Navigate to User Guide & Auto-scroll to Shortcuts list
7. **`Esc`**: General close hook for overlays, popups, profile menus


# Management Module UI/UX & Data Guidelines

## 1. UI Tabs Design (Segmented Control style)
Following the standard Shadcn UI approach, the Top Tabs for configuring management sections (e.g., Quyá»n, NhÃ³m Quyá»n, NgÆ°á»i dÃ¹ng) should implement a Segmented Control switch layout.

```tsx
<Tabs defaultValue="groups" className="flex flex-col gap-6 mt-2">
  <div className="w-full flex justify-center md:items-start md:justify-start">
    <TabsList className="h-12 bg-muted/80 p-1.5 rounded-xl border border-border shadow-inner min-w-[340px]">
      <TabsTrigger
        value="groups"
        className="flex-1 flex items-center justify-center gap-2 px-6 py-2 text-sm font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-[#2E3192] text-muted-foreground transition-all h-full"
      >
        <CheckSquare size={16} /> <span>{t('management.groupsTab')}</span>
      </TabsTrigger>
      {/* ... */}
    </TabsList>
  </div>
</Tabs>
```
*Key notes: Use `h-12`, `p-1.5`, `rounded-xl`, `bg-muted/80`, `shadow-inner` for the wrapper. Use `data-[state=active]` with specific #2E3192 text.*

## 2. Global State & API Refresh Consistency
- **User Session Mapping**: The `UserSessionResponse` from the backend `/auth/refresh` API automatically contains `groupId`, `groupName` and the `groupPermissions` list.
- **Interceptors**: When `apiClient.ts` does an intercept/refresh logic upon `401 / 1102`, it dispatches the `login()` action to update the `session` object in `useAuthStore.ts`.
- **Conclusion**: There is no need to manually refetch permissions on the frontend after a session resume. Any component can directly access `session.groupPermissions` via `useAuthStore()`.

## 3. i18n Internationalization
All UI features deployed to the Management Module must be externalized for localization in two files:
- `src/locales/vi/management.ts`
- `src/locales/en/management.ts`

**Convention for React Components:**
Use the `useTranslation` hook and map strings strictly through `t()`, keeping fallback text for clarity:
```tsx
const { t } = useTranslation();
<Label>
    {t("management.formNameRequired", "TÃªn NhÃ³m Quyá»n")}
</Label>
```

## 4. Multi-Select Forms (Permissions Grouping)
When rendering large arrays of checkbox selections (e.g., Permission assignments to Groups):
- Extract and group them via `useMemo` based on `category`.
- Implement a 2-column or grid layout using `grid-cols-1 md:grid-cols-2`.
- Wrap Checkbox fields in `Label` containers configured as clickable interactive cards (`hover:bg-card border border-border/60 hover:shadow-md hover:border-[#2E3192]/50`).

## 5. Page Header Styling Convention
All major root pages (e.g., Employees, Attendance, Requests, Time Settings) should follow a unified presentation structure using Framer Motion (`motion.div`):
- **Layout Wrap**: `className="w-full p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 md:gap-8"`
- **Motion div**: Initial state `-y: 20, opacity: 0`, animate to `0`, `transition duration 0.5`.
- **Title Block**:
  - `h1` sizing: `text-2xl md:text-3xl font-bold text-[#1E2062] flex items-center gap-3`
  - **The Icon**: Wrapped in a rounded box with `span` classes: `p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl flex items-center justify-center`.
- **Subtitle**: `text-muted-foreground text-sm md:text-base ml-1`.
Do not use old, simple `border-l-4 border-indigo-600 pl-3` lines for standard root pages anymore.

## 6. Table UI & Styling Standardization
All management tables (Employees, Departments, Positions, Job Titles, Employee Codes, Payroll) must follow these strict UI conventions for a unified, modern aesthetic:
- **Header (`thead`)**: `className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 z-10 shadow-sm"`. Remove all `bg-slate-100` or `border-b` logic.
- **Header Cells (`th`)**: Use `font-medium` (not `font-semibold`). Remove any vertical borders like `border-x` or `border-r`.
- **Body (`tbody`)**: `className="divide-y divide-border/50"`.
- **Rows (`tr`)**: `className="hover:bg-muted/30 transition-colors"`.
- **Cells (`td`)**: Remove any vertical borders. Keep them clean.
- **Avatar in Audit Columns**: Any `createdBy` or `updatedBy` fields must use the `AvatarPlaceholder` component paired with the user's name:
  ```tsx
  <div className="flex items-center justify-center gap-2">
    <AvatarPlaceholder name={item.createdBy} className="w-6 h-6 text-[10px]" />
    <span>{item.createdBy}</span>
  </div>
  ```
- **Action Buttons**: Edit buttons must use `text-amber-500 hover:text-amber-600 hover:bg-amber-50` and Delete buttons must use `text-rose-500 hover:text-rose-600 hover:bg-rose-50`. Actions must always be visible (remove `opacity-0 group-hover:opacity-100` tricks).

## 7. Payroll Architecture & Business Rules
The Payroll module manages monthly salary calculation with inline editing and auto-save.

### 7.1 Flow
1. **Create**: User picks month, year, and scope (jobTitleIds / userProfileIds / employeeCodes / all). `POST /payrolls` creates a DRAFT payroll.
2. **Calculate**: `POST /payrolls/calculate` with `imports[]` containing editable field overrides. Returns recalculated `PayrollResponse`.
3. **Inline Editing**: Editable cells trigger auto-save via calculate mutation on blur.
4. **Statuses**: DRAFT â†’ CALCULATED â†’ FINALIZED â†’ APPROVED â†’ LOCKED. Also CANCELED.

### 7.2 Data Sources
- **From user compensation/profile** (readonly): basicSalary, targetThreshold, parkingAllowance, fuelAllowance, phoneAllowance, insuranceBalance, usaOfficeAllowance, managementAllowance, jobAllowance, socialInsuranceSalary, standardWorkdays, actualWorkdays, dependentCount
- **From performance** (readonly): performanceAttitudeAllowance
- **From AttendanceMonthlySummary** (readonly): punctualityDisciplineAllowance
- **Editable (nháº­p vÃ o)**: targetSalary, commission, seniorityAllowance, outstandingAllowance, hotBonus, monthlyBonus, businessTripFee, mealAllowance, clientEntertainment, personalIncomeTax, bankTransfer

### 7.3 Auto-Calculated Fields (Â§5)
- BHXH Cty = BHXH Ã— 17.5%, BHYT Cty = BHXH Ã— 3%, BHTN Cty = BHXH Ã— 1%
- BHXH NV = BHXH Ã— 8%, BHYT NV = BHXH Ã— 1.5%, BHTN NV = BHXH Ã— 1%

### 7.4 Formulas (Â§6)
- **Tá»•ng lÆ°Æ¡ng** = ROUND(Hoa há»“ng + (LÆ°Æ¡ng Target + LÆ°Æ¡ng CB + Gá»­i xe + XÄƒng xe + ÄT) Ã— [CÃ´ng LV / CÃ´ng chuáº©n] + Balance BH + ThÆ°á»Ÿng nÃ³ng + ThÆ°á»Ÿng thÃ¡ng + PC VP USA + PC QL + CÃ´ng tÃ¡c + Tiá»n Äƒn + PC cÃ´ng viá»‡c + Tiáº¿p khÃ¡ch âˆ’ BHXH NV âˆ’ BHYT NV âˆ’ BHTN NV + PC thÃ¢m niÃªn + PC hiá»‡u suáº¥t & thÃ¡i Ä‘á»™ + PC giá» giáº¥c & ká»· luáº­t + PC vÆ°á»£t trá»™i, 0)
- **TN chá»‹u thuáº¿** = LÆ°Æ¡ng CB + Hoa há»“ng + PC QL
- **Miá»…n giáº£m NPT** = Sá»‘ NPT Ã— 6.200.000
- **TN tÃ­nh thuáº¿** = MAX(TN chá»‹u thuáº¿ âˆ’ 15.500.000 âˆ’ Miá»…n giáº£m NPT âˆ’ BHXH NV âˆ’ BHYT NV âˆ’ BHTN NV, 0)
- **Thá»±c lÃ£nh** = ROUND(Tá»•ng LÆ°Æ¡ng âˆ’ Thuáº¿ TNCN, 0)
- **Tiá»n máº·t** = Thá»±c lÃ£nh âˆ’ Chuyá»ƒn khoáº£n

### 7.5 UI Features
- **Formula Tooltips**: Hovering table column headers shows the calculation formula via `@/components/ui/tooltip` (base-ui Tooltip primitive).
- **Column Order**: Info â†’ Compensation â†’ Allowances â†’ Workdays â†’ Performance â†’ Attendance â†’ Editable inputs â†’ Insurance â†’ Salary calc â†’ Tax calc â†’ Final â†’ Notes.
- **Permissions**: `PAYROLL_MANAGE` required via `useAuthStore`.

## 8. Request Form Module (Rebuilt)
The Request Form module supports 5 active form types. **RESIGNATION is legacy** â€” FE does not render creation UI for it.

### 8.1 Form Types & Endpoints
| Type | Create | Update |
|---|---|---|
| Leave | `POST /request-forms/me/leaves` | `PUT /request-forms/me/leaves/{id}` |
| Absence | `POST /request-forms/me/absences` | `PUT /request-forms/me/absences/{id}` |
| Attendance Adj | `POST /request-forms/me/attendance-adjustments` | `PUT /request-forms/me/attendance-adjustments/{id}` |
| Business Trip | `POST /request-forms/me/business-trips` | `PUT /request-forms/me/business-trips/{id}` |
| WFH | `POST /request-forms/me/wfh` | `PUT /request-forms/me/wfh/{id}` |

Generic: `GET /me`, `GET /me/{id}`, `PATCH /me/{id}/cancel`
Approval: `GET /approval`, `GET /approval/{id}`, `PATCH /approve`, `PATCH /reject`

### 8.2 Key DTOs
- **Response**: Flat `RequestFormResponse` â€” type-discriminated fields, `countedWork` resolved by backend.
- **Labels**: `src/types/requestform/RequestFormLabels.ts` â€” all Vietnamese label maps, counted-work lookups, type guards (`isLeave()`, `isAbsence()`, etc.).

### 8.3 Reason Types & Counted Work
- **Leave**: 9 reasons. Only ANNUAL_LEAVE, BEREAVEMENT_LEAVE, WEDDING_LEAVE = tÃ­nh cÃ´ng. Only ANNUAL_LEAVE deducts leave quota.
- **Absence**: 8 reasons. PERSONAL_BUSINESS & OTHER = khÃ´ng tÃ­nh cÃ´ng. Rest = tÃ­nh cÃ´ng. LATE_EARLY_UNDER_NINETY max 90 min.
- **Attendance Adjustment**: 3 reasons (FORGOT_FINGERPRINT, MACHINE_BROKEN, ACCOUNT_NOT_GRANTED). No countedWork field.
- **Business Trip**: 4 reasons. Always countedWork = true.
- **WFH**: No reason type. Unchanged from old spec.

### 8.4 Validation Rules
- Leave: reject same-day AFTERNOONâ†’MORNING
- Absence: toTime > fromTime; LATE_EARLY_UNDER_NINETY â†’ duration â‰¤ 90 min
- Business Trip: endDate â‰¥ startDate; tripMode required
- All: description optional max 1000 (except WFH where description is required)

### 8.5 Service Methods
`requestFormMeService`: `createLeave`, `updateLeave`, `createAbsence`, `updateAbsence`, `createAttendanceAdjustment`, `updateAttendanceAdjustment`, `createBusinessTrip`, `updateBusinessTrip`, `createWfh`, `updateWfh`, `cancelCurrentUserRequestForm`.

## 9. Attendance & Settings (WFH & Discipline Logic)
The Attendance module (`/app/attendance`) and Server Settings (`/app/management/server-settings`) are heavily linked:
- **Discipline & Allowances**: Discipline scores, WFH limit days, and punctuality allowances are dynamically fetched from `ServerSettingsResponse`. Do not hardcode rules.
- **Attendance Summaries**: The `AttendanceMonthlySummaryResponse` provides granular violation times (`leaveDeductionViolationTimes`, `majorLateEarlyViolationTimes`).
- **UI Localization**: Use highly descriptive, localized Vietnamese labels (e.g., `Äi trá»… / Vá» sá»›m (Lá»—i náº·ng)`) mapped in `vi/attendance.ts` rather than raw technical keys.
- **Card-Based UI**: Use `Card`, `CardHeader`, and `CardContent` constructs to display summarized metrics (WFH status, discipline scoreboard) cleanly rather than dense text arrays.

## 10. Performance Management Refactor
- **Flat Payload Structures**: Nested `profile` objects have been eliminated from the architecture. API requests and responses now use flat structures directly mapping fields.
- **Dynamic Grading Scale**: Do not hardcode performance grades (e.g., A, B, C). Always fetch and map from the dynamic `/performance-review-levels` endpoint.
- **Component Design**: Implement client-side pagination and distinct Score Selector Cards to improve the UX during review submissions.

## 11. Terminology Rules
- **Job Title vs Role**: "Chá»©c vá»¥" is `Job Title`. The term "Role" is deprecated for job classification.
- **Group Management**: "NhÃ³m quyá»n" is `Group` or `Group Management`, replacing previous mentions of "Roles" in the security/permission context.
- **Level vs Type**: In Position structures, `manager` is a boolean flag indicating `Loáº¡i vá»‹ trÃ­` (Position Type: Quáº£n lÃ½ / NhÃ¢n viÃªn), NOT a hierarchical `Cáº¥p báº­c` (Level).
