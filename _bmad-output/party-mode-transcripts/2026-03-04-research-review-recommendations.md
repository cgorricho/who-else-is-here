---
date: '2026-03-04'
topic: 'Technical & Domain Research Review — Panel Recommendations'
participants: [Winston, John, Murat, Amelia, Sally, Mary, Bob]
triggeredBy: 'Carlos requested Party Mode review of both research documents (technical + domain) to draw conclusions and recommendations for planning document updates'
---

# Party Mode Transcript: Research Review & Recommendations

**Date:** 2026-03-04
**Participants:** 🏗️ Winston (Architect), 📋 John (PM), 🧪 Murat (Test Architect), 👩‍💻 Amelia (Developer), 🎨 Sally (UX Designer), 🏃 Bob (Scrum Master), 📊 Mary (Business Analyst)
**Context:** Two research reports were completed — Technical (LinkedIn OAuth, WebSocket/SSE, QR libraries) and Domain (8 competitor analysis for feature parity). The panel reviewed findings, approved/rejected architectural decisions, and produced a prioritized list of planning document updates.

---

🏗️ **Winston (Architect):** Let me cut straight to the punch. I've reviewed both research reports, and this is the most impactful pre-implementation research I've seen on this project. Two findings are **showstoppers** that would have derailed implementation:

**Finding 1 — LinkedIn scopes:** If an AI agent had built against `r_liteprofile`, the entire OAuth flow would fail on first test. The migration to OIDC scopes (`openid`, `profile`, `email`) is not optional — it's mandatory. **APPROVED.** No discussion needed.

**Finding 2 — Title + Company → Headline:** This cascades through *every* document — PRD, Architecture, UX spec, epics, database schema. The research is correct: LinkedIn's self-serve product does NOT provide separate title/company fields. The `headline` column approach is the right call. It's simpler, more honest, and eliminates the unreliable parsing problem. **APPROVED.**

Now, the two *significant* decisions that need panel discussion:

**Decision A — Auth.js v5 vs Custom OAuth:**
I'm strongly in favor. Auth.js eliminates ~500 lines of custom code, handles CSRF, session cookies, token lifecycle — all things that are high-risk for AI agent drift. The custom profile callback pattern for `/v2/me` (headline + vanityName) is well-documented and clean. My only concern: does Auth.js's session management conflict with our tRPC session context? It shouldn't — Auth.js exposes a `getServerSession()` helper that tRPC middleware can consume. **I approve Auth.js with one condition:** the Architecture must specify exactly how Auth.js sessions flow into tRPC context.

**Decision B — tRPC SSE Subscriptions vs Raw WebSocket:**
This one I need the panel on. The research makes a compelling case — our traffic IS 95% server→client, and `tracked()` with `lastEventId` solves FR54 reconnection *for free*. But I have three concerns:

1. **Scaling:** SSE connections are HTTP keep-alive. At 500 concurrent connections, that's 500 open HTTP connections. With Nginx and Node.js, this is fine — but the Architecture should document the ceiling.
2. **Future extensibility:** If we ever add chat or typing indicators, we'd need WebSocket alongside SSE. The research acknowledges this tradeoff.
3. **Custom server.js:** We still need it for Docker, but it becomes simpler without WebSocket upgrade handling. That's a net positive.

My position: **Approve tRPC SSE with a documented migration path to WebSocket if bidirectional features are added post-pilot.**

---

📋 **John (Product Manager):** Winston covered the technical approvals. Let me address the product-facing impacts.

**On the headline change (FR2, FR12):**
The PRD says _"name, photo, title, and company"_ — we need to change this to _"name, photo, and professional headline."_ FR12 (AttendeeCard display) needs the same treatment. This is NOT a scope change — it's a **reality correction**. We're aligning our requirements with what LinkedIn actually provides.

**On the domain research:**
Mary's detective instincts were right — the domain research is gold. Two key takeaways for our planning docs:

1. **Our differentiation is validated.** No competitor does "scan QR → see who's in this room." That's a real gap, not an assumption. This should be echoed in the PRD's problem statement to give AI agents context on *why* we're building this way.

2. **The 4 minor enhancements from domain research.** Let me prioritize:
   - Enhancement #1 (QR print minimum size): **Yes** — add to Story 3.3. Costs nothing, prevents a usability failure.
   - Enhancement #2 (Quiet zone): **Yes** — add to Story 3.3. Industry standard.
   - Enhancement #3 (Signage micro-copy "Scan to see who else is here"): **Yes** — add to UX spec. This is the "moment of truth" copy.
   - Enhancement #4 (Manual name lookup fallback): **No for MVP.** This adds a search feature, which is scope creep for the pilot. Park it for post-pilot.

**On the "first pilot" context:**
The earlier panel flagged that RUMC-specific context isn't echoed in the epics. I still think `create-story` is the right place for this, but we should add a **"Pilot Context" note** to the epics file header so AI agents see it at the top of every story file.

---

🧪 **Murat (Test Architect):** Let me address the quality implications of these five decisions.

**Auth.js v5 — Test Impact:**
This is a massive win for testability. Instead of testing a custom OAuth implementation (which is notoriously hard to unit test — mock HTTP redirects, state tokens, CSRF), we can:
- Test Auth.js configuration (valid scopes, callback URL)
- Test the custom profile callback in isolation (mock `/v2/me` response)
- Test session-to-tRPC-context flow
- Integration test the full OAuth flow against LinkedIn's sandbox (if available) or a mock OIDC provider

**Story 1.2 risk level drops from HIGH to MEDIUM** with Auth.js. This is significant.

**tRPC SSE — Test Impact:**
Even better for testing. tRPC subscriptions are just procedures — they can be tested with the standard tRPC caller pattern. The `tracked()` helper means reconnection tests don't require simulating WebSocket disconnections — we test that the subscription yields the correct events and that `lastEventId` filtering works.

**Story 2.3 risk level drops from HIGH to MEDIUM-LOW.** The reconnection state machine we were worried about? It's now the browser's native EventSource behavior. We don't test the browser — we test that our server sends the right event IDs.

**What I need in the Architecture for test clarity:**
1. Auth.js mock provider configuration for testing
2. tRPC subscription test pattern (how to test async generators)
3. The exact error response shapes for: (a) LinkedIn OAuth failure, (b) SSE connection failure, (c) session cookie expired

---

👩‍💻 **Amelia (Developer Agent Advocate):** As the voice for AI coding agents, these decisions make my life *dramatically* easier. Let me be specific:

**Auth.js v5:**
An AI agent reading "implement OAuth with LinkedIn" could go in 10 directions. An AI agent reading "configure Auth.js v5 with LinkedIn OIDC provider and this exact profile callback" has ONE path. This is the difference between a 2-hour story and a 2-day story. **Strong approve.**

**tRPC SSE:**
Same story. "Implement WebSocket server with session-scoped rooms, exponential backoff reconnection, and missed update recovery" is an invitation for agent drift. "Add a tRPC subscription procedure using `tracked()` that yields attendees" is a single, type-safe function. The wire format ambiguity the panel flagged in the first Party Mode? **Completely eliminated** — Zod schemas define the message shapes.

**What I need in the stories:**
1. The **exact Auth.js configuration code** (the profile callback pattern from the research is perfect — put it in Story 1.2 as a reference implementation)
2. The **exact tRPC subscription procedure signature** with Zod input/output schemas (put it in Story 1.3)
3. The **exact Drizzle ORM schema** for the updated `attendees` table with `headline` and `vanity_name` columns (put it in Story 1.1)

If these three code patterns are in the stories, an AI agent can implement each story in a single pass with zero drift.

---

🎨 **Sally (UX Designer):** The headline change impacts my UX spec, so let me address it.

**AttendeeCard redesign:**
Current spec: Photo | Name (bold) | Title • Company (secondary) | LinkedIn tap target

Updated: Photo | Name (bold) | Headline (secondary) | LinkedIn tap target

This is actually **cleaner**. The "Title • Company" pattern required specific typography (dot separator, truncation rules for long titles AND long companies). A single `headline` line is:
- Simpler to implement
- More authentic (shows what the user chose as their identity)
- Better handles edge cases (retired professionals, students, multi-role people)
- Matches what Swapcard and Brella show in their attendee cards (per domain research)

**Truncation rule:** Headline max display length should be ~60 characters on mobile (single line), with ellipsis. The full headline (up to 220 chars) shows on hover/tap expansion.

**Signage copy update (Enhancement #3):**
I'll add the exact copy to the UX spec:
- Primary CTA: **"Scan to see who else is here"**
- Sub-text: **"Point your phone camera at the QR code"**
- This goes on the printed signage alongside the QR code, session name, and room number.

---

📊 **Mary (Business Analyst):** Let me synthesize the domain research implications.

The competitive landscape confirms our position is **unique and defensible**. But I want to highlight one strategic insight for the planning docs:

**Swapcard's 70-80% adoption rate** (vs industry 30-40%) is attributed to UX quality. Our PWA + zero-friction approach should aim for even higher adoption within our smaller scale. The planning docs should capture this benchmark — not as a KPI, but as a validation of our UX-first philosophy.

**On Enhancement #4 (manual name lookup fallback):** I agree with John — not MVP. But I want to flag it differently: if QR scanning fails (phone can't read the code, URL not loading), the attendee has **zero fallback**. That's a dead end. For the pilot, Carlos can manually share the URL as a backup (WhatsApp, email). But post-pilot, this needs addressing. **Document it as a known limitation in the Architecture.**

---

🏃 **Bob (Scrum Master):** Let me distill all of this into an actionable recommendation list.

## Panel Consensus: Decisions

| # | Decision | Verdict | Conditions |
|---|----------|---------|------------|
| 1 | LinkedIn OIDC scopes (`openid`, `profile`, `email`) | ✅ **APPROVED unanimously** | None — mandatory |
| 2 | `headline` + `vanity_name` replacing `title` + `company` | ✅ **APPROVED unanimously** | Update all affected docs |
| 3 | Auth.js v5 for LinkedIn OAuth | ✅ **APPROVED** | Document Auth.js → tRPC context flow |
| 4 | tRPC SSE subscriptions (replacing WebSocket) | ✅ **APPROVED** | Document WebSocket migration path for post-pilot |
| 5 | `qrcode` + `sharp` for QR generation | ✅ **APPROVED** | None |
| 6 | Nginx config with `proxy_buffering off` | ✅ **APPROVED** | Include in Architecture |
| 7 | SameSite=lax session cookie | ✅ **APPROVED** | Document why not `strict` |
| 8 | Domain Enhancement #1 (QR min size) | ✅ **Add to Story 3.3** | Minimum 3cm × 3cm |
| 9 | Domain Enhancement #2 (Quiet zone) | ✅ **Add to Story 3.3** | Industry standard |
| 10 | Domain Enhancement #3 (Signage copy) | ✅ **Add to UX spec** | "Scan to see who else is here" |
| 11 | Domain Enhancement #4 (Manual lookup) | ❌ **Deferred** | Post-pilot, document as known limitation |

## Prioritized Planning Document Updates

**Priority 1 — CRITICAL (Must update before ANY story creation):**

1. **Architecture doc:**
   - Replace OAuth section: Auth.js v5 + LinkedIn OIDC + custom profile callback
   - Replace real-time section: tRPC SSE subscriptions with `tracked()` (remove WebSocket references, add WebSocket migration path note)
   - Update `attendees` table schema: `headline` + `vanity_name`
   - Add library decisions table: Auth.js, qrcode, sharp
   - Add session cookie specification (SameSite=lax, why not strict)
   - Add Nginx reverse proxy config block
   - Add Auth.js → tRPC context integration pattern
   - Fix Tailwind v4 `@theme` references (remove `tailwind.config.js`)
   - Explicitly state: "Vercel deployment is NOT supported"

2. **PRD:**
   - FR2: "name, photo, and professional headline" (was "name, photo, title, and company")
   - FR12: Update AttendeeCard description to reflect headline display
   - Add pilot context paragraph to Overview section

3. **Epics:**
   - Story 1.1: Update schema (headline + vanity_name)
   - Story 1.2: Auth.js implementation (not custom OAuth)
   - Story 1.3: tRPC SSE subscription (not WebSocket)
   - Story 2.3: tRPC `tracked()` reconnection (not manual WebSocket reconnection)
   - Add "Pilot Context" header note
   - Story 3.3: QR minimum size + quiet zone

4. **UX Spec:**
   - AttendeeCard: headline single line (with truncation rule)
   - Signage copy: "Scan to see who else is here"

**Priority 2 — IMPORTANT (Before create-story for affected stories):**

5. **Architecture doc (additions from first Party Mode):**
   - Deployment topology detail (Docker Compose service names, port mapping)
   - Error message specifications (OAuth failure, SSE failure, cookie expired)
   - Auth.js mock provider pattern for testing

6. **UX Spec (additions from first Party Mode):**
   - Micro-copy for cold-start messages (FR21-23): exact text
   - Loading skeleton Tailwind classes
   - Complete indigo color palette with hover/disabled/focus states
   - Error state copy

**Priority 3 — POST-PILOT (Document as known limitations):**
- Manual name lookup fallback (Enhancement #4)
- WebSocket migration for bidirectional features
- Gamification features noted from domain research

---

**Carlos:** go ahead

**BMad Master:** Proceeding with Priority 1 document updates. Starting with Architecture (most changes, referenced by other docs), then PRD, Epics, and UX Spec.
