---
stepsCompleted: ['step-01-detect-mode', 'step-02-load-context', 'step-03-risk-and-testability', 'step-04-coverage-plan', 'step-05-generate-output']
lastStep: 'step-05-generate-output'
lastSaved: '2026-03-01'
workflowType: 'testarch-test-design'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/epics.md'
---

# Test Design for QA: Who Else Is Here

**Purpose:** Test execution recipe for QA team. Defines what to test, how to test it, and what QA needs from other teams.

**Date:** 2026-03-01
**Author:** Murat (TEA Master Test Architect)
**Status:** Draft
**Project:** who-else-is-here

**Related:** See Architecture doc (`test-design-architecture.md`) for testability concerns and architectural blockers.

---

## Executive Summary

**Scope:** System-level test design for a real-time, event-scoped attendee directory. Single-page attendee list with QR code entry, LinkedIn OAuth, WebSocket real-time updates, admin panel with analytics. Monorepo (client + server + shared + marketing) deployed on single-server Contabo VPS via Docker Compose.

**Risk Summary:**

- Total Risks: 14 (1 critical score 9, 2 high score 6, 8 medium, 3 low)
- Critical Categories: TECH (test infrastructure), SEC (auth boundaries)

**Coverage Summary:**

- P0 tests: ~12 (critical paths, auth, data isolation, admin RBAC)
- P1 tests: ~16 (lifecycle, journey data, cross-browser, accessibility, real-time UI)
- P2 tests: ~14 (edge cases, Docker, empty states, nginx routing, session resolver)
- P3 tests: ~5 (benchmarks, exploratory, polish)
- **Total**: ~47 tests (~1.5-2.5 weeks with 1 QA engineer)

---

## Not in Scope

**Components or systems explicitly excluded from this test plan:**

| Item | Reasoning | Mitigation |
|---|---|---|
| **LinkedIn API availability** | External dependency; cannot guarantee uptime in tests | All tests use JWT fixtures or HTTP-level mocks; zero LinkedIn network calls |
| **Camera QR scanning** | Hardware-dependent; cannot automate camera in Playwright | QR generates a URL; tests validate session join via URL directly |
| **Nginx SSL/TLS certificate** | Infrastructure concern outside application scope | Manual validation during deployment; HTTPS enforced in production nginx config |
| **Marketing site content** | Static HTML; no dynamic logic to test | Visual spot-check; nginx routing smoke test (P2-013) validates reachability |
| **Load testing >500 users** | Exceeds MVP scale targets; requires k6 infrastructure | Deferred to post-GA; weekly P2-004 validates 50 concurrent WebSocket connections |

**Note:** Items listed here have been reviewed and accepted as out-of-scope.

---

## Dependencies & Test Blockers

**CRITICAL:** QA cannot proceed without these items from other teams.

### Backend/Architecture Dependencies (Pre-Implementation)

**Source:** See Architecture doc "Quick Guide" for detailed mitigation plans

1. **R-002: Drizzle ORM Test Fixtures** — Backend Dev — Pre-implementation
   - QA needs: `packages/server/test/fixtures/seed.ts` with transaction-wrapped data creation + auto-cleanup
   - Why it blocks: Without programmatic test data, no integration or E2E test can run
   - Pattern: Playwright fixture with `use()` + teardown (see factory pattern below)

2. **R-003: createTestJWT() Utility** — Backend Dev — Pre-implementation
   - QA needs: `packages/shared/test/auth.ts` exporting `createTestJWT(userId, claims)` that produces valid JWTs
   - Why it blocks: Every authenticated test requires a JWT; cannot depend on LinkedIn OAuth in tests

3. **WebSocket Event Contract** — Backend Dev / Architect — Pre-implementation
   - QA needs: TypeScript types for all WebSocket events (event names, payload shapes, ordering guarantees)
   - Why it blocks: Cannot write deterministic WebSocket assertions without knowing event structure

### QA Infrastructure Setup (Pre-Implementation)

1. **Test Data Factories** — QA
   - Event factory: `createEvent({ name, startDate, endDate, maxSessions })`
   - Session factory: `createSession({ eventId, name, qrCode })`
   - Attendee factory: `createAttendee({ sessionId, linkedInProfile })`
   - Auto-cleanup fixtures for parallel safety (faker-based unique data)

2. **Test Environments** — QA
   - Local: Docker Compose `--profile dev` + Playwright against `localhost:3002`
   - CI/CD: Docker Compose in GitHub Actions + Playwright with 4 shards
   - No staging needed for MVP (single-server deployment)

**Factory pattern:**

```typescript
// packages/server/test/fixtures/database.ts
import { test as base } from '@playwright/test';
import { db } from '../../src/db';
import { events, sessions, attendees } from '../../src/db/schema';
import { faker } from '@faker-js/faker';

type DatabaseFixture = {
  seedEvent: (overrides?: Partial<typeof events.$inferInsert>) => Promise<typeof events.$inferSelect>;
  seedSession: (eventId: string, overrides?: Partial<typeof sessions.$inferInsert>) => Promise<typeof sessions.$inferSelect>;
  seedAttendee: (sessionId: string, overrides?: Partial<typeof attendees.$inferInsert>) => Promise<typeof attendees.$inferSelect>;
};

export const test = base.extend<DatabaseFixture>({
  seedEvent: async ({}, use) => {
    const createdIds: string[] = [];

    const seedEvent = async (overrides = {}) => {
      const event = await db.insert(events).values({
        name: faker.company.catchPhrase(),
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        ...overrides,
      }).returning();
      createdIds.push(event[0].id);
      return event[0];
    };

    await use(seedEvent);

    // Auto-cleanup
    for (const id of createdIds) {
      await db.delete(events).where(eq(events.id, id));
    }
  },
  // ... similar for seedSession, seedAttendee
});
```

---

## Risk Assessment

**Note:** Full risk details in Architecture doc. This section summarizes risks relevant to QA test planning.

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Score | QA Test Coverage |
|---|---|---|---|---|
| **R-002** | TECH | No test data seeding strategy | **9** | Blocker: must be resolved before any test. Validated by first passing integration test. |
| **R-003** | TECH | LinkedIn OAuth mock undefined | **6** | P0-002 (OAuth flow mock), P0-003 (JWT creation), P0-004 (scope enforcement) |
| **R-014** | SEC | Admin panel unauthorized access | **6** | P0-007 (RBAC 403), P0-008 (admin CRUD with valid JWT) |

### Medium/Low-Priority Risks

| Risk ID | Category | Description | Score | QA Test Coverage |
|---|---|---|---|---|
| R-001 | SEC | OAuth token theft/replay | 4 | P0-009 (expired token), P0-010 (missing token) |
| R-004 | PERF | WebSocket scaling | 4 | P2-004 (50 concurrent connections) |
| R-005 | DATA | Session isolation failure | 3 | P0-005 (multi-tenant isolation) |
| R-006 | SEC | LinkedIn scope creep | 3 | P0-004 (minimal scope assertion) |
| R-007 | BUS | QR code collision | 3 | P1-008 (uniqueness unit test) |
| R-008 | TECH | WebSocket message ordering | 4 | P0-006 (broadcast), P1-009 (reconnection), P1-015 (dual-context UI) |
| R-009 | OPS | Docker dev/prod drift | 2 | P2-008, P2-009 (profile startup tests) |
| R-010 | SEC | SQL injection | 3 | P0-011 (Zod schema enforcement) |
| R-011 | PERF | Cold start >30s | 4 | P1-003 (PWA), P1-004 (Lighthouse CI) |
| R-012 | BUS | Post-event access miscalculation | 4 | P1-001 (5-day window), P2-001 (boundary edge case) |
| R-013 | DATA | Journey event data loss | 2 | P1-006 (journey events logged) |

---

## Entry Criteria

**QA testing cannot begin until ALL of the following are met:**

- [ ] Drizzle ORM test fixtures implemented (R-002 resolved)
- [ ] `createTestJWT()` utility available (R-003 resolved)
- [ ] WebSocket event contract documented (TypeScript types)
- [ ] Docker Compose dev profile starts successfully
- [ ] Database schema finalized and migrations applied
- [ ] At least one tRPC route implemented end-to-end (smoke test target)

## Exit Criteria

**Testing phase is complete when ALL of the following are met:**

- [ ] All P0 tests passing (12/12 = 100%)
- [ ] All P1 tests passing or triaged (≥15/16 = 95%)
- [ ] No open high-priority / high-severity bugs
- [ ] axe-core accessibility scan: zero critical/serious violations
- [ ] Performance baseline: <30s cold start on 4G (Lighthouse CI)
- [ ] Admin RBAC verified: unauthenticated/attendee → 403 on all admin routes

---

## Test Coverage Plan

**IMPORTANT:** P0/P1/P2/P3 = **priority and risk level** (what to focus on if time-constrained), NOT execution timing. See "Execution Strategy" for when tests run.

### P0 (Critical)

**Criteria:** Blocks core functionality + High risk (≥6) + No workaround + Affects majority of users

| Test ID | Requirement | Test Level | Risk Link | Notes |
|---|---|---|---|---|
| **P0-001** | FR1: Session join via URL → attendee list renders | E2E | R-007 | QR generates URL; test validates URL→auth→join→list |
| **P0-002** | FR2: LinkedIn OAuth authentication flow | Integration | R-003 | HTTP-level mock of LinkedIn callback |
| **P0-003** | FR2: JWT token creation after OAuth | Unit | R-001 | Verify token claims, expiry, signing algorithm |
| **P0-004** | FR5: LinkedIn OAuth minimal scope | Integration | R-006 | Assert only name/photo/title/company requested |
| **P0-005** | FR51-52: Multi-tenant data isolation | Integration | R-005 | Session A attendee cannot see session B data |
| **P0-006** | FR53-54: WebSocket broadcast on join | Integration | R-008 | Programmatic WS client verifies broadcast receipt |
| **P0-007** | Admin panel RBAC | Integration | R-014 | Attendee JWT → 403 on admin tRPC procedures |
| **P0-008** | Admin: create event + sessions | API | R-014 | CRUD operations with valid admin JWT |
| **P0-009** | JWT: expired token rejected | Unit | R-001 | Past expiry → 401 response |
| **P0-010** | JWT: missing token rejected | API | R-001 | No auth header → 401 response |
| **P0-011** | Zod schema enforcement on tRPC | Unit | R-010 | Malformed input → Zod validation error, not SQL |
| **P0-012** | Session join: attendee added correctly | Integration | — | Core business logic: correct session, correct data |

**Total P0:** ~12 tests

---

### P1 (High)

**Criteria:** Important features + Medium risk (3-4) + Common workflows + Workaround exists but difficult

| Test ID | Requirement | Test Level | Risk Link | Notes |
|---|---|---|---|---|
| **P1-001** | FR3: Post-event access (5-day window) | Integration | R-012 | Time-mocked: day 4 OK, day 6 denied |
| **P1-002** | FR4: Cross-browser/device support | E2E | — | Chromium, Firefox, WebKit via Playwright projects |
| **P1-003** | FR17-20: PWA offline resilience | E2E | R-011 | Service worker caches; offline shows cached list |
| **P1-004** | FR21-23: Cold-start UX (<30s) | E2E | R-011 | Lighthouse CI performance baseline |
| **P1-005** | FR41-46: Event lifecycle management | Integration | — | Event: active → post-event → archived transitions |
| **P1-006** | FR47-50: Journey data capture | Integration | R-013 | Verify: session_join, session_switch, profile_view logged |
| **P1-007** | Concurrent sessions: attendee hops A→B | Integration | — | OAuth cookie carries; session_switch event logged |
| **P1-008** | QR generation: unique per session | Unit | R-007 | generateQR(sessionId) deterministic + collision-free |
| **P1-009** | WebSocket reconnection | Integration | R-008 | Disconnect → reconnect → receive missed updates |
| **P1-010** | Admin: analytics data accuracy | API | — | Counts, session breakdown, journey stats match DB |
| **P1-011** | WCAG 2.1 AA: axe-core scan | E2E | — | Zero critical/serious violations on all screens |
| **P1-012** | Admin: delete event cascades | Integration | — | Delete → sessions, attendees, journey_events removed |
| **P1-013** | Attendee list: tap → LinkedIn URL | E2E | — | href matches attendee's actual LinkedIn profile URL |
| **P1-014** | tRPC error handling | API | — | Invalid procedure → structured error, not stack trace |
| **P1-015** | WebSocket UI: dual-context rendering | E2E | R-008 | Attendee joins → other browser context shows new card |
| **P1-016** | Event lifecycle scheduler | Integration | — | Time-mocked: state transition fires at correct time |

**Total P1:** ~16 tests

---

### P2 (Medium)

**Criteria:** Secondary features + Low risk (1-2) + Edge cases + Regression prevention

| Test ID | Requirement | Test Level | Risk Link | Notes |
|---|---|---|---|---|
| **P2-001** | FR3: Day 5 boundary edge case | Unit | R-012 | Midnight cutoff; timezone handling |
| **P2-002** | Virtualized rendering (500+ attendees) | E2E | — | Large list renders without jank |
| **P2-003** | Empty session: 0 attendees | E2E | — | Appropriate empty state message |
| **P2-004** | 50 concurrent WebSocket connections | Integration | R-004 | Connection stress test |
| **P2-005** | Admin: bulk event operations | API | — | Multiple events CRUD |
| **P2-006** | Invalid/expired session URL | E2E | — | Friendly error, not crash |
| **P2-007** | OAuth: user denies permission | Integration | R-003 | Graceful error; redirect to retry |
| **P2-008** | Docker compose: dev profile | Integration | R-009 | `--profile dev` starts healthy |
| **P2-009** | Docker compose: prod profile | Integration | R-009 | `--profile prod` starts healthy |
| **P2-010** | Session header: correct session name | E2E | — | UX spec: session-primary headers |
| **P2-011** | Missing LinkedIn photo: fallback avatar | E2E | — | Default avatar displayed |
| **P2-012** | Admin: feedback collection | API | — | CRUD on feedback table |
| **P2-013** | Nginx routing: marketing vs SPA | E2E | — | `/` → marketing HTML, `/event/[slug]` → SPA |
| **P2-014** | Session resolver: event URL without session | E2E | — | Event URL → session selector or redirect |

**Total P2:** ~14 tests

---

### P3 (Low)

**Criteria:** Nice-to-have + Exploratory + Performance benchmarks + Documentation validation

| Test ID | Requirement | Test Level | Notes |
|---|---|---|---|
| **P3-001** | Attendee list load time (1000 attendees) | API | Benchmark, not gate |
| **P3-002** | WebSocket broadcast latency | API | Measure p95/p99 under load |
| **P3-003** | Keyboard-only navigation | E2E | Enhanced WCAG compliance |
| **P3-004** | Progressive enhancement animations | E2E | UX polish validation |
| **P3-005** | Admin: export analytics CSV | API | Nice-to-have feature |

**Total P3:** ~5 tests

---

## Execution Strategy

**Philosophy:** Run everything in PRs unless there's significant infrastructure overhead. Playwright with parallelization is extremely fast.

**Organized by TOOL TYPE:**

### Every PR: Playwright Tests (~8-12 min)

**All functional tests** (from any priority level):

- All E2E, API, Integration, Unit tests using Playwright + Vitest
- Parallelized across 4 shards
- Total: ~47 Playwright/Vitest tests (includes P0, P1, P2, P3)

**Why run in PRs:** Fast feedback, no expensive infrastructure

### Nightly: Lighthouse CI (~5-10 min)

**Performance baseline tests:**

- Lighthouse CI: cold start performance (<30s on 4G simulation)
- PWA audit (service worker, offline capability)

**Why defer to nightly:** Lighthouse requires dedicated browser instance; adds latency to PRs without proportional value

### Weekly: Load & Stress (~15-30 min)

**Infrastructure-heavy tests:**

- P2-004: 50 concurrent WebSocket connections
- P3-001: 1000-attendee list load benchmark
- P3-002: WebSocket broadcast latency p95/p99

**Why defer to weekly:** Requires provisioning concurrent connections; meaningful only at scale

---

## QA Effort Estimate

**QA test development effort only** (excludes DevOps, Backend, Data Eng work):

| Priority | Count | Effort Range | Notes |
|---|---|---|---|
| P0 | ~12 | ~15-25 hours | Auth, isolation, admin — complex setup, critical paths |
| P1 | ~16 | ~22-35 hours | Lifecycle, journey events, cross-browser, accessibility |
| P2 | ~13 | ~12-20 hours | Edge cases, Docker validation, UI states |
| P3 | ~5 | ~3-6 hours | Benchmarks, exploratory |
| **Total** | **~47** | **~52-86 hours (~1.5-2.5 weeks)** | **1 QA engineer, full-time** |

**Assumptions:**

- Includes test design, implementation, debugging, CI integration
- Excludes ongoing maintenance (~10% effort)
- Assumes test infrastructure (factories, fixtures, createTestJWT) ready
- AI-generated tests shift effort: ~60-70% generation, ~30-40% review/stabilization
- Project uses standard Playwright fixtures (not `@seontechnologies/playwright-utils`; `tea_use_playwright_utils` config is TEA installer default, not a project decision)

**Dependencies from other teams:**

- See "Dependencies & Test Blockers" section for what QA needs from Backend and Architecture

---

## Interworking & Regression

**Services and components impacted by this feature:**

| Service/Component | Impact | Regression Scope | Validation Steps |
|---|---|---|---|
| **LinkedIn OAuth API** | External auth dependency | OAuth callback handler tests | P0-002, P0-004: mock-based, no external calls |
| **PostgreSQL** | Data store for all entities | Schema migration tests | Docker Compose healthcheck; Drizzle migration runs clean |
| **WebSocket Server** | Real-time attendee updates | Connection management, broadcast | P0-006, P1-009, P1-015: broadcast and reconnection |
| **Nginx Reverse Proxy** | Routes to backend/frontend | Routing config | P2-013: marketing vs SPA routing smoke test |
| **PWA Service Worker** | Offline caching | Cache invalidation, offline mode | P1-003: offline resilience, cached list browsable |

**Regression test strategy:**

- All P0 + P1 tests must pass before any release
- Docker Compose health checks validate infrastructure on every CI run
- axe-core accessibility scan prevents WCAG regressions
- Lighthouse CI nightly prevents performance regressions

---

## Appendix A: Code Examples & Tagging

**Playwright Tags for Selective Execution:**

```typescript
// e2e/session-join.spec.ts
import { test, expect } from '@playwright/test';

// P0 critical test
test('@P0 @E2E @Core session join via URL shows attendee list', async ({ page }) => {
  // Setup: seed event + session via fixture
  // Navigate to session URL
  // Assert: attendee list visible
});

// P0 security test
test('@P0 @Integration @Security admin route rejects attendee JWT', async ({ request }) => {
  const attendeeJWT = createTestJWT('user-1', { role: 'attendee' });
  const response = await request.get('/api/admin/events', {
    headers: { Authorization: `Bearer ${attendeeJWT}` },
  });
  expect(response.status()).toBe(403);
});

// P1 real-time test
test('@P1 @E2E @WebSocket new attendee appears in real-time', async ({ browser }) => {
  // Context A: existing attendee watching list
  const contextA = await browser.newContext();
  const pageA = await contextA.newPage();

  // Context B: new attendee joining
  const contextB = await browser.newContext();
  const pageB = await contextB.newPage();

  // pageB joins session → pageA sees new attendee card
});
```

**Run specific tags:**

```bash
# Run only P0 tests
npx playwright test --grep @P0

# Run P0 + P1 tests
npx playwright test --grep "@P0|@P1"

# Run only security tests
npx playwright test --grep @Security

# Run all tests in PR (default)
npx playwright test
```

---

## Appendix B: Epic Mapping (Sprint Scorecard)

| Epic | Tests | Count | Key Risks |
|---|---|---|---|
| **Epic 1** (Infrastructure) | P0-001, P0-005, P0-011, P0-012, P1-008 | 5 | R-005, R-007 |
| **Epic 2** (Auth) | P0-002, P0-003, P0-004, P0-009, P0-010, P2-007 | 6 | R-001, R-003, R-006 |
| **Epic 3** (Real-time) | P0-006, P1-006, P1-007, P1-009, P1-015, P2-004 | 6 | R-008, R-013 |
| **Epic 4** (PWA/UX) | P1-002, P1-003, P1-004, P1-011, P1-013, P2-002, P2-003, P2-006, P2-010, P2-011, P2-014, P3-003, P3-004 | 13 | R-011 |
| **Epic 5** (Lifecycle) | P1-001, P1-005, P1-016, P2-001 | 4 | R-012 |
| **Epic 6** (Admin) | P0-007, P0-008, P1-010, P1-012, P1-014, P2-005, P2-012, P3-005 | 8 | R-014 |
| **Cross-cutting** | P2-008, P2-009, P2-013, P3-001, P3-002 | 5 | R-009 |

---

## Appendix C: Knowledge Base References

- **Risk Governance**: `risk-governance.md` — Risk scoring methodology (P×I, gate decisions)
- **Test Levels Framework**: `test-levels-framework.md` — E2E vs API vs Unit selection rules
- **Test Quality**: `test-quality.md` — DoD: no hard waits, <300 lines, <1.5 min, self-cleaning
- **ADR Quality Checklist**: `adr-quality-readiness-checklist.md` — 29-criteria testability assessment

---

**Generated by:** BMad TEA Agent (Murat)
**Workflow:** `_bmad/tea/testarch/test-design`
**Mode:** System-Level (Phase 3)
**Party Mode Reviews:** 2 sessions (risk assessment, coverage plan)
