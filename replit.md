# Overview

This project is a pnpm workspace monorepo using TypeScript, designed to manage an industrial roll forming machine manufacturing ecosystem. It encompasses an API server, a mobile application for machine users, suppliers, and job seekers, and an admin panel for managing machine visualizations. The core vision is to provide a comprehensive digital platform for **Sai Rolotech**, enhancing B2B interactions, streamlining operations, and offering advanced visualization tools for industrial machinery.

The monorepo structure facilitates shared libraries and consistent tooling across different applications. Key capabilities include:
- A robust API for machine data, visualizations, and admin settings.
- A feature-rich mobile application with role-based dashboards, community features, and a detailed machine catalog.
- An administrative interface for managing machine details and their associated 2D/3D visualization assets.

The project aims to improve efficiency, customer engagement, and market reach for industrial machine manufacturers by leveraging modern web and mobile technologies.

# User Preferences

I prefer iterative development, with a focus on delivering functional components that can be reviewed and refined.
When making changes, please explain the reasoning and potential impact.
I like to see clear, concise code with good type definitions.
Ask before making major architectural changes or introducing new external dependencies.
I prefer detailed explanations for complex solutions.
I prefer to communicate in a direct and technical manner.

# System Architecture

The project is structured as a pnpm workspace monorepo, ensuring consistent dependency management and shared codebases.

**Core Technologies:**
- **Monorepo Tool:** pnpm workspaces
- **Node.js:** v24
- **TypeScript:** v5.9
- **API Framework:** Express 5
- **Database:** PostgreSQL with Drizzle ORM
- **Validation:** Zod (`zod/v4`) with `drizzle-zod`
- **API Codegen:** Orval (from OpenAPI spec)
- **Bundling:** esbuild (CJS bundle)

**Monorepo Structure:**
- `artifacts/`: Deployable applications (e.g., `api-server`, `mobile`, `admin`)
- `lib/`: Shared libraries (e.g., `api-spec`, `api-client-react`, `api-zod`, `db`)
- `scripts/`: Utility scripts for development and operations.

**TypeScript & Composite Projects:**
All packages extend a base `tsconfig.json` with `composite: true`, enabling project references for cross-package type-checking and build ordering. `tsc --build --emitDeclarationOnly` is used for type checking and declaration file generation, with actual JS bundling handled by esbuild/tsx/vite.

**API Server (`artifacts/api-server`):**
- Built with Express 5, handling routes for health checks, CRUD operations on machines, visualizations, admin settings, viewer data, and object storage.
- Utilizes `@workspace/db` for persistence and `@workspace/api-zod` for request/response validation.
- GCS client wrapper (`objectStorage.ts`) is used for Replit Object Storage, with an ACL framework (`objectAcl.ts`) for access control.
- Routes are organized under `src/routes/`.

**Database (`lib/db`):**
- Drizzle ORM with PostgreSQL.
- Defines schemas for `machines`, `machineVisualizations`, and `adminSettings`.
- `drizzle.config.ts` handles Drizzle Kit configuration.

**API Specification & Codegen (`lib/api-spec`, `lib/api-zod`, `lib/api-client-react`):**
- `lib/api-spec` contains the OpenAPI 3.1 specification (`openapi.yaml`) and Orval configuration.
- Codegen generates:
    - React Query hooks and a fetch client into `lib/api-client-react/src/generated/`.
    - Zod schemas for validation into `lib/api-zod/src/generated/`.

**Mobile Application (`artifacts/mobile`):**
- **Platform:** Expo React Native (SDK 54) with Expo Router v6 and NativeTabs (iOS 26+).
- **Branding:** **Sai Rolotech**, targeting B2B industrial roll forming machine manufacturers.
- **UI/UX:**
    - **Color Theme:** Industrial Blue (`#1A56DB`), Navy background (`#0F172A`), Electric Blue accent (`#0EA5E9`).
    - **Typography:** Inter font.
    - **3D Design System:** Custom shadow utilities (`shadow3D`, `shadowGlow`, `shadowInset`) and presets, extensive use of `expo-linear-gradient` for UI elements, `AnimatedPressable` for micro-interactions, `HomeSkeleton` for shimmer loading.
    - **Performance:** Centralized memoized theme hook, `React.memo` for list items, `useMemo`, `useCallback`, `useDebounce` for optimization. Static data arrays are `as const`.
- **Key Features:**
    - **Authentication:** 3 login methods (Email+Password, PIN, Biometric/Face ID), role selection (machine_user, supplier, vendor, job_seeker, employer).
    - **Role-Based Dashboards:** Tailored dashboards for suppliers, vendors, job seekers, and employers.
    - **Community System:** Feed with post types, anti-spam rules, ads, and interactive elements.
    - **Machine Catalog:** Searchable catalog with detailed machine information, photo galleries, video cards, specifications, and accessories.
    - **Business Tools:** ROI, EMI, GST, RF calculators.
    - **Forms:** Service requests, quotation requests, AMC plan enrollment, support tickets.
    - **AI Sales Engines:**
        - **Lead Management:** Dashboard with Hot/Warm/Cold qualification, source tracking (IndiaMART, JustDial, TradeIndia, DirectCall, App, WhatsApp, Website, Referral), follow-up reminders, call/WhatsApp quick actions. Routes: `/leads`, `/add-lead`. Data: `data/leads.ts`.
        - **AI Sales Buddy:** Step-by-step chatbot (machine type → thickness → capacity → budget → location → AI recommendation with specs + price estimate + lead auto-capture). Route: `/ai-sales-buddy`.
        - **AI Problem Finder (Troubleshooter):** Keyword search across 8 common machine problems with causes, solutions, urgency levels, and maintenance schedules. Route: `/ai-troubleshooter`. Data: `data/troubleshooting.ts`.
        - **Spare Parts Catalog:** 12 parts searchable by name/model, category filter (Rollers, Bearings, Cutting Blades, Hydraulic, Electrical, Shafts), availability badges (In Stock/Made to Order/Low Stock), Enquire/Order actions. Route: `/spare-parts`. Data: `data/spare-parts.ts`.
- **Data:** All application data is currently local/static.

**Admin Panel (`artifacts/admin`):**
- **Platform:** React, Vite, TailwindCSS, wouter.
- **UI/UX:** Industrial premium design with a clean white background, blueprint-inspired accents, and technical iconography.
- **Key Features:**
    - **Dashboard:** Overview of machines and assets.
    - **Machines Management:** Registry table, machine creation, and asset management.
    - **Machine Detail:** Machine info, drag-and-drop file upload for 2D (SVG, PNG, max 10MB) and 3D (GLB, GLTF, OBJ, max 50MB) assets, inline 2D preview, asset deletion.
    - **Settings:** Global toggles for visualization features (2D/3D View, Animation, Part Highlight, Technical Drawing Download).
- **File Upload:** Uses multer for file uploads, storing them in `/uploads` and serving them statically at `/api/uploads`.

# External Dependencies

- **Database:** PostgreSQL
- **Object Storage:** Google Cloud Storage (via Replit Object Storage)
- **API Codegen:** Orval
- **Validation Library:** Zod
- **Database ORM:** Drizzle ORM
- **Mobile Development Framework:** Expo, React Native
- **Frontend Libraries:** React, React Query, wouter (for admin), `@shopify/flash-list` (for mobile virtualization), `react-dropzone` (for admin file uploads), `lucide-react` (icons for admin)
- **Styling:** TailwindCSS (for admin)
- **Utility Libraries:** `multer` (for file uploads in api-server)
- **GitHub:** (for mobile app source code reference)

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/machines.ts` — `machinesTable` with full specs (name, model, category, capacity, power, speed, price, etc.) + JSONB fields (tags, specs, features, applications, accessories, images, videos)
- `src/schema/machineVisualizations.ts` — `machineVisualizationsTable` for 2D/3D file references per machine (fileType, fileUrl, objectPath, fileName, mimeType, label)
- `src/schema/adminSettings.ts` — `adminSettingsTable` for per-machine feature toggles (enable2dView, enable3dView, enableAnimation, enablePartHighlight, enableDrawingDownload)
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

**Auth System** (3 login methods):
- `contexts/AuthContext.tsx` — Auth state, 5 roles (machine_user, supplier, vendor, job_seeker, employer), demo login
- `auth/login.tsx` — Premium login with SR branding, role selector, Email+Password, PIN entry, Biometric/Face ID buttons, trust badges (Secure/Trusted/Verified)
- `auth/register.tsx` — Registration with role selection chips, personal info, company name, password fields
- `auth/forgot-password.tsx` — 4-step OTP recovery: Phone → OTP (6-digit) → New Password → Success, with progress dots

**Role-Based Dashboards**:
- `supplier-dashboard.tsx` — Green gradient header, Active Orders/Revenue/Clients stats, order cards with Pending/Shipped/Delivered status
- `vendor-dashboard.tsx` — Amber gradient header, Products/Low Stock/Orders stats, inventory cards with demand badges (High/Medium/Low)
- `jobs.tsx` — Job Board for seekers: dark header, search, filter (Distance/Salary/Experience), job cards with Urgent badges, location distance, skills tags, Apply Now
- `hiring.tsx` — Red gradient Hiring Dashboard: applicant stats, status filters (New/Shortlisted/Interview/Rejected), applicant cards with avatar, skills, Shortlist/Reject/Call actions

**Community System** (Ads, Feed, Anti-Spam):
- `community.tsx` — Community feed with rotating supplier banner ads carousel, post cards (author avatar/verified/premium badges, trust stars), post type filter chips (All/Questions/Photos/Problems/Promotions/Discussions), like/comment/share actions, comment modal (slide-up sheet with send), report modal (5 report reasons), Google Ad slots between posts, sponsored post cards with amber border + WhatsApp chat button
- `create-post.tsx` — New post creation with post type selector (Ask Question/Share Photo/Report Problem/Promotion/Discussion), content textarea with 1000 char limit, photo upload placeholder (max 4), machine tag chips (RS-5000, TG-3000, etc.), anti-spam community guidelines notice (max 3 posts/day, 24h freeze)
- `data/community.ts` — 6 community posts (with machine/supplier tags, images), 3 banner ads with gradients, sample comments, spam rules config, post type filter types

**Data**:
- `data/jobs.ts` — 6 industrial jobs + 5 job applicants with skills, salary, location, distance, experience data

**Screens**:
- `(tabs)/index.tsx` — Home dashboard with premium supplier banner ads carousel, quick actions (including Community Feed), stats, feature list, WhatsApp CTA
- `(tabs)/catalog.tsx` — Machine catalog with search, category filter, 8 machines
- `(tabs)/services.tsx` — Service overview + AMC plan cards + emergency contact
- `(tabs)/tools.tsx` — 4 business calculators (ROI, EMI, GST, RF)
- `(tabs)/profile.tsx` — Company profile, contact info, quick links
- `catalog/[id].tsx` — Machine detail with tabbed layout (Overview, Specs, 2D View, 3D View, Videos, Quote). Tabs are admin-controlled via API settings. 2D View renders blueprint-style SVG technical drawings with labeled part annotations (Entry Gate, Main Base, Roll Shaft, Gear Drive, Cutting System) and pinch-to-zoom/pan gestures. 3D View renders interactive Three.js scene with rotate/zoom controls and part highlighting on click. Device capability detection auto-hides 3D tab on non-WebGL devices. Overview tab includes photo gallery, description, applications, features, accessories, warranty, and service CTA
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
- Machine visualization data and admin feature settings are fetched from API (`/api/machines/:id/visualization`, `/api/machines/admin-settings`). Other data is local/static
- All forms show local success states after submission
- GitHub repo: https://github.com/sairolotech-source/CRM

### `artifacts/admin` (`@workspace/admin`)

React + Vite admin panel for machine visualization management at `/admin/`.

**Pages**:
- Dashboard (`/admin/`) — Overview with total machines, 2D/3D asset counts, recently added machines
- Machines (`/admin/machines`) — Registry table with search, create machine form, manage assets links
- Machine Detail (`/admin/machines/:id`) — Machine info, drag-and-drop file upload for 2D (SVG, PNG) and 3D (GLB, GLTF, OBJ) assets, inline 2D preview, asset deletion
- Settings (`/admin/settings`) — Global toggle switches for 5 visualization features (2D View, 3D View, Animation, Part Highlight, Technical Drawing Download)

**Tech**: React, Vite, TailwindCSS, wouter, React Query, react-dropzone, lucide-react icons
**Design**: Industrial premium — clean white background, blueprint-inspired accents, technical iconography

**Database Tables** (lib/db/src/schema/):
- `machines` — id, name, model, description, created_at, updated_at
- `visualization_assets` — id, machine_id (FK), asset_type (2d/3d), file_name, file_size, mime_type, display_name, file_path, created_at
- `visualization_settings` — id, enable_2d_view, enable_3d_view, enable_animation, enable_part_highlight, enable_technical_drawing_download, updated_at

**API Routes** (artifacts/api-server/src/routes/):
- `machines.ts` — CRUD for machines (GET/POST /machines, GET/PATCH/DELETE /machines/:id)
- `visualization-assets.ts` — Asset management (GET /machines/:id/assets, POST /machines/:id/assets/upload, DELETE /machines/:id/assets/:assetId). Uses multer for file uploads to /uploads directory
- `visualization-settings.ts` — Global settings (GET/PUT /visualization-settings). Auto-creates default settings row on first access

**File Upload**: multer stores files in /uploads, served statically at /api/uploads. 2D max 10MB (SVG, PNG), 3D max 50MB (GLB, GLTF, OBJ)

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
