---
date: '2026-03-01'
topic: 'UX Session Context Discovery'
participants: [Sally (UX Designer), John (PM), Winston (Architect), Mary (Business Analyst), Amelia (Developer)]
triggeredBy: 'UX Design workflow step-09 (Design Directions) — Carlos identified missing session context in header mockups, triggered Party Mode to address event→session hierarchy'
---

# Party Mode Transcript: UX Session Context Discovery

**Date:** 2026-03-01
**Participants:** 🎨 Sally, 📋 John, 🏗️ Winston, 📊 Mary, 💻 Amelia
**Context:** During Step 9 (Design Direction Mockups), Carlos pointed out that the header designs showed only the event name but missed the session layer. He gave a real-world example: Roswell United Methodist Church - Job Networking - Monday 2/23/2026 — Session 1 - 1:00 PM to 3:00 PM - Career Quest Workshop. The QR code updates to point to the next session automatically.

---

**Carlos:** I am missing the session within the event. Roswell United Methodist Church - Job Networking - Monday 2/23/2026 — Session 1 - 1:00 PM to 3:00 PM - Career Quest Workshop (UPDATES TO THE NEXT EVENT THE ATTENDEE SCANS A QR FOR). Party Mode.

---

📋 **John**: This is a critical product observation, Carlos, and it reshapes the header design significantly. Let me unpack what you're telling us:

**The real information hierarchy at the event is:**
1. **Organization**: Roswell United Methodist Church
2. **Event series**: Job Networking
3. **Date**: Monday 2/23/2026
4. **Session**: Session 1 - 1:00 PM to 3:00 PM
5. **Session name**: Career Quest Workshop

And the QR code is **session-scoped**, not event-scoped. Alex scans and lands on a specific session's attendee list. The critical UX implication: when Alex scans the QR code for "Career Quest Workshop," the header must clearly say "Career Quest Workshop" — not just "Job Networking." Alex needs to know they're looking at the right session's attendees, not a different session that happened earlier or is happening in the next room.

And then — this is the killer detail — **the QR code UPDATES to point to the next session.** So the same physical signage at the venue rotates which session it links to. This means the URL structure isn't just `/event/[slug]` — it's something like `/event/[event-slug]/session/[session-slug]` or the QR dynamically redirects based on the current time.

Sally, your header needs to handle this. "Tech Careers Meetup" as a single event name was an oversimplification.

🏗️ **Winston**: John nailed the URL structure question. Let me think about this architecturally.

**Two approaches to session-aware QR codes:**

**Approach A: Static QR, dynamic redirect.** The QR code URL is always the same (e.g., `/event/rumc-job-networking`). The server checks the current time against the session schedule and redirects to the current/next session. Pro: one QR code for all sessions, never needs reprinting. Con: server logic to determine "current session" based on time.

**Approach B: Session-specific QR codes.** Each session has its own QR code URL (`/event/rumc-job-networking/career-quest`). The organizer swaps the displayed QR code between sessions. Pro: simpler routing, explicit. Con: Karen has to manage multiple QR codes.

Carlos said "UPDATES TO THE NEXT EVENT THE ATTENDEE SCANS A QR FOR" — this sounds like **Approach A: one QR that dynamically points to the current session**. The signage stays the same; the destination changes based on the schedule.

This has a UX implication Sally needs to address: **what happens if Alex scans between sessions?** The QR code points to... what? The next session? A "no active session" screen? The previous session's list? This is an edge case the design must handle.

Also — the database schema in the architecture has an `events` table but no `sessions` table. If sessions are a first-class concept (which they clearly are from Carlos's example), the architecture may need a `sessions` table: `id, event_id FK, name, scheduled_start, scheduled_end, slug`. This is an architecture gap uncovered by UX design — exactly what this step should surface.

📊 **Mary**: I want to connect this to Karen's real workflow. Carlos, your example tells me something critical about the target market: **these aren't one-off events — they're recurring sessions within ongoing programs.**

Roswell UMC Job Networking isn't a single event. It's a program with regular sessions. Karen (the church volunteer organizing this) runs "Career Quest Workshop" on one Monday, "Resume Review" the next Monday, "Mock Interviews" the month after. Same venue, same QR signage, different sessions, different attendees each time.

This means Karen's admin panel needs to show:
- The **event** (Job Networking) as a container
- **Sessions** within that event, each with their own attendee list, analytics, and report
- Karen's post-event report is probably **per-session**, not per-event — "Career Quest Workshop had 38 attendees and 127 LinkedIn taps" is more useful than "Job Networking had 150 attendees across 4 sessions"

The header design needs to communicate session identity clearly because Alex at "Career Quest Workshop" and Alex at "Resume Review" two weeks later are scanning the same physical QR code and seeing different attendee lists. **The session name is the primary identifier**, not the event name.

💻 **Amelia**: Let me get specific about what the developer agent needs from the header redesign.

**Current header spec (Direction B):**
```
│ Tech Careers Meetup            │  ← one line: event name
│ 38 professionals here     🔍  │  ← counter + search
```

**What it needs to show:**
```
│ Career Quest Workshop          │  ← SESSION name (primary)
│ RUMC Job Networking · 1-3 PM   │  ← Event name · time range (secondary)
│ 38 professionals here     🔍  │  ← counter + search
```

That's a 3-line header now. On mobile, that's ~80px of sticky header instead of ~56px. We lose roughly one card of viewport space compared to the 2-line header. Trade-off: Alex always knows exactly which session they're in.

Alternative — **2-line header with session as primary:**
```
│ Career Quest Workshop · 1-3PM │  ← Session name + time (primary line)
│ 38 professionals here     🔍  │  ← counter + search
```

This keeps the 2-line header height but drops the parent event name. Viable because Alex is AT the event — they know it's "RUMC Job Networking." What they might NOT know is which session this specific QR code opened. The session name is the disambiguator.

🎨 **Sally**: This is a significant design refinement and I'm glad Carlos caught it. The mockups assumed a flat event model when the real product has an **event → session hierarchy.**

Here's my recommendation:

**Mobile header — 2 lines, session-primary:**
```
│ Career Quest Workshop    1-3PM│  ← Session name + time
│ 38 professionals here     🔍 │  ← Counter + search
```

**Rationale:**
- Session name is the **disambiguator** — Alex already knows the event (they're standing in it)
- Time range confirms "yes, this is the current session" — especially important if Alex scans between sessions
- Parent event name is NOT in the header. It's visible on the pre-OAuth screen ("You're joining Career Quest Workshop at RUMC Job Networking") and in the page `<title>` for browser tab identification, but it doesn't need to consume header space

**Desktop header — 2 lines, richer context:**
```
│ Career Quest Workshop · 1:00 PM – 3:00 PM          │
│ RUMC Job Networking · 38 professionals here    🔍   │
```

Desktop has the space. Show the full session name, full time range, parent event name, counter, and search.

**Between-sessions state:**
If Alex scans the QR code between sessions, they see:
```
┌────────────────────────────────────┐
│ RUMC Job Networking                │
│ Next: Resume Review · 1:00 PM     │
├────────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐  │
│  │  The next session hasn't     │  │
│  │  started yet. Come back at   │  │
│  │  1:00 PM for Resume Review.  │  │
│  └──────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

This handles the edge case Winston flagged — no ambiguity, no broken experience.

**Architecture implication:** Winston is right. We need a `sessions` table. This should be flagged as an architecture update needed before developer stories begin.

---

**Carlos:** E

---

### Summary of Panel Contributions

| Agent | Contribution | Impact on UX Spec |
|---|---|---|
| 📋 John | Event→session hierarchy reshapes header; QR is session-scoped, not event-scoped | Header redesigned with session name as primary identifier |
| 🏗️ Winston | Two QR routing approaches (static+redirect vs session-specific); between-sessions edge case; `sessions` table needed in architecture | Approach A (dynamic redirect) selected; between-sessions screen designed; architecture gap flagged |
| 📊 Mary | Events are recurring programs with multiple sessions; Karen's reports are per-session; session name is the primary identifier | Admin panel shows event→session hierarchy; reports per-session |
| 💻 Amelia | 2-line vs 3-line header trade-off; specific layout specs for developer agent | 2-line mobile header (session name + time / counter + search) |
| 🎨 Sally | Session-primary 2-line mobile header; richer desktop header; between-sessions state design; pre-OAuth shows full context | Complete header redesign with session awareness; new between-sessions screen |

### Architecture Gaps Identified

- **`sessions` table needed** — `id, event_id FK, name, scheduled_start, scheduled_end, slug` — not in current architecture schema
- **Dynamic QR routing** — server-side logic to redirect `/event/[slug]` to current/next session based on schedule
- **Session-scoped attendee lists** — attendees belong to sessions, not just events
- **Per-session analytics** — Karen's reports are session-level, not event-level
