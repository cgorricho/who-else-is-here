---
date: '2026-03-01'
topic: 'Cross-Document Consistency Audit'
participants: [Winston (Architect), John (PM), Mary (Business Analyst), Amelia (Developer), Sally (UX Designer), Murat (Test Architect)]
triggeredBy: 'Carlos requested a comprehensive Party Mode review of all four planning documents (Product Brief, PRD, Architecture, UX Design Specification) after discovering that the concurrent sessions model had been missed by all agents. Three documents were patched by individual background agents, and the UX spec was updated by a single agent without panel review. Carlos wanted to ensure no shortcuts, patches, oversights, or inconsistencies remained.'
---

# Party Mode Transcript: Cross-Document Consistency Audit

**Date:** 2026-03-01
**Participants:** 🏗️ Winston, 📋 John, 📊 Mary, 💻 Amelia, 🎨 Sally, 🧪 Murat
**Context:** Carlos requested a comprehensive cross-document consistency audit after the concurrent sessions model revision. Three background agents had updated Product Brief, PRD, and Architecture independently, and the UX spec was patched by a single agent. Carlos wanted the full panel to verify consistency across all four documents.

---

**Carlos:** hi Master
I am concerned because we just evidenced that up to this point all agents had missed the foundational truth for this project: events have sessions that can run, sequentially or concurrently
I had the last party mode review the three documents so far, brief, PRD, and architecture, but UX design spec was reviewed by one single agent, not sure if sally or other
would you agree that this is a good moment to launch a massive party mode to review all the project documents, brief, PRD, architecture and UX spec, and make sure that there are no shortcuts, patches, oversights, or other problems or inconsistencies?

---

🏗️ **Winston**: Five findings from structural audit:

1. **Architecture says "4 tables" in validation section — actually 5 tables.** The `sessions` table was added after the validation was written. References at lines 990, 1010, 1033 all say "4 tables."

2. **Event lifecycle transition scope — PRD vs Architecture conflict.** PRD FR41 says "Lifecycle transitions apply at the event level in MVP. All sessions within an event transition together." Architecture has `post_event_ends_at` on the `sessions` table and `event-lifecycle.ts` described as "now per-session." These contradict each other.

3. **`BetweenSessionsScreen` concept is problematic with concurrent sessions.** UX spec defines this component for "when QR is scanned between active sessions." With concurrent sessions and per-session QR codes, there is no "between sessions" — each QR links to a specific session. The component was designed for a sequential session model.

4. **Architecture `/event/:eventSlug/between` route is orphaned.** With per-session QR codes, no attendee navigates to this route. Should be removed or repurposed.

📋 **John**: PRD alignment findings:

5. **FR14 says "total number of authenticated attendees at the current event" — should be "current session."** The attendee list is session-scoped. The UX spec's `SessionHeader` already shows session-scoped count.

6. **FR40 distraction health metric assumes single "break" time.** With concurrent sessions, there's no unified break — metric needs to be per-session.

7. **PRD Product Scope MVP item #8 says "Basic analytics dashboard" — rest of document says "Per-session analytics dashboard."**

📊 **Mary**: Requirements traceability findings:

8. **Architecture validation says "47/54 FRs Fully Covered" — FR55 and FR50b were added AFTER validation.** The FR count is now 56, but validation doesn't include the two new critical FRs.

9. **Architecture Completeness Checklist says "4 tables" — should be "5 tables."**

💻 **Amelia**: Implementation precision findings:

10. **Architecture `event-lifecycle.ts` cron job queries `events` where `scheduled_end < now()` — but `scheduled_end` was removed from events table.** The cron should query `sessions` table. A developer agent following this description will query a column that doesn't exist.

11. **UX spec `SessionHeader` props include `timeRange` — formatting pattern from two timestamps should be specified.** Minor — existing `Intl.DateTimeFormat` pattern sufficient.

12. **Architecture shared schemas directory listing is missing `session.ts`.** The file is referenced in FR mapping (lines 812, 818, 842, 860, 861) but not listed in the directory structure.

🎨 **Sally**: UX-specific findings:

13. **`SessionList` component has no anatomy spec.** Appears in priority table and Phase 3 implementation but lacks props, Tailwind spec, or accessibility notes.

14. **`BetweenSessionsScreen` should be reconceptualized as `SessionStatusScreen`.** Handles: not-yet-started, post-event (read-only), archived. Rendered inline by `session-page.tsx`, not as a separate route.

🧪 **Murat**: Testing and consistency findings:

15. **Architecture validation section was written pre-sessions.** Missing test coverage for session hop E2E, concurrent session creation, session_switch integrity, per-session QR generation.

16. **No NFR for session hop latency.** The 30-second promise applies to first scan with OAuth, but session hop is supposed to be near-instant. No target specified.

---

**Carlos:** keep the party mode active and fix all inconsistencies, refer to further discussions with the agents for clarifications of the points they raised

---

**Panel discussion on Issue #2 (lifecycle scope):**

🏗️ **Winston**: My recommendation: MVP lifecycle is session-level in the database, event-level in the admin UI. The cron job checks `sessions` where `scheduled_end < now()`. The `events.status` is derived: if ALL sessions are `post_event` or `archived`, event is `post_event`. If ALL are `archived`, event is `archived`. If ANY session is `active`, event is `active`. This avoids archiving a 1:00 PM session at 8:00 PM just because 7:00 PM sessions are still running.

📋 **John**: Agreed. FR41 should be updated to say system transitions individual sessions based on their own `scheduled_end`. Event status is derived from sessions.

💻 **Amelia**: The cron job description needs to query `sessions`, not `events`. Keep `events.status` as denormalized cache updated by the cron.

**All fixes applied:**

| # | Finding | Fix Applied | Document |
|---|---|---|---|
| 1 | Table count "4" → "5" | Updated 3 locations | Architecture |
| 2 | Lifecycle scope conflict | Both aligned: session-level transitions, event status derived | PRD (FR41) + Architecture |
| 3 | `BetweenSessionsScreen` invalid | Replaced with `SessionStatusScreen` (inline, not separate route) | UX Spec |
| 4 | `/event/:eventSlug/between` orphaned | Route removed | Architecture + UX Spec |
| 5 | FR14 "event" → "session" count | Updated | PRD |
| 6 | FR40 distraction metric per-session | Updated | PRD |
| 7 | MVP item #8 "Basic" → "Per-session" | Updated | PRD |
| 8 | FR count 54 → 56 in validation | Updated with FR55, FR50b coverage | Architecture |
| 9 | Checklist table count "4" → "5" | Updated | Architecture |
| 10 | Cron queries nonexistent column | Now queries `sessions` table | Architecture |
| 11 | Time range formatting (minor) | Existing pattern sufficient | No change needed |
| 12 | Missing `session.ts` shared schema | Added to directory listing + tests | Architecture |
| 13 | `SessionList` component missing spec | Full component spec added | UX Spec |
| 14 | `BetweenSessionsScreen` → `SessionStatusScreen` | Renamed and reconceptualized | UX Spec |
| 15 | Validation pre-dates sessions | Post-revision items added to gap analysis | Architecture |
| 16 | No NFR for session hop latency | NFR9b added: <4 seconds | PRD |

---

### Summary of Panel Contributions

| Agent | Contribution | Impact |
|---|---|---|
| 🏗️ Winston | 4 structural findings: table counts, lifecycle scope, BetweenSessionsScreen, orphaned route. Led resolution of lifecycle scope design. | Architecture + UX Spec restructured |
| 📋 John | 3 PRD alignment findings: FR14 scope, FR40 metric, MVP item #8 label | PRD FRs and scope corrected |
| 📊 Mary | 2 traceability findings: FR count in validation, checklist table count | Architecture validation updated |
| 💻 Amelia | 3 implementation precision findings: cron job column, time formatting, missing schema file | Architecture code-breaking issues fixed |
| 🎨 Sally | 2 UX findings: SessionList component spec missing, BetweenSessionsScreen reconceptualization | UX Spec components added/revised |
| 🧪 Murat | 2 testing findings: validation pre-dates sessions, missing session hop NFR | Architecture validation + PRD NFR added |

### Key Decisions

1. **Session-level lifecycle transitions** — Cron job checks `sessions` table. Event status is derived from aggregate session states. Concurrent sessions transition independently.
2. **`BetweenSessionsScreen` → `SessionStatusScreen`** — No "between sessions" concept with concurrent sessions. Session states (draft, post_event, archived) handled inline by `session-page.tsx`.
3. **`/event/:eventSlug/between` route removed** — Per-session QR codes mean attendees always land on a specific session page.
4. **NFR9b added** — Frictionless session hop must complete in <4 seconds (no OAuth, cookie-based).
5. **`session.ts` shared schema** — Added to Architecture directory listing to prevent developer agent confusion.
