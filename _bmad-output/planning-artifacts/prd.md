---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish]
classification:
  projectType: Web App (PWA/SPA)
  domain: General / Event Technology
  complexity: Low-Medium
  projectContext: Greenfield
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-who-else-is-here-2026-02-24.md
  - docs/brainstorming-session-results.md
  - docs/202510092157_strategic_opportunities_brainstorming.md
  - docs/server-configuration-analysis.md
documentCounts:
  briefs: 1
  research: 0
  projectDocs: 3
  projectContext: 0
workflowType: 'prd'
---

# Product Requirements Document - Who Else Is Here

**Author:** Carlos
**Date:** 2026-02-26
**Document Status:** Complete (all PRD workflow steps executed). Reviewed through 5 Party Mode expert panel sessions covering metrics, user journeys, functional requirements, non-functional requirements, and document polish.

## Executive Summary

Who Else Is Here is a real-time, event-scoped attendee directory that bridges professional events to LinkedIn. At any professional gathering — from a 20-person meetup to a 5,000-person conference — attendees scan a QR code, authenticate via LinkedIn, and instantly see every other attendee: name, title, company, and photo. One tap lands directly on a person's LinkedIn profile. No app download. No registration. No complex onboarding. QR code to attendee list in under 30 seconds.

The product solves a universal problem: at professional events, attendees are blind to who else is in the room. A 1,500-person conference typically yields 10-15 meaningful connections — limited by seating, timing, and proximity. The larger the event, the worse the ratio. Who Else Is Here eliminates this blindness by making every attendee visible and reachable in real time.

The product serves two primary users: **attendees** (Alex) who gain visibility into the full room and can direct connection efforts strategically, and **event organizers** (Karen) who gain unprecedented analytics on networking activity — data that currently does not exist in the events industry. For organizers, the app provides real-time scan counts, profile tap metrics, and attendee engagement patterns that prove event ROI to sponsors and justify ticket prices.

The emotional driver for adoption is bidirectional: attendees scan not just to find others, but to **be found**. The job seeker wants the hiring manager to see them. The founder wants the investor to notice them. Every scan creates value for every other user on the list — a network effect embedded in a single action.

### What Makes This Special

Who Else Is Here is not a networking platform — it is a **bridge to LinkedIn, scoped to a live event**. Every competitor (Bizzabo, Swapcard, Whova, Grip) builds in-app messaging, profiles, and connection management — duplicating what LinkedIn already does while creating another silo. Who Else Is Here refuses to compete with LinkedIn and instead leverages it. The app's job is done the moment someone taps a name and lands on a LinkedIn profile. That restraint is the innovation.

Key differentiators: platform-agnostic deployment (works alongside any event with zero integration), LinkedIn-as-identity (professional context is instant and trusted, not self-reported), radical simplicity (the entire UI is essentially a single screen with a list), and zero-burden organizer onboarding (share an agenda, receive QR codes — we handle the rest).

Strategically, the product generates unique attendee journey data — scan timestamps, profile taps, engagement patterns — that no other platform captures. This data compounds over time into a defensible market asset: cross-event intelligence on professional networking behavior that no competitor can replicate without building the same installed base of events.

## Project Classification

- **Project Type:** Web App — Mobile-responsive Progressive Web App (PWA) / Single Page Application (SPA). Architecture decision validated via agent panel review: web app delivers 3x adoption rate over native app from QR code scans, preserves the 30-second onboarding promise, and maintains distribution control without app store gatekeepers.
- **Domain:** Event Technology — professional event networking with standard security requirements (LinkedIn OAuth, user data protection). No heavy regulatory or compliance burden.
- **Complexity:** Low-Medium — domain complexity is low (no regulatory hurdles), but technical complexity is medium due to LinkedIn OAuth dependency, real-time WebSocket attendee list updates, multi-tenant architecture from day one, and session-aware data schema designed for future expansion.
- **Project Context:** Greenfield — new product, no existing application codebase. Target deployment on existing Contabo VPS infrastructure with Nginx, Node.js, and PostgreSQL.

## Success Criteria

### User Success

**Attendee (Alex):**
- Alex scans a QR code and sees a live attendee list within 30 seconds — the "aha moment" is realizing the entire room is now visible
- Alex identifies and taps through to LinkedIn profiles of people worth connecting with — connections that would have been invisible without the app
- Alex returns to the attendee list within the 5-day post-event window to follow up on connections discovered during the event
- Success emotion: "I found someone I never would have met otherwise, and we're now connected on LinkedIn"

**Organizer (Karen):**
- Karen shares an agenda, receives QR codes, and deploys at her event with zero technical effort
- Karen sees real-time networking activity data during the event — data she has never had access to before
- Karen shares a post-event summary report with sponsors showing measurable networking ROI
- Success emotion: "I can finally prove my event creates real professional value"

### Business Success

- **3-month target:** Successful deployment at 2-3 pilot events (C3G, Atlanta Job Seekers) with activation rates above 50% of attendees scanning in
- **6-month target:** Organic adoption by 5+ event organizers through word-of-mouth, with organizers requesting repeat deployment unprompted
- **12-month target:** Establish session-scoped attendee journey data as a unique market asset — the only source of cross-session attendance flow data in the events industry
- **Go/no-go signal:** If activation rate falls below 25% at pilot events, the core value proposition needs re-evaluation before scaling

### Technical Success

- **Performance:** Attendee list loads in under 2 seconds. Real-time updates appear within 3 seconds of a new scan.
- **Reliability:** 99.5% uptime during event hours. The app failing mid-event is catastrophic for organizer trust and attendee adoption.
- **Scalability:** Support 500 concurrent users per event without degradation, covering the largest pilot scenarios.
- **Security:** LinkedIn OAuth tokens handled securely with proper session management. No attendee data exposed to unauthorized users. HTTPS enforced on all connections.

### Measurable Outcomes

| Metric | Target | Measurement Method |
|---|---|---|
| Activation rate | >25% of event attendees scan in | Scans / known attendance |
| Profile tap rate (small events 20-50) | 15-25% of list | Taps / attendee list size per user |
| Profile tap rate (medium events 100-300) | 5-10% of list | Taps / attendee list size per user |
| Post-event return visits | >10% of scanners return within 5 days | Unique return sessions |
| Organizer retention | Pilot organizers request repeat deployment | Unprompted re-engagement |
| Page load time | <2 seconds | Performance monitoring |
| Real-time update latency | <3 seconds | WebSocket delivery measurement |
| Uptime during events | 99.5% | Server monitoring during event windows |
| Distraction health check | <30% of taps during active sessions | Tap timestamp analysis vs. event schedule |

## Product Scope

### MVP - Minimum Viable Product

**Attendee Experience:**
1. Single-event QR code scanning — one QR code per event
2. LinkedIn-only authentication — name, title, company, photo from LinkedIn OAuth
3. Live attendee list — real-time directory with automatic updates (no manual refresh)
4. One-tap LinkedIn profile access — tap any attendee to land on their LinkedIn profile
5. 5-day post-event access — attendee list remains accessible after the event
6. Simple open-door feedback — unstructured text prompt triggered post-event only

**Organizer Experience:**
7. Zero-effort event setup — organizer shares agenda, receives QR code (manual parsing by Carlos for pilots)
8. Basic analytics dashboard — real-time scan count, total profile taps, simplified user journey visualization
9. Post-event summary report — exportable report for sponsors

**Back-End Infrastructure:**
10. Full user journey data capture — every scan, tap, browse, and return visit stored with timestamps. Multi-tenant, session-aware data schema from day one, designed for V2 expansion without migration.

### Growth Features (Post-MVP)

**V2 — Session-First Model:**
- Session-scoped QR codes with individual attendee lists per session
- Full event aggregate tab with collapsible session groups and live attendee status
- Search/filter across all sessions by name, company, or title
- Enhanced organizer analytics with cross-session attendee journey mapping
- Speakers scan in and appear in session lists
- Recurring event intelligence — "Who's new this week?" and attendance streaks

**V2+ Enhancements:**
- AI-generated intro video with organizer/sponsor branding potential
- Automated agenda parsing (replacing manual process)
- Non-LinkedIn authentication fallback (evaluate based on MVP adoption data)

### Vision (Future)

**V3 — The Marketplace:**
- AI matching and recommendation engine powered by journey data collected since MVP
- Attendee pricing tiers (free / smart networking / power networking)
- Organizer pricing tiers (basic / pro / premium analytics)
- Sponsor premium placement, branded sections, and booth connection analytics

**Long-Term — Event Intelligence Platform:**
- Ambient avatar assistant for session engagement management
- Event intelligence data licensing — anonymized, aggregated cross-event insights
- The only source of cross-session attendance flow data in the events industry — a compounding data moat

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. Anti-Platform Architecture (Product Innovation)**
Who Else Is Here challenges the fundamental assumption of the event networking market: that a networking tool must BE a networking platform. Every competitor (Bizzabo, Swapcard, Whova, Grip) builds in-app messaging, profiles, connection management, and content — creating destination apps that compete with LinkedIn. Who Else Is Here does the opposite: it refuses to compete with LinkedIn and instead serves as a bridge to it. The app's job is done the moment someone taps a name and lands on a LinkedIn profile. This radical restraint — doing less on purpose — is the core product innovation. It eliminates the "yet another platform" fatigue that plagues event tech adoption.

**2. Journey Data as Byproduct Intelligence (Business Model Innovation)**
The product's primary function is attendee networking. But every scan, tap, and browse generates unique attendee journey data that no other platform captures. This data — which sessions people attend, who they try to connect with, when networking peaks, how attendees flow through a multi-day event — accumulates into a market intelligence asset that compounds over time. After 100+ events, Who Else Is Here will possess the only dataset of cross-event professional networking behavior patterns in the industry. The innovation is that the data moat is not the product's purpose — it's an emergent property of its use.

**3. Social Proof as Distribution Mechanic (Growth Innovation)**
The product distributes itself within event venues through social proof. When multiple attendees scan a QR code simultaneously, the brief intro audio creates ambient awareness. Nearby non-scanners (Daves) see and hear the social activity — people looking at screens, then looking up with recognition, starting conversations triggered by what they found on the list. This organic, in-venue viral adoption requires zero marketing budget and zero organizer effort. The product's visibility IS its marketing. No event networking tool has leveraged this mechanic intentionally.

**4. Zero-Friction Identity via LinkedIn (Technical Innovation)**
By using LinkedIn OAuth as the sole identity layer, the product eliminates profile creation, manual data entry, and trust verification in a single architectural decision. Every attendee's professional context (name, title, company, photo) is instant, accurate, and trusted — not self-reported. This solves the "empty profile" cold-start problem that kills most networking apps. The innovation is choosing NOT to build identity infrastructure and instead borrowing LinkedIn's — turning a dependency into a competitive advantage.

**5. Session-Scoped Networking (Future Innovation)**
The V2 session-first model — where every session within a larger event has its own QR code and attendee list — creates a granularity of networking data that doesn't exist anywhere. Current event platforms track registration and check-in. Who Else Is Here will track which specific sessions people attended and who they tried to connect with in each session. This enables organizer analytics ("73% of keynote attendees also attended the AI workshop") and attendee intelligence ("people in your industry tend to connect most actively during panel discussions") that no competitor can replicate without the same installed base.

### Market Context & Competitive Landscape

The event networking market is dominated by full-stack event management platforms ($1,500-$5,000+ per event) that treat networking as a secondary feature. These platforms require organizer buy-in, complex setup, registration platform integration, and attendee app downloads — creating barriers that exclude the vast majority of events (meetups, free networking groups, small conferences, recurring community events).

Who Else Is Here occupies a white space: lightweight, standalone, instant-access networking for ANY event regardless of size, budget, or organizer sophistication. The closest competitors in simplicity (Meetup, Eventbrite) don't provide real-time attendee directories or LinkedIn-bridge networking. The closest competitors in networking (Grip, Swapcard) require expensive platform commitment.

No existing product combines: zero-download access + LinkedIn-as-identity + real-time attendee directory + event journey intelligence.

### Validation Approach

Each innovation will be validated through pilot deployments at recurring events:

1. **Anti-platform architecture:** Measure adoption rate. If 30-second onboarding delivers >50% activation (vs. industry standard 15-25% for app-download networking), the zero-friction approach is validated.
2. **Journey data byproduct:** Confirm journey data captures naturally without impacting UX. Validate data quality is sufficient for organizer analytics after 3+ pilot events.
3. **Social proof distribution:** Observe and document in-venue adoption patterns at pilot events. Track whether activation rates increase in later sessions as social proof builds.
4. **LinkedIn identity:** Monitor OAuth completion rates. If >90% of scan attempts complete LinkedIn auth, the single-identity approach is validated. Track whether LinkedIn's API scope provides all needed profile data.
5. **Session-scoped networking (V2):** Validate demand through MVP feedback. If attendees organically request "show me everyone at the whole conference," the session-first model is market-validated before development.

### Risk Mitigation

*Comprehensive risk mitigation for all innovation areas — including technical, market, resource, and competitive risks with likelihood and impact assessments — is consolidated in Project Scoping & Phased Development > Risk Mitigation Strategy.*

## User Journeys

*Note: Short URLs in journey narratives (e.g., `whois.here/c3g-feb26`) use a simplified format for readability. The production URL structure is `whoelseishere.com/event/[slug]`.*

### Journey 1: Alex — Happy Path (The Core Experience)

**Who:** Alex, a business development manager attending C3G's Monday networking session. Alex has been trying to connect with decision-makers at two specific companies but hasn't found them through LinkedIn cold outreach.

**Opening Scene:** Alex walks into the C3G venue on a Monday evening. 45 people are milling around, grabbing coffee, finding seats. On every table there's a small tent card with a QR code and the text: "Who Else Is Here? See everyone at this event. Scan to join." Below the QR code, a short URL: `whois.here/c3g-feb26`.

**Rising Action:** Alex pulls out a phone and scans the QR code. The browser opens instantly — no app download prompt, no redirect to an app store. A LinkedIn OAuth screen appears: "Who Else Is Here wants to access your name, photo, title, and company." Alex taps "Allow." Total elapsed time: 18 seconds.

The attendee list loads. 23 people are already on it — names, titles, companies, and LinkedIn photos. The list updates in real time — a new name appears at the top while Alex watches. Alex scrolls through and freezes: "Regional VP, Acme Corp" — one of the two companies Alex has been targeting for months. Alex taps the name. LinkedIn opens directly to their profile. Alex sends a connection request with a note: "We're both at C3G tonight — would love to chat about your regional expansion."

**Climax:** Alex returns to the attendee list and spots a second person: "Head of Partnerships" at the other target company. Two high-value connections found in under 2 minutes — people Alex would never have identified just by looking around the room. Alex glances across the venue, spots the Acme VP by the coffee station, and walks over to introduce himself in person.

**Resolution:** By the end of the evening, Alex has made 4 targeted LinkedIn connections and had 2 in-person conversations that started because Alex could identify people before approaching them. Over the next 3 days, Alex returns to the attendee list twice from home, tapping through profiles of people missed during the event and sending follow-up connection requests. On day 5, the app shows a gentle prompt: "How was your experience? Anything you wish this app could do?" Alex types: "Loved it. Would be great to see people from the whole conference, not just this session."

**Requirements Revealed:**
- QR code scan → LinkedIn OAuth → attendee list in under 30 seconds
- Real-time list updates via WebSocket (new scans appear without refresh)
- One-tap navigation to LinkedIn profile
- 5-day post-event access with return visit capability
- Post-event feedback prompt (unstructured text, triggered once)

---

### Journey 2: Alex — Cold Start (The Early Arrival)

**Who:** Alex arrives at a 200-person conference 15 minutes before the first session starts. Registration is still setting up. Alex is one of the first to notice the QR code on the registration banner.

**Opening Scene:** Alex scans the QR code and authenticates via LinkedIn. The attendee list loads — and shows 4 people. Four names, four photos, on a screen that could hold 50.

**The Critical Moment:** This is where most apps die. "4 attendees" feels like a ghost town. Alex's instinct: *"Nobody's using this. Waste of time."* Close browser, move on.

**What the app does instead:** Below the 4 names, a warm, energized message: "You're among the first to scan! More professionals are arriving and joining. Keep this tab open — the list updates live as people scan in." The message has subtle animation — a gentle pulse that conveys activity and life, not emptiness.

**Rising Action:** Alex keeps the tab open. During the next 10 minutes, while settling into a seat and checking email, names pop onto the list one by one. 4 becomes 8, becomes 15, becomes 23. Each new name feels like a small dopamine hit — who's arriving? The momentum message updates: "23 professionals and counting. New attendees joining every minute."

**Climax:** At 30+ attendees, the messaging disappears. The list speaks for itself. Alex is now actively browsing, and the early investment of keeping the tab open has paid off — Alex has watched the room fill up digitally before it filled up physically.

**Resolution:** Alex has been engaged with the app for 15 minutes before the event even started, has already identified 3 people to connect with, and has sent a LinkedIn request to one of them. The cold start didn't kill the experience — it created anticipation.

**Requirements Revealed:**
- Cold-start messaging tiers:
  - **<5 attendees:** "You're among the first to scan! More professionals are arriving and joining. Keep this tab open — the list updates live as people scan in."
  - **5-15 attendees:** "[N] professionals and counting. New attendees joining every minute."
  - **15+ attendees:** No messaging needed — list value is self-evident
- Design principle: Never show a raw number that feels small. Frame scarcity as exclusivity and anticipation.
- Real-time updates are critical for cold-start retention — if Alex has to manually refresh, the experience feels dead

---

### Journey 3: Alex — Connectivity Failure (The WiFi Drop)

**Who:** Alex is at a large conference venue where 300 attendees are sharing a single commercial WiFi network. Connectivity is spotty.

**Opening Scene:** Alex scans the QR code, authenticates successfully, and the attendee list loads with 87 names. Alex starts browsing, tapping profiles, sending LinkedIn requests. Everything works.

**Rising Action:** Mid-browse, the WiFi drops. Alex taps a name — loading spinner. Nothing happens. The LinkedIn profile page shows a connection error.

**What the app does:** The attendee list itself remains visible — the PWA service worker cached it on first load. Alex can still scroll, read names, titles, and companies. A subtle indicator appears at the top: "Offline — viewing cached list. Reconnect for real-time updates."

The failed LinkedIn tap doesn't silently fail. Instead, the app shows the person's LinkedIn URL as copyable text: "Can't open LinkedIn right now. Copy this link to connect later: linkedin.com/in/jane-smith." Alex copies the URL and saves it.

**Climax:** WiFi reconnects 3 minutes later. The cached list refreshes — 12 new attendees have scanned in while Alex was offline. The app catches up seamlessly. No data lost, no disruption to the core browse experience.

**Resolution:** Alex didn't lose the experience during the outage — just the real-time updates. The core value (seeing who's here and identifying connection targets) survived the connectivity failure.

**Requirements Revealed:**
- PWA service worker caches attendee list on first load
- Offline browsing of cached list with offline indicator
- Failed LinkedIn taps show copyable LinkedIn URL as fallback
- Graceful reconnection — list refreshes without user action when connectivity returns
- No data loss during connectivity gaps — queued interactions sync when online

---

### Journey 4: Karen — Happy Path (The Organizer Deployment)

**Who:** Karen Griggs Medley, coordinator for RUMC Job Networking, a biweekly career networking event at a church in Roswell, GA. 40-60 attendees per session. Karen has been running this event for 2 years and has never had data on whether attendees actually connect with each other.

**Opening Scene:** Carlos approaches Karen after a RUMC session and explains Who Else Is Here. Karen is intrigued but wary — she's seen event tech come and go, and she doesn't have budget or technical skills. Carlos says: "Just send me your agenda. I'll handle everything. All you need to do is put QR codes on the tables."

**Rising Action:** Karen emails Carlos a PDF of her standard agenda. 48 hours later, Carlos sends back: a print-ready QR code image with the signage text "Who Else Is Here? See everyone at this event. Scan to join." plus the short URL `whois.here/rumc-mar10`, and simple instructions: "Print these on table tents or tape to the registration table. That's it."

At the next RUMC session, Karen places the QR codes on 6 tables. She watches with curiosity as attendees start scanning. She hears a few intro videos playing from nearby phones. She sees people looking at their phones, then looking up and scanning the room — the behavior shift from "blind networking" to "informed networking" is visible.

**Climax:** The next morning, Karen opens an email from Carlos with a post-event summary:
- "38 attendees scanned in (out of ~55 present — 69% activation)"
- "127 LinkedIn profile taps (3.3 taps per user average)"
- "Peak networking activity: first 15 minutes and during the break"
- A simple timeline chart showing scan-in and tap activity over the event

Karen has NEVER had this data. She forwards the summary to her church leadership with a note: "This is proof our networking event creates real professional value."

**Resolution:** Karen asks Carlos: "Can we do this at every session?" She starts mentioning Who Else Is Here in her pre-event emails to attendees. At the next session, activation rate jumps to 78% — attendees arrive expecting to scan.

**Requirements Revealed:**
- Admin-generated QR code with customizable event name and short URL
- Print-ready QR code image export (high-res, suitable for table tents and banners)
- Short URL alongside QR code as scanning fallback (memorable format: `whois.here/[event-slug]`)
- Post-event summary report: scan count, activation rate, total taps, taps per user, activity timeline
- Report delivered via email or exportable format Karen can forward
- QR code signage must answer three objections at a glance: "What is this?" / "Is it safe?" / "Why should I?"

---

### Journey 5: Carlos — System Operator (The Admin Behind the Scenes)

**Who:** Carlos, product owner and sole system operator for MVP pilots. Carlos creates events, monitors live deployments, and generates reports. Carlos is also the first user of what will become Karen's future self-service admin panel.

**Opening Scene:** Karen sends Carlos her agenda PDF for the next RUMC session on Monday. Carlos opens the admin panel — a minimal web-based interface — and starts creating the event.

**Rising Action:** Carlos fills in:
- Event name: "RUMC Job Networking — March 10, 2026"
- Event date and time: March 10, 7:00 PM - 9:00 PM
- Venue: "Roswell United Methodist Church"
- Short URL slug: "rumc-mar10"

Carlos pastes the agenda text into a free-form field. In MVP, Carlos manually extracts session details. The admin panel generates: a unique QR code linking to the event, a print-ready image, and the short URL. Carlos downloads the assets and emails them to Karen.

**Design Principle:** This admin panel is the seed of Karen's future self-service tool. Every field Carlos fills in manually is a field that AI will eventually auto-populate from the agenda PDF. The workflow structure (agenda in → parsed event → QR code out) must be a clean pipeline with a clear "parsing" step where AI can be inserted later without restructuring.

**During the Event:** Carlos monitors a real-time dashboard showing:
- Live scan count and activation rate
- Profile tap activity
- Any system errors or performance issues

Carlos can see across ALL active events simultaneously (super-admin view). In V2, Karen will see only her own events (event-admin view).

**Post-Event:** Carlos generates the summary report from the admin panel and sends it to Karen. The admin panel also shows:
- System health metrics (response times, WebSocket stability)
- Journey data capture confirmation (all scans and taps logged)

**5-Day Window Management:** The admin panel shows event lifecycle status. After the event end time, a countdown shows "Post-event access: 4 days 16 hours remaining." When the window expires, the event status automatically transitions to "Archived." Archived events retain data but the attendee list is no longer accessible to attendees.

**Requirements Revealed:**
- Minimal web-based admin panel (not CLI) — designed as the foundation for Karen's future self-service UI
- Event creation workflow: name, date/time, venue, short URL slug, agenda text → generates QR code + short URL
- Clean pipeline architecture with explicit "parsing" step — AI integration socket for post-MVP
- Print-ready QR code image export
- Real-time monitoring dashboard: scan count, tap activity, system health
- Super-admin view across all events (Carlos in MVP) vs. event-scoped admin view (Karen in V2)
- Role-based access in the schema from day one (super-admin, event-admin) even if MVP only uses super-admin
- Automated event lifecycle: active → post-event (5-day window) → archived
- Post-event summary report generation from admin panel

---

### Journey 6: Dave — The Reluctant Scanner (Anti-Persona)

**Who:** Dave, a mid-career finance professional at his first RUMC Job Networking session. Dave is privacy-conscious, skeptical of new tech, and doesn't understand why he should scan a random QR code at a church event.

**Opening Scene:** Dave settles into his seat at a table with 7 other people. He notices the table tent with the QR code: "Who Else Is Here? See everyone at this event. Scan to join." Dave glances at it, thinks *"Another app trying to harvest my data,"* and ignores it.

**Rising Action:** Around him, 4 of the 7 people at his table pull out their phones and scan. Dave hears the brief intro audio from two phones nearby. He sees people looking at their screens, then looking up with recognition — one person says to another, "Oh, you're at Acme Corp? I've been wanting to talk to someone there!" A conversation sparks that wouldn't have happened otherwise.

Dave watches. The social proof is building. Two people at his table are now showing each other their screens — "Look, the VP of Engineering from Delta is here tonight!" Dave's curiosity is growing, but his resistance holds.

**The Tipping Point:** The person next to Dave turns and says, "Have you tried this? It shows everyone who's here tonight. I just found three people I need to talk to." Dave looks at the screen — it's just a clean list of names, titles, and companies. No ads. No complexity. Just people.

**Climax — Path A (Dave Converts):** Dave scans the QR code. LinkedIn OAuth appears. Dave hesitates — "It wants my LinkedIn?" — but sees it only requests name, photo, title, company. No messaging access. No contact list. No posting permissions. Dave taps Allow. He sees the list, finds it useful, and starts browsing. Dave has converted through peer pressure and social proof, not through marketing.

**Climax — Path B (Dave Doesn't Convert):** Dave decides not to scan. That's fine. Dave is not on the attendee list, which means the list is incomplete — but the app's value doesn't collapse because Dave opted out. The list still shows everyone who DID scan. Dave's absence is invisible to other users. Dave may convert at the next session after hearing others talk about it.

**Resolution:** Whether Dave converts or not, the app is designed to be resilient to partial adoption. The value proposition doesn't require 100% scanning. But every Dave who converts makes the list more complete, which makes the app more valuable for every Alex.

**Requirements Revealed:**
- LinkedIn OAuth scope must be minimal and clearly communicated — name, photo, title, company ONLY. No messaging, contacts, or posting access.
- QR code signage framework — answer three objections at a glance:
  1. "What is this?" → "See everyone at this event"
  2. "Is it safe?" → "LinkedIn sign-in only. No data shared with others."
  3. "Why should I?" → "Make yourself visible so the right people can find you"
- Intro video/audio should have brief, pleasant presence (social proof mechanic) — not silent. Mute option available.
- The app must be valuable at any adoption level — graceful degradation with partial scanning
- Privacy transparency: clear indication of what data is collected and how it's used
- No penalty or visibility for non-scanners — Dave's absence is invisible

---

### System-as-Actor Behaviors (Automated Processes)

These are not user-triggered journeys but automated system behaviors that must be specified:

1. **Real-time list broadcast:** When a new attendee scans in, the server broadcasts the update to all connected clients via WebSocket within 3 seconds. No polling. No manual refresh.

2. **Event lifecycle transitions:**
   - **Active:** Event is live, QR code scanning is enabled, attendee list is accessible
   - **Post-event:** Event end time has passed, scanning is disabled, attendee list remains accessible for 5 days, feedback prompt is triggered
   - **Archived:** 5-day window expired, attendee list is no longer accessible to attendees, data retained for analytics and journey intelligence

3. **LinkedIn OAuth token management:** Tokens refreshed or re-authenticated as needed. If a token expires while the attendee list is open, the cached list remains visible but LinkedIn taps prompt re-authentication.

4. **Journey data capture:** Every user interaction is logged asynchronously — scan timestamp, list browse events, profile tap events, return visit timestamps. This runs in the background without impacting UI performance.

---

### Journey Requirements Summary

*The requirements revealed across all journeys are formally specified in the Functional Requirements section (FR1-FR54). This summary preserves the journey-to-requirement traceability chain.*

**Core Specifications Revealed Across All Journeys:**

| Requirement | Source Journey | Priority |
|---|---|---|
| QR code → LinkedIn OAuth → list in <30 seconds | Alex Happy Path | MVP Critical |
| Real-time WebSocket list updates (<3 sec latency) | Alex Happy Path, Cold Start | MVP Critical |
| One-tap LinkedIn profile navigation | Alex Happy Path | MVP Critical |
| Cold-start messaging tiers (<5, 5-15, 15+) | Alex Cold Start | MVP Critical |
| PWA offline caching of attendee list | Alex Connectivity Failure | MVP Critical |
| Copyable LinkedIn URL on failed taps | Alex Connectivity Failure | MVP Important |
| Short URL alongside QR code on signage | Karen Happy Path, Alex Connectivity | MVP Critical |
| Print-ready QR code image export | Karen Happy Path | MVP Critical |
| Three-objection signage framework | Dave Anti-Persona | MVP Critical |
| Post-event summary report (exportable) | Karen Happy Path | MVP Critical |
| Minimal web-based admin panel | Carlos Operator | MVP Critical |
| Event creation pipeline (agenda → QR code) | Carlos Operator | MVP Critical |
| AI pipeline socket in event creation workflow | Carlos Operator | Post-MVP (design now) |
| Role-based access schema (super-admin, event-admin) | Carlos Operator | MVP (schema only) |
| Automated event lifecycle (active → post-event → archived) | System-as-Actor | MVP Critical |
| 5-day post-event access window | Alex Happy Path, System-as-Actor | MVP Critical |
| Post-event feedback prompt (unstructured, triggered once) | Alex Happy Path | MVP Important |
| Intro audio cue for social proof | Dave Anti-Persona | MVP Important |
| Minimal LinkedIn OAuth scope (name, photo, title, company) | Dave Anti-Persona | MVP Critical |
| Graceful degradation with partial adoption | Dave Anti-Persona | MVP (design principle) |

## Web App Specific Requirements

### Project-Type Overview

Who Else Is Here is a mobile-first Progressive Web App (PWA) built as a Single Page Application (SPA). The app is accessed via QR code scan or short URL at live events — no app store, no download, no installation required. The app must work across the full spectrum of mobile devices attendees bring to events, including older budget Android phones common among professionals in career transition.

The project includes two web deployments on the same domain:
1. **Marketing website** (`whoelseishere.com`) — Public-facing static landing page for organizer acquisition and SEO presence. Must ship before or simultaneously with the first pilot event.
2. **Web application** (`whoelseishere.com/event/[slug]`) — The SPA attendee networking tool, auth-gated, no SEO required.

### Browser Compatibility Matrix

**Target: Modern but not bleeding edge.** The app must work on devices 3-4 years old, reflecting the real-world phone inventory at professional networking events — particularly career transition events where attendees may carry older personal devices without corporate refresh cycles.

| Browser | Minimum Version | Coverage | Notes |
|---|---|---|---|
| Chrome (Android) | 80+ | ~99% of Android Chrome users | Primary Android browser. WebSocket, service worker, PWA all supported. |
| Safari (iOS) | 14+ (iOS 14+) | ~97% of active iPhones | Apple pushes updates aggressively. PWA push notifications limited but functional since iOS 16.4. Core features (WebSocket, service worker caching) supported. |
| Samsung Internet | 13+ | Significant Android share | Default browser on Samsung devices. Must be explicitly tested — QR code scans on Samsung phones open URLs in Samsung Internet, not Chrome. |
| Firefox (Mobile) | 78+ | Rare on mobile | Low priority but covered by the same build target. |
| Chrome (Desktop) | 80+ | Post-event desktop browsing | 5-day post-event access from laptop/desktop. |
| Safari (Desktop) | 14+ | Post-event desktop browsing | macOS users accessing list from home. |
| Edge (Desktop) | 80+ | Post-event desktop browsing | Chromium-based, same compatibility as Chrome. |

**Build target:** ES2020 JavaScript + CSS Grid/Flexbox. This covers all browsers listed above.

**Critical testing requirement:** Before every pilot event, test the complete user flow (QR scan → OAuth → list browse → profile tap) on a 3-year-old budget Android phone with the default browser. This is the most likely failure point and the hardest to catch in development.

**QR code scanning note:** The QR code scan uses the phone's native camera app, not the browser. The scan opens a URL in whatever the user's default browser is. On some Android phones, this may be Samsung Internet, an OEM browser, or an older Chrome version. The app must handle all of these gracefully.

### Responsive Design Strategy

**Mobile-first, desktop-usable.** One responsive layout with CSS breakpoints, not two separate designs.

**Mobile at the event (primary use case):**
- Portrait orientation, one-handed use
- Large tap targets (minimum 44x44px per WCAG AA)
- Attendee card: photo, name, title stacked vertically, company below
- Thumb-friendly scroll with no horizontal navigation
- Minimal text — scan-and-identify speed over reading depth

**Desktop at home (post-event use case):**
- Attendee card expands: photo, name, title AND company on the same row
- Hover states on attendee names (cursor indicates tappable)
- Denser list layout — more attendees visible per screen
- Keyboard navigation: Tab through list, Enter to open LinkedIn profile
- LinkedIn may open in a new tab (vs. replacing the app on mobile)

**Core interaction identical on both:** Tap/click name → LinkedIn profile opens. The responsive layout changes density and spacing, not functionality.

### Performance Targets

*These performance targets are formalized as testable NFRs in the Non-Functional Requirements section (NFR1-NFR9). The NFR versions are authoritative and include Party Mode refinements (e.g., NFR8 splits the OAuth flow into system-controlled and aspirational targets, NFR9 adds large-list rendering at 500 items). This section provides web-app-specific context and rationale for the development team.*

| Metric | Target | Rationale |
|---|---|---|
| Initial page load (first visit) | <2 seconds on 4G | First scan at an event. Must feel instant. Conference WiFi often throttled. |
| Subsequent loads (cached PWA) | <500ms | Return visits should feel like a native app. Service worker serves cached shell. |
| Attendee list render (100 items) | <200ms | Scrolling must be fluid. No jank, no loading spinners within the list. |
| Real-time update appearance | <3 seconds | New scan → WebSocket broadcast → name appears on all connected clients. |
| LinkedIn profile tap response | <1 second | Tap name → browser navigates to LinkedIn. Perceived as instant. |
| Time to interactive (TTI) | <3 seconds on 3G | Worst-case scenario: poor conference WiFi. App must be usable even on slow connections. |
| PWA cache payload | <2MB | Total cached assets for offline functionality. Minimizes data consumption for attendees with limited data plans. |

### SEO Strategy

**Web app:** No SEO required. The attendee list is auth-gated, private, and event-scoped. No public content to index. `noindex` meta tag on all app pages to prevent accidental indexing.

**Marketing website:** SEO is critical for organizer acquisition.
- **Target keywords:** "event networking app," "QR code attendee list," "simple event networking," "LinkedIn event networking"
- **Technical SEO:** Static HTML or server-side rendered for crawlability. Meta title, description, Open Graph tags for social sharing. Structured data markup (Organization, Product).
- **Content SEO:** Product description, how-it-works section, organizer value proposition. Single page initially — expand to blog/case studies post-pilot as testimonials accumulate.
- **Domain authority:** `whoelseishere.com` is secured (registered October 2025). Start building backlinks through pilot event organizer mentions, LinkedIn posts about pilot results, and event industry forum participation.

### Accessibility Level (WCAG 2.1 Level AA)

*Accessibility quality targets are specified in Non-Functional Requirements (NFR30-NFR37). This section provides implementation context, design philosophy, and specific HTML/ARIA patterns for the UX and development teams.*

Accessibility compliance is not extra work — it is "event-proof design." Every AA requirement directly improves the UX for ALL users in event environments.

**Color and Contrast:**
- Minimum 4.5:1 contrast ratio for all text against backgrounds
- Rationale: Bright venue lighting washes out phone screens. High contrast helps EVERY user, not just those with visual impairments.
- Status indicators (online/offline, cold-start messaging) must meet contrast requirements

**Touch and Interaction:**
- Minimum 44x44px touch targets for all interactive elements
- Rationale: At a crowded event, people are standing, one-handed, being bumped. Small tap targets are unusable for everyone in this context.
- Sufficient spacing between tap targets to prevent mis-taps

**Screen Reader Support:**
- ARIA labels on attendee list items (name, title, company as structured data)
- Role="button" on tappable attendee names
- Meaningful alt text on LinkedIn profile photos
- Live region announcements for real-time list updates ("New attendee joined")
- Low implementation effort, high impact for visually impaired attendees

**Keyboard Navigation (Desktop):**
- Tab through attendee list
- Enter to open LinkedIn profile
- Escape to close any overlays
- Focus indicators visible on all interactive elements
- Rationale: Post-event desktop browsing must be fully keyboard-accessible

**Text and Zoom:**
- UI remains fully usable at 200% browser zoom
- Respects system font size settings on mobile devices
- No text in images (all text rendered as HTML)
- Rationale: Some attendees use larger text settings on their phones. The layout must not break.

### Marketing Website Specification

**Purpose:** Sales tool for organizer acquisition. Must exist before the first pilot event. When Karen googles "who else is here" after hearing about the product, this page must appear and look professional.

**Scope:** Single static landing page for MVP. No CMS, no blog, no complex build. Ship in a day.

**Deployment:** Static HTML/CSS served by Nginx at `whoelseishere.com` root. Same server, same SSL certificate as the web app. Separate build artifact.

**Visual identity:** Must echo the web app's visual identity — same color palette, same typography, same "radical simplicity" aesthetic. When Karen visits the website and then sees the QR code at her event, visual continuity builds trust.

**Content structure:**
1. **Hero section:** "See everyone at your event. One QR code. Zero downloads." + product screenshot/mockup
2. **How it works:** 3-step visual (Scan → Browse → Connect on LinkedIn)
3. **For organizers:** "Add networking intelligence to your event. Zero effort. Real-time analytics on who's connecting."
4. **Social proof:** Testimonial space (populate after first pilot — even a single quote from Karen)
5. **Contact:** Direct email link or simple contact form
6. **Footer:** Privacy policy link, LinkedIn OAuth data usage disclosure

**SEO metadata:** Title tag, meta description, Open Graph image, favicon. Basic but complete.

### Implementation Considerations

**Deployment architecture:**
- `whoelseishere.com` → Nginx serves static marketing site at root
- `whoelseishere.com/event/[slug]` → Nginx proxies to SPA web app
- Same Nginx config, same domain, same SSL certificate (Let's Encrypt)
- Two separate build pipelines deployed to the same Contabo VPS server

**PWA configuration:**
- Service worker for offline caching of attendee list and app shell
- Web app manifest for add-to-home-screen prompt (recurring event attendees)
- Offline indicator UI when connectivity drops
- Cache-first strategy for app shell, network-first for attendee data

**Data consumption awareness:**
- Minimize payload size — attendees at career transition events may have limited data plans
- Lazy-load LinkedIn profile photos (load visible photos first, defer off-screen)
- Compress all assets aggressively
- PWA cache should be <2MB total

**Device testing protocol:**
- Test on 3-year-old budget Android phone before every pilot
- Test QR scan → default browser → OAuth → list on Samsung Internet specifically
- Test on iOS Safari with and without PWA add-to-home-screen
- Test desktop flow for post-event browsing (Chrome, Safari, Edge)

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP — the minimum product that delivers the complete "aha moment" experience for both attendees and organizers. Not a feature prototype, not a revenue test. The goal is validated learning through real pilot deployments at recurring events (C3G, RUMC).

**What validates the MVP:**
- **Attendees say:** "I found someone I never would have met otherwise" — core value confirmed
- **Organizers say:** "I finally have data on networking at my events" — organizer hook confirmed
- **We learn:** Activation rates, social proof mechanics, LinkedIn API behavior in the wild, real attendee journey data, and cold-start retention patterns

**Resource Requirements:** Solo developer (Carlos) with existing Contabo VPS infrastructure. MVP scope is deliberately lean — single screen, single action, single purpose. Technical complexity is in infrastructure (WebSocket, multi-tenant schema, journey capture), not UI surface area.

### MVP Feature Set (Phase 1 — Pilots)

**Core User Journeys Supported:**
- Alex Happy Path (QR → OAuth → browse → tap → LinkedIn)
- Alex Cold Start (tiered messaging for early scanners)
- Alex Connectivity Failure (PWA offline caching, copyable LinkedIn URL fallback)
- Karen Happy Path (agenda → QR code → deploy → receive analytics report)
- Carlos System Operator (event creation → monitoring → report generation)
- Dave Reluctant Scanner (minimal OAuth scope, graceful partial adoption)

**Must-Have Capabilities (Product Fails Without These):**

| # | Capability | Rationale |
|---|---|---|
| 1 | QR code → LinkedIn OAuth → attendee list in <30 seconds | The entire value proposition. Without this flow, there is no product. |
| 2 | Real-time WebSocket list updates (<3 sec latency) | Cold-start retention depends on live updates. Manual refresh kills the experience. |
| 3 | One-tap LinkedIn profile navigation | The core action. The app exists to get users to LinkedIn profiles. |
| 4 | Cold-start messaging tiers (<5, 5-15, 15+ attendees) | Without this, early scanners abandon. Validated in User Journey 2 (Alex Cold Start). |
| 5 | PWA offline caching of attendee list | Conference WiFi is unreliable. Losing the list mid-browse is catastrophic. Validated in User Journey 3 (Alex Connectivity Failure). |
| 6 | 5-day post-event access window | Extends value beyond the venue. Return visits are a key success metric. |
| 7 | Automated event lifecycle (active → post-event → archived) | Without automated transitions, events stay live forever or require manual intervention. |
| 8 | Minimal LinkedIn OAuth scope (name, photo, title, company only) | Privacy-conscious attendees (Dave) won't scan if permissions look invasive. Trust is a deal-breaker for adoption. |
| 9 | Admin panel: event creation → QR code generation | Carlos cannot run pilots without a basic admin interface. Manual alternative doesn't scale even for 2 concurrent events. |
| 10 | Basic analytics dashboard (real-time scan count, total taps, activity timeline) | Karen's "aha moment." Without data, the organizer value proposition is empty — there's nothing to show sponsors. |
| 11 | Post-event summary report (exportable) | Karen needs something to forward to stakeholders. The data must leave the admin panel in a shareable format. |
| 12 | Full user journey data capture (backend) | Schema captures every scan, tap, browse, and return visit from day one. Without this, V2 analytics have no historical data to build on. |
| 13 | Multi-tenant, session-aware database schema | Architecture designed from day one. Retrofitting multi-tenancy and session awareness later requires painful data migration. |
| 14 | HTTPS everywhere + secure OAuth token handling | Non-negotiable. LinkedIn OAuth requires HTTPS. Token security is table stakes. |

**MVP-Important (Enhance Experience, Not Make-or-Break):**

| # | Capability | Notes |
|---|---|---|
| 15 | Copyable LinkedIn URL on failed taps | Improves WiFi-failure UX. Could launch without and add quickly if connectivity failures prove common at pilots. |
| 16 | Post-event feedback prompt (unstructured text, triggered once) | Important for learning, but Carlos can collect feedback manually at pilot events during the initial deployments. |
| 17 | Marketing website (static landing page) | Must ship before or simultaneously with first pilot — but it's a separate static page build, independent of the web app work stream. |

**Deferred to Post-MVP (Per Previous Decisions):**

| # | Capability | Rationale for Deferral |
|---|---|---|
| 18 | Intro audio/video social proof cue | Explicitly deferred. Social proof works through visible scanning behavior alone at pilot scale. |
| 19 | Role-based access enforcement | Schema includes role-based access from day one (super-admin, event-admin). Enforcement deferred — MVP has only one admin (Carlos). |
| 20 | Three-objection signage framework | Design/print artifact, not software. Carlos creates signage copy offline. |

### Post-MVP Features

*See Product Scope for the complete Growth (V2/V2+) and Vision (V3/Long-Term) roadmap. The phased development sequence is: MVP Pilots → Phase 2 Growth (session-first model, enhanced analytics, self-service admin) → Phase 3 Expansion (AI matching, pricing tiers, event intelligence platform).*

### Risk Mitigation Strategy

**Technical Risks:**

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| LinkedIn API restricts OAuth scope or rate limits | Medium | Critical | Cache profile data on first auth so existing users retain functionality. Monitor LinkedIn developer program changes actively. Contingency: add Google/GitHub as secondary auth with manual profile enrichment in V2+. |
| WebSocket scaling at 500 concurrent users | Low | High | Pilot events are 40-200 attendees. Scale concern becomes relevant in V2. Validate WebSocket stability at pilot scale first, then load-test before larger deployments. |
| PWA service worker edge cases (Samsung Internet, older Safari) | Medium | Medium | Pre-pilot device testing protocol: test complete flow on 3-year-old budget Android phone with default browser before every pilot event. |
| Conference WiFi kills initial OAuth flow | Medium | High | Short URL fallback alongside QR code. OAuth is a one-time cost — once authenticated, cached list works offline. Consider pre-event email with link for critical events. |

**Market Risks:**

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Activation rate below 25% at pilot events (go/no-go threshold) | Medium | Critical | Iterate on signage placement, organizer verbal promotion, and social proof mechanics. Run 2+ pilot events before drawing conclusions — first event is learning, not judgment. |
| Organizers don't perceive value in analytics reports | Low | High | Karen is pre-validated as an organizer who wants this data. If she doesn't find the report useful after seeing it, iterate on report content and format before scaling to new organizers. |
| Privacy backlash ("LinkedIn tracking at events") | Low | Medium | Transparent QR code signage with clear data usage. Minimal LinkedIn OAuth scope visible during auth. Privacy policy linked from marketing website and app footer. |
| Journey data insufficient for intelligence | Medium | Medium | Set minimum event count threshold (50+ events) before attempting data monetization. Focus on organizer-facing analytics first, which have immediate proven value. |
| Anti-platform approach limits engagement | Low | Medium | If users want in-app messaging or matching, that's a V3 feature — not a pivot. The bridge-to-LinkedIn model is validated first. Only add destination features if the bridge proves insufficient. |
| Competitors copy the approach | Medium | Medium | Speed to market + data accumulation + organizer relationships create a time-based moat. A fast-follower needs 6-12 months to build equivalent relationships and data. By then, the network effects and journey intelligence are compounding. |

**Resource Risks:**

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Solo developer bottleneck delays pilot timeline | High | Medium | MVP scope is deliberately lean — single screen, single action, single purpose. UI complexity is minimal; infrastructure complexity is manageable with proven technologies (Node.js, PostgreSQL, WebSocket). |
| Contabo VPS capacity insufficient for real-time WebSocket workload | Low | Medium | Current VPS specs handle much larger workloads than pilot event traffic. Monitor server performance during first pilot. Vertical scaling available if needed. |

## Functional Requirements

### Attendee Identity & Access

- **FR1:** Attendee can scan a QR code or enter a short URL to access an event's attendee list
- **FR2:** Attendee can authenticate via LinkedIn OAuth, providing name, photo, title, and company
- **FR3:** Attendee can access the attendee list for up to 5 days after the event ends
- **FR4:** Attendee can access the attendee list from any supported browser on mobile or desktop
- **FR5:** System restricts LinkedIn OAuth to minimal scope (name, photo, title, company only — no messaging, contacts, or posting permissions)
- **FR6:** System resolves short URL slugs to the correct event and directs attendees to the corresponding attendee list
- **FR7:** System displays an appropriate message when an attendee accesses an invalid, expired, or archived event URL
- **FR8:** System provides visual feedback during the authentication and list-loading process so the attendee knows the app is working
- **FR9:** System displays meaningful error messaging when LinkedIn authentication fails, with guidance to retry
- **FR10:** System supports multiple concurrent sessions per attendee per event (e.g., phone at event and laptop at home during post-event window)

### Attendee List & Networking

- **FR11:** Attendee can view a real-time list of all other authenticated attendees at the same event
- **FR12:** Attendee can see each attendee's name, title, company, and LinkedIn photo on the list
- **FR13:** Attendee can see their own entry on the attendee list after authentication, confirming successful registration
- **FR14:** Attendee can see the total number of authenticated attendees at the current event
- **FR15:** Attendee can see new attendees appear on the list in real time without manual refresh
- **FR16:** Attendee can tap any attendee's name to navigate directly to that person's LinkedIn profile
- **FR17:** Attendee can copy a LinkedIn profile URL when direct navigation fails (offline fallback)
- **FR18:** Attendee can browse the cached attendee list while offline
- **FR19:** Attendee can see an indicator when viewing the list offline
- **FR20:** Attendee can see the list automatically refresh when connectivity is restored

### Cold-Start Experience

- **FR21:** System displays contextual encouragement messaging when fewer than 5 attendees have scanned
- **FR22:** System displays growth momentum messaging when 5-15 attendees have scanned
- **FR23:** System removes encouragement messaging when the attendee count exceeds 15

### Attendee Feedback

- **FR24:** Attendee can submit unstructured text feedback about their experience
- **FR25:** System triggers the feedback prompt once during the post-event access window

### Event Administration

- **FR26:** Admin can authenticate to the admin panel using secure credentials
- **FR27:** Admin can create a new event with name, date/time, venue, and short URL slug
- **FR28:** Admin can input event agenda content for the event record
- **FR29:** Admin can generate a unique QR code and short URL for an event
- **FR30:** Admin can download a print-ready QR code image that includes the event short URL as visible text alongside the QR code graphic
- **FR31:** Admin can view a real-time monitoring dashboard during active events showing scan count and tap activity
- **FR32:** Admin can view system health indicators (server responsiveness, connection stability) during active events
- **FR33:** Admin can view all active events simultaneously (super-admin view)
- **FR34:** Admin can generate a post-event summary report for an event
- **FR35:** Admin can export the post-event summary report in a shareable format

### Organizer Analytics

- **FR36:** Admin can view total scan count and activation rate for an event
- **FR37:** Admin can view total profile taps and average taps per attendee
- **FR38:** Admin can view an activity timeline showing scan and tap patterns over the event duration
- **FR39:** Admin can view basic attendee journey data (which attendees scanned, when they returned, what they tapped)
- **FR40:** Admin can view distraction health metrics showing the ratio of profile taps occurring during active event sessions versus breaks

### Event Lifecycle Management

- **FR41:** System automatically transitions events from active to post-event status when the event end time passes
- **FR42:** System disables QR code scanning for post-event status events
- **FR43:** System automatically transitions events from post-event to archived status after 5 days
- **FR44:** System retains all event data after archiving for analytics and journey intelligence
- **FR45:** System retains archived event data for a defined retention period, after which attendee personal data is anonymized or purged
- **FR46:** Admin can view the lifecycle status and countdown timer for each event

### Data Capture & Infrastructure

- **FR47:** System captures and stores every scan event with timestamp
- **FR48:** System captures and stores every profile tap event with timestamp
- **FR49:** System captures and stores every list browse session with timestamp
- **FR50:** System captures and stores every return visit with timestamp
- **FR51:** System isolates event data such that attendees of one event cannot access data from another event
- **FR52:** System restricts admin access based on assigned role (super-admin sees all events, event-admin sees only their events)

### Real-Time Communication

- **FR53:** System broadcasts attendee list updates to all connected clients within 3 seconds of a new scan
- **FR54:** System gracefully handles connection drops and reconnections without data loss

## Non-Functional Requirements

### Performance

| Requirement | Target | Rationale |
|---|---|---|
| **NFR1:** Initial page load (first visit, 4G connection) | <2 seconds | First scan at an event must feel instant. Conference WiFi is often throttled. |
| **NFR2:** Subsequent page load (cached PWA) | <500ms | Return visits should feel native. Service worker serves cached shell. |
| **NFR3:** Attendee list render (100 items) | <200ms | Scrolling must be fluid. No jank, no loading spinners within the list. |
| **NFR4:** Real-time update delivery (server broadcast to client DOM update) | <3 seconds on stable connection | Cold-start retention depends on live updates feeling alive. Measured from server broadcast initiation to client DOM update. Network transit time excluded from SLA but monitored. |
| **NFR5:** LinkedIn profile tap response (tap → browser navigation) | <1 second | Core action must feel instant. |
| **NFR6:** Time to interactive on 3G connection | <3 seconds | Worst-case conference WiFi. App must be usable even on degraded connections. |
| **NFR7:** PWA total cache payload | <2MB | Minimizes data consumption for attendees with limited data plans. |
| **NFR8:** System-controlled OAuth flow (redirect, callback processing, list rendering) | <5 seconds | Testable system target. The LinkedIn OAuth screen itself is outside our control. Total end-to-end experience including LinkedIn's UI targets <30 seconds aspirationally. |
| **NFR9:** Large attendee list rendering (500 items with lazy-loaded photos) | Scrollable and responsive without visible frame drops or jank | Largest supported event scenario. Rendering performance is distinct from connection scaling. |

### Security

| Requirement | Target | Rationale |
|---|---|---|
| **NFR10:** All data transmission encrypted via HTTPS | 100% of connections | LinkedIn OAuth requires it. No exceptions. |
| **NFR11:** LinkedIn OAuth tokens stored securely server-side | Never exposed to client-side code | Token leakage would compromise attendee LinkedIn accounts. |
| **NFR12:** OAuth token refresh handled transparently | No user-visible interruption | Expired tokens during post-event browsing must not break the experience. |
| **NFR13:** Attendee personal data accessible only within the event scope | Zero cross-event data leakage | FR51 (data isolation) requires enforcement. Attendee at Event A cannot see Event B data. |
| **NFR14:** Admin panel access protected by authentication | No unauthenticated admin access | FR26 requires secure admin credentials. |
| **NFR15:** LinkedIn OAuth scope requests only permitted fields | Name, photo, title, company — nothing else | Requesting unnecessary permissions destroys trust (Dave's journey). LinkedIn may revoke apps that over-request. |
| **NFR16:** Attendee data handling compliant with LinkedIn API Terms of Service | Full compliance | LinkedIn can revoke API access for ToS violations. This is an existential dependency. |
| **NFR17:** Privacy policy publicly accessible | Before first pilot | Required by LinkedIn OAuth and builds trust with privacy-conscious attendees. |

### Scalability

| Requirement | Target | Rationale |
|---|---|---|
| **NFR18:** Concurrent attendees per event | 500 without degradation | Covers largest pilot scenarios. Current pilots are 40-200. |
| **NFR19:** Concurrent active events | 10 simultaneously without degradation | MVP pilots may use 2-3 simultaneously, but the architecture must not impose a premature ceiling. 10 concurrent events covers 6-month growth without rearchitecting. |
| **NFR20:** Event spike handling (0 → 200 attendees in 15 minutes) | No performance degradation | Realistic conference scenario — registration opens, everyone scans at once. |
| **NFR21:** Concurrent real-time connections per event | 500 simultaneous | Each connected attendee maintains a persistent connection for live updates. |
| **NFR22:** Data growth (journey capture over time) | Support 500+ archived events with full journey data without query performance degradation on analytics dashboards | Journey data accumulates as the data moat. 500 events covers 3+ years at current pilot pace. Queries must remain fast as history grows. |

### Reliability

| Requirement | Target | Rationale |
|---|---|---|
| **NFR23:** Uptime during event windows | 99.5% during defined event windows (event start time minus 1 hour through event end time). Scheduled maintenance permitted outside event windows. | Downtime during a live event destroys organizer trust and attendee experience. Scoped to event windows for realistic solo-dev operations. |
| **NFR24:** Graceful degradation on connectivity loss | Cached list remains browsable, offline indicator shown | FR18-19 require offline resilience. The core browse experience must survive WiFi drops. |
| **NFR25:** Data capture durability | All successfully acknowledged scan and tap events are durably stored. The system acknowledges events only after database persistence is confirmed. | Journey data is the long-term asset. Honest engineering: events that fail before database commit (e.g., server crash mid-request) may be lost, but acknowledged events are guaranteed durable. |
| **NFR26:** Automatic recovery after server restart | Service resumes without manual intervention | Solo operator (Carlos) cannot be on-call 24/7. The system must self-heal. |
| **NFR27:** Event lifecycle transitions execute reliably | Automated transitions fire even if no admin is logged in | Post-event and archival transitions must happen on schedule regardless of admin activity. |
| **NFR28:** Zero-downtime deployments | Code updates can be applied without disconnecting active attendees or interrupting real-time updates | Carlos will need to hotfix during live pilots. Deploying must not disrupt attendees mid-browse. |
| **NFR29:** API error rate during active events | <1% of all requests (page loads, OAuth callbacks, data capture writes) | Establishes an explicit error budget for event-time reliability. |

### Accessibility

| Requirement | Target | Rationale |
|---|---|---|
| **NFR30:** WCAG 2.1 Level AA compliance | Full compliance | Committed in Web App Requirements. "Event-proof design" — benefits all users in event environments. |
| **NFR31:** Color contrast ratio (text against backgrounds) | Minimum 4.5:1 | Bright venue lighting washes out phone screens. High contrast helps everyone. |
| **NFR32:** Touch target size | Minimum 44x44px | Standing, one-handed, being bumped at events. Small targets are unusable for everyone. |
| **NFR33:** Screen reader support | ARIA labels on all interactive elements | Low implementation effort, high impact for visually impaired attendees. |
| **NFR34:** Keyboard navigation (desktop) | Full Tab/Enter/Escape support | Post-event desktop browsing must be fully keyboard-accessible. |
| **NFR35:** Browser zoom support | Fully usable at 200% zoom | Respects system font size settings. Layout must not break. |
| **NFR36:** Animation and motion sensitivity | All animations respect `prefers-reduced-motion` OS setting. Reduced motion replaces animations with static alternatives. | WCAG 2.1 AA compliance. Users with vestibular disorders. Costs almost nothing — single CSS media query. |
| **NFR37:** Real-time updates and keyboard focus | List updates do not disrupt keyboard focus position. Screen reader users notified via ARIA live regions without focus displacement. | Prevents disorienting focus jumps for assistive technology users when new attendees appear on the list. |

### Integration

| Requirement | Target | Rationale |
|---|---|---|
| **NFR38:** LinkedIn OAuth API unavailability handling | Previously authenticated attendees continue browsing via client-side cached attendee list. First-time authentication requires LinkedIn availability — system displays clear error if LinkedIn is unreachable during initial auth. | First auth depends on LinkedIn. Returning users must not be blocked by LinkedIn outages. |
| **NFR39:** LinkedIn API rate limit compliance | Stay within published rate limits with margin | Exceeding limits risks temporary or permanent API access revocation. |
| **NFR40:** LinkedIn API abstraction layer | System architecture isolates LinkedIn API interactions behind an abstraction layer, enabling API version updates without full application redeployment. | LinkedIn periodically updates API versions. Abstraction layer enables rapid adaptation without disrupting the entire application. |

### Observability

| Requirement | Target | Rationale |
|---|---|---|
| **NFR41:** Real-time KPI monitoring during active events | Admin can view response times, connection count, and error rates in real time during events | Carlos needs to know if the system is struggling during a live pilot. Without observability, NFR compliance is unverifiable in production. |
