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

# Test Design for Architecture: Who Else Is Here

**Purpose:** Architectural concerns, testability gaps, and NFR requirements for review by Architecture/Dev teams. Serves as a contract between QA and Engineering on what must be addressed before test development begins.

**Date:** 2026-03-01
**Author:** Murat (TEA Master Test Architect)
**Status:** Architecture Review Pending
**Project:** who-else-is-here
**PRD Reference:** `_bmad-output/planning-artifacts/prd.md`
**ADR Reference:** `_bmad-output/planning-artifacts/architecture.md`

---

## Executive Summary

**Scope:** System-level testability review of a real-time, event-scoped attendee directory that bridges professional events to LinkedIn. Single-page attendee list with QR code entry, LinkedIn OAuth, WebSocket real-time updates, and admin panel with analytics.

**Business Context** (from PRD):

- **Revenue/Impact:** Event organizer tool — value proposition is attendee networking data and journey analytics
- **Problem:** No frictionless way to see who else is at a professional event without app downloads or complex onboarding
- **GA Launch:** Target MVP for RUMC events (up to 7 concurrent sessions)

**Architecture** (from ADR):

- **Key Decision 1:** LinkedIn OAuth as sole authentication (no email/password fallback)
- **Key Decision 2:** Monorepo with npm workspaces (client, server, shared, marketing)
- **Key Decision 3:** Stack: Vite + React + TypeScript (client), Express + TypeScript (server), PostgreSQL + Drizzle ORM, Socket.io + Redis adapter for real-time
- **Key Decision 4:** Single-server Contabo VPS deployment via Docker Compose + PM2 + Nginx + Redis

**Expected Scale** (from ADR):

- 500 concurrent users per event, 10 simultaneous events, 500+ archived events
- <2s initial load on 4G, 500ms cached, <3s real-time updates
- 99.5% uptime during event windows

**Risk Summary:**

- **Total risks**: 14
- **High-priority (≥6)**: 2 risks requiring immediate mitigation (R-003, R-014)
- **Critical blocker**: 1 (R-002: test data seeding strategy)
- **Test effort**: ~47 tests (~1.5-2.5 weeks for 1 QA engineer)

---

## Quick Guide

### 🚨 BLOCKERS - Team Must Decide (Can't Proceed Without)

**Pre-Implementation Critical Path** — These MUST be completed before QA can write integration tests:

1. **R-002: Test Data Seeding Strategy** — Architecture must define Drizzle ORM fixture patterns for programmatic test data creation and cleanup (transaction-wrapped). No REST seeding endpoint needed — direct ORM access in test fixtures. (recommended owner: Backend Dev)
2. **R-003: LinkedIn OAuth Mock Strategy** — Architecture must document: (a) `createTestJWT(userId, claims)` utility for 95% of tests, (b) HTTP-level mock for 2-3 OAuth callback flow integration tests. (recommended owner: Backend Dev)

**What we need from team:** Complete these 2 items pre-implementation or test development is blocked.

---

### ⚠️ HIGH PRIORITY - Team Should Validate (We Provide Recommendation, You Approve)

1. **R-014: Admin Panel RBAC** — Implement role-based middleware from day 1. Test: attendee JWT → 403 on all `/admin/*` tRPC procedures. (implementation phase, Epic 3 (Story 3-1))
2. **Testability Concern #3: WebSocket Event Contract** — Document event names, payload shapes, and ordering guarantees so tests can assert on specific events rather than arbitrary timeouts. (pre-implementation)
3. **Testability Concern #4: QR Code as Pure Function** — Extract QR generation as `generateQR(sessionId: string): string` — a pure function testable with vitest. Do not couple to session creation. (implementation phase, Epic 1)

**What we need from team:** Review recommendations and approve (or suggest changes).

---

### 📋 INFO ONLY - Solutions Provided (Review, No Decisions Needed)

1. **Test strategy**: 46 tests — 12 P0 (critical), 16 P1 (high), 13 P2 (medium), 5 P3 (low)
2. **Test levels**: Unit (Zod schemas, JWT, QR, time boundaries), Integration (tRPC routes, Drizzle ORM, WebSocket, OAuth), E2E (user journeys, cross-browser, accessibility, PWA)
3. **Tooling**: Playwright (E2E + API + Integration), Vitest (unit), axe-core (accessibility), Lighthouse CI (performance)
4. **CI/CD**: All functional tests in PRs (~8-12 min, 4 shards). Performance baselines nightly. Load tests weekly.
5. **Coverage**: ~46 test scenarios prioritized P0-P3 with risk-based classification
6. **Quality gates**: P0 = 100% pass, P1 ≥ 95%, axe-core zero critical/serious, <15 min CI

**What we need from team:** Just review and acknowledge (we already have the solution).

---

## For Architects and Devs - Open Topics 👷

### Risk Assessment

**Total risks identified**: 14 (1 critical score 9, 2 high score 6, 8 medium score 3-5, 3 low score 1-2)

#### Critical Risk (Score 9) - ABSOLUTE BLOCKER

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
|---|---|---|---|---|---|---|---|---|
| **R-002** | **TECH** | No test data seeding strategy — blocks all automated testing | 3 | 3 | **9** | Drizzle programmatic fixtures, transaction-wrapped, auto-cleanup | Backend Dev | Pre-impl |

#### High-Priority Risks (Score ≥6) - IMMEDIATE ATTENTION

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
|---|---|---|---|---|---|---|---|---|
| **R-003** | **TECH** | LinkedIn OAuth mock undefined — tests depend on external API | 3 | 2 | **6** | createTestJWT() for 95% of tests + 2-3 HTTP-level OAuth callback tests | Backend Dev | Pre-impl |
| **R-014** | **SEC** | Admin panel unauthorized access — no RBAC tests | 2 | 3 | **6** | Role-based middleware; test admin vs attendee access boundaries | Backend Dev | Epic 3 (Story 3-1) |

#### Medium-Priority Risks (Score 3-5)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
|---|---|---|---|---|---|---|---|
| R-001 | SEC | OAuth token theft/replay (public data, low exposure) | 2 | 2 | 4 | JWT rotation, short expiry, HTTPS-only cookies | Backend Dev |
| R-004 | PERF | WebSocket connection scaling | 2 | 2 | 4 | Connection pooling, k6 post-MVP | Backend Dev |
| R-005 | DATA | Session isolation failure | 1 | 3 | 3 | event_id+session_id scoping in all queries | Backend Dev |
| R-006 | SEC | LinkedIn API scope creep | 1 | 3 | 3 | Hardcode minimal scope; test FR5 compliance | Backend Dev |
| R-007 | BUS | QR code collision | 1 | 3 | 3 | UUID session IDs; unit test uniqueness | Backend Dev |
| R-008 | TECH | WebSocket message ordering | 2 | 2 | 4 | Sequence numbers; integration test | Backend Dev |
| R-011 | PERF | Cold start >30s on slow connections | 2 | 2 | 4 | PWA service worker; Lighthouse CI | Frontend Dev |
| R-012 | BUS | Post-event access window miscalculation | 2 | 2 | 4 | Unit test time boundaries; time-mocked | Backend Dev |

#### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
|---|---|---|---|---|---|---|
| R-009 | OPS | Docker compose dev/prod drift | 2 | 1 | 2 | CI validates both profiles |
| R-010 | SEC | SQL injection via search | 1 | 3 | 3 | Drizzle parameterized queries + Zod |
| R-013 | DATA | Journey event data loss | 2 | 1 | 2 | Integration test: verify events logged |

#### Risk Category Legend

- **TECH**: Technical/Architecture (flaws, integration, scalability)
- **SEC**: Security (access controls, auth, data exposure)
- **PERF**: Performance (SLA violations, degradation, resource limits)
- **DATA**: Data Integrity (loss, corruption, inconsistency)
- **BUS**: Business Impact (UX harm, logic errors, revenue)
- **OPS**: Operations (deployment, config, monitoring)

---

### Testability Concerns and Architectural Gaps

**🚨 ACTIONABLE CONCERNS - Architecture Team Must Address**

#### 1. Blockers to Fast Feedback (WHAT WE NEED FROM ARCHITECTURE)

| Concern | Impact | What Architecture Must Provide | Owner | Timeline |
|---|---|---|---|---|
| **No test data seeding strategy** | Cannot create/reset test data; parallel tests impossible | Drizzle ORM fixture patterns: `seed.ts` with transaction-wrapped inserts + auto-cleanup teardown | Backend Dev | Pre-implementation |
| **LinkedIn OAuth mock undefined** | Tests depend on external API availability and rate limits | `createTestJWT()` utility + HTTP-level mock for OAuth callback handler | Backend Dev | Pre-implementation |
| **WebSocket event contract undocumented** | Cannot write deterministic WebSocket tests | Document: event names, payload TypeScript types, ordering guarantees, reconnection behavior | Backend Dev / Architect | Pre-implementation |

#### 2. Architectural Improvements Needed (WHAT SHOULD BE CHANGED)

1. **QR code generation coupling**
   - **Current problem**: Unclear if QR generation is coupled to session creation or a pure function
   - **Required change**: Extract as `generateQR(sessionId: string): string` — pure, deterministic, unit-testable
   - **Impact if not fixed**: QR testing requires full integration test instead of fast unit test
   - **Owner**: Backend Dev
   - **Timeline**: Epic 1 implementation

---

### Testability Assessment Summary

**📊 CURRENT STATE - FYI**

#### What Works Well

- ✅ **API-first design (tRPC)**: 100% of business logic accessible via typed API calls — no UI-based testing needed for business logic
- ✅ **Strong type system (Zod + TypeScript strict)**: Schema-driven input validation reduces ambiguity in test expectations
- ✅ **Drizzle ORM with PostgreSQL**: Supports test database isolation via transactions or separate test DBs
- ✅ **Docker Compose + Redis**: Reproducible local environments for integration testing. Redis required for Socket.io adapter in PM2 cluster mode.
- ✅ **Stateless JWT auth**: Supports shared auth state in test fixtures (Playwright `storageState` pattern). Socket.io also uses JWT verification on WebSocket handshake.
- ✅ **Session-scoped data model**: Multi-tenant isolation by design (event_id + session_id scoping) — tests naturally isolated per session
- ✅ **Monorepo structure**: Unit tests in `packages/shared/`, Integration tests in `packages/server/`, E2E tests in `e2e/` — clean separation

#### Accepted Trade-offs (No Action Required)

For Who Else Is Here Phase 1, the following trade-offs are acceptable:

- **No distributed tracing** — Single-service architecture on one VPS; not needed until microservices
- **No k6 load testing infrastructure** — MVP targets <500 concurrent users; revisit post-GA
- **Manual deployment validation** — Single-server Docker deployment; automated rollback not cost-justified for MVP

---

### Risk Mitigation Plans (High-Priority Risks ≥6)

#### R-002: No Test Data Seeding Strategy (Score: 9) - CRITICAL BLOCKER

1. Create `packages/server/test/fixtures/seed.ts` — Drizzle ORM programmatic data creation
2. Transaction-wrap all operations for automatic rollback
3. faker.js for unique data (parallel-safe)
4. Playwright fixture teardown for auto-cleanup
5. Document fixture API for developer agent consumption

**Owner:** Backend Dev | **Timeline:** Pre-implementation | **Status:** Planned
**Verification:** First integration test creates/cleans up data; 4-worker parallel run = no collisions

#### R-003: LinkedIn OAuth Mock Strategy (Score: 6)

1. `createTestJWT(userId, claims)` utility in `packages/shared/test/` — valid JWTs without LinkedIn
2. Use for 95% of authenticated tests
3. 2-3 HTTP-level integration tests mock LinkedIn callback (success, expiry, denial)

**Owner:** Backend Dev | **Timeline:** Pre-implementation | **Status:** Planned
**Verification:** All authenticated tests pass without any network calls to LinkedIn; OAuth callback handler tests cover success, expiry, and denial paths

#### R-014: Admin Panel Unauthorized Access (Score: 6)

1. Role-based middleware on all admin tRPC procedures from day 1
2. Test matrix: unauthenticated → 401, attendee → 403, admin → 200
3. P0 test suite (blocks PR if ungated)

**Owner:** Backend Dev | **Timeline:** Epic 3 (Story 3-1) | **Status:** Planned
**Verification:** Integration tests verify 401/403/200 for each role on every admin endpoint

---

### Assumptions and Dependencies

#### Assumptions

1. Drizzle ORM supports transaction-wrapped test isolation (confirmed: Drizzle transactions are well-documented)
2. Playwright supports WebSocket testing natively (confirmed: `page.waitForEvent('websocket')`)
3. tRPC router introspection provides sufficient API contract documentation (no separate sample requests needed)
4. Single-server deployment means no cross-service test complexity (no service mesh, no API gateway testing)

#### Dependencies

1. **Drizzle schema finalized** — Required before test fixtures can be written (pre-implementation)
2. **WebSocket event contract documented** — Required before real-time tests can be deterministic (pre-implementation)
3. **Docker Compose health checks** — Required for CI test environment setup (Epic 1)

#### Risks to Plan

- **Risk**: LinkedIn API changes OAuth flow or deprecates scopes
  - **Impact**: OAuth callback handler tests may need updating
  - **Contingency**: HTTP-level mocks isolate tests from LinkedIn API changes; only 2-3 tests need updating

---

**End of Architecture Document**

**Next Steps for Architecture Team:**

1. Review Quick Guide (🚨/⚠️/📋) and prioritize blockers
2. Assign owners and timelines for R-002 and R-003 (pre-implementation)
3. Document WebSocket event contract (event names, payloads, ordering)
4. Confirm QR generation will be a pure function

**Next Steps for QA Team:**

1. Wait for pre-implementation blockers (R-002, R-003) to be resolved
2. Refer to companion QA doc (`test-design-qa.md`) for test scenarios
3. Begin test infrastructure setup (Playwright config, Drizzle fixtures, faker factories)
