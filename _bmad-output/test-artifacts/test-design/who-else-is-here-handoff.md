---
title: 'TEA Test Design → BMAD Handoff Document'
version: '1.0'
workflowType: 'testarch-test-design-handoff'
inputDocuments:
  - '_bmad-output/test-artifacts/test-design-architecture.md'
  - '_bmad-output/test-artifacts/test-design-qa.md'
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/epics.md'
sourceWorkflow: 'testarch-test-design'
generatedBy: 'TEA Master Test Architect'
generatedAt: '2026-03-01'
projectName: 'who-else-is-here'
---

# TEA → BMAD Integration Handoff

## Purpose

This document bridges TEA's test design outputs with BMAD's epic/story decomposition workflow (`create-epics-and-stories`). It provides structured integration guidance so that quality requirements, risk assessments, and test strategies flow into implementation planning.

## TEA Artifacts Inventory

| Artifact | Path | BMAD Integration Point |
|---|---|---|
| Test Design (Architecture) | `_bmad-output/test-artifacts/test-design-architecture.md` | Epic quality requirements, architectural blockers |
| Test Design (QA) | `_bmad-output/test-artifacts/test-design-qa.md` | Story acceptance criteria, test coverage matrix |
| Risk Assessment | (embedded in both test design docs) | Epic risk classification, story priority |
| Coverage Strategy | (embedded in QA doc) | Story test requirements, epic sprint scorecards |

## Epic-Level Integration Guidance

### Risk References

The following P0/P1 risks should appear as **epic-level quality gates**:

| Risk ID | Score | Affected Epic | Quality Gate |
|---|---|---|---|
| **R-002** | 9 (CRITICAL) | All Epics (blocker) | Test data seeding fixtures must exist before any epic begins implementation |
| **R-003** | 6 | Epic 1 (Story 1-2: OAuth) | `createTestJWT()` utility must exist before auth story implementation |
| **R-005** | 3 | Epic 1 (Story 1-5: Data Isolation) | Multi-tenant isolation verified via P0-005 before Epic 2 begins |
| **R-008** | 4 | Epic 1 (Story 1-3: Real-Time List) | WebSocket event contract documented before real-time story implementation |
| **R-014** | 6 | Epics 3 & 5 (Admin) | RBAC middleware implemented and tested (P0-007) before admin feature stories |

### Quality Gates

| Epic | Gate Criteria | Blocking Tests |
|---|---|---|
| **Epic 1** (Foundation) | Session join works; data isolation verified; Zod validation active | P0-001, P0-005, P0-011, P0-012 |
| **Epic 1** (Story 1-2: OAuth) | OAuth mock works; JWT creation/validation passes; minimal scope enforced | P0-002, P0-003, P0-004, P0-009, P0-010 |
| **Epic 1** (Stories 1-3, 1-4) + **Epic 2** (Story 2-3) | WebSocket broadcast verified; journey events logged; reconnection works | P0-006, P1-006, P1-009, P1-015 |
| **Epic 2** (PWA) | Cross-browser passes; PWA offline works; accessibility zero violations | P1-002, P1-003, P1-011 |
| **Epic 4** (Lifecycle) | Event state transitions fire correctly; post-event access window accurate | P1-001, P1-005, P1-016 |
| **Epics 3 & 5** (Admin) | RBAC enforced; CRUD works; analytics accurate; cascade delete verified | P0-007, P0-008, P1-010, P1-012 |

## Story-Level Integration Guidance

### P0/P1 Test Scenarios → Story Acceptance Criteria

The following critical test scenarios **MUST** be embedded as acceptance criteria in the corresponding stories. BMAD's `create-epics-and-stories` workflow should include these as Given/When/Then criteria:

**Epic 1 Stories (Foundation):**
- **Session Join Story**: Given a valid session URL, When an authenticated user navigates to it, Then they are added to the session and see the attendee list (P0-001, P0-012)
- **Data Isolation Story**: Given attendee in Session A, When they query attendees, Then they see only Session A attendees, not Session B (P0-005)

**Epic 1 Stories (Auth — Story 1-2):**
- **OAuth Flow Story**: Given a user scanning a QR code, When they authenticate via LinkedIn, Then a JWT is created with correct claims and minimal scope (P0-002, P0-003, P0-004)
- **Token Validation Story**: Given an expired/missing JWT, When any API is called, Then 401 is returned (P0-009, P0-010)

**Epic 1 Stories (Real-Time — Stories 1-3, 1-4) + Epic 2 (Story 2-3):**
- **Real-Time List Story**: Given attendee A is viewing the list, When attendee B joins the session, Then attendee A sees B appear without page refresh (P0-006, P1-015)
- **Journey Tracking Story**: Given an attendee performing actions, When they join/switch/view profiles, Then journey_events are logged with timestamps (P1-006)
- **Reconnection Story**: Given a WebSocket disconnect, When connectivity restores, Then client reconnects and receives missed updates (P1-009)

**Epic 4 Stories (Lifecycle):**
- **Post-Event Access Story**: Given an event ended 4 days ago, When an attendee accesses the list, Then access is granted; at 6 days, access is denied (P1-001)
- **Lifecycle Automation Story**: Given an event past its end time, When the scheduler runs, Then the event transitions to post-event state automatically (P1-005, P1-016)

**Epics 3 & 5 Stories (Admin):**
- **Admin RBAC Story**: Given a user with attendee role, When they access admin routes, Then 403 is returned (P0-007)
- **Cascade Delete Story**: Given an admin deleting an event, When the delete executes, Then sessions, attendees, and journey_events are cascade-deleted (P1-012)

### Data-TestId Requirements

The following `data-testid` attributes are recommended for testability. BMAD stories with UI components should include these in implementation guidance:

| Component | data-testid | Used By Test |
|---|---|---|
| Attendee list container | `attendee-list` | P0-001, P2-002 |
| Individual attendee card | `attendee-card` | P1-015, P2-002 |
| LinkedIn profile link | `linkedin-link` | P1-013 |
| Session header/name | `session-header` | P2-010 |
| Empty state message | `empty-state` | P2-003 |
| Error message container | `error-message` | P2-006 |
| Fallback avatar image | `fallback-avatar` | P2-011 |
| Admin event list | `admin-event-list` | P0-008 |
| Admin analytics dashboard | `admin-analytics` | P1-010 |
| Offline indicator | `offline-indicator` | P1-003 |

## Risk-to-Story Mapping

| Risk ID | Category | P×I | Recommended Story/Epic | Test Level | Test IDs |
|---|---|---|---|---|---|
| R-001 | SEC | 2×2=4 | Epic 1 (Story 1-2): Token validation story | Unit + API | P0-009, P0-010 |
| R-002 | TECH | 3×3=9 | Cross-cutting: Test infrastructure | — (blocker) | — |
| R-003 | TECH | 3×2=6 | Epic 1 (Story 1-2): OAuth flow story | Integration | P0-002, P2-007 |
| R-004 | PERF | 2×2=4 | Epic 1 (Story 1-3): WebSocket scaling | Integration | P2-004 |
| R-005 | DATA | 1×3=3 | Epic 1 (Story 1-5): Data isolation story | Integration | P0-005 |
| R-006 | SEC | 1×3=3 | Epic 1 (Story 1-2): OAuth scope story | Integration | P0-004 |
| R-007 | BUS | 1×3=3 | Epic 3 (Story 3-3): QR generation story | Unit | P1-008 |
| R-008 | TECH | 2×2=4 | Epic 1 (Story 1-3): Real-time list story | Integration + E2E | P0-006, P1-009, P1-015 |
| R-009 | OPS | 2×1=2 | Cross-cutting: Docker config | Integration | P2-008, P2-009 |
| R-010 | SEC | 1×3=3 | Epic 1 (Story 1-5): Input validation story | Unit | P0-011 |
| R-011 | PERF | 2×2=4 | Epic 2 (Stories 2-1, 2-2): PWA/cold-start story | E2E | P1-003, P1-004 |
| R-012 | BUS | 2×2=4 | Epic 4 (Story 4-3): Post-event access story | Unit + Integration | P1-001, P2-001 |
| R-013 | DATA | 2×1=2 | Epic 1 (Story 1-4): Journey tracking story | Integration | P1-006 |
| R-014 | SEC | 2×3=6 | Epic 3 (Story 3-1): Admin RBAC story | Integration | P0-007, P0-008 |

## Recommended BMAD → TEA Workflow Sequence

1. **TEA Test Design** (`TD`) → produces this handoff document ✅ COMPLETE
2. **TEA NFR Assessment** (`NR`) → assesses non-functional requirements against architecture
3. **BMAD Create Epics & Stories** → consumes this handoff, embeds quality requirements
4. **TEA ATDD** (`AT`) → generates failing acceptance tests per story (per epic)
5. **BMAD Implementation** → developers implement with test-first guidance
6. **TEA Automate** (`TA`) → generates full test suite per story
7. **TEA Trace** (`TR`) → validates coverage completeness

## Phase Transition Quality Gates

| From Phase | To Phase | Gate Criteria |
|---|---|---|
| Test Design | NFR Assessment | All P0 risks have mitigation strategy ✅ |
| NFR Assessment | Epic/Story Creation | NFR assessment complete; architecture gaps documented |
| Epic/Story Creation | ATDD | Stories have acceptance criteria from test design |
| ATDD | Implementation | Failing acceptance tests exist for all P0/P1 scenarios |
| Implementation | Test Automation | All acceptance tests pass |
| Test Automation | Release | Trace matrix shows ≥80% coverage of P0/P1 requirements |

## Pre-Implementation Checklist

Before BMAD's developer agent begins implementation, ensure:

- [ ] R-002 resolved: Drizzle test fixtures exist (`packages/server/test/fixtures/`)
- [ ] R-003 resolved: `createTestJWT()` available (`packages/shared/test/auth.ts`)
- [ ] WebSocket event contract documented (event names, payload TypeScript types, ordering guarantees in `packages/shared/`)
- [ ] Playwright configured in monorepo (`e2e/` directory, `playwright.config.ts`)
- [ ] Docker Compose dev profile starts and passes healthchecks (includes Redis for Socket.io adapter)
- [ ] Redis available in Docker Compose for Socket.io cross-worker broadcasts (PM2 cluster mode)
- [ ] Socket.io JWT authentication middleware implemented (`packages/server/src/socket/auth.ts`)
- [ ] CI pipeline scaffolded (GitHub Actions with Playwright sharding)
