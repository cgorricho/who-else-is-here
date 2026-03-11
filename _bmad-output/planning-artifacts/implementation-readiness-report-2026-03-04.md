# Implementation Readiness Assessment Report

**Date:** 2026-03-04
**Project:** who-else-is-here

---

## Step 1: Document Discovery

**stepsCompleted:** [step-01-document-discovery, step-02-prd-analysis, step-03-epic-coverage-validation, step-04-ux-alignment, step-05-epic-quality-review, step-06-final-assessment]

### Documents Identified

| Document Type | File | Format |
|---|---|---|
| PRD | `prd.md` | Whole |
| PRD Validation Report | `prd-validation-report.md` | Whole (supporting) |
| Architecture | `architecture.md` | Whole |
| Epics & Stories | `epics.md` | Whole |
| UX Design | `ux-design-specification.md` | Whole |

**Issues:** None. No duplicates, no sharded versions, all 4 required document types present.

---

## Step 2: PRD Analysis

### Functional Requirements (55 total)

| ID | Requirement Summary |
|---|---|
| FR1 | QR code / short URL → session attendee list |
| FR2 | LinkedIn OAuth (OIDC) → name, photo, headline |
| FR3 | Post-event access up to 5 days |
| FR4 | Any supported browser, mobile or desktop |
| FR5 | Minimal OIDC scopes: `openid`, `profile`, `email` |
| FR6 | Short URL slug resolution |
| FR7 | Status-specific messages (invalid/expired/archived) |
| FR8 | Loading indicator during auth/list-loading |
| FR9 | Error message on OAuth failure with retry |
| FR10 | Multiple concurrent browser sessions per attendee |
| FR11 | Real-time attendee list per session |
| FR12 | Name, headline, LinkedIn photo per card |
| FR13 | Self-entry visible after authentication |
| FR14 | Session-scoped attendee count |
| FR15 | Real-time new attendee appearance |
| FR16 | Tap name → LinkedIn profile |
| FR17 | Copy LinkedIn URL fallback (offline) |
| FR18 | Cached list browsable offline |
| FR19 | Offline indicator |
| FR20 | Auto-refresh on connectivity restored |
| FR21 | Encouragement messaging (<5 attendees) |
| FR22 | Growth momentum messaging (5-15 attendees) |
| FR23 | Remove messaging (>15 attendees) |
| FR24 | Text feedback submission |
| FR25 | Feedback prompt in post-event window |
| FR26 | Admin authentication |
| FR27 | Event + session creation |
| FR28 | Agenda content input |
| FR29 | Per-session QR code + short URL generation |
| FR30 | Print-ready QR signage download |
| FR31 | Real-time admin monitoring dashboard |
| FR32 | System health indicators |
| FR33 | Super-admin multi-event view |
| FR34 | Post-event summary report |
| FR35 | Report export |
| FR36 | Scan count + activation rate |
| FR37 | Profile taps + avg taps per attendee |
| FR38 | Activity timeline (scan/tap patterns) |
| FR39 | Attendee journey data |
| FR40 | Distraction health metrics per session |
| FR41 | Auto session status transitions |
| FR42 | Disable QR scanning post-event |
| FR43 | Auto archive after 5 days |
| FR44 | Data retention after archiving |
| FR45 | 12-month anonymization policy |
| FR46 | Lifecycle status + countdown display |
| FR47 | Scan event capture |
| FR48 | Profile tap event capture |
| FR49 | List browse session capture |
| FR50 | Return visit capture |
| FR50b | Session switch event capture |
| FR51 | Cross-event data isolation |
| FR52 | Role-based admin access |
| FR53 | Broadcast updates <3s |
| FR54 | Auto-reconnection with exponential backoff |
| FR55 | Frictionless session hop (cookie-based) |

### Non-Functional Requirements (41 total)

| ID | Category | Requirement Summary |
|---|---|---|
| NFR1 | Performance | Initial load <2s (4G) |
| NFR2 | Performance | Cached PWA load <500ms |
| NFR3 | Performance | List render (100 items) <200ms |
| NFR4 | Performance | Real-time update delivery <3s |
| NFR5 | Performance | LinkedIn tap response <1s |
| NFR6 | Performance | TTI on 3G <3s |
| NFR7 | Performance | PWA cache <2MB |
| NFR8 | Performance | OAuth flow <5s (system-controlled) |
| NFR9 | Performance | 500-item list scrollable at 30fps+ |
| NFR9b | Performance | Session hop <4s |
| NFR10 | Security | HTTPS 100% |
| NFR11 | Security | OAuth tokens server-side only |
| NFR12 | Security | Transparent token refresh <5s |
| NFR13 | Security | Zero cross-event data leakage |
| NFR14 | Security | Admin auth required |
| NFR15 | Security | OIDC minimal scopes only |
| NFR16 | Security | LinkedIn ToS compliance |
| NFR17 | Security | Published privacy policy |
| NFR18 | Scalability | 500 concurrent attendees |
| NFR19 | Scalability | 10 concurrent events |
| NFR20 | Scalability | 0→200 spike in 15min |
| NFR21 | Scalability | 500 simultaneous connections |
| NFR22 | Scalability | 500+ archived events, queries <2s |
| NFR23 | Reliability | 99.5% uptime during event windows |
| NFR24 | Reliability | Graceful offline degradation |
| NFR25 | Reliability | Durable data capture |
| NFR26 | Reliability | Auto-recovery <60s after restart |
| NFR27 | Reliability | Lifecycle transitions fire unattended |
| NFR28 | Reliability | Near-zero-downtime deploys |
| NFR29 | Reliability | <1% API error rate during events |
| NFR30 | Accessibility | WCAG 2.1 AA compliance |
| NFR31 | Accessibility | 4.5:1 contrast ratio minimum |
| NFR32 | Accessibility | 44x44px touch targets |
| NFR33 | Accessibility | Screen reader support |
| NFR34 | Accessibility | Full keyboard navigation |
| NFR35 | Accessibility | Usable at 200% zoom |
| NFR36 | Accessibility | prefers-reduced-motion respected |
| NFR37 | Accessibility | Updates don't disrupt keyboard focus |
| NFR38 | Integration | LinkedIn API outage handling |
| NFR39 | Integration | Rate limit compliance |
| NFR40 | Integration | LinkedIn API change isolation |
| NFR41 | Observability | Real-time metrics within 5s |

### PRD Completeness Assessment

The PRD is comprehensive and well-structured. 55 FRs cover the full attendee journey, admin workflow, data lifecycle, and real-time behavior. 41 NFRs span performance, security, scalability, reliability, accessibility, integration, and observability with quantitative targets. Additional constraints cover deployment, PWA, cold-start messaging, privacy, and explicit out-of-scope items.

**Note:** One inconsistency detected — the PRD's "Additional Requirements" section mentions "WebSocket JWT authentication" which conflicts with the architecture decision to use tRPC SSE subscriptions with Auth.js session cookies. This should be flagged.

---

## Step 3: Epic Coverage Validation

### Coverage Summary

| Metric | Value |
|---|---|
| **Total PRD FRs** | 56 (FR1–FR55 + FR50b) |
| **FRs covered in epics** | 56 |
| **Coverage percentage** | **100%** |
| **Missing FRs** | 0 |

### Coverage by Epic

| Epic | FRs Covered | Count |
|---|---|---|
| Epic 1: Project Foundation & Core Attendee Experience | FR1-2, FR4-16, FR47-51, FR53 | 21 |
| Epic 2: PWA, Offline Resilience & Cold Start | FR17-23, FR54 | 8 |
| Epic 3: Admin Event & Session Management | FR26-30, FR52 | 6 |
| Epic 4: Session Hop, Event Lifecycle & Post-Event | FR3, FR24-25, FR41-45, FR50b, FR55 | 10 |
| Epic 5: Admin Monitoring, Analytics & Reports | FR31-40, FR46 | 11 |
| Epic M: Marketing Website | 0 (satisfies NFR17 via /privacy) | 0 |

### Cross-Story FR Coverage (FRs cited in multiple stories)

- FR47 (scan events): Stories 1.2 + 1.4
- FR48 (tap events): Stories 1.3 + 1.4
- FR50 (return visits): Stories 1.4 + 4.3
- FR51 (data isolation): Stories 1.4 + 1.5
- FR18/FR19 (offline): Stories 2.1 + 2.3
- FR33 (super-admin): Stories 3.1 + 4.3 + 5.1

### Missing Requirements

**None.** The epics file declares 56/56 FRs mapped with zero gaps, which the BMad Master has verified.

### Structure

6 epics, 18 stories total:
- Epic 1: Stories 1.1–1.5
- Epic 2: Stories 2.1–2.3
- Epic 3: Stories 3.1–3.3
- Epic 4: Stories 4.1–4.3
- Epic 5: Stories 5.1–5.3
- Epic M: Story M.1

**Note:** Story 1.1 (Project Scaffold) has no attendee-facing FR citations — it is pure infrastructure foundation.

---

## Step 4: UX Alignment Assessment

### UX Document Status

**Found:** `ux-design-specification.md` — comprehensive 2000+ line UX design spec covering all 14 design steps.

### CRITICAL Alignment Issues (4)

| ID | Documents | Issue |
|---|---|---|
| CRITICAL-1 | PRD vs. UX+Arch | PRD uses "WebSocket" in 14 locations; correct technology is tRPC SSE subscriptions. Will cause dev agents to implement wrong real-time layer |
| CRITICAL-2 | PRD vs. UX | Cold-start message removal threshold: PRD FR22-23 says 15+, UX says 20+ (4-tier system). Directly conflicts with ColdStartMessage component thresholds (0,1,4,5,14,15,19,20) |
| CRITICAL-3 | PRD vs. Arch | NFR28 describes "WebSocket connections experience <5s interruption during deployment" — architecture uses SSE with fundamentally different reconnection semantics (EventSource auto-reconnect + `lastEventId`) |
| CRITICAL-4 | PRD vs. Arch | NFR12 requires OAuth token refresh in <5s — architecture explicitly states LinkedIn provides NO refresh tokens (60-day TTL sufficient, no refresh needed) |

### WARNING Alignment Issues (7)

| ID | Documents | Issue |
|---|---|---|
| WARNING-1 | UX vs. Arch | `theme.css` location: UX says `packages/shared/theme.css`, Architecture says monorepo root `theme.css` |
| WARNING-2 | UX vs. Arch | Admin "Settings" tab in UX nav has no corresponding route/component in architecture |
| WARNING-3 | PRD vs. Arch | `whois.here/*` short URLs appear as MVP-Critical in PRD; architecture defers custom short domain to post-MVP |
| WARNING-4 | UX+Arch+PRD | Report export format: 3 different answers ("screenshot-only" / "unspecified" / `window.print()`) |
| WARNING-5 | UX vs. Arch | `attendee-card.tsx` file path: UX says `components/`, Architecture says `components/attendee-list/` |
| WARNING-6 | UX vs. Arch | SessionReport route: UX uses `/admin/event/[slug]/...`, Architecture uses `/admin/events/:id/...` |
| WARNING-7 | UX internal | Search threshold: ~15 in Design Inspiration section vs. 20 in 5 other finalized locations |

### INFO Items (6)

- PRD Journey Requirements Summary lists "Intro audio cue" as "MVP Important" but MVP scope explicitly defers it
- "title/company" stale terminology in PRD V2 feature description and product brief (FRs correctly use "headline")
- "name, or headline" Oxford comma oddity in UX spec search placeholder (minor copy)
- Architecture correctly references Passport.js in comparative decision context only
- UX spec correctly uses SSE throughout
- PRD FR2 and FR12 correctly use "headline"

### Required Fixes Before Implementation

**Priority 1 — Fix before Story 1.1:**
1. Resolve `theme.css` canonical location (WARNING-1)

**Priority 2 — Fix before Story 1.2/1.3:**
2. Update PRD: replace 14 "WebSocket" instances with SSE terminology (CRITICAL-1)
3. Update PRD FR22-23: align cold-start thresholds with UX 4-tier system (CRITICAL-2)
4. Update PRD NFR28: rewrite for SSE reconnection behavior (CRITICAL-3)
5. Update PRD NFR12: remove impossible token refresh requirement (CRITICAL-4)

**Priority 3 — Fix before admin stories:**
6. Resolve admin Settings tab (WARNING-2)
7. Clarify FR6 short URL MVP scope (WARNING-3)
8. Align report export format across docs (WARNING-4)
9. Fix AttendeeCard file path in UX spec (WARNING-5)
10. Align SessionReport route pattern (WARNING-6)
11. Fix ~15 threshold in UX Design Inspiration section (WARNING-7)

---

## Step 5: Epic Quality Review

### Summary

**2 Critical Violations | 7 Major Issues | 9 Minor Concerns**

### 🔴 Critical Violations

| ID | Story | Finding | Fix |
|---|---|---|---|
| CRIT-1 | Story 1.1 | All 5 DB tables created upfront (including `feedback` needed in 4.3, `journey_events` needed in 1.4). Architecture-mandated but undocumented rationale | Add note explaining intentional deviation: tight FK relationships, migration cascade risk |
| CRIT-2 | Stories 1.2 + 1.4 | FR47 `scan` journey event specified in BOTH stories — behavioral duplicate | Remove `scan` event from Story 1.4 (1.2 already owns it) |

### 🟠 Major Issues

| ID | Story | Finding | Fix |
|---|---|---|---|
| MAJ-1 | Story 1.4 | "As the system" persona — no direct user value | Reframe to Karen's perspective (analytics value) |
| MAJ-2 | Story 2.2 | SessionStatusScreen post-event AC references read-only list not available until Story 4.3 — untestable | Move post-event rendering to Story 4.3, or stub the AC |
| MAJ-3 | Story 4.2 | Lifecycle cron has no fixture-based test ACs — only verifiable with real sessions from Epic 3 | Add seed/fixture data AC for testing without Epic 3 |
| MAJ-4 | Story 5.3 | Narrative metric ACs require live event data — no test fixtures specified | Add fixture-based test AC with expected metric outputs |
| MAJ-5 | Epic 3 | "Standalone" dependency claim is false — depends on Story 1.1 | Update to "Depends on Story 1.1" |
| MAJ-6 | Story M.1 | Full Story 1.1 dependency unnecessarily serializes marketing work | Narrow to `theme.css` dependency only |
| MAJ-7 | Story 2.2 | Combines 3 distinct capabilities (cold start + search + status screens) — borderline epic-sized | Split into 2.2a (cold start) and 2.2b (search filter), move status screens |

### 🟡 Minor Concerns

| ID | Story | Finding |
|---|---|---|
| MIN-1 | Story 1.3/1.4 | `browse` event logically belongs in 1.3 |
| MIN-2 | Story 5.1 | Emoji status badges without accessible text labels |
| MIN-3 | Story 3.2 | No duplicate session slug collision AC |
| MIN-4 | Story 4.3 | Missing note that post-event list reuses Epic 1 components |
| MIN-5 | Story 2.3 | Playwright `setOffline` prevents API call in same context — needs two-context setup |
| MIN-6 | Story 3.3 | No QR code decode validation AC |
| MIN-7 | Epic 5 | "Builds on Epics 3 and 4" overstates dependency |
| MIN-8 | FR Coverage | FR50b split across epics lacks explanatory footnote |
| MIN-9 | Story 1.1 | `socket.ts` schema filename — should be `realtime.ts` (project uses SSE) |

### Compliance Scores

| Epic | Score | Key Gap |
|---|---|---|
| Epic 1 | 5/7 | Upfront DB tables, FR47 duplication |
| Epic 2 | 4/7 | Story 2.2 oversized, untestable post-event AC |
| Epic 3 | 5/7 | False "Standalone" claim, missing slug collision AC |
| Epic 4 | 6/7 | Lifecycle cron testing needs fixtures |
| Epic 5 | 5/7 | Narrative metric ACs need fixtures, emoji a11y |
| Epic M | 6/7 | Unnecessarily broad Story 1.1 dependency |

---

## Step 6: Final Assessment

### Overall Readiness Status

## **NEEDS WORK** — Conditionally Ready

The planning artifacts are substantially well-crafted. FR coverage is 100% (56/56). BDD acceptance criteria are present throughout. Architecture, UX, and Epics are largely aligned. However, **6 critical issues** (4 cross-document alignment + 2 epic quality) and **14 major/warning issues** must be addressed before handing to developer agents.

### Issue Counts

| Severity | Cross-Doc Alignment (Step 4) | Epic Quality (Step 5) | Total |
|---|---|---|---|
| 🔴 Critical | 4 | 2 | **6** |
| 🟠 Major/Warning | 7 | 7 | **14** |
| 🟡 Minor/Info | 6 | 9 | **15** |
| **Total** | **17** | **18** | **35** |

### Critical Issues Requiring Immediate Action

**Before ANY implementation begins:**

1. **PRD "WebSocket" → SSE** (CRITICAL-1): 14 PRD locations use "WebSocket" — architecture uses tRPC SSE. Developer agents reading the PRD will implement the wrong real-time layer. Global find/replace required.

2. **PRD NFR12 token refresh is impossible** (CRITICAL-4): NFR12 requires OAuth token refresh in <5s. LinkedIn provides NO refresh tokens. Architecture confirms 60-day TTL is sufficient. NFR12 must be rewritten or removed.

3. **PRD NFR28 describes wrong reconnection semantics** (CRITICAL-3): NFR28 specifies WebSocket-specific deployment behavior. Must be rewritten for SSE EventSource auto-reconnect + `lastEventId`.

4. **Cold-start thresholds conflict** (CRITICAL-2): PRD FR22-23 says messaging disappears at 15+. UX spec says 20+ (4-tier system). Epics follow UX. PRD must be updated.

5. **FR47 scan event duplicated in Stories 1.2 and 1.4** (Epic CRIT-2): Pick one owner (recommend Story 1.2).

6. **Story 1.1 all-tables-upfront rationale missing** (Epic CRIT-1): Add architectural rationale note.

### Recommended Next Steps

**Phase A — Fix Critical Issues (do first):**
1. Update PRD: replace 14 "WebSocket" instances with SSE/tRPC terminology
2. Update PRD: rewrite NFR12 (remove token refresh), rewrite NFR28 (SSE semantics)
3. Update PRD: align FR22-23 cold-start thresholds with UX spec (4-tier, 20+ threshold)
4. Update Epics: remove FR47 duplicate from Story 1.4, add rationale note to Story 1.1

**Phase B — Fix Major/Warning Issues (do before relevant stories):**
5. Resolve `theme.css` canonical location (Architecture says root, UX says `packages/shared/`) — before Story 1.1
6. Rename `socket.ts` → `realtime.ts` in Story 1.1 ACs — before Story 1.1
7. Update Epic 3 dependency from "Standalone" to "Depends on Story 1.1"
8. Fix Story 2.2: split into 2.2a/2.2b, move post-event SessionStatusScreen to Story 4.3
9. Add fixture-based test ACs to Stories 4.2 and 5.3
10. Resolve admin Settings tab (add to architecture or remove from UX)
11. Add duplicate slug collision AC to Story 3.2

**Phase C — Fix Minor Issues (can fix during implementation):**
12. Add QR decode validation AC to Story 3.3
13. Fix emoji a11y in Story 5.1 status badges
14. Narrow Story M.1 dependency to `theme.css` only
15. Align file paths (AttendeeCard, SessionReport route) between UX and Architecture

### Final Note

This assessment identified **35 issues** across **3 categories** (cross-document alignment, epic quality, and minor concerns). The project's planning is at approximately **85% readiness** — the architecture and UX are strong, FR coverage is complete, and the BDD acceptance criteria provide a solid implementation foundation. The critical issues are primarily **PRD stale terminology** from the pre-research tech stack (WebSocket/Passport.js era) that was not fully propagated after the research-driven Architecture updates.

**The BMad Master recommends:** Fix Phase A critical issues (estimated 30 minutes of document edits), then proceed to `create-story` for Story 1.1 while Phase B fixes are applied in parallel to documents not yet needed.

**Assessor:** BMad Master
**Date:** 2026-03-04
**Workflow:** check-implementation-readiness (6 steps completed)
