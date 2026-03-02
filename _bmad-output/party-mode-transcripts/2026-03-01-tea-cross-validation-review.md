---
date: '2026-03-01'
topic: 'TEA Test Design Cross-Validation Review'
participants: [Murat, Winston, Paige, Bob]
triggeredBy: 'TEA test-design workflow Step 5 (Generate Output) — user requested cross-validation Party Mode'
---

# Party Mode Transcript: TEA Test Design Cross-Validation Review

**Date:** 2026-03-01
**Participants:** 🧪 Murat, 🏗️ Winston, 📚 Paige, 🏃 Bob
**Context:** Cross-validation of all three TEA test design output documents: test-design-architecture.md, test-design-qa.md, who-else-is-here-handoff.md

---

**Carlos:** (requested cross-validation Party Mode after YOLO generation of all 3 documents)

---

📚 **Paige**: Let me start with the structural review against the checklist. I'm going to be clinical here.

**Architecture doc — issues found:**

1. **Length**: The checklist targets ~150-200 lines. This document is approximately 230+ lines. It's not egregiously over, but there's tightening opportunity. The Risk Mitigation Plans section repeats information already present in the risk matrix (same mitigation text, same owners, same timelines). The mitigation plans should add *detailed steps* that the matrix doesn't — which they do — but the introductory text for each risk duplicates the matrix row. Trim the preamble on each mitigation plan.

2. **No test code — PASS.** The architecture doc correctly avoids Playwright test blocks, assertions, and test setup code. It stays in the "WHAT and WHY" lane.

3. **Quick Guide structure — PASS.** Three tiers present: 🚨 BLOCKERS, ⚠️ HIGH PRIORITY, 📋 INFO ONLY. Actionable-first, FYI-last principle followed.

4. **One concern**: The Accepted Trade-offs subsection says "No k6 load testing infrastructure" — but the QA doc lists k6 in the Nightly execution tier for Lighthouse CI. These aren't the same thing (Lighthouse ≠ k6), but a reader might confuse them. The QA doc doesn't actually mention k6 anywhere in its execution strategy — it says "Lighthouse CI" for nightly. So this is consistent. No action needed, just wanted to flag my initial read.

**QA doc — issues found:**

1. **`@seontechnologies/playwright-utils` import**: The checklist says if `tea_use_playwright_utils: true`, the QA doc should import from `@seontechnologies/playwright-utils/api-request/fixtures`. The factory code example uses `@playwright/test` directly. However — this is a greenfield project that doesn't use the SEON playwright-utils package. The `tea_use_playwright_utils` config is a default from the TEA installer, not a project decision. I'd recommend either: (a) change the config to `false`, or (b) note in the QA doc that playwright-utils is available but the project uses standard Playwright fixtures. This is a minor checklist deviation, not a quality issue.

2. **Nightly section**: The checklist template says "Nightly: k6 performance tests (~30-60 min)" but the QA doc says "Nightly: Lighthouse CI (~5-10 min)." This is fine — the template is generic, the QA doc is project-specific. Lighthouse CI is the right choice for this project. No k6 infrastructure is needed for MVP.

3. **No Quality Gate Criteria section in QA doc**: The checklist says "NO Quality Gate Criteria section (teams decide for themselves)" under the DON'T INCLUDE list, but the coverage plan in the progress file has quality gates. These were added during Step 4 and are in the progress file but correctly NOT in the QA output doc. **However** — the entry/exit criteria in the QA doc effectively serve as quality gates. This is the right approach. PASS.

4. **Epic Mapping as Appendix B — good.** The checklist doesn't require it, but Bob's Party Mode suggestion to include it adds real value for sprint planning.

**Cross-document consistency — PASS.** Risk IDs match (R-001 through R-014). Priority levels consistent (P0-P3). Pre-implementation blockers consistent (R-002, R-003). Dates and author match. No duplicate content — architecture doc cross-references QA doc appropriately.

🏗️ **Winston**: Architecture alignment check.

1. **Monorepo structure reference — PASS.** The QA doc's factory example uses `packages/server/test/fixtures/` which aligns with the monorepo layout in the architecture doc (`packages/client/`, `packages/server/`, `packages/shared/`). The handoff doc references the same paths. Consistent.

2. **Tech stack alignment — PASS.** Documents reference Vite + React (client), Express + TypeScript (server), Drizzle ORM + PostgreSQL, tRPC, Zod, Docker Compose. All match the architecture doc.

3. **One architectural concern**: The architecture doc mentions `session-resolver.ts` as an optional "event lobby" pattern for when an attendee arrives at the root event URL instead of a specific session URL. None of the 46 tests cover this scenario. It's described as "not primary routing" in the architecture, so it's reasonable to exclude from P0/P1. But there should be at least one P2 test: "attendee navigates to event URL without session → sees session selector or redirect." This is an edge case that will exist in production (someone shares the event URL instead of the session URL).

🧪 **Murat**: Winston raises a valid gap. The session resolver is an optional component, but it will be implemented and users will hit it. I'd add:

- **P2-014**: E2E — Attendee navigates to event URL (no session) → sees session selector or appropriate redirect

That brings us to 47 tests. Estimate stays in the same range.

🏃 **Bob**: Handoff document review — this is the one I care about most.

1. **Epic-Level Integration Guidance — STRONG.** Risk references table maps risks to epics with quality gates. This is exactly what sprint planning needs. When we start Epic 2, I can see immediately: "R-003 must be resolved, `createTestJWT()` must exist."

2. **Story-Level Integration Guidance — STRONG.** The Given/When/Then acceptance criteria for each epic's key stories are ready to copy into story cards. This saves significant story refinement time.

3. **Data-TestId Requirements — EXCELLENT.** This is the kind of detail that prevents back-and-forth between QA and Dev during implementation. Developer agent can implement `data-testid="attendee-card"` from day 1.

4. **One gap in the handoff**: The Pre-Implementation Checklist at the bottom lists 6 items, but doesn't mention the **WebSocket event contract documentation**. It's mentioned as a testability concern in the architecture doc, but the handoff checklist should include it explicitly since it's a pre-implementation blocker for Epic 3.

5. **Workflow sequence**: The handoff recommends "TEA NFR Assessment" as step 2, before "BMAD Create Epics & Stories." This is correct — Carlos mentioned wanting to run both TEA Phase 3 workflows. The sequence is well-ordered.

🧪 **Murat**: Final adjustments from this panel:

1. **Architecture doc**: Trim mitigation plan preambles to reduce ~30 lines of duplication with the risk matrix
2. **QA doc**: Add note that `tea_use_playwright_utils` is available but project uses standard Playwright fixtures
3. **Coverage**: Add P2-014 (session resolver / event URL without session) → 47 tests total
4. **Handoff**: Add WebSocket event contract to Pre-Implementation Checklist
5. **Config**: Recommend changing `tea_use_playwright_utils: false` in TEA config since this project doesn't use SEON's package

**Panel consensus**: Documents are solid. 4 minor adjustments. No structural issues. Cross-document consistency verified. The three-document system (Architecture concerns → QA execution recipe → BMAD handoff) achieves clean separation of concerns. Ready for use.

---

**Carlos:** exit, fold in the adjustments
