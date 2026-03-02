---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
completedAt: '2026-03-01'
lastStep: 8
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/product-brief-who-else-is-here-2026-02-24.md'
  - 'docs/server-configuration-analysis.md'
  - 'docs/brainstorming-session-results.md'
  - 'docs/202510092157_strategic_opportunities_brainstorming.md'
workflowType: 'architecture'
project_name: 'who-else-is-here'
user_name: 'Carlos'
date: '2026-02-28'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
56 FRs (FR1-FR55 + FR50b) across 8 domains. The functional surface is deceptively simple — a single-screen attendee list with tap-to-LinkedIn — but the underlying requirements span real-time communication (FR53-54), multi-tenant data isolation (FR51-52), automated event lifecycle management (FR41-46), comprehensive journey data capture (FR47-50), PWA offline resilience (FR17-20), cold-start UX (FR21-23), and a full admin panel with analytics (FR26-40). The "bridge, not platform" philosophy means UI complexity is minimal, but infrastructure complexity is significant.

**Non-Functional Requirements:**
42 NFRs (NFR1-NFR41 + NFR9b) across 7 domains. Performance targets are aggressive for the deployment context (2s initial load on 4G, 500ms cached, <3s real-time updates). Security centers on LinkedIn OAuth token handling and event-scoped data isolation. Scalability targets (500 concurrent users/event, 10 simultaneous events, 500+ archived events) are designed for 6-12 month growth without rearchitecting. Reliability requirements (99.5% uptime during event windows, <5s WebSocket interruption during deployment, 60s auto-recovery) reflect the solo-operator reality. Accessibility is WCAG 2.1 AA with event-specific rationale. LinkedIn API integration requires dependency isolation for independent deployment of API-facing changes.

**Scale & Complexity:**

- Primary domain: Full-stack web (PWA/SPA + Node.js API + PostgreSQL + WebSocket)
- Complexity level: Medium (simple UI, complex infrastructure)
- Estimated architectural components: 8-10 (Frontend SPA, Service Worker/PWA, API Server, WebSocket Server, Database, Auth/OAuth Layer, Event Lifecycle Scheduler, Journey Data Pipeline, Admin Dashboard, Marketing Site)

### Technical Constraints & Dependencies

| Constraint | Source | Architectural Impact |
|---|---|---|
| Contabo VPS single-server deployment | Server Config | No horizontal scaling in MVP. All components co-located. PM2 for process management. |
| Nginx 1.18 reverse proxy | Server Config | Frontend static files served by Nginx. API and WebSocket proxied to Node.js on port 3001. WebSocket upgrade headers required. |
| Node.js v22.17 runtime | Server Config | Backend language locked. Express + TypeScript recommended per server analysis. |
| PostgreSQL (to install) | Server Config | Primary data store. Session storage. Journey data. Multi-tenant schema. |
| LinkedIn OAuth as sole identity | PRD (FR2, FR5, NFR15-16) | Existential external dependency. Must be isolated (NFR40) for independent deployment. API terms compliance required (NFR16). Rate limit adherence (NFR39). |
| Solo operator (Carlos) | PRD (Resource Risks) | System must self-heal (NFR26). Near-zero-downtime deployments (NFR28). Observability for one person (NFR41). No 24/7 on-call. |
| Same domain, two deployments | PRD (Web App Requirements) | Marketing site at root, SPA at /event/[slug]. Single Nginx config, single SSL cert. Separate build artifacts. |
| ES2020 build target | PRD (Browser Matrix) | Must support Chrome 80+, Safari 14+, Samsung Internet 13+. No bleeding-edge APIs. |
| Budget Android device support | PRD (Device Testing) | Performance must hold on 3-year-old budget Android phones. Aggressive asset optimization. |

### Cross-Cutting Concerns Identified

1. **Real-Time Communication** — WebSocket pub/sub scoped per event. Affects frontend (live list rendering, reconnection UI), backend (broadcast engine, connection management, missed-update delivery), and deployment (graceful WebSocket handoff during deploys). FR53-54, NFR4, NFR21, NFR28.

2. **Event Scoping / Multi-Tenancy** — Every data access, every WebSocket channel, every API endpoint must be scoped to a single event. No cross-event data leakage (NFR13). Schema supports multiple concurrent events (NFR19) from day one. FR51-52.

3. **Journey Data Capture** — Background telemetry pipeline logging every scan, tap, browse, return visit, and session_switch with timestamps. Must not impact UI performance. Must be durably stored (NFR25: acknowledged only after DB persistence). Feeds organizer analytics (FR36-40) and long-term data moat (NFR22). `session_switch` events track cross-session movement when an attendee scans a new session QR. FR47-50.

4. **Offline Resilience** — PWA service worker caches attendee list and app shell. Offline indicator within 3 seconds of connectivity loss (NFR24). Cached list remains browsable. LinkedIn URL copyable as fallback. Graceful reconnection with catch-up on missed updates (FR54). FR17-20.

5. **LinkedIn API Dependency Isolation** — Auth flow, profile data retrieval, and API version management must be architecturally isolated so that LinkedIn API changes can be addressed without full application redeployment (NFR40). Rate limit compliance (NFR39). Unavailability detection within 10 seconds (NFR38).

6. **Event Lifecycle Automation** — Automated state transitions (active → post-event → archived) must fire reliably without admin intervention (NFR27). Triggers based on event end time and 5-day post-event window. Affects QR code scanning enablement, attendee list accessibility, feedback prompt triggering, and data retention policy.

7. **Observability** — Solo operator needs real-time visibility during live events. Response times, connection counts, and error rates available within 5 seconds (NFR41). API error rate monitoring (<1% budget, NFR29). System health indicators in admin dashboard (FR32).

## Starter Template Evaluation

*Evaluated through Party Mode expert panel (Winston, Amelia, Barry, John, Murat, Sally) — [transcript](_bmad-output/party-mode-transcripts/2026-03-01-architecture-starter-template-tech-stack.md)*

### Developer Profile Context

Carlos Gorricho — CFO-turned-AI practitioner with 25+ years C-suite executive leadership. Python expert, JavaScript proficient, PostgreSQL experienced. Has shipped production systems on the same Contabo VPS infrastructure (nginx, SSL, OAuth, process management). Getting acquainted with React + Node.js/Express + WebSocket but is a fast learner with strong architectural instincts. Full profile: `_bmad-output/carlos-gorricho-profile.md`.

### Primary Technology Domain

Full-stack web (PWA/SPA + Node.js API + PostgreSQL + WebSocket) — identified from project requirements analysis and existing infrastructure constraints.

### Starter Approach: Minimal Scaffold

Party Mode consensus: no mega-starter (T3, create-next-app, etc.). Carlos's profile — engineering rigor, fast shipping, high quality standards — calls for a minimal, fully-understood stack where every piece is added intentionally and controlled completely. `npm create vite@latest -- --template react-ts` as the frontend foundation, manual Express backend setup.

### Repository Structure: Monorepo

```
who-else-is-here/
├── packages/
│   ├── client/          # Vite + React + TypeScript (SPA) → /event/[slug]
│   ├── server/          # Express + TypeScript (API + WebSocket) → localhost:3001
│   ├── shared/          # Shared types, constants, Zod validation schemas
│   └── marketing/       # Static HTML + Tailwind CSS → domain root
├── e2e/                 # Playwright cross-package E2E tests
├── package.json         # Root workspace config (npm workspaces)
├── tsconfig.base.json   # Shared TypeScript configuration
└── tailwind.config.js   # Shared Tailwind config (client + marketing)
```

**Rationale:** Monorepo with npm workspaces enables shared TypeScript types across the API boundary (WebSocket messages, API contracts, event lifecycle states). Solo developer benefits from single repository, single CI pipeline, single commit history. npm workspaces is built into Node.js — zero additional tooling.

### Selected Technology Stack

| Layer | Choice | Version | Rationale |
|---|---|---|---|
| **Monorepo** | npm workspaces | Built-in (Node.js 22) | Zero config, sufficient for solo dev scope |
| **Frontend** | Vite + React + TypeScript | React 19, Vite 7 | Minimal scaffold, full control, fast HMR, native TS support |
| **Styling** | Tailwind CSS | v4 | Utility-first, responsive built-in, tiny production bundle, shared config across SPA + marketing |
| **Backend** | Express + TypeScript | Express 5 | "Boring technology" — proven, hotfix-friendly, Carlos knows how to deploy it |
| **Database** | PostgreSQL + Drizzle ORM | Drizzle latest | SQL-like API matches Carlos's deep SQL expertise (Oracle, PostgreSQL). Drizzle over Prisma: less abstraction, queries look like SQL |
| **Real-time** | Socket.io | Latest | First-class React hooks, built-in reconnection, nginx WebSocket upgrade support, room-based event scoping |
| **Real-time adapter** | @socket.io/redis-adapter + Redis | Latest | Required for PM2 cluster mode — enables Socket.io broadcasts across worker processes. Without this, WebSocket events are silently lost between workers. |
| **Auth** | Passport.js + LinkedIn Strategy | Latest | Already specified in server config analysis. LinkedIn OAuth as sole identity layer |
| **Validation** | Zod | Latest | Shared package: define schema once → TypeScript type + runtime validation from one definition |
| **Unit/Integration Testing** | Vitest + @testing-library/react + Supertest | Latest | Shares Vite config, native ESM, faster than Jest for Vite projects |
| **E2E Testing** | Playwright | Latest | Cross-browser (Chrome, Safari, Firefox), native WebSocket testing, offline simulation |
| **Process Management** | PM2 | Latest | Already planned for Contabo VPS deployment |
| **List Virtualization** | @tanstack/react-virtual | Latest | Virtualized attendee list rendering for 500+ items at 30fps (NFR9). Required by UX spec. |
| **PWA** | vite-plugin-pwa | Latest | Service worker generation, offline caching, web app manifest |
| **Marketing Site** | Static HTML + Tailwind CSS | N/A | No framework needed. Ship in a day. Shares Tailwind config for visual consistency |

### Two-Product Deployment Architecture

The project produces two web deployments on the same domain, same server, same SSL certificate:

| Product | Tech | Build Output | Nginx Routing | SEO |
|---|---|---|---|---|
| **Marketing site** | Static HTML + Tailwind CSS | `/var/www/whoelseishere.com/` | Serves directly at `whoelseishere.com/` | Full — static HTML, meta tags, Open Graph, structured data |
| **Web app (SPA)** | Vite + React + TypeScript | Proxied through Nginx | `/event/[slug]` → SPA; `/api/` + `/socket.io/` → Express on :3001 | None — `noindex` meta tag |

Both products share `tailwind.config.js` for visual identity consistency (same color palette, typography, spacing). Both are separate build artifacts deployed independently.

### Architectural Decisions Provided by Stack

**Language & Runtime:**
- TypeScript strict mode on both client and server
- Shared `tsconfig.base.json` extended by each package
- ES2020 build target for browser compatibility (Chrome 80+, Safari 14+, Samsung Internet 13+)

**Shared Types & Validation (Zod):**
- Single source of truth: Zod schemas in `packages/shared` define both TypeScript types and runtime validation
- WebSocket message types, API request/response shapes, event lifecycle states all shared
- Type mismatches caught at compile time across the API boundary

**Testing Architecture:**
- Each package tests independently via Vitest
- `packages/client/tests/` — Vitest + @testing-library/react (component tests)
- `packages/server/tests/` — Vitest + Supertest (API endpoint tests)
- `packages/shared/tests/` — Vitest (schema validation tests)
- `e2e/` — Playwright (full-stack integration: per-session QR scan → OAuth → list → tap, session hop flow, WebSocket reconnection, offline resilience)
- Root-level Vitest workspace config for single-command test execution
- Testing strategy: spike first (build per-session QR-to-list flow), backfill tests before first pilot. Risk priority: WebSocket reconnection > OAuth flow > journey data capture > session hop

**Note:** Project initialization using the monorepo scaffold should be the first implementation story.

## Core Architectural Decisions

*Reviewed through Party Mode expert panel (Winston, Amelia, Barry, John, Murat) — [transcript](_bmad-output/party-mode-transcripts/2026-03-01-architecture-core-decisions-review.md)*

### Development Model

Carlos operates as **mastermind/architect** — AI developer agents implement the code from this architecture document. This means:
- Every decision must be precise enough for an AI agent to implement without clarification
- Stricter type systems (tRPC, Zod, TypeScript strict) serve as guardrails for developer agents
- The architecture document is effectively a **build specification**
- Test expectations should accompany each decision so agents know what to verify

### Verified Technology Versions (March 2026)

| Technology | Version | Status |
|---|---|---|
| React | 19.2.4 | Stable |
| Vite | 7.3.1 | Stable (updated from v6 recommendation) |
| Express | 5.2.1 | Stable (ACTIVE on npm) |
| Tailwind CSS | 4.2.0 | Stable |
| Drizzle ORM | 0.45.1 | Stable (v1.0 beta available) |
| Socket.io | 4.8.3 | Stable |
| @socket.io/redis-adapter | Latest | Stable |
| Redis | Latest | Stable (added for Socket.io cross-worker broadcasts in PM2 cluster mode) |
| Playwright | 1.58.2 | Stable |
| Node.js | 22.17.0 | LTS (on Contabo VPS) |
| PostgreSQL | To install | Latest stable at install time |

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- API pattern: tRPC (type-safe monorepo approach)
- Database migration: Drizzle Kit
- Session storage: PostgreSQL (connect-pg-simple)
- Admin authentication: Environment variable credentials (MVP)
- State management: React Query (via tRPC) + useState for client-only state

**Important Decisions (Shape Architecture):**
- Security middleware stack: helmet + cors + express-rate-limit
- Routing: React Router v7 with code splitting
- Logging: Pino + pino-http
- Error handling: tRPC built-in error formatting

**Deferred Decisions (Post-MVP):**
- Dedicated caching layer (evaluate if PostgreSQL performance monitoring reveals need)
- Admin user management with LinkedIn OAuth (V2, when Karen needs self-service)
- Automated CI/CD deployment (add GitHub Actions before first pilot, no auto-deploy)
- Redis for session storage (migration path clear if PostgreSQL bottlenecks at 500 concurrent)

### Data Architecture

**Database Schema Specification**

The following table specifications define the complete data model. AI developer agents MUST implement these tables in `packages/server/src/db/schema.ts` using Drizzle ORM's `pgTable` definitions.

**Table: `events`**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `slug` | `varchar(100)` | UNIQUE, NOT NULL | URL-safe, used in `/event/:slug` for dynamic session routing |
| `name` | `varchar(255)` | NOT NULL | Event display name (e.g., "RUMC Job Networking") |
| `venue` | `varchar(255)` | | Event location |
| `agenda` | `text` | | Free-form agenda content (FR28) |
| `status` | `varchar(20)` | NOT NULL, default `'draft'` | Values: `draft`, `active`, `post_event`, `archived` |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | |

Indexes: `idx_events_slug` (UNIQUE), `idx_events_status`

Note: `scheduled_start`, `scheduled_end`, and `post_event_ends_at` moved to the `sessions` table. Events are containers for sessions — scheduling is per-session.

**Table: `sessions`**

Events contain one or more sessions. Each session has its own attendee list, schedule, and analytics. One QR per session. Each session gets its own QR code posted in its room, linking directly to `/event/:eventSlug/session/:sessionSlug`.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `event_id` | `uuid` | FK → `events.id`, NOT NULL | Parent event |
| `slug` | `varchar(100)` | NOT NULL | URL-safe, unique within event. Used in `/event/:eventSlug/session/:sessionSlug` |
| `name` | `varchar(255)` | NOT NULL | Session display name (e.g., "Career Quest Workshop") |
| `room` | `varchar(255)` | | Room number or location (e.g., "Room 101", "Main Hall") — FR27, FR30 |
| `scheduled_start` | `timestamptz` | NOT NULL | Session start time (UTC) |
| `scheduled_end` | `timestamptz` | NOT NULL | Session end time (UTC) |
| `post_event_ends_at` | `timestamptz` | | Computed: `scheduled_end + 5 days` (FR3, FR43) |
| `status` | `varchar(20)` | NOT NULL, default `'draft'` | Values: `draft`, `active`, `post_event`, `archived` |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | |

Indexes: `idx_sessions_event_id`, `idx_sessions_event_slug` (UNIQUE on `event_id` + `slug`), `idx_sessions_scheduled_start`, `idx_sessions_status`

**Per-Session QR Codes:**
Each session gets its own QR code posted in its room. The QR code URL is `/event/:eventSlug/session/:sessionSlug` — a direct link to the session page. No resolver or redirect needed for the primary attendee flow. One QR per session.

Sessions within an event can run concurrently. The RUMC test event has up to 7 simultaneous sessions at the 7:00 PM time slot. No overlap validation — concurrent sessions are the expected model.

**Optional Event Lobby (master QR):**
If Karen deploys a master QR at the registration desk, it links to `/event/:eventSlug` which renders `event-redirect.tsx` — an event lobby page listing all currently active sessions to choose from. This is a nice-to-have convenience, not the primary flow. The logic for listing active sessions lives in `services/session-resolver.ts`.

**Table: `attendees`**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `session_id` | `uuid` | FK → `sessions.id`, NOT NULL | Session scoping — attendees belong to sessions |
| `event_id` | `uuid` | FK → `events.id`, NOT NULL | Denormalized for cross-session queries (Karen's event-level reports) |
| `linkedin_id` | `varchar(100)` | NOT NULL | LinkedIn user identifier |
| `name` | `varchar(255)` | NOT NULL | From LinkedIn profile (FR2) |
| `title` | `varchar(255)` | | Job title from LinkedIn |
| `company` | `varchar(255)` | | Company from LinkedIn |
| `photo_url` | `text` | | LinkedIn profile photo URL |
| `linkedin_url` | `text` | NOT NULL | Public LinkedIn profile URL (FR16-17) |
| `scanned_at` | `timestamptz` | NOT NULL, default `now()` | QR scan timestamp |
| `role` | `varchar(20)` | NOT NULL, default `'attendee'` | Values: `attendee`, `event_admin`, `super_admin` (FR52 schema-ready) |

Indexes: `idx_attendees_session_id`, `idx_attendees_event_id`, `idx_attendees_session_linkedin` (UNIQUE on `session_id` + `linkedin_id`)

Note: The same person can attend multiple sessions within one event. Uniqueness is per-session (`session_id` + `linkedin_id`), not per-event. `event_id` is denormalized from `sessions.event_id` for efficient event-level aggregate queries without joining.

**Table: `journey_events`**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `session_id` | `uuid` | FK → `sessions.id`, NOT NULL | Session scoping |
| `event_id` | `uuid` | FK → `events.id`, NOT NULL | Denormalized for event-level analytics |
| `attendee_id` | `uuid` | FK → `attendees.id`, NOT NULL | |
| `type` | `varchar(20)` | NOT NULL | Values: `scan`, `tap`, `browse`, `return`, `session_switch` (FR47-50). `session_switch` logged on the previous session when an already-authenticated attendee scans a new session QR, with `metadata: { new_session_id }`. A corresponding `scan` event is logged on the new session. |
| `target_attendee_id` | `uuid` | FK → `attendees.id` | For `tap` events: whose profile was tapped |
| `metadata` | `jsonb` | | Extensible event-specific data |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Event timestamp |

Indexes: `idx_journey_events_session_id`, `idx_journey_events_event_id`, `idx_journey_events_attendee_id`, `idx_journey_events_type`, `idx_journey_events_created_at`

**Table: `feedback`**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `session_id` | `uuid` | FK → `sessions.id`, NOT NULL | Session scoping |
| `event_id` | `uuid` | FK → `events.id`, NOT NULL | Denormalized |
| `attendee_id` | `uuid` | FK → `attendees.id`, NOT NULL | |
| `text` | `text` | NOT NULL | Unstructured feedback (FR24) |
| `submitted_at` | `timestamptz` | NOT NULL, default `now()` | |

Indexes: `idx_feedback_session_id`. Constraint: UNIQUE on `event_id` + `attendee_id` (enforces one feedback submission per attendee per event, FR25)

**HTTP session tables:** Managed automatically by `connect-pg-simple`. No manual schema definition needed — the library creates and manages its own `session` table for Express session storage. This is unrelated to the `sessions` table above.

**Relationships:**
- `sessions.event_id` → `events.id` (CASCADE on delete)
- `attendees.session_id` → `sessions.id` (CASCADE on delete)
- `attendees.event_id` → `events.id` (CASCADE on delete)
- `journey_events.session_id` → `sessions.id` (CASCADE on delete)
- `journey_events.event_id` → `events.id` (CASCADE on delete)
- `journey_events.attendee_id` → `attendees.id` (CASCADE on delete)
- `journey_events.target_attendee_id` → `attendees.id` (SET NULL on delete)
- `feedback.session_id` → `sessions.id` (CASCADE on delete)
- `feedback.event_id` → `events.id` (CASCADE on delete)
- `feedback.attendee_id` → `attendees.id` (CASCADE on delete)

**Database Migration Strategy: Drizzle Kit**
- Decision: Drizzle Kit for schema migration management
- Development workflow: `drizzle-kit push` for rapid prototyping (applies changes directly, no migration files)
- Production workflow: `drizzle-kit generate` + `drizzle-kit migrate` (generates reviewable SQL migration files)
- Migration files committed to git as schema audit trail
- Rationale: SQL-first approach matches Carlos's deep SQL expertise. Generated SQL is reviewable and editable before applying.
- Affects: All database schema changes, event lifecycle tables, journey data tables, multi-tenant schema

**Session Storage: PostgreSQL (connect-pg-simple)**
- Decision: Store user sessions in PostgreSQL using `connect-pg-simple`
- Rationale: Single database to manage, sessions survive server restarts (NFR26), no additional infrastructure on VPS
- Scalability note: Monitor session query latency at 500 concurrent connections. Migration path to Redis is a session store adapter swap — no application code changes.
- Affects: Authentication flow, admin panel sessions, attendee sessions

**Caching Strategy: No Dedicated Cache (MVP)**
- Decision: No dedicated caching layer for MVP. PostgreSQL handles all queries directly.
- Rationale: Largest event is 500 attendees — a simple indexed `SELECT` with event scope filter. Premature caching adds complexity without proven need at pilot scale.
- In-memory cache (node-cache) may be added for event metadata if monitoring reveals repeated expensive queries.
- Revisit trigger: NFR41 observability data shows query latency exceeding 200ms for attendee list operations
- Affects: Attendee list API, analytics queries

### Authentication & Security

**Admin Panel Authentication: Environment Variable Credentials (MVP)**
- Decision: `ADMIN_EMAIL` + `ADMIN_PASSWORD` (bcrypt-hashed) in `.env` file. No admin user table, no registration flow, no password reset.
- Rationale: Carlos is the sole admin for MVP. Building a full credential system for one user is over-engineering. Environment variable approach takes 20 minutes to implement and protects against casual access to analytics data.
- V2 upgrade path: Add admin user table + LinkedIn OAuth when Karen needs self-service access.
- Security: bcrypt comparison at login, session stored in PostgreSQL, admin routes protected by authentication middleware.
- **Express 5 compatibility note:** Verify Passport.js and `connect-pg-simple` compatibility with Express 5.2.1 at scaffold time. If incompatible, use `passport@next` or switch to manual OAuth2 flow with `openid-client`. For session middleware, `express-session` has confirmed Express 5 support.
- Affects: Admin panel access, FR26

**Security Middleware Stack: helmet + cors + express-rate-limit**
- Decision: Standard Express security middleware stack, all three required:
  - `helmet` — Security HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
  - `cors` — Allow only `whoelseishere.com` as origin. No wildcard.
  - `express-rate-limit` — General API rate limiting + aggressive rate limiting on OAuth callback endpoint specifically
- OAuth rate limit rationale: LinkedIn callbacks should be rate-limited more aggressively than attendee list API to prevent auth abuse (NFR39 compliance)
- Test requirement: One integration test verifying CORS rejects unauthorized origins. One integration test verifying rate limiting triggers on excessive requests.
- Affects: All API endpoints, NFR10, NFR14, NFR39

### API & Communication Patterns

**API Pattern: tRPC**
- Decision: tRPC for all request/response API communication. Socket.io remains separate for real-time pub/sub.
- Rationale: In a TypeScript monorepo with Zod shared schemas, tRPC eliminates API contract drift entirely. Change a server procedure → client TypeScript updates automatically. Zero possibility of type mismatch across the API boundary. For a mastermind + AI developer model, tRPC makes the API layer **self-enforcing** — the compiler catches deviations from the architecture.
- tRPC handles: Event CRUD, admin panel data, analytics queries, auth callbacks, attendee data fetching
- Socket.io handles: Real-time attendee list broadcasts, connection status, reconnection with missed-update delivery
- React Query included: tRPC wraps React Query, providing automatic caching, loading states, error states, and refetching for all API data
- Nginx note: tRPC uses a single HTTP endpoint (typically `/api/trpc`). Nginx proxies this to Express on port 3001 — simpler than multiple REST routes.
- Affects: All API endpoints, frontend data fetching, shared types architecture

**Error Handling: tRPC Built-in**
- Decision: Use tRPC's built-in error formatting with Zod validation errors
- Error shape: `TRPCError` with `code` (HTTP-equivalent), `message`, and optional `cause` (Zod validation details)
- Client receives typed error objects — no manual JSON parsing
- Affects: All API error responses, client-side error handling

### Frontend Architecture

**State Management: React Query (via tRPC) + useState**
- Decision: No external state management library. tRPC provides React Query for all server state. `useState` for client-only state (WebSocket connection status, offline indicator boolean).
- Rationale: With tRPC managing server state (attendee list, event metadata, analytics), the remaining client state is trivial — two booleans (isConnected, isOffline). React Context is unnecessary for two booleans. If client state complexity grows in V2, evaluate Zustand.
- Affects: All React components, data fetching patterns

**Routing: React Router v7**
- Decision: React Router v7 in SPA mode
- Routes: Minimal — `/event/:eventSlug` (optional event lobby for master QR), `/event/:eventSlug/session/:sessionSlug` (attendee list — primary QR landing; also handles session-not-started, session-ended, and session-archived states inline), `/admin/*` (admin panel), `/` (marketing site handled separately by Nginx)
- QR code landing: Primary flow is direct — per-session QR codes link to `/event/:eventSlug/session/:sessionSlug`, which renders `session-page.tsx` immediately. No redirect needed. The `/event/:eventSlug` route is an optional event lobby for a master registration-desk QR — it renders `event-redirect.tsx` showing a list of currently active sessions.
- Code splitting: Admin routes (`/admin/*`) in a separate route tree from attendee routes (`/event/*`). Attendees never download admin dashboard code.
- Rationale: Code splitting keeps PWA cache under 2MB (NFR7). 5-6 routes total — no need for TanStack Router or file-based routing.
- Affects: Bundle size, PWA cache budget, NFR7

### Infrastructure & Deployment

**CI/CD Pipeline: Manual → GitHub Actions**
- Decision: Manual deployment for MVP development (`npm run build` → `scp` to VPS). Add GitHub Actions before first pilot event.
- GitHub Actions scope: `on push → install → lint → test → build`. No automated deployment — manual control over production updates during live pilots.
- Rationale: Don't add CI to run zero tests. Add CI when there are tests worth running automatically. Manual deployment matches Carlos's existing VPS deployment workflow.
- Affects: Deployment workflow, pre-pilot quality gate

**Logging: Pino + pino-http**
- Decision: Pino for application logging, `pino-http` as Express middleware for automatic request logging
- Output: Structured JSON logs (method, URL, status code, response time per request)
- Log management: PM2 handles log rotation and persistence
- Rationale: Fastest Node.js logger. Structured JSON enables grep-based analysis during live events (NFR41). `pino-http` provides automatic per-request metrics without custom logging code.
- Test note: Don't test logging itself. Test behaviors that produce log-worthy events.
- Affects: NFR41 (observability), NFR29 (error rate monitoring)

**Environment Configuration: Single Root .env**
- Decision: Single `.env` file at monorepo root. `dotenv` loads variables for all packages.
- `.env.example` committed to git with all required variable names (no values) — serves as configuration documentation
- `.env` in `.gitignore` — never committed (contains LinkedIn OAuth credentials, admin password, database connection string)
- Required variables: `DATABASE_URL`, `REDIS_URL`, `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `NODE_ENV`
- `REDIS_URL` default: `redis://localhost:6379` (dev), configurable for prod
- Affects: All packages, deployment configuration, security

### Decision Impact Analysis

**Implementation Sequence:**
1. Monorepo scaffold (npm workspaces, tsconfig, tailwind config)
2. Database setup (PostgreSQL install, Drizzle schema, initial migration)
3. Express server with tRPC + security middleware + Pino logging
4. LinkedIn OAuth integration (Passport.js + session storage)
5. Attendee list API (tRPC procedures + Zod schemas)
6. Socket.io real-time layer (event-scoped rooms, broadcast engine, Redis adapter for PM2 cluster, JWT auth middleware)
7. React SPA (Vite scaffold, tRPC client, attendee list component)
8. PWA configuration (vite-plugin-pwa, service worker, offline support)
9. Admin panel (tRPC procedures + React admin routes)
10. Marketing site (static HTML + Tailwind)

**Cross-Component Dependencies:**
- tRPC + Zod schemas must be defined before client or server procedures (shared package first)
- Drizzle schema defines the data model that tRPC procedures query
- Socket.io coexists with tRPC on the same Express server (port 3001). Redis adapter required for PM2 cluster mode.
- React Query (via tRPC) manages server state; Socket.io manages real-time state — clear separation
- Admin auth (env-var) is independent of attendee auth (LinkedIn OAuth) — no shared auth infrastructure
- Code splitting (React Router) depends on admin/attendee route separation being clean from the start

**Event Lifecycle Scheduling:**
- The `event-lifecycle.ts` service uses `node-cron` to run lifecycle checks every 60 seconds
- **Session-level transitions:** Each check queries `sessions` with `status = 'active'` where `scheduled_end < now()` → transitions that session to `post_event`. Queries `sessions` with `status = 'post_event'` where `post_event_ends_at < now()` → transitions that session to `archived`.
- **Event-level derivation:** After processing sessions, the cron job updates `events.status` as a derived value: if ANY session is `active` → event is `active`. If ALL sessions are `post_event` or `archived` → event is `post_event`. If ALL sessions are `archived` → event is `archived`.
- This means concurrent sessions that end at different times transition independently. A 1:00 PM session can be `post_event` while a 7:00 PM session is still `active`.
- Cron job initializes on server startup. PM2 ensures the server (and therefore the cron) is always running.
- **PM2 Cluster Configuration:** `instances: 2` on the Contabo VPS. Two workers provide basic load distribution and zero-downtime restarts (PM2 graceful reload). Not `instances: 'max'` — a single VPS should reserve resources for PostgreSQL, Redis, and Nginx. The `ecosystem.config.js` specifies this explicitly.
- **Data anonymization:** A separate daily scheduled task (or conditional branch in the lifecycle cron) checks for events where the latest `session.scheduled_end + 12 months < now()`. When triggered, it replaces attendee personal data (name, photo URL, LinkedIn profile URL) with anonymized identifiers while retaining aggregate analytics and journey event timestamps/types (FR45).

## Implementation Patterns & Consistency Rules

*These patterns are a specification for AI developer agents — unambiguous rules that prevent any two agents from making incompatible choices.*

### Naming Patterns

**Database Naming (Drizzle schema):**
- Tables: `snake_case`, plural — `events`, `attendees`, `journey_events`, `admin_sessions`
- Columns: `snake_case` — `event_id`, `scanned_at`, `linkedin_url`, `photo_url`
- Foreign keys: `{referenced_table_singular}_id` — `event_id`, `attendee_id`
- Indexes: `idx_{table}_{column}` — `idx_attendees_event_id`, `idx_journey_events_timestamp`
- Enums: `snake_case` — `event_status` with values `'active'`, `'post_event'`, `'archived'`

**tRPC Naming:**
- Routers: `camelCase`, domain-grouped — `eventRouter`, `sessionRouter`, `attendeeRouter`, `analyticsRouter`, `adminRouter`
- Procedures: `camelCase`, verb-first — `getBySlug`, `resolveCurrentSession`, `listAttendees`, `createEvent`, `createSession`, `generateReport`
- Full path example: `trpc.event.getBySlug`, `trpc.session.resolveCurrentSession` (optional event lobby), `trpc.analytics.getSessionSummary`

**Code Naming:**
- Files: `kebab-case` — `attendee-list.tsx`, `event-router.ts`, `journey-capture.ts`
- React components: `PascalCase` — `AttendeeList`, `ColdStartMessage`, `OfflineIndicator`
- Functions/variables: `camelCase` — `getAttendees`, `eventSlug`, `isConnected`
- Constants: `SCREAMING_SNAKE_CASE` — `MAX_RECONNECT_ATTEMPTS`, `POST_EVENT_WINDOW_DAYS`
- Types/interfaces: `PascalCase` — `Attendee`, `EventStatus`, `JourneyEvent`
- Zod schemas: `PascalCase` + `Schema` suffix — `AttendeeSchema`, `EventCreateSchema`

**Socket.io Events:**
- Event names: `kebab-case`, namespace-prefixed — `attendee:joined`, `attendee:list-update`, `connection:status-change`
- Room names: `session:{sessionId}` — e.g., `session:abc123`. Attendees join the room for their specific session, not the parent event. This ensures real-time broadcasts are session-scoped.

### Structure Patterns

**Project Organization:**

```
packages/client/
├── src/
│   ├── components/          # React components by feature
│   │   ├── attendee-list/   # AttendeeList, AttendeeCard, etc.
│   │   ├── cold-start/      # ColdStartMessage
│   │   ├── common/          # Shared UI (OfflineIndicator, LoadingSpinner)
│   │   └── admin/           # Admin dashboard components
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Route-level page components
│   ├── utils/               # Client-only utilities
│   └── trpc.ts              # tRPC client setup
├── tests/                   # Vitest + @testing-library/react
└── index.html

packages/server/
├── src/
│   ├── routers/             # tRPC routers (event, attendee, analytics, admin)
│   ├── services/            # Business logic (event-lifecycle, journey-capture, linkedin-api)
│   ├── db/                  # Drizzle schema, migrations, connection
│   ├── middleware/          # Express middleware (auth, security, logging)
│   ├── socket/              # Socket.io setup, event handlers, room management
│   └── index.ts             # Server entry point
├── tests/                   # Vitest + tRPC createCaller
└── drizzle.config.ts

packages/shared/
├── src/
│   ├── schemas/             # Zod schemas (attendee, event, session, journey, analytics)
│   ├── types/               # TypeScript types derived from Zod (re-exports)
│   └── constants/           # Shared constants (event/session statuses, cold-start thresholds)
└── tests/                   # Vitest (schema validation tests)
```

**Test Location Rule:** Tests live in a `tests/` directory at the package root, NOT co-located with source files. Test files mirror the source structure: `tests/routers/event-router.test.ts` tests `src/routers/event-router.ts`.

**Component Organization:** Feature-based, not type-based. `components/attendee-list/` contains everything related to the attendee list (component, sub-components, styles). NOT `components/` + `containers/` + `styles/`.

### Format Patterns

**API Response Formats (tRPC):**
- Success: tRPC returns data directly — no wrapper. The procedure's return type IS the response.
- Errors: `TRPCError` with standard codes (`NOT_FOUND`, `UNAUTHORIZED`, `BAD_REQUEST`, `INTERNAL_SERVER_ERROR`)
- Validation errors: Zod validation failures automatically surfaced by tRPC with field-level detail

**Date/Time Formats:**
- Database: `timestamp with time zone` (PostgreSQL native)
- API/JSON: ISO 8601 strings — `"2026-03-01T19:00:00.000Z"`
- Display: Formatted at the React component level using `Intl.DateTimeFormat` (no moment.js or date-fns unless needed)
- Timezone handling: All timestamps stored and transmitted in UTC. Client converts to local timezone for display only.

**JSON Field Naming:**
- `camelCase` in TypeScript/JSON — `eventSlug`, `scannedAt`, `photoUrl`
- Drizzle maps `snake_case` database columns to `camelCase` TypeScript properties automatically

### Communication Patterns

**Socket.io Event Payload Structure:**
```typescript
// All Socket.io events follow this pattern:
{
  type: 'attendee:joined',        // Event type (matches event name)
  eventId: string,                // Always include event scope
  payload: { ... },               // Event-specific data
  timestamp: string,              // ISO 8601 UTC
}
```

**WebSocket Reconnection Pattern (FR54):**
- Client tracks `lastReceivedTimestamp`
- On reconnection, client sends `{ lastTimestamp }` to server
- Server delivers all events since that timestamp
- Client merges updates into existing list (no full reload)

### Process Patterns

**Error Handling:**
- Server: All errors caught by tRPC error handler. Business logic throws `TRPCError` with appropriate code. Unexpected errors logged via Pino, returned as `INTERNAL_SERVER_ERROR` to client.
- Client: tRPC `useQuery`/`useMutation` provides `error` object with typed error codes. Components display user-facing messages based on error code, NOT raw error messages.
- Logging: Pino logs include `{ error, context, requestId }`. Never log sensitive data (tokens, passwords, LinkedIn URLs with query params).

**Loading State Pattern:**
- tRPC provides `isLoading`, `isError`, `data` from every query hook
- Components render three states: loading (skeleton/spinner), error (retry action), success (data)
- No global loading state — each query manages its own loading independently

**Authentication Flow Pattern:**
- Attendee (first scan): QR scan → `/event/:eventSlug/session/:sessionSlug` → session-page.tsx → no HTTP cookie → store session info in sessionStorage → LinkedIn OAuth (state param includes sessionId) → callback → HTTP session created → attendee record created → attendee list rendered
- Attendee (session hop): QR scan → `/event/:eventSlug/session/:sessionSlug` → session-page.tsx → HTTP cookie found → create attendee in new session from cached profile → attendee list rendered → log session_switch on previous session
- Admin: Navigate to `/admin` → login form → env-var credential check → session created → dashboard rendered
- Session check: Express middleware verifies session on every API request. Invalid session → `UNAUTHORIZED` tRPC error → client redirects to auth

**Validation Pattern:**
- Input validation: Zod schemas in `packages/shared`, enforced by tRPC procedure `.input()` — server never receives unvalidated data
- Database validation: Drizzle schema constraints (NOT NULL, UNIQUE, CHECK) as second layer
- Client validation: Zod schemas reused in React forms for instant feedback — same schema, client and server

### Accessibility Patterns (WCAG 2.1 AA)

*These rules apply to ALL React components. AI developer agents MUST follow these without exception.*

1. **ARIA labels:** All interactive elements (buttons, links, form inputs) must have descriptive `aria-label` or associated `<label>` elements. Attendee cards: `aria-label="View {name}'s LinkedIn profile"`.
2. **Live regions:** The attendee list container must use `aria-live="polite"` so screen readers announce new attendees without interrupting the user. Attendee count uses `aria-live="polite"` with `aria-atomic="true"`.
3. **Touch targets:** All interactive elements minimum 44x44px. Tailwind: `min-h-11 min-w-11`. Applies to attendee cards, buttons, navigation links, form controls.
4. **Keyboard navigation:** All interactive elements reachable via Tab. Focus order follows visual layout. Attendee list supports arrow key navigation between cards. All actions triggerable via Enter/Space.
5. **Focus preservation:** When the attendee list updates via Socket.io, focus MUST remain on the currently focused element. New attendees append to the list without stealing focus. Use React `key` props and `useRef` to preserve focus across re-renders.
6. **Motion sensitivity:** All animations and transitions wrapped in `@media (prefers-reduced-motion: no-preference)`. Users who prefer reduced motion see instant state changes with no animation.
7. **Color contrast:** All text/background combinations must meet WCAG 2.1 AA contrast ratio: 4.5:1 for normal text (< 18px), 3:1 for large text (>= 18px bold or >= 24px). Verify during component development.
8. **Zoom support:** Layout must remain functional and readable at 200% browser zoom. No horizontal scrolling at 200% on viewport widths >= 320px. Tailwind responsive utilities handle this when used correctly.

**Accessibility Testing:** Add `@axe-core/playwright` to E2E test dependencies. Every Playwright E2E test that renders a page MUST include an axe accessibility scan assertion. This provides automated WCAG 2.1 AA violation detection on every test run.

### Enforcement Guidelines

**All AI Agents MUST:**
1. Follow naming conventions exactly — no exceptions, no "personal preferences"
2. Place files in the correct package and directory — consult the structure pattern before creating files
3. Use Zod schemas from `packages/shared` — never define inline types for API data
4. Use tRPC procedures for all request/response communication — never use raw `fetch` or `axios`
5. Use Socket.io for all real-time communication — never poll the API for updates
6. Write tests in `tests/` directories, not co-located with source
7. Use Pino for logging — never use `console.log` in production code
8. Handle all three states (loading, error, success) in React components
9. Store all timestamps in UTC, format for display only at the component level
10. Scope all data access to the current event — never expose cross-event data

**Pattern Verification:**
- TypeScript strict mode catches naming and type violations at compile time
- ESLint rules enforce file naming conventions
- tRPC + Zod enforce API contract compliance automatically
- Drizzle schema enforces database naming via code-first definitions

## Project Structure & Boundaries

### Complete Project Directory Structure

```
who-else-is-here/
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Variable names documentation (committed)
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml                # GitHub Actions: install → lint → test → build
├── package.json                  # Root workspace config (npm workspaces)
├── tsconfig.base.json            # Shared TypeScript strict config
├── tailwind.config.js            # Shared Tailwind config (client + marketing)
├── vitest.workspace.ts           # Root-level Vitest workspace (all packages)
├── playwright.config.ts          # Playwright E2E config
│
├── packages/
│   ├── shared/                   # Shared types, schemas, constants
│   │   ├── package.json
│   │   ├── tsconfig.json         # Extends tsconfig.base.json
│   │   ├── src/
│   │   │   ├── index.ts          # Public API barrel export
│   │   │   ├── schemas/
│   │   │   │   ├── attendee.ts   # AttendeeSchema, AttendeeCreateSchema
│   │   │   │   ├── event.ts      # EventSchema, EventCreateSchema, EventStatusEnum
│   │   │   │   ├── session.ts    # SessionSchema, SessionCreateSchema, SessionStatusEnum
│   │   │   │   ├── journey.ts    # JourneyEventSchema (scan, tap, browse, return, session_switch)
│   │   │   │   ├── analytics.ts  # AnalyticsSummarySchema, ActivityTimelineSchema
│   │   │   │   ├── auth.ts       # AdminLoginSchema, OAuthCallbackSchema (state param includes sessionId)
│   │   │   │   └── socket.ts     # SocketMessageSchema, ReconnectPayloadSchema
│   │   │   ├── types/
│   │   │   │   └── index.ts      # Re-exports z.infer<> types from schemas
│   │   │   └── constants/
│   │   │       ├── event-status.ts    # EVENT_STATUS enum values
│   │   │       ├── cold-start.ts      # COLD_START_THRESHOLDS (5, 15)
│   │   │       ├── lifecycle.ts       # POST_EVENT_WINDOW_DAYS (5), DATA_RETENTION_MONTHS (12)
│   │   │       └── websocket.ts       # RECONNECT_INITIAL_MS (1000), RECONNECT_MAX_MS (30000)
│   │   └── tests/
│   │       └── schemas/
│   │           ├── attendee.test.ts
│   │           ├── event.test.ts
│   │           ├── session.test.ts
│   │           └── socket.test.ts
│   │
│   ├── server/                   # Express + tRPC + Socket.io backend
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── drizzle.config.ts     # Drizzle Kit configuration
│   │   ├── src/
│   │   │   ├── index.ts          # Server entry point (Express + Socket.io + tRPC mount)
│   │   │   ├── trpc.ts           # tRPC init (context, router, procedure helpers)
│   │   │   ├── app-router.ts     # Root tRPC router (merges all sub-routers)
│   │   │   ├── routers/
│   │   │   │   ├── event.ts      # Event CRUD: createEvent, getBySlug, listEvents, updateEvent
│   │   │   │   ├── session.ts    # Session CRUD: createSession, resolveCurrentSession (optional event lobby), listSessions, updateSession
│   │   │   │   ├── attendee.ts   # Attendee ops: listAttendees, getAttendeeProfile (session-scoped)
│   │   │   │   ├── analytics.ts  # Analytics: getSessionSummary, getEventSummary, getTimeline, getJourneyData
│   │   │   │   ├── admin.ts      # Admin: login, getSystemHealth, generateReport, exportReport
│   │   │   │   └── auth.ts       # OAuth: initLinkedIn, linkedInCallback, refreshSession, logout. OAuth state param MUST include sessionId so callback creates attendee in correct session.
│   │   │   ├── services/
│   │   │   │   ├── session-resolver.ts # Optional event lobby: list active sessions for master registration QR
│   │   │   │   ├── event-lifecycle.ts  # Automated transitions: active → post-event → archived (FR41-43)
│   │   │   │   ├── journey-capture.ts  # Async telemetry: scan, tap, browse, return, session_switch events (FR47-50)
│   │   │   │   ├── linkedin-api.ts     # LinkedIn OAuth + profile data (isolated per NFR40)
│   │   │   │   ├── report-generator.ts # Post-session summary report (FR34-35)
│   │   │   │   └── qr-generator.ts     # QR code + short URL generation (FR29-30) — generates per-session QR. Output includes session name + room below the QR image for easy identification when printing.
│   │   │   │                            # **Short URL Strategy (MVP):** Path-based URLs on the primary domain (`whoelseishere.com/event/:eventSlug/session/:sessionSlug`). No custom short URL domain for MVP. Short URLs in PRD journey narratives (e.g., `whois.here/c3g-feb26`) are illustrative only. Custom short domain (e.g., `whois.here`) is a post-MVP enhancement.
│   │   │   ├── db/
│   │   │   │   ├── connection.ts       # Drizzle + PostgreSQL connection pool
│   │   │   │   ├── schema.ts           # Complete Drizzle schema (all tables)
│   │   │   │   └── migrations/         # Drizzle Kit generated SQL migrations
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts             # Session verification middleware
│   │   │   │   ├── admin-auth.ts       # Admin env-var credential check
│   │   │   │   ├── security.ts         # helmet + cors + rate-limit setup
│   │   │   │   └── logging.ts          # pino-http request logging
│   │   │   └── socket/
│   │   │       ├── setup.ts            # Socket.io server init + Redis adapter + Nginx upgrade config
│   │   │       ├── auth.ts             # Socket.io JWT authentication middleware (verifies token on handshake)
│   │   │       ├── handlers.ts         # Event handlers: join room, broadcast attendee update
│   │   │       └── rooms.ts            # Room management: session:{sessionId} scoping
│   │   └── tests/
│   │       ├── routers/
│   │       │   ├── event.test.ts
│   │       │   ├── attendee.test.ts
│   │       │   ├── analytics.test.ts
│   │       │   └── admin.test.ts
│   │       ├── services/
│   │       │   ├── event-lifecycle.test.ts
│   │       │   ├── journey-capture.test.ts
│   │       │   └── linkedin-api.test.ts
│   │       └── socket/
│   │           └── handlers.test.ts
│   │
│   ├── client/                   # Vite + React + TypeScript SPA
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts        # Vite 7 + vite-plugin-pwa config
│   │   ├── index.html
│   │   ├── public/
│   │   │   ├── manifest.json     # PWA web app manifest
│   │   │   ├── favicon.ico
│   │   │   └── icons/            # PWA icons (192x192, 512x512)
│   │   ├── src/
│   │   │   ├── main.tsx          # React app entry point
│   │   │   ├── app.tsx           # Root component + React Router setup
│   │   │   ├── trpc.ts           # tRPC React client setup (+ React Query provider)
│   │   │   ├── global.css        # Tailwind base imports
│   │   │   ├── pages/
│   │   │   │   ├── event-redirect.tsx    # /event/:eventSlug — optional event lobby: lists active sessions for master registration QR
│   │   │   │   ├── session-page.tsx      # /event/:eventSlug/session/:sessionSlug — primary QR landing. Handles all session states: active (attendee list), not-yet-started, post-event (read-only list), archived
│   │   │   │   ├── admin-layout.tsx      # /admin/* — admin shell with nav
│   │   │   │   ├── admin-dashboard.tsx   # /admin — real-time monitoring
│   │   │   │   ├── admin-events.tsx      # /admin/events — event management
│   │   │   │   ├── admin-sessions.tsx    # /admin/events/:id/sessions — session management within event
│   │   │   │   ├── admin-analytics.tsx   # /admin/events/:id/sessions/:sessionId/analytics — session analytics
│   │   │   │   └── admin-login.tsx       # /admin/login — admin credential form
│   │   │   ├── components/
│   │   │   │   ├── attendee-list/
│   │   │   │   │   ├── attendee-list.tsx      # Main list component (virtualized)
│   │   │   │   │   ├── attendee-card.tsx      # Individual attendee card
│   │   │   │   │   └── attendee-count.tsx     # Total attendee count display (FR14)
│   │   │   │   ├── cold-start/
│   │   │   │   │   └── cold-start-message.tsx # Tiered messaging: <5, 5-15, 15+ (FR21-23)
│   │   │   │   ├── common/
│   │   │   │   │   ├── offline-indicator.tsx  # Offline/online status (FR19)
│   │   │   │   │   ├── loading-spinner.tsx    # Loading state component (FR8)
│   │   │   │   │   ├── error-display.tsx      # Error with retry action (FR9)
│   │   │   │   │   └── feedback-prompt.tsx    # Post-event text feedback (FR24-25)
│   │   │   │   └── admin/
│   │   │   │       ├── event-form.tsx         # Event creation form (FR27-28)
│   │   │   │       ├── session-form.tsx       # Session creation/edit within event
│   │   │   │       ├── qr-code-display.tsx    # QR code preview + download (FR29-30) — per-session QR with session name + room label
│   │   │   │       ├── live-dashboard.tsx     # Real-time scan/tap counters (FR31-32) — session-scoped
│   │   │   │       ├── analytics-charts.tsx   # Activity timeline, journey data (FR36-40) — per-session
│   │   │   │       └── session-report.tsx     # Session report: screenshot-ready metrics (FR34-35)
│   │   │   ├── hooks/
│   │   │   │   ├── use-socket.ts         # Socket.io connection + reconnection logic (session-scoped rooms)
│   │   │   │   ├── use-online-status.ts  # Online/offline detection
│   │   │   │   ├── use-session-data.ts   # Session metadata + lifecycle status
│   │   │   │   └── use-media-query.ts    # Breakpoint detection for target attribute switching (lg: 1024px)
│   │   │   └── utils/
│   │   │       ├── format-date.ts        # Intl.DateTimeFormat UTC → local
│   │   │       └── linkedin-url.ts       # LinkedIn URL formatting + copyable fallback
│   │   └── tests/
│   │       ├── components/
│   │       │   ├── attendee-list.test.tsx
│   │       │   ├── cold-start-message.test.tsx
│   │       │   └── offline-indicator.test.tsx
│   │       └── hooks/
│   │           ├── use-socket.test.ts
│   │           └── use-online-status.test.ts
│   │
│   └── marketing/                # Static HTML marketing site
│       ├── package.json          # Tailwind CSS CLI build script
│       ├── index.html            # Landing page (hero, how-it-works, organizers, contact, footer)
│       ├── privacy.html          # Privacy policy (NFR17)
│       ├── input.css             # Tailwind @import directives
│       └── dist/                 # Compiled CSS output (gitignored, built for deploy)
│           └── output.css
│
└── e2e/                          # Playwright cross-package E2E tests
    ├── tests/
    │   ├── attendee-flow.spec.ts     # Per-session QR scan → OAuth → list → tap → LinkedIn + session hop flow
    │   ├── cold-start.spec.ts        # <5, 5-15, 15+ messaging tiers
    │   ├── offline-resilience.spec.ts # WiFi drop → cached list → reconnection
    │   ├── websocket-reconnect.spec.ts # Connection drop → exponential backoff → catch-up
    │   ├── admin-login.spec.ts       # Admin credential auth flow
    │   └── event-lifecycle.spec.ts   # Active → post-event → archived transitions
    └── fixtures/
        ├── test-event.ts             # Event factory for test data
        ├── test-session.ts           # Session factory for test data
        └── test-attendee.ts          # Attendee factory for test data
```

### Architectural Boundaries

**API Boundaries (tRPC):**

| Boundary | Entry Point | Auth Required | Description |
|---|---|---|---|
| Public attendee API | `trpc.attendee.*` | LinkedIn OAuth session | Attendee list, profile data (session-scoped) |
| Public session API | `trpc.session.resolveCurrentSession` | None | Optional event lobby — list active sessions for master registration QR |
| Public auth API | `trpc.auth.*` | None (initiates auth) | LinkedIn OAuth flow |
| Admin API | `trpc.admin.*` | Admin env-var session | System health, report generation |
| Admin event API | `trpc.event.*` | Admin env-var session | Event CRUD, QR generation |
| Admin session API | `trpc.session.*` | Admin env-var session | Session CRUD within events |
| Admin analytics API | `trpc.analytics.*` | Admin env-var session | Analytics, journey data, reports (session + event level) |

**Socket.io Boundaries:**

| Boundary | Namespace | Auth Required | Description |
|---|---|---|---|
| Attendee real-time | Default `/` | JWT (verified on handshake) | Join session room (`session:{sessionId}`), receive attendee broadcasts |
| Admin monitoring | `/admin` | Admin session | Live scan/tap counters during sessions |

**Socket.io Authentication Middleware:**
- JWT token must be verified on WebSocket handshake — unauthenticated connections are rejected before joining any room
- Pattern: `io.use((socket, next) => { const token = socket.handshake.auth.token; verifyJWT(token) ? next() : next(new Error('Unauthorized')); })`
- Client sends JWT via `socket.handshake.auth.token` (not cookies — WebSocket connections don't reliably carry cookies in all browsers)
- Implementation: `packages/server/src/socket/auth.ts`

**Socket.io Redis Adapter (Required for PM2 Cluster Mode):**
- PM2 runs multiple Node.js worker processes. Each worker has its own Socket.io instance. Without a shared pub/sub backend, broadcasts from worker 1 never reach clients connected to worker 2.
- Solution: `@socket.io/redis-adapter` — all Socket.io instances connect to the same Redis pub/sub channels, enabling cross-worker broadcasts.
- Redis is used **exclusively** for Socket.io adapter in MVP. No session store, no caching, no other purpose.
- Configuration: `createAdapter(pubClient, subClient)` where both clients connect to `REDIS_URL`
- Redis must be in Docker Compose for both `dev` and `prod` profiles
- Implementation: `packages/server/src/socket/setup.ts`

**Data Boundaries:**

| Table | Scoped By | Access Pattern |
|---|---|---|
| `events` | N/A (admin-only) | Admin creates/reads. Attendees access via event slug → session resolution. |
| `sessions` | `event_id` | Admin creates/reads within events. Attendees land directly on session via per-session QR code. |
| `attendees` | `session_id` (+ denormalized `event_id`) | Attendees see only their session's attendees. Admin sees per-session or aggregated per-event. |
| `journey_events` | `session_id` (+ denormalized `event_id`) | Never exposed to attendees. Admin sees aggregate per session or per event. |
| `admin_sessions` | N/A | Admin-only. Environment credential auth. |
| `http_sessions` | N/A | Managed by connect-pg-simple. Express HTTP session storage. |

### Requirements to Structure Mapping

**FR Category: Attendee Identity & Access (FR1-10)**
- Components: `client/src/pages/event-redirect.tsx`, `client/src/pages/session-page.tsx`, `client/src/components/common/loading-spinner.tsx`, `client/src/components/common/error-display.tsx`
- Services: `server/src/services/linkedin-api.ts`, `server/src/services/session-resolver.ts`, `server/src/routers/auth.ts`, `server/src/routers/session.ts`
- Schemas: `shared/src/schemas/auth.ts`, `shared/src/schemas/attendee.ts`, `shared/src/schemas/session.ts`

**FR Category: Attendee List & Networking (FR11-20)**
- Components: `client/src/components/attendee-list/*`, `client/src/components/common/offline-indicator.tsx`
- Hooks: `client/src/hooks/use-socket.ts`, `client/src/hooks/use-online-status.ts`, `client/src/hooks/use-session-data.ts`
- Services: `server/src/socket/handlers.ts`, `server/src/socket/rooms.ts`
- Schemas: `shared/src/schemas/attendee.ts`, `shared/src/schemas/socket.ts`, `shared/src/schemas/session.ts`
- PWA: `client/vite.config.ts` (vite-plugin-pwa service worker config)

**FR Category: Cold-Start Experience (FR21-23)**
- Components: `client/src/components/cold-start/cold-start-message.tsx`
- Constants: `shared/src/constants/cold-start.ts`

**FR Category: Attendee Feedback (FR24-25)**
- Components: `client/src/components/common/feedback-prompt.tsx`
- Router: `server/src/routers/attendee.ts` (submitFeedback procedure)

**FR Category: Event Administration (FR26-35)**
- Components: `client/src/components/admin/*`, `client/src/pages/admin-*.tsx`
- Routers: `server/src/routers/event.ts`, `server/src/routers/session.ts`, `server/src/routers/admin.ts`
- Services: `server/src/services/qr-generator.ts`, `server/src/services/report-generator.ts`
- Middleware: `server/src/middleware/admin-auth.ts`

**FR Category: Organizer Analytics (FR36-40)**
- Components: `client/src/components/admin/analytics-charts.tsx`, `client/src/components/admin/live-dashboard.tsx`
- Router: `server/src/routers/analytics.ts`
- Services: `server/src/services/journey-capture.ts`

**FR Category: Event Lifecycle Management (FR41-46)**
- Service: `server/src/services/event-lifecycle.ts` (automated transitions, timer-based: cron checks `sessions` table per `scheduled_end` and `post_event_ends_at`, derives `events.status` from aggregate session states)
- Schema: `shared/src/schemas/event.ts` (EventStatusEnum), `shared/src/schemas/session.ts` (SessionStatusEnum)
- Constants: `shared/src/constants/lifecycle.ts`

**FR Category: Data Capture & Infrastructure (FR47-52)**
- Service: `server/src/services/journey-capture.ts` (async telemetry pipeline)
- Schema: `shared/src/schemas/journey.ts`
- Database: `server/src/db/schema.ts` (journey_events table with session + event scope)

**FR Category: Real-Time Communication (FR53-54)**
- Socket: `server/src/socket/*` (setup, handlers, rooms)
- Hooks: `client/src/hooks/use-socket.ts` (reconnection with exponential backoff, missed-update catch-up)
- Schema: `shared/src/schemas/socket.ts` (SocketMessageSchema, ReconnectPayloadSchema)
- Constants: `shared/src/constants/websocket.ts`

### Cross-Cutting Concerns Mapping

| Concern | Server Location | Client Location | Shared Location |
|---|---|---|---|
| Session scoping | `db/schema.ts` (FK constraints), all routers (session_id filter) | `hooks/use-socket.ts` (session room join) | `schemas/session.ts` |
| Session resolution | `services/session-resolver.ts` (optional event lobby), `routers/session.ts` | `pages/session-page.tsx` (primary QR landing), `pages/event-redirect.tsx` (optional event lobby) | `schemas/session.ts` |
| Authentication | `middleware/auth.ts`, `services/linkedin-api.ts` | `pages/session-page.tsx` (OAuth redirect) | `schemas/auth.ts` |
| Offline resilience | N/A | `hooks/use-online-status.ts`, `vite.config.ts` (PWA) | `schemas/socket.ts` |
| Journey capture | `services/journey-capture.ts` | Implicit (tRPC calls log events) | `schemas/journey.ts` |
| Observability | `middleware/logging.ts` (pino-http) | N/A | N/A |

### Data Flow

```
Attendee Flow (primary — per-session QR):
QR Scan → Browser opens /event/:eventSlug/session/:sessionSlug
  → React Router renders session-page.tsx
  → If not authenticated (no HTTP session cookie):
    → Store {sessionSlug, eventSlug, sessionName} in sessionStorage (for OAuth callback)
    → Redirect to LinkedIn OAuth (server/routers/auth.ts → services/linkedin-api.ts)
    → OAuth state parameter includes sessionId so callback knows which session to create attendee in
    → OAuth callback → HTTP session created (middleware/auth.ts) → create attendee record in session
    → OAuthLoadingScreen reads sessionStorage for branded loading
    → Redirect back to /event/:eventSlug/session/:sessionSlug
  → tRPC: attendee.listAttendees (session-scoped) → Drizzle query → attendee list
  → Socket.io: join session:{sessionId} room
  → Socket.io: receive attendee:joined broadcasts (session-scoped)
  → Journey capture: scan event logged (services/journey-capture.ts)
  → Each tap: journey capture + LinkedIn URL navigation

Returning-Attendee Flow (session hop — frictionless):
QR Scan in new room → Browser opens /event/:eventSlug/session/:sessionSlug
  → React Router renders session-page.tsx
  → HTTP session cookie found → already authenticated
  → Create attendee record in new session from cached LinkedIn profile (no re-authentication)
  → tRPC: attendee.listAttendees (new session) → render attendee list
  → Socket.io: join new session:{sessionId} room
  → Journey capture: log session_switch event on previous session (metadata: { new_session_id })
  → Journey capture: log scan event on new session

Optional Event Lobby Flow (master registration-desk QR):
QR Scan → Browser opens /event/:eventSlug
  → React Router renders event-redirect.tsx
  → tRPC: session.resolveCurrentSession → lists currently active sessions
  → Attendee selects a session → navigates to /event/:eventSlug/session/:sessionSlug
  → Continues with primary attendee flow above

Admin Flow:
Navigate to /admin/login
  → Submit credentials → middleware/admin-auth.ts → session
  → tRPC: event.listEvents → admin dashboard (events with session counts)
  → Select event → tRPC: session.listSessions → session list within event
  → Select session → tRPC: analytics.getSessionSummary → session-level charts/reports
  → tRPC: analytics.getEventSummary → event-level aggregate across sessions
  → Socket.io /admin: live monitoring during active sessions
```

### Deployment Structure

```
Contabo VPS (/var/www/whoelseishere.com/)
├── marketing/              # Static HTML (packages/marketing build output)
│   ├── index.html
│   ├── privacy.html
│   └── output.css

Contabo VPS (/home/cgorricho/apps/who-else-is-here/)
├── packages/client/dist/   # Vite build output (served by Nginx at /event/)
├── packages/server/dist/   # TypeScript compiled output (run by PM2 on :3001)
├── redis/                  # Redis data directory (Socket.io adapter pub/sub)
└── .env                    # Production environment variables (includes REDIS_URL)

Nginx routes:
  whoelseishere.com/                → /var/www/whoelseishere.com/ (static)
  whoelseishere.com/event/*         → SPA (client/dist)
  whoelseishere.com/api/trpc/*      → localhost:3001 (tRPC)
  whoelseishere.com/socket.io/*     → localhost:3001 (WebSocket upgrade)
  whoelseishere.com/admin/*         → SPA (client/dist, same build)
```

## Architecture Validation Results

*Validated through comprehensive FR/NFR coverage analysis + Party Mode expert panel review (Winston, Amelia, Barry, Murat, Sally) — [transcript](_bmad-output/party-mode-transcripts/2026-03-01-architecture-validation-gap-review.md)*

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices work together without conflicts. The tRPC + Express 5 + Socket.io + Redis adapter + Drizzle + Vite 7 + React 19 + Tailwind v4 stack is coherent. tRPC handles request/response, Socket.io handles real-time with Redis adapter for PM2 cluster cross-worker broadcasts — clean separation. Zod schemas in shared package provide type safety across all boundaries. Express 5 compatibility with Passport.js and connect-pg-simple flagged for verification at scaffold time (fallback path documented in Authentication section).

**Pattern Consistency:**
All naming conventions (database `snake_case`, tRPC `camelCase`, files `kebab-case`, components `PascalCase`) are internally consistent and non-contradictory. Structure patterns align with technology choices. Communication patterns (Socket.io payloads, tRPC responses) are fully specified.

**Structure Alignment:**
Project structure supports all architectural decisions. Boundaries (API, Socket.io, Data) are properly defined with auth requirements. The monorepo structure with npm workspaces enables shared types as designed.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage: 49/56 Fully Covered**

All 56 FRs (FR1-FR55 + FR50b) have architectural support. 49 are fully covered by explicit architectural decisions, project structure, and implementation patterns. 7 are partially covered with gaps deferred to developer stories:

| FR | Description | Gap | Resolution |
|---|---|---|---|
| FR7 | Status-specific messages for non-active events | No explicit error page component for invalid/expired/archived states | Defer to developer story — `event-page.tsx` handles per status |
| FR13 | Self-entry visible on list | No self-identification UX pattern (highlight? pin to top?) | Defer to developer story |
| FR25 | One-time feedback trigger | Mechanism enforced via UNIQUE constraint on `feedback` table (`event_id` + `attendee_id`) | **Resolved** — schema constraint added |
| FR35 | Export report in shareable format | Export format not specified | Defer to developer story |
| FR42 | Disable scanning for post-event | Scanning disable mechanism not specified | Defer to developer story — server checks event status before OAuth |
| FR45 | 12-month data retention with anonymization | Anonymization approach not documented | Defer to developer story |
| FR52 | Role-based admin access | Role column added to `attendees` table schema (schema-ready for V2) | **Resolved** — `role` column added |

**Non-Functional Requirements Coverage: 27/42 Fully Covered**

All 42 NFRs (NFR1-NFR41 + NFR9b) have architectural support or explicit patterns. 27 fully covered, 15 partially covered with gaps addressed or deferred:

| NFR | Description | Gap | Resolution |
|---|---|---|---|
| NFR6 | TTI <3s on 3G | No explicit 3G optimization strategy | Defer — Vite code splitting + PWA cache addresses this |
| NFR12 | Token refresh <5s | Token refresh mechanism not detailed | Defer to developer story |
| NFR16 | LinkedIn API ToS compliance | No ToS review process | Defer to developer story |
| NFR20 | 0→200 spike in 15 min | No connection pool sizing | Defer to developer story |
| NFR22 | 500+ archived events analytics <2s | No indexing strategy for large-scale analytics | Defer — indexes specified in schema |
| NFR23 | 99.5% uptime during events | No alerting/monitoring mechanism | Defer to developer story |
| NFR27 | Lifecycle transitions fire without admin | Scheduling mechanism not specified | **Resolved** — `node-cron` every 60s added |
| NFR28 | <5s WebSocket interruption during deploy | Graceful deployment strategy not detailed | Defer to developer story |
| NFR29 | <1% API error rate | No error rate monitoring | Defer — Pino structured logs enable analysis |
| NFR30-37 | WCAG 2.1 AA accessibility (8 NFRs) | No accessibility patterns | **Resolved** — 8-rule Accessibility Patterns section added + `@axe-core/playwright` |
| NFR38 | LinkedIn API unavailability handling | No circuit breaker pattern | Defer — `linkedin-api.ts` isolation enables story-level implementation |
| NFR41 | Observability within 5s | System health metrics not fully specified | Defer — `getSystemHealth` procedure + Pino logs provide foundation |

### Implementation Readiness Validation ✅

**Decision Completeness:**
- All critical technologies have pinned versions (React 19.2.4, Vite 7.3.1, Express 5.2.1, Tailwind 4.2.0, Drizzle 0.45.1, Socket.io 4.8.3, @socket.io/redis-adapter latest, Redis latest, Playwright 1.58.2, Node.js 22.17.0)
- Secondary dependencies (Zod, Passport.js, Pino, helmet, cors, etc.) specified as "Latest" — acceptable for MVP
- Complete database schema with 5 tables (events, sessions, attendees, journey_events, feedback), all columns, types, constraints, relationships, and indexes
- All 11 architectural decisions documented with rationale and cross-references

**Structure Completeness:**
- Complete directory tree with ~100+ files, each mapped to specific FRs
- All architectural boundaries defined (API, Socket.io, Data) with auth requirements
- Integration points specified (tRPC mount, Socket.io rooms, Nginx routing)
- Requirements-to-structure mapping covers all 8 FR categories

**Pattern Completeness:**
- Naming conventions: database, tRPC, code, Socket.io — all specified with examples
- Communication patterns: Socket.io payload structure, WebSocket reconnection flow
- Process patterns: error handling, loading states, auth flows, validation
- Accessibility patterns: 8 enforcement rules with specific Tailwind/ARIA guidance
- 10 enforcement guidelines for AI developer agents
- Pattern verification through TypeScript strict mode, ESLint, tRPC+Zod, Drizzle schema

### Gap Analysis Results

**Critical gaps resolved (2):**
1. ✅ Database schema — full 5-table specification added (events, sessions, attendees, journey_events, feedback) with columns, types, constraints, relationships, indexes
2. ✅ Accessibility patterns — 8-rule enforcement section added with `@axe-core/playwright` for automated verification

**Important gaps resolved (2):**
3. ✅ Event lifecycle scheduling — `node-cron` every 60s specified
4. ✅ Express 5 compatibility — verification note with fallback path added

**Post-concurrent-sessions revision (resolved):**
5. ✅ FR55 (frictionless session hop) — returning-attendee flow documented in Authentication Flow Pattern and Data Flow sections
6. ✅ FR50b (session_switch capture) — journey event type added to schema, journey-capture.ts service, and data flow
7. ✅ Session-level lifecycle transitions — cron job queries sessions table, derives event status
8. ✅ `session.ts` shared schema — added to directory listing

**Deferred to developer stories (14):**
Token refresh, report export format, scanning disable mechanism, anonymization approach, LinkedIn API circuit breaker, deployment scripts, spike handling config, analytics indexing, uptime monitoring, error rate monitoring, observability dashboard, design tokens, ESLint configuration, self-identification UX. All are implementation-level details that the architecture correctly delegates to the file structure and requirements mapping.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed (56 FRs, 41 NFRs, 7 user journeys)
- [x] Scale and complexity assessed (Medium — single-screen UI, significant infrastructure)
- [x] Technical constraints identified (Contabo VPS, Nginx, PostgreSQL, PM2)
- [x] Cross-cutting concerns mapped (event scoping, auth, offline, journey capture, observability)

**✅ Architectural Decisions**
- [x] 11 critical decisions documented with verified versions
- [x] Technology stack fully specified (14 technology choices)
- [x] Integration patterns defined (tRPC + Socket.io coexistence, Zod shared schemas)
- [x] Performance considerations addressed (code splitting, PWA cache, list virtualization)
- [x] Database schema fully specified (5 tables, all columns/types/constraints/indexes)

**✅ Implementation Patterns**
- [x] Naming conventions established (database, tRPC, code, Socket.io)
- [x] Structure patterns defined (feature-based components, test location rules)
- [x] Communication patterns specified (Socket.io payloads, WebSocket reconnection)
- [x] Process patterns documented (error handling, loading states, auth flows, validation)
- [x] Accessibility patterns defined (8 WCAG 2.1 AA enforcement rules)
- [x] 10 enforcement guidelines for AI developer agents

**✅ Project Structure**
- [x] Complete directory structure defined (~100+ files)
- [x] Component boundaries established (packages/client, server, shared, marketing)
- [x] Integration points mapped (tRPC mount, Socket.io rooms, Nginx routing)
- [x] Requirements-to-structure mapping complete (all 8 FR categories)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** HIGH — based on comprehensive validation across all 56 FRs and 42 NFRs

**Key Strengths:**
- Type-safe end-to-end architecture (tRPC + Zod + TypeScript strict) serves as guardrails for AI developer agents
- Complete database schema specification eliminates data model ambiguity
- Every FR category mapped to specific files in the project structure
- Accessibility patterns ensure WCAG 2.1 AA compliance is enforced, not optional
- "Mastermind + AI developer" model explicitly shapes the document as a build specification

**Areas for Future Enhancement:**
- Deployment automation (CI/CD scripts, PM2 config, graceful shutdown)
- Observability dashboard (real-time metrics beyond structured logs)
- Design tokens and color palette (UX design phase deliverable)
- LinkedIn API resilience patterns (circuit breaker, token refresh — developer story level)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented — no deviations
- Use implementation patterns consistently across all components
- Respect project structure and boundaries — consult the directory tree before creating files
- Use Zod schemas from `packages/shared` — never define inline types for API data
- Implement all 8 accessibility patterns in every React component
- Refer to this document as the single source of truth for all architectural questions

**First Implementation Priority:**
1. Monorepo scaffold (npm workspaces, `tsconfig.base.json`, `tailwind.config.js`, `.env.example`)
2. `packages/shared` — Zod schemas and TypeScript types (the foundation everything depends on)
3. `packages/server` — Drizzle schema, database connection, initial migration
4. Express server with tRPC mount + security middleware + Pino logging
5. LinkedIn OAuth integration (verify Passport.js + Express 5 compatibility first)
