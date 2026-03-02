---
date: '2026-03-01'
topic: 'Story Review — All 18 Stories Across 5 Epics'
participants: [John (PM), Winston (Architect), Murat (Test Architect), Amelia (Developer), Sally (UX Designer), Bob (Scrum Master)]
triggeredBy: 'Carlos requested Party Mode review of all 18 stories before proceeding to final validation.'
---

# Party Mode Transcript: Story Review

**Date:** 2026-03-01
**Participants:** 📋 John, 🏗️ Winston, 🧪 Murat, 💻 Amelia, 🎨 Sally, 🏃 Bob
**Context:** Step 3 of the Create Epics & Stories workflow completed 18 stories across 5 epics + 1 marketing mini-epic. Carlos requested a full panel review before proceeding to Step 4 (final validation).

---

**Carlos:** party mode to review all stories

---

📋 **John**: PM perspective — four findings.

1. **Story 1.2 has an Express 5 spike buried in an AC.** That's not an acceptance criterion — it's a spike/investigation. **Recommendation:** Extract as subtask with clear output: "Spike result confirming Passport.js + connect-pg-simple compatibility with Express 5.2.1, or documenting chosen alternative."

2. **Story 2.2 SessionStatusScreen for post_event implies behavior before Epic 4 ships.** **Recommendation:** Add note that the component renders UI shell only; full post-event access behavior is in Story 4.3.

3. **Story 3.1 rate limiting AC references "OAuth callback endpoint" — wrong endpoint.** Admin login is NOT OAuth. **Recommendation:** Fix to "admin login endpoint."

4. **NFR17 (privacy policy) has no story.** **Recommendation:** Add AC to Story M.1 covering LinkedIn data usage, retention policy, and contact info.

---

🏗️ **Winston**: Architecture perspective — five findings.

5. **Story 1.1 missing Drizzle ORM schema AC.** Developer agents need both Drizzle schemas (for migration) AND Zod schemas (for validation). **Recommendation:** Add AC for Drizzle schema files in `packages/server/src/db/schema/`.

6. **Story 1.1 missing Socket.io room pattern.** Without `session:{sessionId}` rooms, Story 1.3's broadcasts won't be session-scoped. **Recommendation:** Add room config AC.

7. **Story 1.3 references wrong tRPC procedure.** Should be `trpc.attendee.listBySession` not `trpc.session.getBySlug` (which is from 1.2). **Recommendation:** Clarify procedure name.

8. **Story 4.2 anonymization implementation vague.** "When the anonymization process runs" — where? **Recommendation:** Specify as separate daily scheduled task or conditional branch in lifecycle cron.

9. **No PM2 ecosystem config in Story 1.1.** **Recommendation:** Add `ecosystem.config.js` AC.

---

🧪 **Murat**: Testing perspective — five findings.

10. **Story 1.1 testing ACs too minimal.** "A sample test passes" is scaffold-level, not a quality gate. **Recommendation:** Specify test tooling installation: `@testing-library/react`, `@axe-core/playwright`, Supertest.

11. **Story 1.3 no test mechanism for 3-second broadcast.** **Recommendation:** Add integration test AC using Supertest + Socket.io client.

12. **Story 2.3 missing Playwright E2E test AC.** This is the #1 test risk item per Architecture. **Recommendation:** Add E2E test verifying offline/reconnection/missed-update delivery.

13. **Story 4.1 missing E2E test AC.** #4 test risk item. **Recommendation:** Add Playwright test verifying frictionless session hop.

14. **No `@axe-core/playwright` accessibility test ACs anywhere.** Cross-cutting accessibility is described but never operationalized. **Recommendation:** Add to Stories 1.3, 2.2, and 3.1.

---

💻 **Amelia**: Implementation precision — four findings.

15. **`/event/:eventSlug` lobby route undefined.** All QR codes link to session-specific URLs. What renders at the event-level URL? **Recommendation:** Define as "lists active sessions with links to each session page."

16. **Story 1.3 wrong tRPC reference.** (Same as #7.)

17. **Story 3.2 missing session slug auto-generation.** Events get `eventSlug` but sessions also need `sessionSlug`. **Recommendation:** Add AC for kebab-case auto-generation from session name.

18. **Story 5.3 export mechanism undefined.** "Screenshot-ready HTML page" — how exported? **Recommendation:** Clarify as print-friendly page without admin chrome, `@media print` styles, `window.print()` trigger.

---

🎨 **Sally**: UX perspective — three findings.

19. **AttendeeCard tap affordance underspecified.** Chevron placement and full-row tap target not explicit. **Recommendation:** Clarify card anatomy: `[Photo] [Name / Title·Company] [Chevron →]` with entire row as tap target.

20. **FR23 ">15" vs UX spec "20" threshold.** UX spec refines FR23 into four tiers (1-4, 5-14, 15-19, 20+). **Recommendation:** Note that ACs follow UX spec's refined thresholds; FR23 ">15" is clarified to ">19."

21. **Logo asset not addressed.** OAuthLoadingScreen references "the logo" but no story creates it. **Recommendation:** Define as text treatment: "Who Else Is Here?" in Inter Bold, `text-primary-600`.

---

🏃 **Bob**: Scrum Master perspective — three findings.

22. **Story 1.1 massive scope.** Multi-day story. **Verdict:** Keep as-is (splitting risks non-bootable intermediate state), flag as multi-day.

23. **Intra-epic story dependencies not stated.** Developer agents can't sequence work. **Recommendation:** Add `Dependencies:` line to every story.

24. **Story 1.1 ACs not grouped.** 10+ ACs spanning 5 subsystems. **Recommendation:** Add subsystem headers (Scaffold, Shared, Database, Server, Client, Testing).

---

**Carlos:** apply all 24

---

All 24 findings applied to `epics.md`:

| # | Finding | Fix Applied |
|---|---|---|
| 1 | Express 5 spike buried as AC | Extracted as named subtask with clear output on Story 1.2 |
| 2 | Story 2.2 post-event UI shell note | Added note: UI shell only, full behavior in 4.3 |
| 3 | Rate limiting on wrong endpoint | Fixed to "admin login endpoint" |
| 4 | NFR17 privacy policy missing | Added AC to Story M.1 with content requirements |
| 5 | Missing Drizzle ORM schema AC | Added Database section with Drizzle schema files AC |
| 6 | Missing Socket.io room pattern | Added `session:{sessionId}` room config to server AC |
| 7 | Wrong tRPC procedure in 1.3 | Changed to `trpc.attendee.listBySession({ sessionId })` |
| 8 | Anonymization mechanism vague | Specified as separate daily scheduled task |
| 9 | No PM2 ecosystem config | Added `ecosystem.config.js` AC to Story 1.1 |
| 10 | Testing ACs too minimal | Added specific devDependency installation ACs |
| 11 | No broadcast test mechanism | Added integration test AC (Supertest + Socket.io client) |
| 12 | Story 2.3 missing E2E test | Added Playwright E2E test AC for offline/reconnection |
| 13 | Story 4.1 missing E2E test | Added Playwright E2E test AC for session hop |
| 14 | No axe-core accessibility tests | Added to Stories 1.3, 2.2, 3.1 |
| 15 | Event lobby route undefined | Defined as "lists active sessions with links" |
| 16 | Story 1.3 wrong tRPC (duplicate of #7) | Fixed with #7 |
| 17 | Missing session slug auto-generation | Added session slug AC to Story 3.2 |
| 18 | Export mechanism undefined | Clarified: no admin chrome, `@media print`, `window.print()` |
| 19 | AttendeeCard affordance underspecified | Explicit card anatomy with full-row tap target |
| 20 | FR23 threshold clarified | Added note about UX spec's refined 4-tier thresholds |
| 21 | Logo asset undefined | Defined as text treatment in Inter Bold, primary-600 |
| 22 | Story 1.1 massive scope | Flagged as multi-day story with note |
| 23 | Intra-epic dependencies missing | Added `Dependencies:` line to all 18 stories |
| 24 | Story 1.1 ACs not grouped | Added subsystem headers: Scaffold, Shared, Environment, Database, Server, Client, Testing |

### Key Decisions

1. **Express 5 spike is a subtask, not an AC** — output is a compatibility confirmation document, not a test assertion
2. **Event lobby route (`/event/:eventSlug`) defined** — lists active sessions with links to session pages
3. **Privacy policy at `/privacy`** — covers LinkedIn data, retention, anonymization, contact info (NFR17)
4. **`window.print()` for MVP export** — server-side PDF generation deferred to Phase 3
5. **Logo is a text treatment** — "Who Else Is Here?" in Inter Bold, primary-600; no separate graphic asset needed for MVP
6. **All stories now have explicit Dependencies lines** — enables developer agents to sequence work correctly
