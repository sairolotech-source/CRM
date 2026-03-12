# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `artifacts/mobile` (`@workspace/mobile`)

Expo React Native mobile app for **Sai Rolotech** — a B2B industrial roll forming machine manufacturer.

**Tech Stack**: Expo SDK 54, Expo Router v6, NativeTabs (iOS 26+ liquid glass), React Native

**Color Theme**: Industrial Blue (`#1A56DB`) + Navy background (`#0F172A`) + Electric Blue accent (`#0EA5E9`), Inter font

**Screens**:
- `(tabs)/index.tsx` — Home dashboard with quick actions, stats, feature list, WhatsApp CTA
- `(tabs)/catalog.tsx` — Machine catalog with search, category filter, 8 machines
- `(tabs)/services.tsx` — Service overview + AMC plan cards + emergency contact
- `(tabs)/tools.tsx` — 4 business calculators (ROI, EMI, GST, RF)
- `(tabs)/profile.tsx` — Company profile, contact info, quick links
- `catalog/[id].tsx` — Machine detail with photo gallery (horizontal swipe + dots), video cards (YouTube links with play/duration/type badges), detailed description, applications tags, specs table, features, included accessories list, warranty card, service CTA
- `service-request.tsx` — Service request form (modal) with priority selection
- `quotation.tsx` — Get quotation form (modal)
- `amc.tsx` — AMC plan enrollment (modal) with 3-tier plan selection
- `support-ticket.tsx` — Support ticket form (modal) with categories

**3D Design System** (Figma-quality):
- `constants/shadows.ts` — `shadow3D()`, `shadowGlow()`, `shadowInset()` utilities + `CARD_SHADOW`, `CARD_SHADOW_LG`, `CARD_SHADOW_XL`, `BUTTON_SHADOW`, `ICON_SHADOW` presets
- `expo-linear-gradient` — Gradient icons, buttons, headers, badges, CTA banners across all screens
- Dark navy gradient headers (`#0F172A → #1E293B`) on Home and Profile screens
- Color-coded gradient pairs per feature: Blue `["#1E40AF","#3B82F6"]`, Green `["#059669","#10B981"]`, Amber `["#D97706","#F59E0B"]`, Purple `["#7C3AED","#8B5CF6"]`, Red `["#DC2626","#EF4444"]`
- `AnimatedPressable` with `scaleDown` prop for Instagram-style micro-interactions
- `@shopify/flash-list` in catalog for virtualized performance
- `HomeSkeleton` shimmer loading (80ms) prevents content flash
- Pull-to-refresh on Home, Catalog, Services, Profile screens

**Performance Engine**:
- `hooks/useTheme.ts` — Centralized memoized theme hook (colors, insets, platform detection) — single source of truth, prevents redundant re-renders
- `data/machines.ts` — Centralized machine data with typed exports (`MACHINES`, `MACHINE_DETAILS`, `CATEGORIES`, `CATEGORY_COLORS`, `MACHINE_TYPES`). Each `MachineDetail` includes: `images[]` (url, label, type), `videos[]` (title, duration, youtubeId, type), `detailedDescription`, `applications[]`, `accessories[]`, `warranty`
- All list items wrapped in `React.memo` (MachineCard, ActionCard, FeatureCard, StatCard, ServiceCard, AmcCard, CategoryChip, SpecRow, etc.)
- `useMemo` for filtered/computed data (catalog search, calculator results, plan lookups)
- `useCallback` for all event handlers to prevent unnecessary child re-renders
- `useDebounce` hook for search input optimization
- Static data arrays marked `as const` for type narrowing and immutability
- Stack screen options extracted to module-level constants to prevent re-creation

**Key Notes**:
- Uses `isLiquidGlassAvailable()` for iOS 26+ NativeTabs, falls back to classic Tabs with BlurView
- All data is local/static (no backend integration)
- All forms show local success states after submission
- GitHub repo: https://github.com/sairolotech-source/CRM

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
