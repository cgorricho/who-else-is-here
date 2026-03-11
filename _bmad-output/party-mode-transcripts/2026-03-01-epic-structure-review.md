---
date: '2026-03-01'
topic: 'Epic Structure Review'
participants: [John (PM), Winston (Architect), Murat (Test Architect), Amelia (Developer), Sally (UX Designer)]
triggeredBy: 'Carlos requested Party Mode review of the proposed 6-epic structure before approving it for story creation.'
---

# Party Mode Transcript: Epic Structure Review

**Date:** 2026-03-01
**Participants:** 📋 John, 🏗️ Winston, 🧪 Murat, 💻 Amelia, 🎨 Sally
**Context:** Step 2 of the Create Epics & Stories workflow proposed a 6-epic structure. Carlos requested Party Mode review before approval.

---

**Carlos:** pp (Party Mode)

---

📋 **John**: PM perspective — three observations on epic structure.

1. **Epic 1 is carrying too much weight.** 17 FRs in one epic — that's 30% of all requirements. Considered splitting into scaffold/auth/list sub-epics but concluded: Epic 1 IS correctly structured as one epic because the user value is "Alex scans → authenticates → browses → taps LinkedIn." That's one complete user journey. Splitting means no epic delivers the end-to-end experience. **Verdict: Keep Epic 1 as-is.**

2. **Epic 4 (Journey Intelligence) sequencing concern.** FR47-FR50 (journey data capture) should be in Epic 1, not Epic 4. Architecture mandates "Full user journey data capture from day one." If Epic 1 ships without journey capture, we lose all pilot data permanently. **Recommendation:** Move FR47-FR50 to Epic 1. Leave FR50b (session_switch) and FR55 (frictionless hop) in Epic 4.

3. **Epic 6 is mixing unrelated things.** Admin analytics + marketing website have zero functional overlap. **Recommendation:** Remove marketing site from Epic 6, make standalone mini-epic or tuck into Epic 3.

---

🏗️ **Winston**: Architecture perspective — two structural concerns.

1. **Journey data capture must be in Epic 1.** The Architecture's implementation sequence puts journey data capture as part of the core API layer. The capture middleware is a few lines of server code alongside API endpoints. Deferring to Epic 4 risks losing all pilot data. **Confirmed John's recommendation.**

2. **Epic 5 (Lifecycle) has implicit dependency on Epic 3 (Admin).** Lifecycle cron checks `sessions` table for `scheduled_end < now()`. If no sessions exist (admin hasn't created any), the cron is inert. Dependency should be documented.

---

🧪 **Murat**: Testing perspective.

1. **Epic 1's E2E coverage is highest-risk.** Architecture's test risk priority: WebSocket reconnection > OAuth flow > journey data capture > session hop. With journey capture moved to Epic 1, the top 3 risk items get tested earliest. Good.

2. **Epic 2 needs Playwright offline simulation.** Different test setup from Epic 1 (`context.setOffline(true)`).

3. **Epic 6 needs seeded data.** Karen's dashboard displays journey data metrics. Tests need mock data or fixtures.

---

💻 **Amelia**: Implementation precision.

1. **Epic 4 with only 2 FRs (FR50b, FR55) is too thin.** Recommended merging Epic 4 + Epic 5 into: "Session Hop, Event Lifecycle & Post-Event" — FR3, FR24, FR25, FR41-FR45, FR50b, FR55. 10 FRs covering session-aware lifecycle + cross-session movement.

2. **UX component phasing aligns with epic ordering.** Phase 1 → Epics 1+2, Phase 2 → Epics 2+3+5, Phase 3 → Epic 5.

---

🎨 **Sally**: UX perspective.

1. **Alex's epic flow makes sense.** Epic 1 = scan and see people. Epic 2 = works offline. Epic 4 = hop between rooms.

2. **Karen's gap.** Karen needs Epic 3 AND Epic 5 (analytics/reports). Her "aha moment" (report) arrives in last epic. If pilots start before Epic 5, Carlos generates reports manually.

---

**Panel Recommended Revised Structure (5 Epics):**

| Epic | Title | FRs | Count |
|---|---|---|---|
| 1 | Project Foundation & Core Attendee Experience | FR1-FR16, FR47-FR50, FR51, FR53 | 21 |
| 2 | PWA, Offline Resilience & Cold Start | FR17-FR23, FR54 | 8 |
| 3 | Admin Event & Session Management | FR26-FR30, FR52 | 6 |
| 4 | Session Hop, Event Lifecycle & Post-Event | FR3, FR24, FR25, FR41-FR45, FR50b, FR55 | 10 |
| 5 | Admin Monitoring, Analytics & Reports | FR31-FR40, FR46 | 11 |
| + | Marketing Website (standalone mini-epic or part of Epic 3) | — | 0 FRs |
| **Total** | | | **56** |

---

**Carlos:** adopt the revised 5-epic structure, exit party mode, and continue

---

### Key Decisions

1. **Journey data capture (FR47-50) moved to Epic 1** — pilot data captured from day one, no data loss risk
2. **Original Epics 4+5 merged** — session hop (2 FRs) too thin alone; combined with lifecycle + post-event as "session-aware behaviors"
3. **Marketing site separated** — unrelated to admin analytics, treated as standalone mini-epic
4. **Epic 1 kept as single large epic (21 FRs)** — delivers complete core user journey; splitting breaks end-to-end value delivery
5. **Epic 4 depends on Epic 3** — lifecycle cron needs sessions to exist from admin event creation
