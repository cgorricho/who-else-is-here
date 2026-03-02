---
date: '2026-03-01'
topic: 'TEA Step 4 Coverage Plan Review'
participants: [Murat, Quinn, Winston, Bob]
triggeredBy: 'TEA test-design workflow Step 4 (Coverage Plan) — user requested Party Mode review'
---

# Party Mode Transcript: TEA Step 4 Coverage Plan Review

**Date:** 2026-03-01
**Participants:** 🧪 Murat, 🧪 Quinn, 🏗️ Winston, 🏃 Bob
**Context:** Review of the TEA Coverage Plan — 43 tests, 1.5-2.5 week estimate

---

**Carlos:** p

---

🧪 **Quinn**: First thing that jumps out — 43 tests for a system-level plan feels about right for this scope. But I want to challenge some test level assignments. P0-001 (QR scan → attendee list) is marked as E2E. That's the *happy path* full journey, sure. But the QR scan itself is a camera/URL redirect — we can't automate the camera scan in Playwright. What we're actually testing is "user hits session URL → sees attendee list." I'd rename it to be clear: this is an E2E test of the *session join flow via URL*, not a QR camera test. The QR just generates that URL.

Also, P0-006 (real-time WebSocket) is marked as Integration. That's underselling it. If we're testing "new attendee joins → all connected clients see them," that's an E2E test with two browser contexts. One joins, the other watches. Playwright handles this natively with `browser.newContext()`. Bump it to E2E with a note about the dual-context setup.

🧪 **Murat**: Quinn's right on both counts. P0-001 should be renamed to "Session join via URL → attendee list renders" — the QR code is just a delivery mechanism for the URL. The actual testable surface is URL → auth → session join → list render.

On P0-006, I disagree slightly. The *API-level* test is: POST join-session → WebSocket broadcasts to existing connections. That's testable at the integration level with raw WebSocket clients — no browser needed. The *E2E* version adds the UI rendering assertion (attendee card appears in the DOM). I'd keep it as Integration for the broadcast mechanism test, and add a companion E2E test for the UI rendering. But Quinn's point about dual-context is valid — we need to note that in the implementation guidance.

Actually, let me revise: we should have *both*. P0-006 stays as Integration (WebSocket broadcast verification via programmatic WS client). Add P1-015 as E2E: "attendee joins → other user's browser shows new attendee card in real-time." Two different levels, two different failure modes, no duplicate coverage.

🏗️ **Winston**: From an architecture perspective, the coverage plan aligns well with the monorepo structure. Tests map to the right packages: Unit tests for `packages/shared/` (Zod schemas, QR generation, JWT utilities), Integration tests for `packages/server/` (tRPC routes, Drizzle ORM, WebSocket), E2E tests in `e2e/` (cross-package user journeys).

One gap I notice: the architecture specifies **event lifecycle automation** (FR41-46) — events transition from active → post-event → archived automatically based on timestamps. P1-005 covers this at Integration level, but the *scheduler* that triggers these transitions isn't explicitly tested. Is it a cron job? A setTimeout? Drizzle-based polling? The test needs to mock the system clock and verify state transitions fire at the right time. This is important because a missed transition means attendees lose access early or retain it forever.

I'd also add a test for the **marketing site → SPA boundary** — the architecture has two deployments on the same domain (root = marketing, `/event/[slug]` = SPA). If nginx routing breaks, the SPA is unreachable. A simple E2E smoke test: `GET /` returns marketing HTML, `GET /event/test` returns SPA HTML. That's a P2, but it catches a common deployment regression.

🏃 **Bob**: Story alignment check. Looking at the epics document, I count 6 epics. The coverage plan maps tests to epics in the risk table (R-001 → Epic 2, R-005 → Epic 1, etc.), but the coverage matrix itself doesn't have an epic column. For sprint planning, I need to know: when we start Epic 1, which tests should be written? When we finish Epic 2, which tests should pass?

I'd add an **Epic Mapping** column to the coverage matrix — or better, a summary table:

- **Epic 1** (Infrastructure): P0-001 (session join), P0-005 (isolation), P0-011 (Zod validation), P0-012 (attendee added), P1-008 (QR uniqueness) = ~5 tests
- **Epic 2** (Auth): P0-002 (OAuth flow), P0-003 (JWT creation), P0-004 (minimal scope), P0-009 (expired token), P0-010 (missing token), P2-007 (OAuth deny) = ~6 tests
- **Epic 3** (Real-time): P0-006 (WS broadcast), P1-006 (journey events), P1-007 (session hop), P1-009 (WS reconnect), P2-004 (concurrent WS) = ~5 tests

...and so on. This gives each sprint a clear "test scorecard." The ATDD workflow can then generate the failing tests *before* implementation starts for each epic.

🧪 **Murat**: Bob's epic mapping is exactly what the handoff document needs. I'll add it. That bridges the coverage plan to the sprint lifecycle — which is the whole point of the TEA → BMAD handoff.

Winston's gaps are valid. Let me add:
- **P1-015**: E2E — attendee joins → other browser shows new card (dual-context WebSocket UI test)
- **P1-016**: Integration — event lifecycle scheduler triggers state transition at correct time (time-mocked)
- **P2-013**: E2E — nginx routing: marketing site at `/`, SPA at `/event/[slug]` (deployment smoke test)

That brings us to **46 tests**. Estimate adjustment: ~50-85 hours (~1.5-2.5 weeks) — the range holds.

🧪 **Quinn**: One more thing on the resource estimate. The 1.5-2.5 week estimate assumes Carlos isn't writing these tests himself — the BMAD developer agent will. For AI-generated tests with a clear coverage plan and acceptance criteria, I'd expect the *generation* to be faster (maybe 60-70% of the estimate) but the *debugging and stabilization* to eat the difference. So the total holds, but the effort distribution shifts: less writing, more reviewing and fixing. Worth noting in the handoff.

🧪 **Murat**: Agreed. Final adjustments:

1. **P0-001 renamed**: "Session join via URL → attendee list renders"
2. **P0-006 clarified**: Integration-level WebSocket broadcast (programmatic WS client)
3. **P1-015 added**: E2E dual-context WebSocket UI rendering
4. **P1-016 added**: Integration event lifecycle scheduler (time-mocked)
5. **P2-013 added**: E2E nginx routing smoke test
6. **Epic mapping** to be included in handoff document
7. **Resource note**: AI-generated tests shift effort from writing to review/stabilization

**Panel consensus**: Coverage plan is solid. 3 tests added (43 → 46), no tests removed, estimate range unchanged. Epic mapping is the key addition for BMAD integration.

---

**Carlos:** exit, fold in the adjustments and continue
