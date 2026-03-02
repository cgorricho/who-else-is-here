---
stepsCompleted: ['step-01-detect-mode', 'step-02-load-context', 'step-03-risk-and-testability', 'step-04-coverage-plan', 'step-05-generate-output']
lastStep: 'step-05-generate-output'
lastSaved: '2026-03-01'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/epics.md'
  - '_bmad/tea/testarch/knowledge/adr-quality-readiness-checklist.md'
  - '_bmad/tea/testarch/knowledge/test-levels-framework.md'
  - '_bmad/tea/testarch/knowledge/risk-governance.md'
  - '_bmad/tea/testarch/knowledge/test-quality.md'
---

# Step 1: Mode Detection & Prerequisites

## Mode: System-Level (Phase 3)

### Detection Basis
- User explicitly requested TEA Phase 3 workflows
- PRD complete: 56 FRs (FR1-FR55 + FR50b), 42 NFRs (NFR1-NFR41 + NFR9b), 7 user journeys (including Journey 3b: Session Hop)
- Architecture complete: 5 tables, concurrent sessions model, tRPC/Zod stack
- No sprint-status.yaml exists (Phase 4 not started)

### Prerequisites Verified
- PRD: `_bmad-output/planning-artifacts/prd.md` ✓
- Architecture: `_bmad-output/planning-artifacts/architecture.md` ✓

### Outputs to Produce
1. `test-design-architecture.md` — Architectural testability review
2. `test-design-qa.md` — QA test execution plan
3. Handoff document — TEA → BMAD integration bridge

# Step 2: Context & Knowledge Base

## Configuration
- tea_use_playwright_utils: true
- tea_browser_automation: auto
- test_stack_type: auto → detected: fullstack (Node.js + React + PostgreSQL + Nginx)

## Project Artifacts Loaded
- PRD: 56 FRs (FR1-FR55 + FR50b), 42 NFRs (NFR1-NFR41 + NFR9b), 7 user journeys
- Architecture: 5 tables, tRPC/Zod, concurrent sessions, LinkedIn OAuth
- Epics: Full epic/story breakdown with acceptance criteria

## Key Extractions
- Tech stack: Next.js, tRPC, Zod, PostgreSQL, Drizzle ORM, Tailwind v4, Docker
- Integration points: LinkedIn OAuth API, QR code generation, WebSocket (real-time attendee list)
- NFRs: <30s QR-to-list, 99.9% uptime, WCAG 2.1 AA, 5-day post-event access, concurrent sessions

## Knowledge Fragments Loaded
- adr-quality-readiness-checklist.md (29-criteria testability framework)
- test-levels-framework.md (Unit/Integration/E2E selection)
- risk-governance.md (Risk scoring, gate decisions)
- test-quality.md (Test DoD: deterministic, <300 lines, <1.5min)

## Templates Ready
- test-design-architecture-template.md
- test-design-qa-template.md
- test-design-handoff-template.md

## Browser Exploration
Skipped — no running application (pre-implementation phase)

# Step 3: Testability & Risk Assessment

## Party Mode Review Applied
Panel: Murat (TEA), Winston (Architect), Mary (Analyst), Amelia (Dev)
Transcript: `_bmad-output/party-mode-transcripts/2026-03-01-tea-risk-assessment-review.md`

## Testability Concerns (Post-Panel)

### ACTIONABLE
1. **Test Data Seeding** — Use Drizzle programmatic fixtures (transaction-wrapped), NOT REST endpoints. Critical blocker.
2. **LinkedIn OAuth Mock** — Split: createTestJWT() for 95% of tests + 2-3 HTTP-level OAuth callback integration tests
3. **WebSocket Event Contract** — Document event names, payloads, ordering guarantees for deterministic testing
4. **QR Code Isolation** — Extract as pure function `generateQR(sessionId): string`. Trivial mitigation.

### FYI (Not Blocking)
5. **Sample API Contracts** — tRPC self-documents via router introspection. No action needed.

### What Works Well
- API-first design (tRPC): 100% business logic via typed API calls
- Strong type system (Zod + TypeScript strict): schema-driven validation
- Drizzle ORM: supports test DB isolation via transactions
- Docker Compose: reproducible local environments
- Stateless JWT auth: supports storageState pattern
- Session-scoped data model: natural multi-tenant isolation

### Accepted Trade-offs (Phase 1)
- No distributed tracing (single-service, acceptable)
- No k6 load testing (MVP <500 users, revisit post-GA)
- Manual deployment validation (single-server Docker)

## ASRs
| ASR | Description | Type |
|---|---|---|
| ASR-1 | LinkedIn OAuth sole auth | ACTIONABLE |
| ASR-2 | Real-time WebSocket | ACTIONABLE |
| ASR-3 | Concurrent sessions (up to 7) | FYI |
| ASR-4 | 5-day post-event access | FYI |
| ASR-5 | <30s QR-to-list | FYI |
| ASR-6 | WCAG 2.1 AA | FYI |

## Risk Assessment (Post-Panel Adjusted)

| Risk ID | Category | Description | Prob | Impact | Score | Mitigation | Owner | Timeline |
|---|---|---|---|---|---|---|---|---|
| R-001 | SEC | OAuth token theft/replay | 2 | 2 | 4 | JWT rotation, short expiry, HTTPS-only cookies | Backend Dev | Epic 2 |
| R-002 | TECH | No test data seeding strategy | 3 | 3 | 9 | Drizzle programmatic fixtures, transaction-wrapped | Backend Dev | Pre-impl |
| R-003 | TECH | LinkedIn OAuth mock undefined | 3 | 2 | 6 | createTestJWT() + 2-3 HTTP-level OAuth flow tests | Backend Dev | Pre-impl |
| R-004 | PERF | WebSocket connection scaling | 2 | 2 | 4 | Connection pooling, k6 post-MVP | Backend Dev | Post-Epic 3 |
| R-005 | DATA | Session isolation failure | 1 | 3 | 3 | event_id+session_id scoping; integration tests | Backend Dev | Epic 1 |
| R-006 | SEC | LinkedIn API scope creep | 1 | 3 | 3 | Hardcode minimal scope; test FR5 compliance | Backend Dev | Epic 2 |
| R-007 | BUS | QR code collision | 1 | 3 | 3 | UUID session IDs; unit test uniqueness | Backend Dev | Epic 1 |
| R-008 | TECH | WebSocket message ordering | 2 | 2 | 4 | Sequence numbers; integration test ordering | Backend Dev | Epic 3 |
| R-009 | OPS | Docker compose dev/prod drift | 2 | 1 | 2 | Single compose with profiles; CI validates both | DevOps | Epic 1 |
| R-010 | SEC | SQL injection via search | 1 | 3 | 3 | Drizzle parameterized queries + Zod validation | Backend Dev | Epic 3 |
| R-011 | PERF | Cold start >30s slow connections | 2 | 2 | 4 | PWA service worker caching; Lighthouse CI | Frontend Dev | Epic 4 |
| R-012 | BUS | Post-event access window error | 2 | 2 | 4 | Unit test time boundaries; time-mocked integration | Backend Dev | Epic 5 |
| R-013 | DATA | Journey event data loss | 2 | 1 | 2 | Integration test: verify journey events logged | Backend Dev | Epic 3 |
| R-014 | SEC | Admin panel unauthorized access | 2 | 3 | 6 | Role-based middleware; test admin vs attendee boundaries | Backend Dev | Epic 6 |

## Risk Summary (Post-Panel)
- CRITICAL (Score 9): 1 — R-002 (test data seeding)
- HIGH (Score 6-8): 2 — R-003 (OAuth mock), R-014 (Admin auth)
- MEDIUM (Score 3-5): 8 — R-001, R-004, R-005, R-006, R-007, R-008, R-011, R-012
- LOW (Score 1-2): 3 — R-009, R-010, R-013
- Gate Decision: CONCERNS — R-002 must be resolved pre-implementation

# Step 4: Coverage Plan & Execution Strategy

## Party Mode Review Applied
Panel: Murat (TEA), Quinn (QA), Winston (Architect), Bob (SM)
Transcript: `_bmad-output/party-mode-transcripts/2026-03-01-tea-coverage-plan-review.md`

## Coverage Matrix (Post-Panel: 46 tests)

### P0 (Critical) — 12 tests
| Test ID | Requirement | Test Level | Risk Link | Notes |
|---|---|---|---|---|
| P0-001 | FR1: Session join via URL → attendee list renders | E2E | R-007 | Renamed: QR is URL delivery; test is URL→auth→join→list |
| P0-002 | FR2: LinkedIn OAuth authentication flow | Integration | R-003 | Mock LinkedIn at HTTP level |
| P0-003 | FR2: JWT token creation after OAuth | Unit | R-001 | Token claims, expiry, signing |
| P0-004 | FR5: LinkedIn OAuth minimal scope enforcement | Integration | R-006 | Assert only name/photo/title/company |
| P0-005 | FR51-52: Multi-tenant data isolation | Integration | R-005 | Session A attendee cannot see session B |
| P0-006 | FR53-54: WebSocket broadcast on join | Integration | R-008 | Programmatic WS client, not browser |
| P0-007 | Admin panel RBAC | Integration | R-014 | Attendee role → 403 on admin routes |
| P0-008 | Admin: create event + sessions | API | R-014 | CRUD with valid admin JWT |
| P0-009 | JWT: expired token rejected | Unit | R-001 | Past expiry → 401 |
| P0-010 | JWT: missing token rejected | API | R-001 | No auth → 401 |
| P0-011 | Zod schema enforcement on tRPC routes | Unit | R-010 | Malformed input → validation error |
| P0-012 | Session join: attendee added to correct session | Integration | — | Core business logic |

### P1 (High) — 16 tests
| Test ID | Requirement | Test Level | Risk Link | Notes |
|---|---|---|---|---|
| P1-001 | FR3: Post-event access (5-day window) | Integration | R-012 | Time-mocked: day 4 OK, day 6 denied |
| P1-002 | FR4: Cross-browser/device support | E2E | — | Chromium, Firefox, WebKit |
| P1-003 | FR17-20: PWA offline resilience | E2E | R-011 | Service worker caches; offline shows cached |
| P1-004 | FR21-23: Cold-start UX (<30s) | E2E | R-011 | Lighthouse CI performance baseline |
| P1-005 | FR41-46: Event lifecycle management | Integration | — | active → expired → archived |
| P1-006 | FR47-50: Journey data capture | Integration | R-013 | session_join, session_switch, profile_view logged |
| P1-007 | Concurrent sessions: attendee hops A → B | Integration | — | Cookie carries; session_switch event |
| P1-008 | QR generation: unique per session | Unit | R-007 | Deterministic + collision-free |
| P1-009 | WebSocket reconnection after disconnect | Integration | R-008 | Reconnects; receives missed updates |
| P1-010 | Admin: analytics data accuracy | API | — | Counts, session breakdown, journey stats |
| P1-011 | WCAG 2.1 AA: axe-core scan | E2E | — | Zero critical/serious violations |
| P1-012 | Admin: delete event cascades | Integration | — | Cascades to sessions, attendees, journey_events |
| P1-013 | Attendee list: tap → LinkedIn profile URL | E2E | — | href matches LinkedIn profile |
| P1-014 | tRPC error handling: graceful responses | API | — | Structured error, not stack trace |
| P1-015 | WebSocket UI: dual-context real-time rendering | E2E | R-008 | NEW: Attendee joins → other browser shows card |
| P1-016 | Event lifecycle scheduler triggers correctly | Integration | — | NEW: Time-mocked state transition verification |

### P2 (Medium) — 13 tests
| Test ID | Requirement | Test Level | Risk Link | Notes |
|---|---|---|---|---|
| P2-001 | FR3: Day 5 boundary edge case | Unit | R-012 | Midnight cutoff timezone handling |
| P2-002 | Virtualized rendering (500+ attendees) | E2E | — | No jank |
| P2-003 | Empty session: 0 attendees UI | E2E | — | Appropriate empty state |
| P2-004 | 50 concurrent WebSocket connections | Integration | R-004 | Stress test |
| P2-005 | Admin: bulk event operations | API | — | Multiple events CRUD |
| P2-006 | Invalid/expired session URL | E2E | — | Friendly error |
| P2-007 | OAuth: user denies permission | Integration | R-003 | Graceful error, redirect |
| P2-008 | Docker compose: dev profile | Integration | R-009 | Healthy startup |
| P2-009 | Docker compose: prod profile | Integration | R-009 | Healthy startup |
| P2-010 | Session header: correct session name | E2E | — | UX spec compliance |
| P2-011 | Missing LinkedIn photo: fallback avatar | E2E | — | Default avatar |
| P2-012 | Admin: feedback collection per session | API | — | CRUD on feedback table |
| P2-013 | Nginx routing: marketing vs SPA | E2E | — | NEW: / → marketing, /event/[slug] → SPA |

### P3 (Low) — 5 tests
| Test ID | Requirement | Test Level | Notes |
|---|---|---|---|
| P3-001 | Attendee list load time (1000 attendees) | API | Benchmark |
| P3-002 | WebSocket broadcast latency | API | p95/p99 under load |
| P3-003 | Keyboard-only navigation | E2E | Enhanced WCAG |
| P3-004 | Progressive enhancement animations | E2E | UX polish |
| P3-005 | Admin: export analytics CSV | API | Nice-to-have |

## Execution Strategy
| Tier | What Runs | Cadence | Duration |
|---|---|---|---|
| Every PR | All Playwright tests (P0-P3) | On push/PR | ~8-12 min (4 shards) |
| Nightly | Lighthouse CI performance baselines | 1x/day | ~5-10 min |
| Weekly | Load tests (concurrent WS, large datasets) | 1x/week | ~15-30 min |

## Resource Estimates
| Priority | Count | Effort Range | Notes |
|---|---|---|---|
| P0 | ~12 | ~15-25 hours | Auth, isolation, admin — complex setup |
| P1 | ~16 | ~22-35 hours | Lifecycle, journey, cross-browser, a11y |
| P2 | ~13 | ~12-20 hours | Edge cases, Docker, UI states |
| P3 | ~5 | ~3-6 hours | Benchmarks, exploratory |
| **Total** | **~46** | **~52-86 hours (~1.5-2.5 weeks)** | **1 QA engineer, full-time** |

Note: AI-generated tests shift effort from writing (~60-70%) to review/stabilization (~30-40%). Total estimate unchanged.

## Epic Mapping (for BMAD Handoff)
| Epic | Tests | Count |
|---|---|---|
| Epic 1 (Infrastructure) | P0-001, P0-005, P0-011, P0-012, P1-008 | 5 |
| Epic 2 (Auth) | P0-002, P0-003, P0-004, P0-009, P0-010, P2-007 | 6 |
| Epic 3 (Real-time) | P0-006, P1-006, P1-007, P1-009, P1-015, P2-004 | 6 |
| Epic 4 (PWA/UX) | P1-002, P1-003, P1-004, P1-011, P1-013, P2-002, P2-003, P2-006, P2-010, P2-011, P3-003, P3-004 | 12 |
| Epic 5 (Lifecycle) | P1-001, P1-005, P1-016, P2-001 | 4 |
| Epic 6 (Admin) | P0-007, P0-008, P1-010, P1-012, P1-014, P2-005, P2-012, P3-005 | 8 |
| Cross-cutting | P2-008, P2-009, P2-013, P3-001, P3-002 | 5 |

## Quality Gates
| Gate | Threshold | Enforcement |
|---|---|---|
| P0 pass rate | 100% | PR blocked |
| P1 pass rate | ≥ 95% | PR warning; triage 24h |
| P2 pass rate | ≥ 90% | Tracked, not blocking |
| P3 pass rate | Informational | Not blocking |
| High-risk mitigations (R-002, R-003, R-014) | Complete before Epic 2 | Epic gate check |
| Axe-core accessibility | Zero critical/serious | PR blocked |
| Test execution time | < 15 min total | CI alert |

# Step 5: Generate Output — COMPLETE

## Party Mode Review Applied
Panel: Murat (TEA), Winston (Architect), Paige (Librarian), Bob (SM)
Transcript: `_bmad-output/party-mode-transcripts/2026-03-01-tea-cross-validation-review.md`

## Output Documents Generated
1. `_bmad-output/test-artifacts/test-design-architecture.md` — Architecture testability review (for Architect/Dev teams)
2. `_bmad-output/test-artifacts/test-design-qa.md` — QA test execution recipe (for QA team)
3. `_bmad-output/test-artifacts/test-design/who-else-is-here-handoff.md` — TEA → BMAD integration bridge

## Cross-Validation Adjustments Applied
1. Trimmed architecture doc mitigation plan preambles (reduced duplication with risk matrix)
2. Added playwright-utils note to QA doc (project uses standard Playwright, not @seontechnologies/playwright-utils)
3. Added P2-014: Session resolver / event URL without session (47 total tests)
4. Added WebSocket event contract to handoff doc Pre-Implementation Checklist
5. Config recommendation noted: `tea_use_playwright_utils: false` (not applied — config in gitignored `_bmad/`)

## Final Test Count: 47
- P0: 12, P1: 16, P2: 14, P3: 5

## Workflow Status: COMPLETE
