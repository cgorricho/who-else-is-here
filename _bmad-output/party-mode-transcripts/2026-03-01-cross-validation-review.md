---
date: '2026-03-01'
topic: 'Cross-Validation Review — All 4 Planning Documents'
participants: [John (PM), Winston (Architect), Murat (Test Architect), Amelia (Developer), Sally (UX Designer), Bob (Scrum Master)]
triggeredBy: 'Carlos requested Party Mode cross-validation of all documents to confirm implementation readiness.'
---

# Party Mode Transcript: Cross-Validation Review

**Date:** 2026-03-01
**Participants:** 📋 John, 🏗️ Winston, 🧪 Murat, 💻 Amelia, 🎨 Sally, 🏃 Bob
**Context:** After the Implementation Readiness Report gave a "READY" verdict, Carlos requested a fresh-eyes cross-validation of all 4 planning documents (PRD, Architecture, UX Spec, Epics) by the full expert panel.

---

**Carlos:** invoke a party mode and give them the implementation readiness report. have them do yet another cross-validation of all documents to confirm implementation readiness

---

📋 **John**: PM perspective — four observations.

1. **FR3 placement is correct but the AC is thin.** FR3 says "5-day post-event access." Story 4.3 covers it, but the AC should verify that Alex can *still browse and tap LinkedIn profiles* during the post-event window, not merely "access" the list. **Recommendation:** Verify Story 4.3's AC explicitly mentions browse + tap functionality during post-event.

2. **FR10 (multiple concurrent browser sessions) has no dedicated test AC.** It's cited in Story 1.3, but there's no integration test verifying two clients both receive the broadcast. **Recommendation:** Add concurrent session test AC to Story 1.3.

3. **Journey 6 (Dave — Reluctant Scanner) has zero story coverage.** Dave's journey is behavioral, not functional. **Verdict:** Acceptable gap — Dave's journey is an adoption strategy, not a software feature.

4. **FR28 (event agenda content input) vs Story 3.2.** Already covered — Story 3.2 AC includes "an agenda text field accepts free-form agenda content per event (FR28)." No change needed.

---

🏗️ **Winston**: Architecture perspective — six findings.

5. **tRPC procedure naming** — Consistent across documents. `trpc.session.getBySlug` (direct resolution) and `trpc.session.resolveCurrentSession` (event lobby) are two different procedures. No issue.

6. **`attendees.role` column** — Schema-only for MVP. Correct as stated. No issue.

7. **Socket.io room prefix** — Both Architecture and Epics use `session:{sessionId}`. Consistent. No issue.

8. **Event lobby page (`/event/:eventSlug`) has no behavioral AC.** Story 1.1 says "routes exist" but doesn't specify what the lobby renders or which tRPC procedure it calls. **Recommendation:** Add lobby behavior AC to Story 1.1.

9. **Anonymization cron not in Architecture doc.** Story 4.2 specifies a daily anonymization task that extends the Architecture's lifecycle system but isn't documented there. **Recommendation:** Add anonymization scheduled task to Architecture's lifecycle section.

10. **`connect-pg-simple` session table** auto-creates. Not in Story 1.1's 5-table migration AC. Correct — no issue.

---

🧪 **Murat**: Testing perspective — five findings.

11. **NFR9 (500 items, 30fps) has no performance test AC.** Story 1.3 mentions NFR9 in prose but no Playwright test seeds 500 attendees and verifies scroll performance. **Recommendation:** Add 500-item performance test AC.

12. **NFR8 (OAuth flow < 5 seconds) has no timing assertion.** **Recommendation:** Add end-to-end timing AC to Story 1.2.

13. **NFR28 (near-zero-downtime deployments) has no test.** Deployment-time NFR, not story-scoped. **Recommendation:** Add to pre-pilot operational checklist in epics header.

14. **Story 2.3 E2E test AC doesn't verify backoff timing or missed-update delivery specifics.** **Recommendation:** Strengthen with full reconnection sequence verification.

15. **Stories 1.2 and 1.5 missing `@axe-core/playwright` ACs.** Both render user-facing UI but lack accessibility test coverage. **Recommendation:** Add axe-core ACs.

---

💻 **Amelia**: Implementation precision — four findings.

16. **Tailwind config** — Consistent in UX spec + Epics. Architecture is the known outlier. No new issue.

17. **Sessions table missing `room`/`location` column.** FR27 says "room number/location" and FR30 says "room number/location alongside the QR code graphic." The Architecture's sessions table has no `room` column. **Finding: HIGH.** Developer agents implementing Story 3.2 will fail to store room data. **Recommendation:** Add `room varchar(255)` to sessions table in Architecture AND update Story 1.1 DB migration AC.

18. **SearchFilter component** — Actually IS implemented in Story 2.2 (lines 696-711). The component name wasn't explicit. **Recommendation:** Make SearchFilter component name explicit in AC.

19. **File naming** — All consistent with kebab-case convention. No issue.

---

🎨 **Sally**: UX perspective — three findings.

20. **Scroll position preservation on mobile back-navigation.** Called out as "#1 UX risk" in UX spec. Story 1.3 has a generic scroll preservation AC but doesn't address the mobile-specific `target="_self"` scenario where browser back button must restore scroll. **Finding: HIGH.** **Recommendation:** Add mobile-specific back-navigation scroll test.

21. **Desktop/mobile link target** — Consistent. No issue.

22. **`@tanstack/react-virtual` not in Architecture's tech stack table.** UX spec and epics require it but Architecture doesn't list it. **Recommendation:** Add to Architecture tech stack.

---

🏃 **Bob**: Scrum Master perspective — two findings.

23. **Dependency parallelism** — Stories 1.4 and 1.5 are correctly parallelizable after 1.2. No issue.

24. **No global Definition of Done.** Individual stories have ACs but no cross-story DoD. **Recommendation:** Add DoD to epics header.

---

**Carlos:** apply all the findings now, I don't want to postpone anything

---

All actionable findings applied:

| # | Finding | Severity | Fix Applied |
|---|---|---|---|
| 1 | FR3 AC thin in Story 4.3 | Low | Strengthened post-event AC with explicit browse + tap + LinkedIn navigation (FR16) |
| 2 | FR10 concurrent sessions no test | Medium | Added integration test AC to Story 1.3 (two Socket.io clients verify broadcast) |
| 3 | Journey 6 (Dave) no story | Info | Accepted — behavioral journey, not a software feature |
| 4 | FR28 agenda input | Low | Already covered in Story 3.2 AC. No change needed. |
| 5 | tRPC naming | None | Confirmed consistent |
| 6 | Role column schema-only | None | Confirmed correct |
| 7 | Socket.io room prefix | None | Confirmed consistent |
| 8 | Event lobby no behavioral AC | Low | Added `event-redirect.tsx` behavior, tRPC procedure, and placeholder note to Story 1.1 |
| 9 | Anonymization cron not in Architecture | Low | Added anonymization daily task to Architecture's lifecycle section |
| 10 | connect-pg-simple auto-table | None | Confirmed correct |
| 11 | NFR9 no 500-item performance test | Medium | Added Playwright performance test AC with 500 seeded attendees to Story 1.3 |
| 12 | NFR8 no OAuth timing assertion | Low | Added 5-second end-to-end timing AC to Story 1.2 |
| 13 | NFR28 zero-downtime no test | Info | Added pre-pilot operational checklist to epics header |
| 14 | Story 2.3 reconnection AC weak | Low | Strengthened E2E test with full 4-step reconnection sequence verification |
| 15 | Stories 1.2 + 1.5 missing axe-core | Medium | Added `@axe-core/playwright` ACs to both stories |
| 16 | Tailwind config | None | Confirmed consistent where it matters |
| 17 | **Sessions table missing `room` column** | **High** | Added `room varchar(255)` to Architecture sessions table + Story 1.1 DB AC + epics additional requirements |
| 18 | SearchFilter no explicit component name | Medium | Made `SearchFilter` component name explicit in Story 2.2 AC |
| 19 | File naming | None | Confirmed consistent |
| 20 | **Scroll position preservation** | **High** | Added mobile-specific `scrollRestoration` AC with Playwright E2E test to Story 1.3 |
| 21 | Desktop/mobile link target | None | Confirmed consistent |
| 22 | `@tanstack/react-virtual` not in Architecture | Low | Added to Architecture's Selected Technology Stack table |
| 23 | Dependency parallelism | None | Confirmed correct |
| 24 | No global Definition of Done | Low | Added 5-point DoD to epics header |

### Key Decisions

1. **`room` column added to `sessions` table** — `varchar(255)`, nullable. Required by FR27 (session creation with room) and FR30 (room on QR printout). Added to Architecture schema + Story 1.1 migration AC + epics additional requirements.
2. **Scroll position preservation elevated to E2E test** — Mobile back-navigation verified by Playwright: navigate to LinkedIn, go back, assert scroll offset. `scrollRestoration: 'manual'` as implementation approach.
3. **Global Definition of Done established** — 5 criteria applied to all 18 stories: ACs pass, tests green, build clean, axe-core clean, naming conventions followed.
4. **Pre-pilot operational checklist added** — NFR28 (zero-downtime deploy) verified manually during deployment rehearsal, not in a story AC.
5. **SearchFilter confirmed in Story 2.2** — Panel initially missed it. Component name now explicit in AC.
6. **Anonymization cron documented in Architecture** — Story 4.2's daily task now has a matching Architecture specification.
