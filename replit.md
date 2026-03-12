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