---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - docs/brainstorming-session-results.md
  - docs/202510092157_strategic_opportunities_brainstorming.md
  - docs/server-configuration-analysis.md
date: 2026-02-24
author: Carlos
---

# Product Brief: Who Else Is Here

## Executive Summary

You're at a large-attendance event. You know the people who could change your career — your next client, your next employer, your next collaborator — are somewhere in this room. But you're stuck at one table, talking to the ten people around you, while hundreds of potential connections walk past. You leave having met a fraction of the room, wondering who you missed.

Who Else Is Here puts every attendee in your pocket. One QR code scan and you see everyone — who they are, what they do, and how to connect. No app downloads. No complex setup. No burden on the event organizer. Just: **see everyone, meet the right ones.**

It's the attendee layer for any professional event — from a 20-person meetup to a 5,000-person conference, online or in-person. LinkedIn authentication provides instant professional context. The organizer shares their agenda; we handle the rest. Attendees network without limits.

---

## Core Vision

### Problem Statement

At professional events, attendees are blind to who else is in the room. A 1,500-person conference may yield only 10-15 meaningful connections due to seating, timing, and logistics. The larger the event, the worse the ratio — and the higher the likelihood of missing the exact people who would have been most valuable to connect with.

The real enemy is not physical constraints — it's **blindness and friction**. Today, after an event, people open LinkedIn, type half-remembered names, scroll through dozens of results, give up, and lose the connection forever. Or worse — they never even *knew* the right person was in the room.

### Problem Impact

This disproportionately affects professionals for whom networking is career-critical: people in career transition, business development, sales, marketing, founders seeking investment, and executives seeking talent or new opportunities. These attendees invest time and money to attend events specifically to build professional relationships, yet leave having connected with a fraction of the room.

Critically, this problem is **bidirectional**. The job seeker desperate to be seen is mirrored by the hiring manager who can't find the right candidate. The founder looking for financing is mirrored by the PE executive looking for the next investment opportunity. The vendor looking for clients is mirrored by the executive who might benefit from a new technology. Every missed connection is a missed opportunity for *both sides*.

### Why Existing Solutions Fall Short

Current solutions (Bizzabo, Swapcard, Whova, Grip) are full event management platforms priced at $1,500-$5,000+ that bolt networking on as a secondary feature. They require organizer buy-in, complex setup, and registration platform integration. This creates three critical gaps:

1. **Accessibility:** Most events — meetups, free networking groups, small conferences — will never pay $1,500+ for event software
2. **Independence:** Networking features are locked inside the organizer's chosen platform
3. **Simplicity:** Attendees face complex apps when all they want is to see who else is in the room

Additionally, none of these platforms solve the core UX problem: they try to *replace* professional networking tools rather than *connecting to them*. They build in-app messaging, in-app profiles, in-app connection management — duplicating what LinkedIn already does well, while creating yet another silo attendees must learn and maintain.

### Proposed Solution

Who Else Is Here is a **bridge to LinkedIn, scoped to a live event**. It is not a networking platform — it is a real-time, event-scoped attendee directory where every entry links directly to the person's LinkedIn profile.

The experience is radically simple:
1. **Scan** — Attendee scans a QR code at the event or session
2. **Browse** — See everyone who scanned: name, title, company, photo (from LinkedIn)
3. **Tap** — Land directly on their LinkedIn profile to explore, connect, or message
4. **Return** — Come back to the list, find the next person

There is no pre-registration. The attendee list builds live, by the people who actually show up and scan. The app's job is done the moment someone taps a name and lands on LinkedIn. Everything after that happens where people already know how to network.

The emotional motivation to scan is not "check in for the organizer." It's: **"Make yourself visible so the right people can find YOU."** This works in every direction — the job seeker wants to be found, the hiring manager wants to find. The founder wants funding, the investor wants deal flow. Every scan creates value for everyone on the list.

### Key Differentiators

1. **Platform-agnostic:** Works alongside any event — no organizer platform dependency, no integration required. Can be present at 10 events simultaneously with zero operational overhead per event.
2. **LinkedIn-as-identity:** Professional context is instant and trusted, not self-reported. Each list entry IS the link to the person's LinkedIn profile — the app is a springboard, not a destination.
3. **Full networking lifecycle:** Discovery before, action during, and follow-up after the event.
4. **Radical simplicity:** QR code to attendee list in under 30 seconds — no downloads, no complex onboarding. The entire UI is essentially a single screen with a list.
5. **Universal applicability:** From 20-person meetups to 5,000-person conferences, online or in-person, including recurring periodic events with the same format.
6. **Zero-burden onboarding:** Organizers share their existing agenda (PDF, link, text) — we handle event creation, session extraction, and QR code generation. The organizer's only decision is "yes, deploy the app at my event." We do the rest.

---

## Target Users

### Primary Users

#### Persona 1: The Attendee — "Alex"

**Who they are:** Any professional attending an event — job seekers, executives, founders, investors, sales professionals, speakers, coaches, vendors. The role varies; the behavior is identical.

**Context:** Alex attends professional events regularly — meetups, conferences, workshops, job networking sessions. Sometimes Alex is in career transition, sometimes closing deals, sometimes scouting talent, sometimes speaking on stage. The motivation changes by event; the frustration doesn't.

**The Problem Alex Lives:** Alex walks into a 300-person event knowing valuable connections are in the room but having no way to find them. Alex networks with whoever happens to be nearby — the luck of seating, timing, and proximity. After the event, Alex opens LinkedIn, tries to remember names, searches unsuccessfully, and moves on. The connections that could have mattered are lost.

**Current Workarounds:**
- Manually scanning name badges while walking through crowds
- Asking "what do you do?" dozens of times hoping to find relevance
- Post-event LinkedIn searches based on half-remembered names
- Hoping the organizer shares an attendee list (they rarely do)

**What Success Looks Like:** Alex scans a QR code, sees every attendee with their name, title, company, and photo. Alex taps a name, lands on their LinkedIn profile, and decides in seconds whether to connect, message, or walk over and introduce themselves. Alex leaves the event having identified and connected with the people who actually matter — not just the people who happened to sit nearby.

**Emotional Motivation:** "Make yourself visible so the right people can find you." Alex scans not just to find others, but to BE found. The job seeker wants the hiring manager to see them. The founder wants the investor to notice them. The vendor wants prospects to discover them. Every scan is a signal: "I'm here and I'm open for business."

**App Interaction:** Identical for all attendees regardless of motivation — scan QR code, authenticate via LinkedIn, appear on the list, browse others, tap to visit LinkedIn profiles. The app is a bridge, not a destination.

#### Persona 2: The Event Organizer — "Karen"

**Who they are:** The person responsible for organizing and running the event. Could be a coordinator at a church job networking group (like RUMC's Karen Griggs Medley), a meetup organizer, a conference director, or a corporate event planner.

**Context:** Karen has already done the hard work — booked the venue, confirmed speakers, built the agenda, handled registration. She doesn't want another platform to manage. She wants networking value added to her event with zero additional effort on her part.

**The Problem Karen Lives:** Karen knows networking is why people come to her events, but she has zero visibility into whether it actually happens. She sees registration counts and room attendance, but has no idea whether attendees actually connected with each other. She can't prove networking ROI to sponsors or justify ticket prices with engagement data.

**Current Workarounds:**
- Post-event surveys asking "did you network?" (unreliable)
- Counting badge scans at sponsor booths (measures foot traffic, not connections)
- Anecdotal feedback from attendees
- No data at all for most small/free events

**What Success Looks Like:** Karen shares her existing agenda (PDF, link, text). We create the event, generate QR codes for each session, and hand them back ready to print. At the event, Karen can see real-time data: how many attendees scanned in, which sessions drove the most networking activity, and a post-event report showing the networking footprint of her event.

**Emotional Motivation:** "I want to prove my event creates real value." Karen wants data that shows her event isn't just attended — it's where meaningful professional connections happen.

**App Interaction:** Karen never scans a QR code or browses the attendee list to network. Her interaction is: authorize deployment → share agenda → receive QR codes → deploy at event → view analytics dashboard.

### Secondary Users

#### Paid Sponsors — "Acme Corp"

**Who they are:** Companies or organizations with a commercial presence at the event — sponsors, exhibitors, vendor booths.

**Distinction from regular attendees:** Sponsors interact with the attendee list the same way any attendee does (browse, tap, LinkedIn). However, when sponsors pay for visibility, they receive:
- Pinned position and/or dedicated sponsors section in the attendee list
- Links to their landing pages of choice instead of LinkedIn profiles
- Visibility as a sponsor/exhibitor to all attendees browsing the list

**This is a post-MVP monetization feature**, not a core product requirement. In MVP, sponsors scan and appear on the list like any other attendee.

### User Journeys

#### Attendee Journey — "Alex at a Conference"

1. **Discovery:** Alex sees a QR code on a banner, table tent, or projected slide at the event. Or receives a link shared by the organizer before the event.
2. **Onboarding:** Alex scans the QR code. Authenticates with LinkedIn (or GitHub/Google with a brief profile prompt). Takes under 30 seconds.
3. **Core Usage:** Alex browses the attendee list — name, title, company, photo. Taps a name, lands on their LinkedIn profile. Decides to connect, message, or find them in the room. Returns to the list to find the next person.
4. **Engage:** Alex bookmarks profiles they're interested in — a simple one-tap action. This is a personal organizational tool. As a byproduct, the bookmarked person sees a badge on their own app view: "4 people bookmarked you at this event" — a lightweight awareness nudge that signals "check your LinkedIn, someone here is trying to connect with you." No names revealed, no matching mechanics, no in-app messaging. Just awareness.
5. **Success Moment:** Alex spots "VP of Partnerships at [exact company I've been targeting]" on the list, taps through to LinkedIn, sends a connection request with a note: "We're both at [event name] — would love to connect." Bookmarks them in the app.
6. **Long-term:** Alex expects Who Else Is Here at every event. At recurring meetups (C3G, Atlanta Job Seekers), scanning becomes ritual. Alex checks the list before each session to see who's new.

#### Organizer Journey — "Karen Deploys the App"

1. **Discovery:** Karen hears about Who Else Is Here from another organizer or is approached directly.
2. **Onboarding:** Karen says "yes." Shares her existing agenda PDF. Receives QR codes ready to print. Zero configuration work on her part.
3. **Core Usage:** At the event, Karen deploys QR codes at registration, session rooms, and common areas. During the event, she can glance at real-time scan counts.
4. **Success Moment:** Post-event, Karen sees: "247 attendees scanned in. 89 bookmarks created across attendees. Highest networking activity during the Elevator Pitch workshop." She shares this with her sponsors.
5. **Long-term:** Karen deploys Who Else Is Here at every recurring event. For periodic meetups with the same format, the app handles it automatically — same structure, new date, fresh QR codes.

---

## Success Metrics

### User Success Metrics (Alex — The Attendee)

| Metric | What It Measures | How It's Measured |
|---|---|---|
| **Activation rate** | Did the attendee engage beyond scanning? | % of scanners who browse the attendee list beyond the first screen |
| **Profile tap rate** | Are attendees finding connection value? | LinkedIn profile taps as % of attendee list size, banded by event size: small events (20-50 people) 15-25%, medium events (100-300) 5-10%, large events (500+) 2-5% |
| **Post-event return visits** | Does the app deliver sustained value? | Unique return sessions within a 5-day post-event window |

### Organizer Success Metrics (Karen — The Event Organizer)

| Metric | What It Measures | How It's Measured |
|---|---|---|
| **Session scan-in counts** | Which sessions drove attendee engagement? | Number of QR scans per session |
| **Cross-session flow** | Attendee journey through the event | Number of unique users scanning into 2+ sessions within the larger gathering |
| **Networking density per session** | Where meaningful connections happened | Profile taps per session |
| **Total unique attendees** | Organic reach of the app across the event | Unique users across all sessions |

### Internal Health Metric (Not User-Facing)

| Metric | What It Measures | How It's Measured |
|---|---|---|
| **Usage timing pattern** | Is the app becoming a session distractor? | Distribution of profile taps during active sessions vs. breaks and transitions |

### Business Objectives

- **3-month target:** Successful deployment at 2-3 pilot events (C3G, Atlanta Job Seekers) with activation rates above 50% of attendees scanning in
- **6-month target:** Organic adoption by 5+ event organizers through word-of-mouth, with organizers requesting repeat deployment
- **12-month target:** Establish session-scoped attendee journey data as a unique market asset — the only source of cross-session attendance flow data in the events industry

### Key Performance Indicators

1. **Pilot validation:** 50+ scans at first pilot event (confirms attendees see value in joining)
2. **Organizer retention:** Pilot organizers deploy at their next event without being asked (confirms organizer value)
3. **Networking proof:** Average profile tap rate meets or exceeds the event-size band targets defined above
4. **Journey data generation:** 60%+ of attendees at multi-session events scan into 2+ sessions (confirms the session-first QR model works)
5. **Distraction health check:** Less than 30% of profile taps occur during active session times (confirms the app supports rather than undermines event engagement)

---

## MVP Scope

### Core Features

**Attendee Experience:**
1. **Single-event QR code scanning** — One QR code per event, attendees scan to join the attendee list
2. **LinkedIn-only authentication** — LinkedIn OAuth provides name, title, company, photo. No manual profile fallback in MVP
3. **Live attendee list** — Real-time directory of everyone who has scanned in, showing name, title, company, and photo from LinkedIn
4. **One-tap LinkedIn profile access** — Tap any attendee to land directly on their LinkedIn profile
5. **5-day post-event access** — Attendee list remains accessible for 5 days after the event for follow-up connections
6. **Simple open-door feedback** — A single unstructured text prompt triggered after meaningful engagement (e.g., after 3rd profile tap or post-event), asking "How was your experience? Anything you wish this app could do?"

**Organizer Experience:**
7. **Zero-effort event setup** — Organizer shares agenda (PDF, link, text); we create the event and generate the QR code
8. **Basic analytics dashboard** — Real-time scan count, total profile taps, and simplified user journey visualization (scan timeline, engagement patterns, activity over time)
9. **Post-event summary report** — Exportable report Karen can share with sponsors showing networking activity at her event

**Back-End Data Infrastructure:**
10. **Full user journey data capture** — Every scan timestamp, profile tap, browse session, and return visit captured and stored. Data schema designed for the multi-session future even though the MVP UI exposes only single-event views. This is a strategic asset from day one.

### Out of Scope for MVP

- Session-first model with event-wide aggregate tab (V2)
- AI-generated intro video with organizer/sponsor branding (V2+)
- Bookmark feature (deferred — dropped as metric and feature)
- AI matching and recommendation engine (V3)
- Proximity-based attendee sorting (V3)
- Attendee pricing tiers — free / smart / power networking (V3)
- Organizer pricing tiers — basic / pro / premium analytics (V3)
- Sponsor premium placement and analytics (V3)
- Ambient avatar assistant for distraction management (V3+)
- Event intelligence data licensing (long-term)
- Non-LinkedIn authentication fallback (post-MVP, evaluate based on adoption data)
- Native mobile apps (web-only, mobile-responsive)
- Registration platform integrations

### MVP Success Criteria

- **Activation gate:** Activation rate above 25% of event attendees scanning in at pilot events (below this signals insufficient perceived value)
- **Engagement gate:** Average profile tap rate meets event-size band targets (15-25% for small events, 5-10% for medium)
- **Organizer retention gate:** Pilot organizers (C3G, Atlanta Job Seekers) request repeat deployment at their next event unprompted
- **Session-first upgrade signal:** Pilot events generate enough journey data to demonstrate cross-session pattern value AND/OR attendee feedback organically requests event-wide visibility
- **Feedback validation:** Unstructured feedback collected from engaged users provides actionable signals for V2 prioritization

### Future Vision

**V2 — Session-First Model:**
- Session-scoped QR codes with individual attendee lists per session
- Full event aggregate tab with collapsible session groups and live attendee status
- Search/filter across all sessions by name, company, or title
- Enhanced organizer analytics with cross-session attendee journey mapping
- Speakers scan in and appear in session lists

**V3 — The Marketplace Emerges:**
- AI matching and recommendation engine (powered by journey data collected since MVP)
- Attendee pricing tiers (free / smart networking / power networking)
- Organizer pricing tiers (basic / pro / premium analytics)
- Sponsor premium placement, branded sections, and booth connection analytics
- AI-generated intro video with organizer/sponsor branding opportunities

**Long-Term — Event Intelligence Platform:**
- Ambient avatar assistant for session engagement management
- Event intelligence data licensing — anonymized, aggregated cross-event insights on attendee behavior patterns by industry, role, and session type
- The only source of cross-session attendance flow data in the events industry — a compounding data moat that no competitor can replicate without the same installed base

---

## Product Brief Review — Agent Panel Insights

*Review conducted 2026-02-25 by BMAD agent panel: Mary (Business Analyst), John (Product Manager), Winston (Architect), Sally (UX Designer), Victor (Innovation Strategist)*

### Critical Dependencies to Address in PRD

1. **LinkedIn OAuth scope validation** — LinkedIn's API has become increasingly restrictive. Must validate before PRD which profile fields (name, photo, title, company) are accessible under current OAuth products and approval requirements. If restricted, the "instant professional context" differentiator needs a contingency plan.
2. **LinkedIn API rate limits** — At conference registration, 200+ simultaneous scans could trigger rate limiting. Caching strategy for LinkedIn profile data is architecturally essential.
3. **Real-time list update model** — The attendee list must update automatically with no manual refresh action. Architecture must support this (WebSocket or equivalent) while remaining lightweight. Zero manual user actions beyond scan and browse — this is a core design principle.

### Architecture Decisions for PRD

1. **Multi-tenant from day one** — Even though MVP serves pilot events, the database schema must support multi-tenancy to avoid costly refactoring. Single-tenant MVP designs that require migration later are a known anti-pattern.
2. **Session-aware data schema** — Data model must include event → session hierarchy from day one, even though MVP UI only exposes single-event views. The back-end data capture for the multi-session future must not require schema migration.
3. **Event lifecycle management** — Define when an event "ends" (manual organizer action vs. scheduled time) to trigger the 5-day post-event access window and eventual data archival.

### UX Insights for PRD

1. **Cold-start experience** — Early scanners will see a nearly empty list. This is a critical "aha moment" risk. Requires positive reinforcement messaging that builds anticipation: "Users are actively scanning the QR code — get ready for a different networking experience." Create tension and excitement about who else is arriving, not a suggestion to "come back later."
2. **Feedback prompt timing** — Move the unstructured feedback prompt to post-event only. Interrupting profile browsing flow mid-event breaks the core behavior we want to encourage. Let users network; ask for feedback after.
3. **The app name IS the value proposition** — "Who Else Is Here" naturally reinforces the core action every time it's mentioned. Leverage this in all onboarding copy and QR code signage.

### Strategic Insights for PRD and Beyond

1. **"Nice to have" → "Must have" transition** — The moment Karen depends on analytics for sponsor reports, the app shifts from lightweight add-on to critical event infrastructure. The PRD should account for reliability and uptime expectations that come with this shift.
2. **Recurring events are the fastest path to organizer lock-in** — Pilot events are recurring: RUMC Job Networking (biweekly), Atlanta Job Seekers (weekly, Fridays), C3G (weekly, Mondays). Month-over-month attendee list evolution ("Who's new this week?"), attendance streaks, and retention signals for organizers are high-value features that compound with each recurrence. This should be prioritized in V2 alongside the session-first model.
3. **Agenda parsing as operational cost** — For MVP pilots, Carlos will manually parse organizer agendas using AI-assisted tooling and document the process. This is acceptable at pilot scale but becomes one of the first urgent automation needs if the app gains traction.
4. **Activation gate simplification** — Start with the 25% activation rate as a single metric across all event types. Pilot data from small recurring events will reveal whether event-type differentiation is needed. KISS principle applies.
