# SAI ROLOTECH — Master Project Reference

This is the **master command file**. It tracks every change, every screen, every design rule, and every data file. This file is auto-loaded every session — nothing will be forgotten.

---

# Overview

A pnpm workspace monorepo for **Sai Rolotech** — a B2B industrial roll forming machine manufacturer from **Rajkot, Gujarat**. The platform includes a mobile app, API server, and admin panel for managing machines, leads, service, community, and AI-powered sales tools.

# User Preferences

- Iterative development, functional components over mocked placeholders
- Clear, concise code with strong TypeScript types
- Ask before major architecture changes or new dependencies
- Communicate directly, technically, in Hindi or English as needed
- Explain reasoning and impact of changes

---

# DESIGN SYSTEM (Critical — Follow Everywhere)

## Colors
| Token | Value | Usage |
|-------|-------|-------|
| Primary Blue | `#1A56DB` | Buttons, links, active states |
| Navy Background | `#0F172A` | Dark headers, gradients |
| Electric Blue | `#0EA5E9` | Accents, highlights |
| Success Green | `#10B981` | Success states, service |
| Warning Amber | `#F59E0B` | Quotation, warnings |
| Error Red | `#EF4444` | Errors, urgent badges |
| Purple | `#8B5CF6` | AMC, premium features |

## Tab Gradients (Bottom Navigation)
| Tab | Gradient |
|-----|----------|
| Home | `["#1E40AF", "#3B82F6"]` |
| Catalog | `["#059669", "#10B981"]` |
| Services | `["#D97706", "#F59E0B"]` |
| Tools | `["#7C3AED", "#8B5CF6"]` |
| Profile | `["#DC2626", "#EF4444"]` |

## Feature Color Gradients
| Feature | Gradient |
|---------|----------|
| Blue (Catalog/Default) | `["#1E40AF", "#3B82F6"]` |
| Green (Service/Success) | `["#059669", "#10B981"]` |
| Amber (Quotation/Warning) | `["#D97706", "#F59E0B"]` |
| Purple (AMC/Premium) | `["#7C3AED", "#8B5CF6"]` |
| Red (Support/Urgent) | `["#DC2626", "#EF4444"]` |
| Cyan (Parts/Tools) | `["#0284C7", "#0EA5E9"]` |
| Pink (Community) | `["#DB2777", "#EC4899"]` |

## Typography
- **Font:** Inter (400 Regular, 500 Medium, 600 SemiBold, 700 Bold)
- Loaded via `@expo-google-fonts/inter`

## Shadows & 3D Effects
- `constants/shadows.ts` — `shadow3D()`, `shadowGlow()`, `shadowInset()` utilities
- Presets: `CARD_SHADOW`, `CARD_SHADOW_LG`, `CARD_SHADOW_XL`, `BUTTON_SHADOW`, `ICON_SHADOW`
- USE THESE on every card, button, and icon container

## Component Patterns
- `AnimatedPressable` with `scaleDown` prop for micro-interactions (use everywhere for tappable items)
- `expo-linear-gradient` for gradient icons, buttons, headers, badges
- Dark navy gradient headers (`#0F172A → #1E293B`) on major screens
- `HomeSkeleton` shimmer loading prevents content flash
- Pull-to-refresh on scrollable screens
- All list items wrapped in `React.memo`
- `useMemo`, `useCallback`, `useDebounce` for performance
- Static data arrays marked `as const`

## Icon Rules
- Use `Feather` icons from `@expo/vector-icons`
- **CRITICAL:** Feather has NO "wrench" icon — use `"tool"` instead
- Common icons: tool, shield, file-text, message-circle, cpu, box, trending-up, alert-circle, users, package, bar-chart-2, phone, chevron-right

---

# COMPLETE SCREEN INVENTORY

## Root Layout (`app/_layout.tsx`)
All routes registered here with presentation type:

### Tab Screens (`app/(tabs)/`)
| File | Screen | Description |
|------|--------|-------------|
| `_layout.tsx` | Tab Bar | 5 tabs: Home, Catalog, Services, Tools, Profile. iOS 26+ NativeTabs with liquid glass, fallback to classic Tabs+BlurView |
| `index.tsx` | Home | Dark gradient header, stats row (50+ Machines, 500+ Clients, 15+ Years), premium supplier banner ads carousel, **9 Quick Actions** grid, WhatsApp CTA |
| `catalog.tsx` | Catalog | Machine catalog with search, category filter chips, 8 machines displayed with FlashList |
| `services.tsx` | Services | **6 service cards** (Service Request, AMC, Quotation, Support Ticket, AI Problem Finder, Spare Parts) + AMC plan cards + emergency contact |
| `tools.tsx` | Tools | 4 business calculators: ROI, EMI, GST, RF |
| `profile.tsx` | Profile | Company profile, contact info, quick links |

### Quick Actions on Home (9 buttons, in order):
1. AI Sales Buddy → `/ai-sales-buddy`
2. Machine Catalog → `/catalog`
3. Lead Dashboard → `/leads`
4. Get Quote → `/quotation`
5. Spare Parts → `/spare-parts`
6. Problem Finder → `/ai-troubleshooter`
7. Community Feed → `/community`
8. Service Request → `/service-request`
9. Business Tools → `/tools`

### Modal Screens (presentation: "modal")
| File | Route | Description |
|------|-------|-------------|
| `service-request.tsx` | `/service-request` | Service request form with priority selection |
| `quotation.tsx` | `/quotation` | Get quotation form |
| `amc.tsx` | `/amc` | AMC plan enrollment (3 tiers: Basic ₹15K, Standard ₹28K, Premium ₹45K) |
| `support-ticket.tsx` | `/support-ticket` | Support ticket with categories |
| `create-post.tsx` | `/create-post` | New community post (5 types: Question/Photo/Problem/Promotion/Discussion) |
| `add-lead.tsx` | `/add-lead` | Add lead form with source picker, machine interest, budget, urgency, AI qualification |

### Card Screens (presentation: "card")
| File | Route | Description |
|------|-------|-------------|
| `catalog/[id].tsx` | `/catalog/:id` | Machine detail with 6 tabs: Overview, Specs, 2D View, 3D View, Videos, Quote |
| `jobs.tsx` | `/jobs` | Job Board for seekers with search, filters, Urgent badges |
| `hiring.tsx` | `/hiring` | Employer hiring dashboard with applicant cards and actions |
| `supplier-dashboard.tsx` | `/supplier-dashboard` | Supplier dashboard: orders, revenue, clients |
| `vendor-dashboard.tsx` | `/vendor-dashboard` | Vendor dashboard: inventory, demand badges |
| `community.tsx` | `/community` | Community feed with ads, post types (All/Questions/Photos/Problems/Promotions/Discussions), comments, reports |
| `leads.tsx` | `/leads` | Lead Dashboard: Hot/Warm/Cold stats, filter chips, lead cards with call/WhatsApp |
| `ai-sales-buddy.tsx` | `/ai-sales-buddy` | AI chatbot: machine type → thickness → capacity → budget → location → recommendation |
| `ai-troubleshooter.tsx` | `/ai-troubleshooter` | AI Problem Finder: 8 common problems with causes, solutions, urgency |
| `spare-parts.tsx` | `/spare-parts` | Spare Parts: 12 parts, category filter, In Stock/Made to Order badges, Enquire/Order |

### Auth Screens (`app/auth/`)
| File | Route | Description |
|------|-------|-------------|
| `_layout.tsx` | Auth layout | Auth stack |
| `login.tsx` | `/auth/login` | 3 login methods: Email+Password, PIN, Biometric. Role selector. SR branding |
| `register.tsx` | `/auth/register` | Registration with role chips, personal info, company, password |
| `forgot-password.tsx` | `/auth/forgot-password` | 4-step OTP recovery: Phone → OTP → New Password → Success |

---

# DATA FILES

| File | Contents |
|------|----------|
| `data/machines.ts` | 8 machines with full specs. Models: RS-5000, TG-3000, CP-8000, TR-6000, DF-4000, SC-2000, ST-3500, ZP-7000. Categories: Rolling Shutter, False Ceiling, Door & Window, Roofing & Cladding, Purlin Systems, Solar Structure, Light Gauge. Exports: `MACHINES`, `MACHINE_DETAILS`, `CATEGORIES`, `CATEGORY_COLORS`, `MACHINE_TYPES` |
| `data/leads.ts` | Lead types, 8 lead sources (IndiaMART, JustDial, TradeIndia, DirectCall, App, WhatsApp, Website, Referral), statuses (New, Contacted, Interested, Quote Sent, Follow Up, Negotiation, Won, Lost), `qualifyLead()` function (budget + urgency + source → Hot/Warm/Cold score), 8 sample leads |
| `data/community.ts` | 6 community posts, 3 banner ads with gradients, sample comments, spam rules (max 3 posts/day, 24h freeze), post type filters |
| `data/jobs.ts` | 6 industrial jobs + 5 job applicants with skills, salary, location, distance, experience |
| `data/troubleshooting.ts` | 8 common machine problems (Sheet bending, Unusual noise, Oil leaking, Not starting, Wrong dimensions, Cutting issue, Surface scratch, Slow speed) with causes[], solutions[], urgency levels, maintenance schedules |
| `data/spare-parts.ts` | 12 spare parts across 6 categories (Rollers, Bearings, Cutting Blades, Hydraulic, Electrical, Shafts), with price ranges, availability (In Stock/Made to Order/Low Stock), compatible machine models |

---

# COMPONENTS

| File | Purpose |
|------|---------|
| `components/AnimatedPressable.tsx` | Touchable with scale-down animation (micro-interactions) |
| `components/ErrorBoundary.tsx` | React error boundary wrapper |
| `components/ErrorFallback.tsx` | Error fallback UI |
| `components/KeyboardAwareScrollViewCompat.tsx` | Cross-platform keyboard-aware scroll |
| `components/MachineViewer2D.tsx` | 2D blueprint SVG viewer with pinch-to-zoom, part annotations |
| `components/MachineViewer3D.tsx` | Three.js 3D model viewer with rotate/zoom, part highlighting |
| `components/Skeleton.tsx` | Shimmer loading skeleton component |

# HOOKS

| File | Purpose |
|------|---------|
| `hooks/useTheme.ts` | Centralized memoized theme hook (colors, insets, platform detection) |
| `hooks/useDebounce.ts` | Debounce hook for search inputs |
| `hooks/useDeviceCapability.ts` | Device capability detection (isLowEnd, hasWebGL) |
| `hooks/useMachineVisualization.ts` | Fetches machine visualization data + admin settings from API |

# CONTEXTS

| File | Purpose |
|------|---------|
| `contexts/AuthContext.tsx` | Auth state, 5 roles, demo login, login/logout/register methods |

# CONSTANTS

| File | Purpose |
|------|---------|
| `constants/shadows.ts` | 3D shadow utilities and presets |
| `constants/colors.ts` | Color constants |

---

# AI SALES ENGINES (Machine Category → Model Mapping)

The AI Sales Buddy maps user-selected categories to actual machine models:

| Category | Model Code(s) |
|----------|---------------|
| Roofing Sheet | RS-5000 |
| False Ceiling / T-Grid | TG-3000 |
| C-Purlin / Z-Purlin | CP-8000, ZP-7000 |
| Trapezoidal Sheet | TR-6000 |
| Door Frame | DF-4000 |
| Solar Channel | SC-2000 |
| Stud & Track | ST-3500 |
| Rolling Shutter | RS-5000 |

If no model matches, shows graceful fallback message + captures lead for manual follow-up.

Lead Qualification Logic (`qualifyLead()` in `data/leads.ts`):
- **Hot 🔥**: Budget ≥ ₹5L + Urgency Immediate/ThisWeek + Source = IndiaMART/JustDial
- **Warm ☀️**: Budget ≥ ₹3L OR Urgency ThisMonth
- **Cold ❄️**: Everything else

---

# SYSTEM ARCHITECTURE

## Monorepo Structure
```
artifacts/
  api-server/     — Express 5 API (machines CRUD, visualization, admin settings, object storage)
  mobile/         — Expo React Native app (this document covers this extensively)
  admin/          — React+Vite admin panel (machine management, 2D/3D upload, settings)
  mockup-sandbox/ — Component preview server for canvas
lib/
  api-spec/       — OpenAPI 3.1 spec + Orval codegen config
  api-client-react/ — Generated React Query hooks + fetch client
  api-zod/        — Generated Zod schemas
  db/             — Drizzle ORM + PostgreSQL schemas
scripts/          — Utility scripts
```

## Core Technologies
- **pnpm workspaces** monorepo, **Node.js v24**, **TypeScript v5.9**
- **Express 5** API, **PostgreSQL + Drizzle ORM**, **Zod v4** validation
- **Expo SDK 54** + Expo Router v6 + NativeTabs (iOS 26+)
- **Orval** codegen from OpenAPI spec

## Database Tables (lib/db/src/schema/)
- `machines` — id, name, model, description, JSONB fields (tags, specs, features, applications, accessories, images, videos)
- `machineVisualizations` — 2D/3D file references per machine
- `adminSettings` — Per-machine feature toggles (enable2dView, enable3dView, etc.)

## API Routes (artifacts/api-server/src/routes/)
- `machines.ts` — CRUD for machines
- `visualization-assets.ts` — Asset upload/delete (multer, /uploads directory)
- `visualization-settings.ts` — Global visualization settings

## Admin Panel (`artifacts/admin`)
- Dashboard, Machines Management, Machine Detail (drag-drop 2D/3D upload), Settings
- Tech: React, Vite, TailwindCSS, wouter, React Query, react-dropzone, lucide-react

## Machine Visualization
- 2D: SVG/PNG from API with zoom/pan + fallback blueprint with part annotations
- 3D: GLB/GLTF via Three.js + GLTFLoader with part highlighting, fallback procedural scene
- Admin settings control which tabs are visible per machine
- Low-end device auto-hides 3D tab

---

# EXTERNAL DEPENDENCIES

- PostgreSQL, Google Cloud Storage (Replit Object Storage)
- Orval (codegen), Zod (validation), Drizzle ORM
- Expo, React Native, React Query
- `@shopify/flash-list`, `expo-linear-gradient`, `expo-haptics`
- TailwindCSS (admin), wouter (admin routing)
- multer (file uploads), lucide-react (admin icons)
- GitHub integration configured

---

# KEY NOTES & GOTCHAS

1. **All mobile data is currently local/static** — no API calls except machine visualization + admin settings
2. **Feather icons have NO "wrench"** — always use `"tool"`
3. **`shadow*` style props are deprecated** in React Native Web — use `boxShadow` (warning only, still works)
4. Machine visualization data comes from API, everything else is in `data/` files
5. Community anti-spam: max 3 posts/day, 24h cooldown on spam detection
6. Auth is demo/local — no real backend auth yet
7. iOS 26+ gets liquid glass NativeTabs, older iOS/Android gets classic tab bar with BlurView
8. `isLiquidGlassAvailable()` for tab detection
9. AMC Plans: Basic ₹15K/yr, Standard ₹28K/yr (popular), Premium ₹45K/yr
10. Expo dev URL: check workflow logs for current URL

---

# PENDING / FUTURE WORK

- T004: Quotation Preview + Auto Follow-up system
- T005: Admin Analytics Enhancement
- T006: Full integration testing & cleanup (partially done — routes registered, home updated)
- Station Calculator (was listed in T003 but not yet built)
- Backend auth system (currently demo/local)
- Real API integration for leads, community, jobs, spare parts
