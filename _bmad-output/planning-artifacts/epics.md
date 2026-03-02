---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

# who-else-is-here - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for who-else-is-here, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Definition of Done (All Stories)

Every story is complete when ALL of the following are true:
1. All acceptance criteria pass (Given/When/Then verified)
2. All existing tests pass (no regressions) — `npm run test` green
3. No new lint warnings or TypeScript errors — `npm run build` clean
4. `@axe-core/playwright` accessibility scan passes on all new UI screens (zero critical/serious)
5. Code reviewed (or self-reviewed for solo dev) against Architecture naming conventions and structure patterns

## Requirements Inventory

### Functional Requirements

- **FR1:** Attendee can scan a session-specific QR code or enter a session short URL to access that session's attendee list
- **FR2:** Attendee can authenticate via LinkedIn OAuth, providing name, photo, title, and company
- **FR3:** Attendee can access the attendee list for up to 5 days after the event ends
- **FR4:** Attendee can access the attendee list from any supported browser on mobile or desktop
- **FR5:** System restricts LinkedIn OAuth to minimal scope (name, photo, title, company only — no messaging, contacts, or posting permissions)
- **FR6:** System resolves short URL slugs to the correct event and directs attendees to the corresponding attendee list
- **FR7:** System displays a status-specific message (invalid, expired, or archived) when an attendee accesses a non-active event URL, with guidance to contact the event organizer
- **FR8:** System displays a loading indicator during the authentication and list-loading process so the attendee knows the app is working
- **FR9:** System displays an error message identifying the failure type when LinkedIn authentication fails, with a retry action
- **FR10:** System supports multiple concurrent browser sessions per attendee per event (e.g., phone at event and laptop at home during post-event window)
- **FR11:** Attendee can view a real-time list of all other authenticated attendees at the same session
- **FR12:** Attendee can see each attendee's name, title, company, and LinkedIn photo on the list
- **FR13:** Attendee can see their own entry on the attendee list after authentication, confirming successful registration
- **FR14:** Attendee can see the total number of authenticated attendees at the current session (session-scoped count, not event-wide)
- **FR15:** Attendee can see new attendees appear on the list in real time without manual refresh
- **FR16:** Attendee can tap any attendee's name to navigate directly to that person's LinkedIn profile
- **FR17:** Attendee can copy a LinkedIn profile URL when direct navigation fails (offline fallback)
- **FR18:** Attendee can browse the cached attendee list while offline
- **FR19:** Attendee can see an indicator when viewing the list offline
- **FR20:** Attendee can see the list automatically refresh when connectivity is restored
- **FR21:** System displays contextual encouragement messaging when fewer than 5 attendees have scanned
- **FR22:** System displays growth momentum messaging when 5-15 attendees have scanned
- **FR23:** System removes encouragement messaging when the attendee count exceeds 15
- **FR24:** Attendee can submit unstructured text feedback about their experience
- **FR25:** System triggers the feedback prompt once during the post-event access window
- **FR26:** Admin can authenticate to the admin panel using secure credentials
- **FR27:** Admin can create a new event with name, date/time, venue, and short URL slug, and can create one or more sessions within the event, each with a session name, time slot, and room number/location
- **FR28:** Admin can input event agenda content for the event record
- **FR29:** Admin can generate a unique QR code and short URL per session within an event (URL format: `/event/:eventSlug/session/:sessionSlug`). For single-session events, one QR code is generated. For multi-session events, each session gets its own QR code.
- **FR30:** Admin can download a print-ready QR code image per session that includes the session short URL as visible text, the session name, and the room number/location alongside the QR code graphic
- **FR31:** Admin can view a real-time monitoring dashboard during active events showing scan count and tap activity
- **FR32:** Admin can view system health indicators (server responsiveness, connection stability) during active events
- **FR33:** Admin can view all active events simultaneously (super-admin view)
- **FR34:** Admin can generate a post-event summary report for an event
- **FR35:** Admin can export the post-event summary report in a shareable format
- **FR36:** Admin can view total scan count and activation rate for an event
- **FR37:** Admin can view total profile taps and average taps per attendee
- **FR38:** Admin can view an activity timeline showing scan and tap patterns over the event duration
- **FR39:** Admin can view attendee journey data (scan timestamps, return visits, profile taps per attendee)
- **FR40:** Admin can view distraction health metrics per session, showing the ratio of profile taps occurring during that session's active time slot versus outside it. With concurrent sessions, this metric is per-session.
- **FR41:** System automatically transitions individual sessions from active to post-event status when each session's scheduled_end time passes. Event status is derived from aggregate session states.
- **FR42:** System disables QR code scanning for all sessions in post-event status events
- **FR43:** System automatically transitions events from post-event to archived status after 5 days
- **FR44:** System retains all event data after archiving for analytics and journey intelligence
- **FR45:** System retains archived event data for 12 months after the event end date, after which attendee personal data is anonymized while retaining aggregate analytics
- **FR46:** Admin can view the lifecycle status and countdown timer for each event
- **FR47:** System captures and stores every scan event with timestamp and session identifier
- **FR48:** System captures and stores every profile tap event with timestamp and session identifier
- **FR49:** System captures and stores every list browse session with timestamp and session identifier
- **FR50:** System captures and stores every return visit with timestamp and session identifier
- **FR50b:** System captures and stores session_switch events when a returning attendee scans a QR code for a different session within the same event, recording the source session, target session, and timestamp
- **FR51:** System isolates event data such that attendees of one event cannot access data from another event
- **FR52:** System restricts admin access based on assigned role (super-admin sees all events, event-admin sees only their events)
- **FR53:** System broadcasts attendee list updates to all connected clients within 3 seconds of a new scan
- **FR54:** When a client connection drops, the system automatically attempts reconnection with exponential backoff (initial 1s, max 30s). Upon reconnection, the server delivers all attendee list updates missed during disconnection. If reconnection fails after 60 seconds, the client displays the offline indicator and falls back to cached list browsing
- **FR55:** When a returning attendee scans a QR code for a different session, the system uses the existing HTTP session cookie to bypass re-authentication and automatically creates the attendee record in the new session using the cached LinkedIn profile. OAuth happens once per event; subsequent session QR scans are frictionless.

### NonFunctional Requirements

**Performance:**
- **NFR1:** Initial page load (first visit, 4G connection) < 2 seconds
- **NFR2:** Subsequent page load (cached PWA) < 500ms
- **NFR3:** Attendee list render (100 items) < 200ms
- **NFR4:** Real-time update delivery (server broadcast to client DOM update) < 3 seconds on stable connection
- **NFR5:** LinkedIn profile tap response (tap → browser navigation) < 1 second
- **NFR6:** Time to interactive on 3G connection < 3 seconds
- **NFR7:** PWA total cache payload < 2MB
- **NFR8:** System-controlled OAuth flow (redirect, callback processing, list rendering) < 5 seconds
- **NFR9:** Large attendee list rendering (500 items with photos) scrollable and responsive without visible frame drops, no frame longer than 33ms (30fps floor)
- **NFR9b:** Frictionless session hop (returning attendee scans new session QR) < 4 seconds from QR scan to attendee list rendered

**Security:**
- **NFR10:** All data transmission encrypted via HTTPS — 100% of connections
- **NFR11:** LinkedIn OAuth tokens stored securely server-side — never exposed to client-side code
- **NFR12:** OAuth token refresh handled transparently within 5 seconds with no page reload required
- **NFR13:** Attendee personal data accessible only within the event scope — zero cross-event data leakage
- **NFR14:** Admin panel access protected by authentication — no unauthenticated admin access
- **NFR15:** LinkedIn OAuth scope requests only permitted fields (name, photo, title, company)
- **NFR16:** Attendee data handling compliant with LinkedIn API Terms of Service
- **NFR17:** Privacy policy publicly accessible at a stable URL

**Scalability:**
- **NFR18:** Concurrent attendees per event: 500 without degradation
- **NFR19:** Concurrent active events: 10 simultaneously without degradation
- **NFR20:** Event spike handling (0 → 200 attendees in 15 minutes) — no performance degradation
- **NFR21:** Concurrent real-time connections per event: 500 simultaneous
- **NFR22:** Data growth: support 500+ archived events with full journey data, analytics queries < 2 seconds

**Reliability:**
- **NFR23:** Uptime during event windows: 99.5% during defined event windows
- **NFR24:** Degradation on connectivity loss: cached attendee list remains browsable, offline indicator within 3 seconds
- **NFR25:** Data capture durability: all acknowledged events guaranteed durable after database persistence
- **NFR26:** Automatic recovery after server restart within 60 seconds without manual intervention
- **NFR27:** Event lifecycle transitions execute reliably even if no admin is logged in
- **NFR28:** Near-zero-downtime deployments: active WebSocket connections < 5 seconds interruption
- **NFR29:** API error rate during active events < 1% of all requests

**Accessibility:**
- **NFR30:** WCAG 2.1 Level AA compliance — zero critical violations
- **NFR31:** Color contrast ratio minimum 4.5:1
- **NFR32:** Touch target size minimum 44x44px
- **NFR33:** Screen reader support — all interactive elements programmatically identifiable
- **NFR34:** Keyboard navigation — all primary actions operable via keyboard
- **NFR35:** Browser zoom support — fully usable at 200% zoom
- **NFR36:** Animation and motion sensitivity — all animations respect prefers-reduced-motion
- **NFR37:** Real-time updates do not disrupt keyboard focus position; ARIA live regions for new attendees

**External Dependencies:**
- **NFR38:** LinkedIn OAuth API unavailability: previously authenticated attendees continue browsing via cached list
- **NFR39:** LinkedIn API rate limit compliance — stay within published rate limits with margin
- **NFR40:** LinkedIn API change isolation — API version updates accommodated without full application redeployment
- **NFR41:** Event observability — response times, connection counts, error rates available within 5 seconds during active events

### User Journeys (Reference for Acceptance Criteria)

These 7 user journeys from the PRD provide acceptance criteria context that goes beyond what individual FRs specify. Story acceptance criteria should reference these journeys.

1. **Journey 1: Alex — Happy Path** — QR scan → LinkedIn OAuth → attendee list in <30 seconds → browse → tap → LinkedIn profile → return with scroll position preserved → 5-day post-event access → feedback prompt
2. **Journey 2: Alex — Cold Start** — Early arrival, ≤5 attendees → tiered messaging creates anticipation → real-time additions retain attention → messaging disappears at 20+ attendees
3. **Journey 3: Alex — Connectivity Failure** — WiFi drops → cached list remains browsable → offline indicator → failed LinkedIn taps show copyable URL fallback → reconnection catches up silently
4. **Journey 3b: Alex — Session Hop** — Scan Session A → walk to Session B → scan new QR → no re-auth (HTTP cookie) → instant list load (<4 seconds) → `session_switch` event logged → organic growth engine
5. **Journey 4: Karen — Event Deployment** — Receives per-session QR code assets from Carlos → places in rooms → monitors live dashboard → receives post-event report → forwards to leadership as proof of value
6. **Journey 5: Carlos — System Operator** — Creates event + sessions in admin → generates per-session QR codes → downloads print-ready assets → monitors real-time dashboard → generates reports → manages lifecycle
7. **Journey 6: Dave — Reluctant Scanner** — Ignores QR → observes social proof → peer pressure builds → checks OAuth permissions (minimal) → converts or doesn't (app tolerates partial adoption gracefully)

### Additional Requirements

**From Architecture:**
- Monorepo scaffold with npm workspaces (packages/client, packages/server, packages/shared, packages/marketing)
- Minimal scaffold: `npm create vite@latest -- --template react-ts` for frontend, manual Express backend setup
- Tech stack: React 19, Vite 7, Express 5, Tailwind CSS v4, Drizzle ORM, Socket.io, Passport.js, Zod, Vitest, Playwright
- tRPC for all request/response API communication; Socket.io for real-time pub/sub
- 5 database tables: events, sessions (includes `room` column for room number/location — FR27, FR30), attendees, journey_events, feedback
- Per-session Socket.io rooms: `session:{sessionId}` for session-scoped broadcasts
- Event lifecycle cron job (node-cron, every 60 seconds) — session-level transitions, event status derived
- Security middleware: helmet + cors + express-rate-limit
- Logging: Pino + pino-http (structured JSON)
- Single root `.env` with required variables: DATABASE_URL, REDIS_URL, LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET, NODE_ENV
- CI/CD: Manual deployment for MVP development → GitHub Actions before first pilot
- PM2 for process management on Contabo VPS
- PWA via vite-plugin-pwa (service worker, offline caching, web app manifest)
- Code splitting: admin routes separate from attendee routes
- TypeScript strict mode across all packages
- Drizzle Kit for database migrations
- Session storage: PostgreSQL (connect-pg-simple)
- React Router v7 in SPA mode
- Shared Tailwind config between client and marketing packages
- Implementation sequence: scaffold → database → Express/tRPC → OAuth → attendee API → Socket.io → React SPA → PWA → admin panel → marketing site
- **CRITICAL: "Project initialization using the monorepo scaffold should be the first implementation story."** — Architecture explicit note. Shapes Epic 1 Story 1.
- Testing architecture: Vitest (unit/integration), Playwright (E2E), `@axe-core/playwright` (accessibility), `@testing-library/react` (component tests), Supertest (API tests). Every story's "Done" must include tests.
- E2E test risk priority (Architecture): WebSocket reconnection > OAuth flow > journey data capture > session hop. Informs which stories get E2E coverage first.
- Express 5 compatibility spike: "Verify Passport.js and `connect-pg-simple` compatibility with Express 5.2.1 at scaffold time. If incompatible, use `passport@next` or switch to manual OAuth2 flow with `openid-client`." — Investigation task for auth epic.

**From UX Design Specification:**
- Tailwind CSS v4 with `@theme` CSS-first configuration (not v3 `tailwind.config.js`)
- Inter (variable font) as primary typeface, JetBrains Mono for admin monospace
- Indigo primary color palette (distinct from LinkedIn blue and Tailwind default blue)
- 4px spacing grid, 72px minimum card height, 40px circular avatars
- Attendee card: photo-led hierarchy (Photo → Name → Title·Company → chevron)
- Virtualized list via @tanstack/react-virtual
- Scroll position preservation on back-navigation (highest-risk UX failure mode)
- Cold-start tiered messaging: 1-4, 5-14, 15-19, 20+ thresholds
- Session-aware sticky header (session name + time range + live counter + search icon at 20+)
- SessionStatusScreen (not separate route) for draft/post_event/archived states
- OAuthLoadingScreen with sessionStorage context
- Desktop: max-width container (640px centered), hover states, target="_blank" for LinkedIn
- Mobile: edge-to-edge list, target="_self" for LinkedIn
- Admin: session list cards (not tabs) for concurrent sessions, drill-down navigation
- Admin: MetricCard, SessionReport (screenshot-ready), ActivityTimeline, EventForm
- No pull-to-refresh, no onboarding tour, no notification badges
- All animations wrapped in prefers-reduced-motion media query
- LinkedIn links: standard https://linkedin.com/in/ URLs only (no linkedin:// scheme)
- Responsive: mobile-first, lg: (1024px) as primary desktop breakpoint
- 12 custom components: AttendeeCard, AttendeeList, SessionHeader, ColdStartMessage, SearchFilter, SessionStatusScreen, OAuthLoadingScreen, MetricCard, SessionReport, ActivityTimeline, EventForm, SessionList
- **UX component implementation phases** (affects epic ordering):
  - Phase 1 — MVP Core (pilot-blocking): AttendeeCard, AttendeeList, SessionHeader, OAuthLoadingScreen, ColdStartMessage
  - Phase 2 — MVP Complete (pre-pilot): SearchFilter, SessionStatusScreen, MetricCard, EventForm, SessionReport
  - Phase 3 — Post-Pilot Enhancement: ActivityTimeline, SessionList, PDF export
- **Tailwind v4 @theme note:** Architecture references `tailwind.config.js` but UX spec (written later) correctly identifies Tailwind v4 uses `@theme` directives in `packages/shared/theme.css`. Stories should use the CSS-first `@theme` approach, not JS config.

**Cross-Cutting Concerns:**

- **Accessibility (NFR30-37) is cross-cutting, not isolated stories.** The 8 accessibility enforcement rules from Architecture apply to EVERY attendee-facing component: (1) ARIA labels on all interactive elements, (2) `aria-live="polite"` on attendee list, (3) 44x44px minimum touch targets, (4) keyboard navigation via Tab/Enter/Space/Arrow, (5) focus preservation on list updates, (6) `prefers-reduced-motion` wrapping on all animations, (7) 4.5:1 color contrast minimum, (8) 200% zoom support. These must be acceptance criteria on every UI story, not a separate epic.

**Pre-Pilot Operational Checklist (Not Story-Scoped):**
- NFR28 (near-zero-downtime deployments, <5s WebSocket interruption) — verified manually during pre-pilot deployment rehearsal, not in a story AC. PM2 reload + Nginx upstream configuration must be validated before first live event.

**MVP Scope Boundaries (What NOT to Build):**

Developer agents must NOT implement these — they are explicitly deferred:
- Dark mode (V2 consideration)
- Multi-language / internationalization
- Native mobile app (PWA only)
- In-app messaging between attendees
- Social features (likes, comments, activity feed)
- Custom branding per organizer
- API for third-party integrations
- Intro audio/video social proof cue (deferred — social proof works through visible scanning behavior alone)
- Role-based access enforcement (schema includes roles from day one; enforcement deferred — MVP has only one admin, Carlos)
- Three-objection signage framework (design/print artifact, not software)
- Event-wide aggregate view (V2 — per-session views only in MVP)
- AI-generated intro video
- Automated agenda parsing (Carlos parses manually in MVP)
- Non-LinkedIn authentication fallback
- AI matching / recommendation engine
- Pricing tiers (attendee or organizer)
- Sponsor premium placement

### FR Coverage Map

| FR | Epic | Description |
|---|---|---|
| FR1 | Epic 1 | QR code scan to access session attendee list |
| FR2 | Epic 1 | LinkedIn OAuth authentication |
| FR4 | Epic 1 | Cross-browser support (mobile + desktop) |
| FR5 | Epic 1 | Minimal LinkedIn OAuth scope |
| FR6 | Epic 1 | URL slug resolution to correct event/session |
| FR7 | Epic 1 | Status-specific messages for non-active URLs |
| FR8 | Epic 1 | Loading indicator during auth + list load |
| FR9 | Epic 1 | Error message on LinkedIn auth failure with retry |
| FR10 | Epic 1 | Multiple concurrent browser sessions per attendee |
| FR11 | Epic 1 | Real-time attendee list (session-scoped) |
| FR12 | Epic 1 | Attendee card: name, title, company, photo |
| FR13 | Epic 1 | Self-entry visible on list after auth |
| FR14 | Epic 1 | Session-scoped attendee count |
| FR15 | Epic 1 | Real-time new attendee appearance (no refresh) |
| FR16 | Epic 1 | One-tap LinkedIn profile navigation |
| FR47 | Epic 1 | Journey capture: scan events |
| FR48 | Epic 1 | Journey capture: profile tap events |
| FR49 | Epic 1 | Journey capture: list browse sessions |
| FR50 | Epic 1 | Journey capture: return visits |
| FR51 | Epic 1 | Event data isolation (multi-tenant) |
| FR53 | Epic 1 | WebSocket broadcast within 3 seconds |
| FR17 | Epic 2 | Copyable LinkedIn URL (offline fallback) |
| FR18 | Epic 2 | Cached attendee list browsing (offline) |
| FR19 | Epic 2 | Offline indicator |
| FR20 | Epic 2 | Auto-refresh on connectivity restore |
| FR21 | Epic 2 | Cold-start messaging (<5 attendees) |
| FR22 | Epic 2 | Growth momentum messaging (5-15 attendees) |
| FR23 | Epic 2 | Messaging removal (>15 attendees) |
| FR54 | Epic 2 | WebSocket reconnection with missed-update delivery |
| FR26 | Epic 3 | Admin authentication (secure credentials) |
| FR27 | Epic 3 | Event + session creation (name, time, room) |
| FR28 | Epic 3 | Event agenda content input |
| FR29 | Epic 3 | Per-session QR code + short URL generation |
| FR30 | Epic 3 | Print-ready QR code image per session |
| FR52 | Epic 3 | Role-based admin access (schema) |
| FR3 | Epic 4 | 5-day post-event attendee list access |
| FR24 | Epic 4 | Unstructured text feedback submission |
| FR25 | Epic 4 | Feedback prompt triggered once post-event |
| FR41 | Epic 4 | Session-level auto-transition (active → post_event) |
| FR42 | Epic 4 | Disable scanning in post-event sessions |
| FR43 | Epic 4 | Auto-transition post-event → archived (5 days) |
| FR44 | Epic 4 | Data retention after archiving |
| FR45 | Epic 4 | 12-month retention → anonymization |
| FR50b | Epic 4 | Journey capture: session_switch events |
| FR55 | Epic 4 | Frictionless session hop (cookie-based, no re-auth) |
| FR31 | Epic 5 | Real-time monitoring dashboard (scan count, taps) |
| FR32 | Epic 5 | System health indicators during events |
| FR33 | Epic 5 | Super-admin view across all active events |
| FR34 | Epic 5 | Post-event summary report generation |
| FR35 | Epic 5 | Report export in shareable format |
| FR36 | Epic 5 | Scan count + activation rate |
| FR37 | Epic 5 | Profile taps + average taps per attendee |
| FR38 | Epic 5 | Activity timeline (scan/tap patterns) |
| FR39 | Epic 5 | Attendee journey data view |
| FR40 | Epic 5 | Per-session distraction health metrics |
| FR46 | Epic 5 | Lifecycle status + countdown timer |

**Coverage verification:** 56/56 FRs mapped. Zero gaps.

## Epic List

| Epic | Title | Stories | FRs |
|---|---|---|---|
| 1 | Project Foundation & Core Attendee Experience | 5 stories | 21 FRs |
| 2 | PWA, Offline Resilience & Cold Start | 3 stories | 8 FRs |
| 3 | Admin Event & Session Management | 3 stories | 6 FRs |
| 4 | Session Hop, Event Lifecycle & Post-Event | 3 stories | 10 FRs |
| 5 | Admin Monitoring, Analytics & Reports | 3 stories | 11 FRs |
| M | Marketing Website (Standalone) | 1 story | 0 FRs |
| **Total** | | **18 stories** | **56 FRs** |

---

## Epic 1: Project Foundation & Core Attendee Experience

Alex scans a session QR code, authenticates via LinkedIn, and browses a real-time attendee list with one-tap LinkedIn navigation. Journey data is captured from the first interaction.

**FRs covered:** FR1, FR2, FR4, FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR47, FR48, FR49, FR50, FR51, FR53 (21 FRs)
**User Journeys:** Journey 1 (Alex Happy Path), Journey 6 (Dave Reluctant Scanner)
**Dependencies:** None — this is the foundation epic.

### Story 1.1: Project Scaffold & Database Foundation

As a developer agent,
I want a fully configured monorepo with database, server, and client scaffolds,
So that all subsequent stories can be built on a consistent, type-safe foundation.

**Dependencies:** None — this is the first implementation story.
**Note:** This is a multi-day story due to the breadth of scaffold concerns. All items are tightly coupled and cannot ship independently.

**Acceptance Criteria:**

*Scaffold & Build:*

**Given** a fresh repository clone
**When** `npm install` is run at the monorepo root
**Then** all four packages (client, server, shared, marketing) install successfully via npm workspaces
**And** `tsconfig.base.json` exists with TypeScript strict mode enabled, extended by each package's `tsconfig.json`

**Given** the monorepo is installed
**When** `npm run build` is executed
**Then** all packages compile without TypeScript errors

*Shared Package:*

**Given** the shared package exists
**When** a developer inspects `packages/shared/src/schemas/`
**Then** Zod schema files exist for: `event.ts`, `session.ts`, `attendee.ts`, `journey.ts`, `auth.ts`, `socket.ts`
**And** each schema exports both the Zod schema and the inferred TypeScript type
**And** `packages/shared/src/types/index.ts` re-exports all inferred types

**Given** the shared package exists
**When** a developer inspects `packages/shared/theme.css`
**Then** a Tailwind v4 `@theme` configuration exists with the design tokens from the UX spec (indigo primary palette, gray neutrals, semantic colors, Inter font, 4px spacing grid)

*Environment:*

**Given** a `.env.example` file exists at the monorepo root
**When** a developer reads it
**Then** it contains all required variable names: `DATABASE_URL`, `REDIS_URL`, `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `NODE_ENV`
**And** no secret values are committed — only descriptive placeholder comments

*Database:*

**Given** a PostgreSQL database is accessible via `DATABASE_URL`
**When** `npm run db:migrate` is executed
**Then** Drizzle Kit creates the following tables: `events`, `sessions`, `attendees`, `journey_events`, `feedback`
**And** all foreign keys, indexes, and constraints match the Architecture document schema
**And** the `sessions` table includes a `room` column (`varchar(255)`, nullable) for room number/location (FR27, FR30)
**And** `events.status` and `sessions.status` use the enum values: `draft`, `active`, `post_event`, `archived`

**Given** the database schema
**When** a developer inspects `packages/server/src/db/schema/`
**Then** Drizzle ORM schema files exist for all 5 tables (`events.ts`, `sessions.ts`, `attendees.ts`, `journey-events.ts`, `feedback.ts`)
**And** the Drizzle schemas match the Zod schemas in `packages/shared/src/schemas/`
**And** `npm run db:migrate` generates migration files successfully via Drizzle Kit

*Server:*

**Given** the server package exists
**When** `npm run dev:server` is executed
**Then** an Express 5 server starts on port 3001
**And** tRPC is mounted at `/api/trpc`
**And** Socket.io is initialized on the same server with room-based architecture using `session:{sessionId}` pattern for session-scoped broadcasts, with `@socket.io/redis-adapter` connected to `REDIS_URL` for PM2 cluster cross-worker broadcasts
**And** security middleware is active: helmet (CSP, HSTS), cors (only `whoelseishere.com` origin in production), express-rate-limit
**And** Pino + pino-http log structured JSON for every request

**Given** the server needs process management
**When** a developer inspects the monorepo root
**Then** an `ecosystem.config.js` exists with PM2 configuration for the Express server (app name, script path, env variables, restart policy)

*Operational Readiness:*

**Given** the server is running
**When** a GET request is sent to `/api/health`
**Then** it returns HTTP 200 with a JSON body including `{ status: "ok", uptime: number }` (health endpoint for monitoring)

**Given** the server receives a SIGTERM signal
**When** the process shutdown sequence executes
**Then** active connections are drained gracefully before the process exits (graceful shutdown for zero-downtime deployments)

**Given** the server's CORS configuration
**When** a request arrives from an origin other than the configured allowed origin (`whoelseishere.com`)
**Then** the request is rejected with a CORS error (CORS whitelist enforcement)

**Given** the PM2 ecosystem configuration
**When** `ecosystem.config.js` is inspected
**Then** it specifies `instances: 2` for PM2 cluster mode (matching the architecture's single VPS deployment context)

*Client:*

**Given** the client package exists
**When** `npm run dev:client` is executed
**Then** a Vite dev server starts with React 19 + React Router v7
**And** routes exist for: `/event/:eventSlug` (event lobby), `/event/:eventSlug/session/:sessionSlug` (session page), `/admin/*` (admin panel)
**And** the `/event/:eventSlug` route renders `event-redirect.tsx` — an event lobby page that lists all currently active sessions for the event with links to each session page, using `trpc.session.resolveCurrentSession` to fetch the session list. This serves the optional master-QR use case (Karen's registration desk). The lobby is a placeholder in this story; full status-aware behavior ships in Story 1.5.
**And** the shared `@theme` CSS is imported and applied

*Testing Infrastructure:*

**Given** the testing infrastructure
**When** `npm run test` is executed at the root
**Then** Vitest runs across all packages via the workspace config
**And** Playwright config exists at `playwright.config.ts` with `baseURL` configured
**And** `@testing-library/react` is installed as a devDependency in the client package
**And** `@axe-core/playwright` is installed as a devDependency for accessibility testing
**And** Supertest is installed as a devDependency in the server package for API tests
**And** a sample test in each package passes

---

### Story 1.2: LinkedIn OAuth Authentication Flow

As an attendee (Alex),
I want to scan a session QR code and authenticate via LinkedIn,
So that I am added to the session's attendee list and others can see my professional identity.

**Dependencies:** Story 1.1
**Subtask — Express 5 Compatibility Spike:** Before implementing auth, verify Passport.js and `connect-pg-simple` compatibility with Express 5.2.1. Output: a brief spike result confirming compatibility, or documenting the chosen alternative (`passport@next` or manual OAuth2 flow with `openid-client`). This spike informs the implementation approach for the remaining ACs.

**Acceptance Criteria:**

**Given** Alex scans a QR code with URL `/event/rumc-mar10/session/resume-workshop` (FR1)
**When** the browser navigates to that URL
**Then** `session-page.tsx` resolves the event slug and session slug via tRPC (`trpc.session.getBySlug`) (FR6)
**And** if the session exists and is active, the authentication flow begins (FR2)
**And** if no HTTP session cookie exists, the pre-OAuth screen renders

**Given** the pre-OAuth screen is displayed
**When** Alex reads the screen
**Then** it shows: the session name, the event name, "Sign in with LinkedIn so others can find you too", and a "Continue with LinkedIn" button (`bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg w-full`)
**And** the session name and event name are stored in `sessionStorage` for the loading screen (FR8)

**Given** Alex taps "Continue with LinkedIn"
**When** the OAuth redirect initiates
**Then** Passport.js redirects to LinkedIn with minimal scope: `openid`, `profile` — name, photo, title, company only (FR5)
**And** the OAuth `state` parameter includes the `sessionId` for callback routing

**Given** Alex taps "Allow" on LinkedIn's OAuth screen
**When** the callback hits `/api/auth/linkedin/callback`
**Then** the server exchanges the auth code for an access token
**And** fetches the LinkedIn profile (name, photo URL, title, company)
**And** creates an HTTP session (stored in PostgreSQL via `connect-pg-simple`)
**And** creates an attendee record in the `attendees` table linked to the session
**And** redirects to `/event/:eventSlug/session/:sessionSlug`

**Given** the OAuth callback is processing
**When** the OAuthLoadingScreen renders
**Then** it displays: the Who Else Is Here logo (text treatment: "Who Else Is Here?" in Inter Bold, `text-primary-600`), the session name, the event name (from `sessionStorage`), and "Connecting your profile..." with animated dots
**And** the screen is vertically and horizontally centered (`min-h-screen flex items-center justify-center`)

**Given** Alex denies the LinkedIn OAuth request
**When** the callback returns with an error
**Then** the app displays: "No problem. You can scan again anytime." with a "Try Again" button (FR9)
**And** the "Try Again" button retriggers the OAuth flow
**And** no error codes or technical details are shown to the user

**Given** the LinkedIn API is unavailable during OAuth
**When** the callback fails with a network error
**Then** the app displays: "Something went wrong connecting to LinkedIn. Tap to try again." with a retry button (FR9)

**Given** Alex authenticates successfully
**When** the attendee record is created
**Then** a `scan` journey event is logged in `journey_events` with timestamp, session ID, and attendee ID (FR47)

**Given** the pre-OAuth screen or OAuthLoadingScreen is rendered
**When** an `@axe-core/playwright` accessibility scan runs
**Then** zero critical or serious violations are reported (NFR30)

**Given** the complete OAuth flow (tap "Continue with LinkedIn" → LinkedIn consent → callback → attendee list rendered)
**When** measured end-to-end
**Then** the total elapsed time is under 5 seconds on a stable connection (NFR8)

---

### Story 1.3: Real-Time Attendee List & LinkedIn Navigation

As an attendee (Alex),
I want to browse a real-time, session-scoped list of all attendees and tap any name to open their LinkedIn profile,
So that I can identify and connect with professionals at this event.

**Dependencies:** Story 1.2

**Acceptance Criteria:**

**Given** Alex has authenticated and the session page loads
**When** the attendee list renders via `trpc.attendee.listBySession({ sessionId })`
**Then** it displays all authenticated attendees for this session, sorted alphabetically by first name (FR11)
**And** each AttendeeCard has the anatomy: `[Photo 40px] [Name / Title·Company] [Chevron →]` — the chevron is right-aligned (`text-gray-400`), and the entire card row is the tap target (not just the chevron) (FR12)
**And** card text styling: name (`text-base font-semibold text-gray-900`), title·company (`text-sm text-gray-600`)
**And** Alex's own entry is visible in the list confirming successful registration (FR13)
**And** the list renders within 200ms for 100 items (NFR3)

**Given** the SessionHeader component renders
**When** Alex views the header
**Then** it shows: session name (left, `text-base font-semibold`), time range (right, `text-sm text-gray-600`), live attendee count (left, `text-sm text-gray-600`: "X professionals here") (FR14)
**And** the header is sticky (`sticky top-0 z-10 bg-white shadow-sm`)
**And** on desktop (`lg:`), the event name is also shown

**Given** the attendee list contains more items than fit in the viewport
**When** Alex scrolls
**Then** the list is virtualized via `@tanstack/react-virtual` — only visible cards are in the DOM
**And** each card has minimum height 72px with 8px gap separation
**And** scroll performance shows no frame longer than 33ms (NFR9)

**Given** a new attendee scans into the session
**When** the server broadcasts via Socket.io to room `session:{sessionId}`
**Then** the new attendee appears on Alex's list within 3 seconds without any manual refresh (FR15, FR53)
**And** if the insertion position is within the visible viewport, the card fades in (opacity 0→1, 300ms)
**And** if the insertion is off-screen, it appears silently (no animation, no scroll jump)
**And** the attendee count in the header increments
**And** users with `prefers-reduced-motion` see instant appearance (no fade)

**Given** Alex taps an attendee card on mobile (below `lg:` breakpoint)
**When** the tap registers
**Then** the browser navigates to the attendee's LinkedIn profile URL in the same tab (`target="_self"`) (FR16)
**And** the LinkedIn URL uses standard `https://linkedin.com/in/...` format (no `linkedin://` scheme)
**And** a `tap` journey event is logged with timestamp and session ID (FR48)

**Given** Alex taps an attendee card on desktop (`lg:` breakpoint and above)
**When** the tap registers
**Then** LinkedIn opens in a new tab (`target="_blank" rel="noopener noreferrer"`) (FR16)

**Given** Alex returns to the app after visiting LinkedIn (highest-risk UX failure mode per UX spec)
**When** the attendee list re-renders
**Then** the scroll position is preserved exactly where Alex left off (FR4)
**And** the list has not reshuffled
**And** on mobile (`target="_self"`): browser back navigation restores scroll position via `scrollRestoration: 'manual'` or equivalent mechanism — verified by Playwright E2E test: navigate to LinkedIn, go back, assert scroll offset matches pre-navigation position
**And** on desktop (`target="_blank"`): the original tab's scroll position is inherently preserved (new tab opened)

**Given** an attendee has no LinkedIn photo
**When** their card renders
**Then** an initials avatar displays: circle (`w-10 h-10 rounded-full bg-primary-100`), initials (`text-primary-600 font-semibold text-sm`) — first letter of first name + first letter of last name

**Given** Alex has the app open on both phone and laptop simultaneously
**When** a new attendee joins
**Then** both browser sessions receive the WebSocket broadcast and update independently (FR10)
**And** an integration test verifies: two Socket.io clients connected to the same `session:{sessionId}` room both receive the `attendee:joined` event when a new attendee is created via the API

**Given** any attendee-facing interactive element
**When** it renders
**Then** it meets WCAG 2.1 AA: `aria-label` on cards ("View {name}'s LinkedIn profile"), `min-h-11` touch targets, `focus-visible:ring-2` for keyboard navigation, `aria-live="polite"` on list container (NFR30-37)

**Given** the real-time broadcast mechanism
**When** a new attendee record is created via the API
**Then** an integration test (Supertest + Socket.io client) verifies: a connected Socket.io client in the correct `session:{sessionId}` room receives the attendee event within 3 seconds (FR53, NFR4)

**Given** the attendee list is seeded with 500 attendees (via test fixtures)
**When** a Playwright performance test scrolls the virtualized list
**Then** no frame exceeds 33ms (30fps floor) (NFR9)
**And** the list renders and becomes interactive within 200ms (NFR3)

**Given** the attendee list page is rendered
**When** an `@axe-core/playwright` accessibility scan runs
**Then** zero critical or serious violations are reported (NFR30)

---

### Story 1.4: Journey Data Capture

As the system,
I want to capture every attendee interaction with timestamps and session identifiers,
So that journey data accumulates from day one for analytics and the long-term data moat.

**Dependencies:** Story 1.3

**Acceptance Criteria:**

**Given** an attendee scans a QR code and authenticates
**When** the attendee record is created
**Then** a `scan` journey event is stored in `journey_events` with: `type='scan'`, `attendee_id`, `session_id`, `event_id`, `timestamp` (UTC), and `metadata: {}` (FR47)

**Given** an attendee taps a card to view a LinkedIn profile
**When** the tap is registered on the client
**Then** a tRPC mutation fires to log a `tap` journey event with: `type='tap'`, `attendee_id`, `session_id`, `event_id`, `timestamp`, and `metadata: { target_attendee_id }` (FR48)
**And** the journey event is persisted before the client receives acknowledgement (NFR25)
**And** the tap navigation is NOT blocked by the logging — fire-and-forget from the UI perspective

**Given** an attendee loads the attendee list page
**When** the list renders successfully
**Then** a `browse` journey event is logged with: `type='browse'`, `attendee_id`, `session_id`, `event_id`, `timestamp` (FR49)

**Given** an attendee who previously visited the session returns within the 5-day post-event window
**When** the list page loads
**Then** a `return_visit` journey event is logged with: `type='return_visit'`, `attendee_id`, `session_id`, `event_id`, `timestamp` (FR50)
**And** the system distinguishes return visits from first visits by checking existing journey events for this attendee+session

**Given** journey events are being captured
**When** the server processes any journey event
**Then** it is stored asynchronously without impacting UI response time
**And** no sensitive data is included in journey event metadata (no LinkedIn tokens, no URLs with query params)
**And** all timestamps are stored in UTC

**Given** the journey_events table
**When** queried by event_id or session_id
**Then** results are scoped to that event/session only — no cross-event data leakage (FR51)

---

### Story 1.5: Error Handling, Status Pages & Data Isolation

As an attendee (Alex),
I want to see clear, helpful messages when accessing non-active sessions, and be confident my data is isolated from other events,
So that the app feels trustworthy and informative even in edge cases.

**Dependencies:** Story 1.2

**Acceptance Criteria:**

**Given** Alex navigates to `/event/rumc-mar10/session/nonexistent-slug`
**When** the session slug cannot be resolved
**Then** a full-screen centered message displays: "This session isn't available. The event may have ended." (FR7)
**And** no retry button is shown — the session genuinely doesn't exist
**And** if organizer contact info is available, it is displayed

**Given** Alex navigates to a session with status `archived`
**When** the page loads
**Then** `SessionStatusScreen` renders inline: "[Session Name] at [Event Name] has ended and been archived." (FR7)

**Given** Alex navigates to a session with status `draft` (not yet started)
**When** the page loads
**Then** `SessionStatusScreen` renders inline: "This session hasn't started yet. Come back at [scheduledStart]." with the session name and event name displayed (FR7)

**Given** an attendee is authenticated for Event A
**When** they attempt to access attendee data for Event B via the API
**Then** the tRPC procedure returns `NOT_FOUND` or `UNAUTHORIZED` — zero cross-event data is exposed (FR51)
**And** all tRPC procedures that return attendee or journey data include an event-scoped `WHERE` clause

**Given** skeleton loading cards are shown during initial list load
**When** data arrives from the server
**Then** skeleton cards (`bg-gray-100 animate-pulse` rectangles matching card layout) are replaced with real AttendeeCards
**And** users with `prefers-reduced-motion` see static gray rectangles instead of pulse animation

**Given** any tRPC query fails with a server error
**When** the error is displayed to the user
**Then** the message is user-friendly (no stack traces, no error codes)
**And** the error is logged server-side via Pino with `{ error, context, requestId }`

**Given** any SessionStatusScreen (draft, post_event, archived) or error state page is rendered
**When** an `@axe-core/playwright` accessibility scan runs
**Then** zero critical or serious violations are reported (NFR30)

---

## Epic 2: PWA, Offline Resilience & Cold Start

Alex's experience survives WiFi drops and early arrivals — cached list browsing, cold-start retention messaging, search at scale, and seamless WebSocket reconnection with missed-update delivery.

**FRs covered:** FR17, FR18, FR19, FR20, FR21, FR22, FR23, FR54 (8 FRs)
**User Journeys:** Journey 2 (Alex Cold Start), Journey 3 (Alex Connectivity Failure)
**Dependencies:** Builds on Epic 1.

### Story 2.1: PWA Service Worker & Offline Attendee Browsing

As an attendee (Alex),
I want the attendee list to remain browsable when WiFi drops and LinkedIn URLs to be copyable when navigation fails,
So that the app stays useful on unreliable conference WiFi.

**Dependencies:** Story 1.3

**Acceptance Criteria:**

**Given** Alex has loaded the attendee list while online
**When** WiFi drops (WebSocket disconnects for >5 seconds)
**Then** an offline indicator pill appears in the SessionHeader: "Offline" (`bg-warning-50 text-warning-500 text-xs font-medium px-2 py-0.5 rounded-md`) (FR19)
**And** the attendee list remains fully scrollable from service worker cache (FR18)
**And** the attendee count freezes at the last known value

**Given** Alex is offline and taps an attendee card
**When** the LinkedIn navigation fails (no connectivity)
**Then** a fallback displays: "Can't open LinkedIn. Copy link for later: linkedin.com/in/jane-smith" with a copy button (FR17)
**And** the copy button copies the URL to clipboard
**And** a "Copied!" confirmation appears for 2 seconds

**Given** Alex is offline and taps an attendee card
**When** cellular data is available (WiFi down but mobile data up)
**Then** LinkedIn opens normally via cellular connection

**Given** WiFi reconnects after an offline period
**When** the WebSocket reconnects
**Then** the offline indicator disappears silently (no toast, no modal) (FR20)
**And** the attendee list refreshes with any new attendees who joined during the offline period
**And** the attendee count updates to the current value

**Given** the PWA service worker is configured via vite-plugin-pwa
**When** the app is installed or first visited
**Then** the service worker caches the app shell and current attendee data
**And** the total PWA cache payload is under 2MB (NFR7)
**And** a web app manifest enables "Add to Home Screen" on mobile

---

### Story 2.2: Cold Start Messaging & Search Filter

As an attendee (Alex),
I want encouraging messages when few people have scanned and a search filter when the list grows large,
So that I stay engaged from early arrival through peak attendance.

**Dependencies:** Story 1.3
**Note:** The `SessionStatusScreen` for `post_event` and `archived` statuses renders the UI shell in this story. Full post-event access behavior (read-only list, feedback prompt, 5-day window) is delivered in Story 4.3.
**Note:** FR23 says ">15" for messaging removal. The UX spec clarifies this with four tiers: 1-4, 5-14, 15-19, 20+. Messaging disappears at the 20 threshold; search icon appears at 20+. The ACs below follow the UX spec's refined thresholds.

**Acceptance Criteria:**

**Given** the attendee count is 0
**When** Alex is the first to authenticate
**Then** a message appears: "You're the first one here! Others will appear as they scan the QR code." with subtle animated dots (`text-center text-gray-600 py-12`)
**And** users with `prefers-reduced-motion` see static text (no animated dots)

**Given** the attendee count is 1-4
**When** the ColdStartMessage renders below the attendee list
**Then** it displays: "You're among the first! The list is growing live. New connections appear automatically." (FR21)
**And** styling: `bg-primary-50 text-primary-600 text-sm rounded-lg p-4 mx-4 mt-4`
**And** the count number within the message is `font-semibold`

**Given** the attendee count is 5-14
**When** the ColdStartMessage updates
**Then** it displays: "[X] professionals have joined. The list is growing — stay tuned." (FR22)
**And** the message transitions via crossfade (current fades out 200ms, new fades in 300ms)
**And** users with `prefers-reduced-motion` see an instant swap

**Given** the attendee count is 15-19
**When** the ColdStartMessage updates
**Then** it displays: "[X] professionals and counting. New attendees joining every minute."

**Given** the attendee count reaches 20
**When** the threshold is crossed
**Then** the ColdStartMessage fades out and disappears (FR23)
**And** a search icon appears in the SessionHeader (right-aligned, `w-5 h-5 text-gray-400`)

**Given** the search icon is visible (≥20 attendees)
**When** Alex taps the search icon
**Then** the `SearchFilter` component (UX spec Phase 2) expands as an input: `w-full px-3 py-2 text-sm rounded-md border border-gray-200`, placeholder "Search by name, title, or company"
**And** focus is auto-set to the input

**Given** Alex types in the SearchFilter
**When** text is entered
**Then** the attendee list filters instantly (client-side, case-insensitive match against name, title, and company)
**And** no debounce is needed (filtering ≤500 local items)
**And** if zero matches: "No one matches '[query]'. Try a different name, title, or company." displays centered in the list area

**Given** the SearchFilter is active
**When** Alex taps the clear button (✕) or presses Escape
**Then** the filter text clears, the full list restores, and the search input closes
**And** the SearchFilter has `role="search"` and `aria-label="Filter attendees"`

**Given** a session has status `draft` (not yet started)
**When** the session page loads
**Then** `SessionStatusScreen` renders inline: session name, event name, "This session hasn't started yet. Come back at [scheduledStart]." (`gray-50 bg, text-sm gray-700, rounded-lg p-6 mx-4 mt-8`)

**Given** a session has status `post_event` (within 5-day window)
**When** the session page loads
**Then** `SessionStatusScreen` renders a banner: "This session has ended. Browse the attendee list until [postEventEndsAt]." above a read-only attendee list

**Given** a session has status `archived` (5-day window expired)
**When** the session page loads
**Then** `SessionStatusScreen` renders: "[sessionName] at [eventName] has ended and been archived."

**Given** the cold start or search filter page is rendered
**When** an `@axe-core/playwright` accessibility scan runs
**Then** zero critical or serious violations are reported (NFR30)

---

### Story 2.3: WebSocket Reconnection with Missed Updates

As an attendee (Alex),
I want the app to automatically reconnect after a connection drop and catch up on any attendees who joined while I was disconnected,
So that my list is always current without manual refresh.

**Dependencies:** Story 2.1

**Acceptance Criteria:**

**Given** Alex's WebSocket connection drops
**When** the client detects disconnection
**Then** Socket.io automatically attempts reconnection with exponential backoff: initial 1 second, doubling each attempt, maximum 30 seconds (FR54)
**And** the client tracks `lastReceivedTimestamp` of the most recent attendee update

**Given** reconnection succeeds
**When** the client reconnects to the server
**Then** the client sends `{ lastTimestamp }` to the server
**And** the server delivers all attendee updates since that timestamp
**And** the client merges updates into the existing list (no full reload)
**And** the offline indicator disappears
**And** new attendees from the missed period appear in the list (with fade-in if in viewport)

**Given** reconnection fails after 60 seconds of attempts
**When** the maximum retry window expires
**Then** the client displays the offline indicator (FR19)
**And** falls back to cached list browsing (FR18)
**And** continues reconnection attempts in the background

**Given** the WebSocket reconnects
**When** the list updates with missed attendees
**Then** keyboard focus position is NOT disrupted (NFR37)
**And** screen reader users are notified via `aria-live="polite"` region without focus displacement

**Given** this is the #1 E2E test risk item per Architecture
**When** a Playwright E2E test runs
**Then** it verifies the full reconnection sequence:
1. Given a loaded attendee list with N attendees, when `context.setOffline(true)` is set, then the offline indicator appears within 5 seconds
2. While offline, a new attendee is added to the session via the API (server-side)
3. When connectivity is restored via `context.setOffline(false)`, then: the offline indicator disappears, the missed attendee appears in the list (N+1 total), and the client did NOT perform a full page reload (reconnection was seamless)
4. The exponential backoff is configured: initial 1s, max 30s (FR54) — verified via Socket.io client config assertion

---

## Epic 3: Admin Event & Session Management

Carlos creates events with concurrent sessions and generates per-session QR codes with print-ready signage for Karen to deploy in each room.

**FRs covered:** FR26, FR27, FR28, FR29, FR30, FR52 (6 FRs)
**User Journeys:** Journey 5 (Carlos System Operator), Journey 4 (Karen — setup portion)
**Dependencies:** Standalone. Creates events/sessions that Epic 1 attendees use.

### Story 3.1: Admin Authentication & Dashboard Shell

As an admin (Carlos),
I want to log into a secure admin panel with a clean dashboard layout,
So that I can manage events and sessions for my pilots.

**Dependencies:** Story 1.1

**Acceptance Criteria:**

**Given** Carlos navigates to `/admin`
**When** no admin session exists
**Then** a login form displays with email and password fields (FR26)
**And** the form uses inline validation on blur (`text-error-600` below field, `border-error-500` ring)

**Given** Carlos enters valid credentials (matching `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables)
**When** the form is submitted
**Then** an admin session is created (stored in PostgreSQL)
**And** Carlos is redirected to the admin dashboard
**And** the session persists across page reloads

**Given** Carlos enters invalid credentials
**When** the form is submitted
**Then** an error message displays: "Invalid email or password." (no indication of which field is wrong)
**And** the admin login endpoint has aggressive rate limiting to prevent brute-force attacks

**Given** Carlos is logged in
**When** the admin dashboard renders
**Then** it shows: "Who Else Is Here · Admin" header, tab navigation (Events | Analytics | Settings), and a list of all events (FR33)
**And** on desktop (`lg:`): left sidebar navigation, always visible
**And** on mobile: bottom tab bar

**Given** the admin panel is accessed without authentication
**When** any admin tRPC procedure is called
**Then** it returns `UNAUTHORIZED` (NFR14)

**Given** the database schema includes role-based access
**When** an admin record is created
**Then** it includes a `role` field with values `super_admin` or `event_admin` (FR52)
**And** MVP uses only `super_admin` — role enforcement is deferred but schema is ready

**Given** the admin login and dashboard pages are rendered
**When** an `@axe-core/playwright` accessibility scan runs
**Then** zero critical or serious violations are reported (NFR30)

---

### Story 3.2: Event & Session Creation

As an admin (Carlos),
I want to create events with multiple concurrent sessions including name, time, room, and agenda,
So that each session is ready for QR code generation and attendee scanning.

**Dependencies:** Story 3.1

**Acceptance Criteria:**

**Given** Carlos is on the admin dashboard
**When** he clicks "Create Event"
**Then** the EventForm renders with fields: event name (required), venue (required), slug (auto-generated from name, editable), and description (optional) (FR27)
**And** the event slug auto-generates as kebab-case from the event name (e.g., "RUMC Job Networking" → `rumc-job-networking`)

**Given** Carlos has created an event
**When** he adds sessions
**Then** each session form includes: session name (required), room number/location (required), date (required), start time (required), end time (required) (FR27)
**And** session slug auto-generates as kebab-case from the session name (e.g., "Resume Workshop" → `resume-workshop`), editable by the admin
**And** an agenda text field accepts free-form agenda content per event (FR28)

**Given** Carlos is creating sessions for a multi-room event (e.g., RUMC with 7 concurrent sessions)
**When** he adds sessions
**Then** he can add multiple sessions to the same event with different rooms and time slots
**And** there is no overlap validation — concurrent sessions are the norm
**And** the form supports bulk creation (add session, save, add another)

**Given** Carlos saves a new event with sessions
**When** the tRPC mutation succeeds
**Then** the event and all sessions are persisted in the database
**And** each session has status `draft`
**And** a success toast appears: "Event created successfully" (`bg-success-50 border-success-200 text-success-700`, auto-dismiss 3s)

**Given** form validation
**When** a required field is left blank and the field loses focus
**Then** an inline error appears below the field in `text-error-600`
**And** the submit button is disabled until all required fields are valid

---

### Story 3.3: Per-Session QR Code Generation & Print-Ready Signage

As an admin (Carlos),
I want to generate and download a print-ready QR code image per session with the session name, room, and URL,
So that Karen can place the correct sign in each room at her event.

**Dependencies:** Story 3.2

**Acceptance Criteria:**

**Given** an event with sessions exists
**When** Carlos views the event's session list in admin
**Then** each session shows a "QR Code" action link (FR29)

**Given** Carlos clicks "QR Code" for a session
**When** the QR code generates
**Then** a QR code is generated encoding the URL `/event/:eventSlug/session/:sessionSlug` (FR29)
**And** the short URL is displayed as visible text below the QR code (e.g., `whoelseishere.com/event/rumc-mar10/session/resume-workshop`)
**And** the QR code URL is displayed in `font-mono text-sm bg-gray-50 px-3 py-2 rounded-md` with a copy button

**Given** a QR code has been generated
**When** Carlos clicks "Download"
**Then** a print-ready image downloads containing: the QR code graphic, the session name (e.g., "Resume Workshop"), the room number/location (e.g., "Room 101"), the session short URL as visible text, and the prompt "Who Else Is Here? Scan to see." (FR30)
**And** the image is high-resolution (suitable for table tents and banners)

**Given** a multi-session event (e.g., 7 sessions at RUMC)
**When** Carlos views all sessions
**Then** he can generate and download QR codes for all sessions individually
**And** each printable sign uniquely identifies its session so Karen places the correct sign in each room

---

## Epic 4: Session Hop, Event Lifecycle & Post-Event

Alex hops between concurrent sessions without re-authentication. Events automatically transition through their lifecycle. Attendees access the list post-event and submit feedback. Data is retained and eventually anonymized.

**FRs covered:** FR3, FR24, FR25, FR41, FR42, FR43, FR44, FR45, FR50b, FR55 (10 FRs)
**User Journeys:** Journey 3b (Alex Session Hop), Journey 1 (post-event resolution), System-as-Actor behaviors
**Dependencies:** Builds on Epic 1. Production use requires Epic 3.

### Story 4.1: Frictionless Session Hop

As an attendee (Alex),
I want to scan a QR code at a new session room and immediately see that room's attendee list without re-authenticating,
So that I can explore multiple sessions at a multi-room event without friction.

**Dependencies:** Stories 1.2, 1.4

**Acceptance Criteria:**

**Given** Alex has already authenticated at Session A (HTTP session cookie exists)
**When** Alex scans the QR code for Session B (`/event/rumc-mar10/session/interview-skills`)
**Then** the browser navigates to Session B's page
**And** the server detects the existing HTTP session cookie — no OAuth redirect occurs (FR55)
**And** the server creates a new attendee record in Session B using the cached LinkedIn profile from the existing session
**And** Session B's attendee list renders with Alex included
**And** total elapsed time from QR scan to rendered list is under 4 seconds (NFR9b)

**Given** Alex hops from Session A to Session B
**When** the attendee record is created in Session B
**Then** a `session_switch` journey event is logged on Session A with: `type='session_switch'`, `attendee_id`, `session_id` (Session A), `event_id`, `timestamp`, `metadata: { new_session_id: Session B's ID }` (FR50b)

**Given** Alex has hopped to 3 sessions during an event
**When** the journey data is queried
**Then** Alex's full cross-session path is traceable: Session A → Session B → Session C with timestamps

**Given** Alex scans a QR for a session they've already visited
**When** the page loads
**Then** the existing attendee record is reused — no duplicate created
**And** no additional `session_switch` event is logged (already visited)
**And** the attendee list renders normally

**Given** the session hop is the #4 E2E test risk item per Architecture
**When** a Playwright E2E test runs
**Then** it verifies: given a user authenticated in Session A, when navigating to Session B's URL, then the attendee list loads without an OAuth prompt and within 4 seconds (NFR9b)

---

### Story 4.2: Event Lifecycle Automation

As the system,
I want to automatically transition sessions and events through their lifecycle based on scheduled times,
So that no manual admin intervention is needed for post-event and archival transitions.

**Dependencies:** Stories 1.1, 3.2 (sessions must exist in the database)

**Acceptance Criteria:**

**Given** the server is running
**When** the `event-lifecycle.ts` service initializes
**Then** a `node-cron` job starts running every 60 seconds (FR41)
**And** the cron job initializes on server startup and runs continuously via PM2

**Given** a session has `status = 'active'` and `scheduled_end < now()`
**When** the cron job executes
**Then** the session's status transitions to `post_event` (FR41)
**And** the session's `post_event_ends_at` is set to `scheduled_end + 5 days`
**And** QR code scanning is disabled for this session — new OAuth flows for this session are rejected (FR42)
**And** existing authenticated attendees can still browse the read-only attendee list

**Given** a session has `status = 'post_event'` and `post_event_ends_at < now()`
**When** the cron job executes
**Then** the session's status transitions to `archived` (FR43)

**Given** sessions within an event have mixed statuses
**When** the cron job updates session statuses
**Then** it derives the event's status: if ANY session is `active` → event is `active`; if ALL sessions are `post_event` or `archived` → event is `post_event`; if ALL sessions are `archived` → event is `archived` (FR41)
**And** concurrent sessions that end at different times transition independently

**Given** an event is archived
**When** the data is queried
**Then** all event data (attendees, journey events, sessions) is retained for analytics (FR44)
**And** the attendee list is no longer accessible to attendees

**Given** an archived event is older than 12 months from its event end date
**When** a separate daily scheduled task (a conditional branch in the lifecycle cron, or a standalone cron) checks for events where the latest `session.scheduled_end + 12 months < now()`
**Then** attendee personal data (name, photo URL, LinkedIn profile URL) is replaced with anonymized identifiers (FR45)
**And** event-level aggregate analytics and timestamp data are retained
**And** journey event timestamps and types are preserved (only attendee identifiers anonymized)

---

### Story 4.3: Post-Event Access & Feedback

As an attendee (Alex),
I want to access the attendee list for 5 days after the event and submit feedback about my experience,
So that I can follow up on connections and share what I thought.

**Dependencies:** Stories 1.3, 4.2

**Acceptance Criteria:**

**Given** a session has status `post_event` (within 5-day window)
**When** Alex navigates to the session URL
**Then** the attendee list renders in read-only mode (FR3)
**And** a banner displays: "This session has ended. Browse the attendee list until [postEventEndsAt formatted date]."
**And** new OAuth scans are disabled — only previously authenticated attendees can access
**And** Alex can browse the full attendee list (scroll, search) exactly as during the active session
**And** Alex can still tap names to visit LinkedIn profiles — one-tap LinkedIn navigation remains fully functional (FR16)
**And** the visit is logged as a `return_visit` journey event (FR50)

**Given** Alex accesses the post-event list from a desktop (laptop at home)
**When** the page renders at `lg:` breakpoint
**Then** the layout shifts to the denser desktop view: `max-w-2xl mx-auto`, `hover:bg-gray-50` on cards, `target="_blank"` for LinkedIn links, event name visible in header

**Given** Alex is browsing the post-event list
**When** the feedback prompt has not been shown to this attendee before
**Then** a single feedback prompt appears (triggered once per attendee): "How was your experience? Anything you wish this app could do?" (FR25)
**And** the prompt includes a text area for unstructured feedback and a "Submit" button
**And** a "Dismiss" option is available — feedback is optional

**Given** Alex submits feedback
**When** the text is submitted
**Then** it is stored in the `feedback` table with: `attendee_id`, `session_id`, `event_id`, `text`, `timestamp` (FR24)
**And** a confirmation displays: "Thanks for your feedback!"
**And** the prompt does not appear again for this attendee on subsequent visits

**Given** Alex dismisses the feedback prompt
**When** dismissed
**Then** the prompt does not appear again for this attendee

**Given** a session's 5-day window has expired (status `archived`)
**When** Alex navigates to the session URL
**Then** `SessionStatusScreen` displays: "[sessionName] at [eventName] has ended and been archived."
**And** no attendee list is shown

---

## Epic 5: Admin Monitoring, Analytics & Reports

Karen monitors live events, views per-session analytics, and generates screenshot-ready reports that prove her events create value.

**FRs covered:** FR31, FR32, FR33, FR34, FR35, FR36, FR37, FR38, FR39, FR40, FR46 (11 FRs)
**User Journeys:** Journey 4 (Karen — monitoring & report portion)
**Dependencies:** Builds on Epics 3 and 4.

### Story 5.1: Real-Time Monitoring Dashboard

As an admin (Carlos),
I want to monitor live events with real-time scan counts, tap activity, and system health,
So that I know the system is working during a live pilot.

**Dependencies:** Stories 3.1, 1.4

**Acceptance Criteria:**

**Given** Carlos is logged into the admin panel during an active event
**When** the monitoring dashboard loads
**Then** it displays live metrics that update in real-time: total scan count across all sessions, total LinkedIn taps, and system health indicators (server responsiveness, WebSocket connection count) (FR31, FR32)
**And** metrics update via WebSocket — no manual refresh needed

**Given** Carlos is a super-admin
**When** the dashboard loads
**Then** all active events are visible simultaneously (FR33)
**And** each event shows: event name, status, total attendees, total taps

**Given** an event has status transitions
**When** the admin views the event
**Then** the lifecycle status is displayed with a countdown timer: "Post-event access: 4 days 16 hours remaining" (FR46)
**And** status badges show: 🟢 Live (`text-success-500`), ⏳ Upcoming (`text-warning-500`), ✓ Ended (`text-gray-400`), 📦 Archived (`text-gray-300`)

**Given** the event has multiple concurrent sessions
**When** Carlos views the event in admin
**Then** the `SessionList` component renders all sessions as cards (not tabs — 7+ concurrent sessions don't fit in a tab bar)
**And** each session card shows: session name, room, status badge, attendee count, tap count, activation rate, and action links (View, QR Code, Export Report)
**And** a cross-session summary shows: "X attendees scanned 2+ sessions"
**And** "← Back to sessions" link in session detail returns to the session list (drill-down navigation)

---

### Story 5.2: Per-Session Analytics & Journey Data View

As an admin (Carlos/Karen),
I want to view per-session analytics including scan count, activation rate, tap metrics, activity timeline, and attendee journey data,
So that I can understand how attendees engage with each session.

**Dependencies:** Story 5.1

**Acceptance Criteria:**

**Given** Carlos drills into a specific session from the SessionList
**When** the session detail view loads
**Then** `MetricCard` components display headline metrics: attendee count (`text-4xl font-extrabold`), LinkedIn taps, activation rate (taps/attendees percentage) (FR36, FR37)
**And** metric cards are arranged in a grid: `grid-cols-2 gap-4` on mobile, `lg:grid-cols-4 gap-6` on desktop
**And** each metric card: `bg-white rounded-lg shadow-md p-6 text-center`

**Given** the session detail view is loaded
**When** the ActivityTimeline component renders
**Then** it displays a simple bar chart showing scan and tap activity over the session duration (FR38)
**And** the peak activity bar is annotated: "peak: 2:30 PM"
**And** the chart uses a lightweight library or CSS bar chart (admin bundle has more freedom — code-split from attendee bundle)

**Given** Carlos views session analytics
**When** the distraction health metric is displayed
**Then** it shows the ratio of profile taps occurring during the session's active time slot versus outside it (FR40)
**And** with concurrent sessions, this metric is per-session — there is no single "break" time across the event

**Given** Carlos views attendee journey data
**When** the journey data table renders
**Then** it shows per-attendee: scan timestamp, number of profile taps, return visits, and session switches (FR39)
**And** data is scoped to the selected session

---

### Story 5.3: Post-Event Summary Report & Export

As an admin (Karen via Carlos),
I want to generate a screenshot-ready summary report for a session and export it in a shareable format,
So that I can forward it to stakeholders as proof that my event creates professional value.

**Dependencies:** Story 5.2, Story 4.2 (sessions must have post_event or archived status)

**Acceptance Criteria:**

**Given** a session is in `post_event` or `archived` status
**When** Carlos clicks "Export Report" for the session
**Then** the `SessionReport` component renders at `/admin/event/[slug]/session/[slug]/report` (FR34)
**And** it displays: session name, date, venue, attendee count, total LinkedIn taps, activation rate, peak activity time, and an activity timeline chart
**And** all metrics use plain English labels ("127 LinkedIn connections facilitated", not "127 tap events logged")
**And** the layout passes Karen's Screenshot Test: if screenshotted and forwarded with zero context, it communicates value

**Given** the report is displayed
**When** Carlos uses the browser screenshot tool or device screenshot
**Then** the page renders cleanly with no developer-facing language, no debug info, no raw IDs
**And** numbers are large (`text-3xl font-bold`), labels are clear (`text-sm text-gray-600`), and the visual hierarchy tells a story without narration

**Given** the report needs to be shared
**When** Carlos clicks "Export"
**Then** the report page renders without admin navigation chrome, with `@media print` styles for clean printing (FR35)
**And** the "Export" button triggers `window.print()` for browser-native print/save-as-PDF
**And** PDF export via server-side generation is deferred to Phase 3
**And** the exported/printed format includes all metrics and the activity timeline chart

**Given** Karen receives the report
**When** she reviews it
**Then** it shows narrative metrics: "38 professionals attended", "127 LinkedIn connections facilitated", "69% activation rate", "Peak activity: during the break"
**And** no technical jargon, no developer terminology, no raw database values

---

## Marketing Website (Standalone Mini-Epic)

Static landing page at the domain root for organizer acquisition. Shares Tailwind `@theme` config with the web app for visual consistency.

**FRs covered:** None (MVP priority item #17)
**Dependencies:** None — can ship at any point.

### Story M.1: Static Marketing Landing Page

As a potential organizer (Karen),
I want to visit the domain root and understand what Who Else Is Here offers,
So that I am persuaded to contact Carlos to deploy it at my event.

**Dependencies:** Story 1.1 (shared `@theme` CSS)

**Acceptance Criteria:**

**Given** a visitor navigates to `whoelseishere.com/`
**When** the page loads
**Then** a static HTML + Tailwind CSS landing page renders (no React, no JavaScript framework)
**And** the page shares the same `@theme` tokens as the web app (same indigo palette, Inter font, spacing grid) for visual consistency
**And** the page loads in under 2 seconds on a 4G connection

**Given** the landing page is rendered
**When** a search engine crawls it
**Then** proper SEO elements are present: `<title>`, `<meta name="description">`, Open Graph tags, structured data
**And** the web app routes (`/event/*`) have `<meta name="robots" content="noindex">` — only the marketing site is indexed

**Given** the landing page content
**When** a visitor reads it
**Then** it answers: "What is this?" (real-time attendee directory for events), "How does it work?" (scan QR → see everyone → tap to connect on LinkedIn), and "How do I get it?" (contact Carlos)
**And** the call-to-action is clear and prominent

**Given** the marketing site is deployed
**When** Nginx receives a request to the domain root
**Then** it serves the static HTML directly from `/var/www/whoelseishere.com/`
**And** requests to `/event/*`, `/api/*`, and `/socket.io/*` are proxied to the Express server on port 3001

**Given** the marketing site is deployed
**When** a visitor navigates to `/privacy`
**Then** a privacy policy page is accessible at a stable URL (NFR17)
**And** it covers: what LinkedIn data is collected (name, photo, title, company only), how event data is used, the 12-month retention and anonymization policy, and contact information for data inquiries
