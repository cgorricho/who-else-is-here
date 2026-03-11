---
date: '2026-03-01'
topic: 'Architecture Concurrent Sessions Review'
participants: [Winston (Architect), John (PM), Mary (Business Analyst), Amelia (Developer), Murat (Test Architect)]
triggeredBy: 'Carlos requested architecture review after sessions table addition. During review, Carlos provided the RUMC Oct 13 2025 agenda showing 7 concurrent sessions at 7:00 PM — proving concurrent sessions are the norm, not an edge case. This triggered a fundamental revision of the session model from "sequential sessions with dynamic resolver" to "per-session QR codes with concurrent sessions as the primary flow."'
---

# Party Mode Transcript: Architecture Concurrent Sessions Review

**Date:** 2026-03-01
**Participants:** 🏗️ Winston, 📋 John, 📊 Mary, 💻 Amelia, 🧪 Murat
**Context:** Carlos requested Party Mode to review the architecture after adding the sessions table. During the session, Carlos identified that the panel had fundamentally misunderstood the session model — assuming sequential sessions when the RUMC agenda clearly shows up to 7 concurrent sessions. Carlos provided the RUMC Oct 13, 2025 agenda as ground truth.

---

**RUMC Agenda Analysis (Oct 13, 2025):**

| Time | Concurrent Sessions |
|---|---|
| 1:00-3:00 | 1 (Seven Steps to Job Search) |
| 3:00-4:00 | 3 concurrent (Create Your Plan + Gwinnett Tech Seminar + Resume Writing) |
| 4:00-5:30 | 4-5 concurrent (Elevator Pitch + AI Job Search + Mock Interviews + Overcoming Ageism + Attire to Hire) |
| 5:30-7:00 | 1 (Dinner + Carrisa Jones) |
| 7:00-8:00 | 7 concurrent (Career Control + Recruiters + Industry Guide + LinkedIn Photos + Resume Review + God's Talking + Chapel Prayer) |

---

**Carlos:** I see that session seems to be a dominant topic. Here is my take:
* sessions are the foundation of events
* in big events, sessions will occur sequentially, with overlaps or concurrently. This is the norm
* I have observed at RUMC, where I deliver an AI applied to job search workshop, people that go to one session for 30 minutes (almost all are 60 min) and then jump to our session, which lasts a bit more
* here is one core principle, one persona can only be at one place at one time
* we should expect that this person, once she realizes the value of Who Else Is Here (WEIS), she could scan the qr code in the sessions where she is
* the app has to record the attendee journey, even if she jumps from one session to other

---

🏗️ **Winston**: Five revised architectural principles:

1. **QR codes are per-session.** Each room has its own QR code with direct URL `/event/:eventSlug/session/:sessionSlug`. No dynamic resolver needed for primary flow.
2. **`session-resolver.ts` becomes optional "event lobby."** If Karen wants a master QR at registration showing active sessions to choose from — nice-to-have, not primary flow.
3. **Concurrent sessions are the norm.** 7 simultaneous sessions at RUMC. No overlap validation. Admin should support bulk session creation.
4. **One persona, one active location at a time.** Alex appears in multiple session lists (historical), but current location is most recent scan. Journey captures every switch.
5. **Frictionless session hop.** OAuth ONCE. Every subsequent QR scan recognized via HTTP cookie → create attendee in new session from cached profile → show list. Zero re-authentication.

Architecture changes: Remove session-resolver as primary flow, per-session QR generation, add `session_switch` journey event type, OAuth state parameter must include `sessionId`, returning-attendee flow (cookie check → auto-create in new session).

📋 **John**: PRD changes needed:
- FR29-30: QR codes per-session with session name + room on printout
- FR47-50: Add `session_switch` journey event type
- FR10: Rename to clarify "browser sessions" vs "event sessions"
- New FR: Returning attendee scans new session QR → no re-auth → auto-create attendee record
- KPIs: "60%+ multi-session scanning" is NOW an MVP KPI (per-session QR codes are MVP)
- Add KPI: Cross-session attendance rate
- User journeys: Add session-hop path for Alex, bulk session creation for Karen

📊 **Mary**: Product Brief changes:
- Session-scoped attendee data is MVP differentiator, not V2
- Karen creates sessions with rooms, generates per-session QR codes
- Success metrics: per-session AND cross-session metrics are MVP
- Move "session-scoped QR codes" from V2 into MVP scope
- Keep "event-wide aggregate tab" as V2

💻 **Amelia**: Architecture changes:
1. Rewrite Dynamic QR Routing Logic — primary flow is direct QR → session page
2. Rename session-resolver purpose (event lobby, not primary routing)
3. qr-generator.ts generates per-session QR codes with session name + room
4. Update data flow for direct session URL + returning-attendee flow
5. Add `session_switch` to journey event type enum
6. OAuth state parameter must include sessionId

🧪 **Murat**: Testing changes:
- Highest-risk path is now returning-attendee session hop (E2E test: auth Session A → scan Session B → no OAuth → list renders)
- Session resolver tests still needed but for optional event lobby
- Add: overlap session creation (create 7 concurrent sessions) as admin test
- Add: cross-session journey integrity test

---

**Carlos:** do the revisions in party mode, then update all documents

---

### Summary of Panel Contributions

| Agent | Contribution | Impact |
|---|---|---|
| 🏗️ Winston | 5 revised architectural principles: per-session QR, optional event lobby, concurrent sessions as norm, one-persona-one-place, frictionless session hop | Complete architecture rewrite of session routing model |
| 📋 John | PRD FR updates: per-session QR (FR29-30), session_switch journey type, returning-attendee FR, KPI revisions | PRD session-related FRs and KPIs updated |
| 📊 Mary | Product Brief positioning: session-scoped data is MVP differentiator, not V2 | Product Brief scope changes |
| 💻 Amelia | Specific architecture file edits: routing logic, resolver purpose, QR generator, data flow, OAuth state | Implementation-ready architecture changes |
| 🧪 Murat | Test strategy: returning-attendee E2E test is highest priority, concurrent session creation test | Test priorities reordered |

### Key Decisions

1. **Per-session QR codes are MVP** — not V2. Each room gets its own QR code.
2. **Session-resolver is optional** — "event lobby" for master QR at registration, not primary attendee flow.
3. **Concurrent sessions are the norm** — RUMC has 7 simultaneous sessions. No overlap prevention.
4. **Frictionless session hop** — OAuth once, HTTP cookie carries. Auto-create attendee in new session.
5. **Journey tracking across sessions** — `session_switch` event type captures cross-session movement.
