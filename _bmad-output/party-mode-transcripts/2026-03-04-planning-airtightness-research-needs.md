---
date: '2026-03-04'
topic: 'Planning Document Airtightness & Research Needs Assessment'
participants: [Winston, John, Murat, Sally, Mary, Bob]
triggeredBy: 'Carlos requested review of planning doc completeness for AI coding agents and whether formal research is needed'
---

# Party Mode Transcript: Planning Document Airtightness & Research Needs Assessment

**Date:** 2026-03-04
**Participants:** 🏗️ Winston, 📋 John, 🧪 Murat, 🎨 Sally, 📊 Mary, 🏃 Bob
**Context:** Carlos wants to triple-check planning documents are airtight for AI coding agents and determine if formal BMAD research (market, tech, domain) would strengthen the project

---

**Carlos:** I want to invoke a party mode to review the following issue:
* at one of the previous party modes it was stated that planning had to be redundantly explicit for AI coding agents not to have a single doubt about what they need to do, I know that part of it will be developed in the creation of each story. I just want to triple-check that the planning documents are air tight and leave no room for AI coding agent drifting
* we have not performed any bmad formal research on this project. based on what was planned so far, I want the party mode to determine if deep research (market, tech, domain) would strengthen what we have at this point

---

🏗️ **Winston (Architect):** Carlos, the BMad Master raises the right concern. Let me be direct about where AI coding agents typically drift, based on what I see in our documents.

**Where our docs ARE airtight:**
- Database schema: 5 tables, every column typed, Drizzle ORM + Zod — agents can't drift when the type system constrains them
- tRPC router structure: named, typed, predictable
- The epics have Given/When/Then acceptance criteria with FR traceability — that's the gold standard

**Where I see potential drift zones:**
1. **WebSocket implementation details** — FR53/FR54 specify *what* (broadcast <3s, exponential backoff) but the Architecture doesn't prescribe *which WebSocket library* or the exact reconnection state machine. An AI agent could pick Socket.io, ws, or Pusher and each would cascade differently through the codebase.
2. **LinkedIn OAuth callback flow** — We specify the scope and the cookie-based session hop, but the exact middleware chain (where does the OAuth callback handler live? How does the session cookie get set?) could be interpreted multiple ways.
3. **The `session-resolver.ts` file** — It's described as "optional event lobby" but it's referenced in the Architecture. An agent might spend effort building it when it's not MVP-critical, or skip it when another story depends on it.
4. **Tailwind v4 `@theme` vs `tailwind.config.js`** — We flagged this as a minor issue. But an AI agent reading Architecture will see `tailwind.config.js` and code against v3 patterns. The epics override this, but if the agent reads Architecture first...

My recommendation: these gaps get closed during `create-story`, which generates implementation-level detail. But a **prescriptive tech decisions appendix** in the Architecture doc — listing exact library choices, file paths, and middleware ordering — would eliminate drift at the source.

---

📋 **John (Product Manager):** Winston's hitting the nail on the head, but let me zoom out and ask the harder question: *where do AI agents actually fail?*

They fail when there's **implicit knowledge** — things *we* know but didn't write down. Let me stress-test our docs against that:

**What's explicit and good:**
- 56 FRs with numbered traceability — an agent can't miss one
- 7 user journeys that tell the "why" behind every feature
- The concurrent sessions model is documented thoroughly — the RUMC 7-session scenario is in there

**What might be implicit:**
- **Deployment topology** — Docker Compose is mentioned, but the exact Nginx → Next.js → PostgreSQL routing for production vs dev isn't spelled out. An agent might scaffold a Dockerfile that works locally but not in production.
- **Error message copy** — FR7 says "status-specific message" for invalid/expired/archived URLs, FR9 says "error message identifying the failure type." But what are the actual words? An agent will generate placeholder copy that may not match the UX spec's tone.
- **The "first pilot" context** — Our entire MVP is scoped for RUMC. That context (7 concurrent sessions, ~100-500 attendees, Carlos as super-admin) shapes implementation priorities. It's in the Product Brief but not echoed in the epics themselves.

Now to your second question — **research**. Here's my detective's instinct: we built this product from Carlos's direct domain expertise as a RUMC organizer. That's *primary research* — the best kind. Formal market research would tell us who else does event networking (Brella, Grip, Whova) and at what price points, but that's a post-pilot concern. We're not trying to find product-market fit right now — we're building a tool for a specific event you run.

**However** — and this is where I'd push — **technical research** could save us pain. Specifically: LinkedIn OAuth API gotchas, rate limits, and recent policy changes. If LinkedIn changed their API in 2025-2026, our Architecture assumptions might be stale.

---

🧪 **Murat (Test Architect):** Let me add the quality lens to both topics.

**On document airtightness for AI agents:**

My TEA test design already identified the risk tiers. The highest-risk stories are 1.2 (OAuth), 2.3 (WebSocket reconnection), and 4.1 (session hop). These are exactly the stories where agent drift is most dangerous because they involve **external integrations and stateful protocols**.

What I want to see before an AI agent touches these stories:
- **Exact HTTP request/response shapes** for the LinkedIn OAuth flow (authorization URL parameters, callback payload, token refresh format)
- **WebSocket message protocol** — what does a `new_attendee` event look like on the wire? What's the `missed_updates` payload shape?
- **Session cookie specification** — name, domain, path, SameSite, HttpOnly, Secure flags, expiry

These are the kind of things that, if left to an AI agent's interpretation, will produce code that *looks right* but fails in integration testing. The `create-story` workflow should pin these down for Stories 1.2, 2.3, and 4.1 specifically.

**On research:**

I agree with John — **technical research** is the one that pays off now. Specifically:
1. **LinkedIn OAuth API** — current scopes, rate limits, deprecation notices, recent breaking changes
2. **WebSocket at scale on Vercel/Node** — our Architecture says Next.js, but WebSocket support varies by deployment target. If we're deploying to Vercel, that's a constraint. If it's a custom Node server, different story.
3. **QR code library evaluation** — we need print-ready output at specific DPI. Not all libraries do this well.

Market and domain research? Save it for post-pilot when you're deciding whether to commercialize.

---

🎨 **Sally (UX Designer):** I want to pile on Winston's point about **error message copy and UI states**.

My UX spec is 137 KB — it has every component, every responsive breakpoint, every animation. But here's what an AI coding agent will struggle with:

1. **Micro-copy** — The encouragement messages for cold-start (FR21-23) are described functionally but the actual text isn't written. An agent will generate generic copy like "Waiting for more attendees..." instead of the warm, encouraging tone we designed for.
2. **Loading skeleton shapes** — I specified skeleton states but the exact Tailwind classes for the shimmer animation aren't in the UX spec. An agent will either skip skeletons or implement them differently than intended.
3. **The indigo color system** — I specified `#4F46E5` as primary, but the full palette (hover states, disabled states, focus rings, dark mode variants) needs to be in `theme.css` with exact values. If the agent eyeballs the shades, the UI will look inconsistent.

My recommendation: **before each epic, I should do a micro-copy and design token pass** that gives the `create-story` workflow exact values to embed.

---

📊 **Mary (Business Analyst):** *leans forward with excitement*

Oh, this is where my detective instincts light up! Let me tackle the research question head-on.

**What research would actually strengthen our position:**

1. **Domain research: Event networking apps** — Not for product-market fit (John's right, that's post-pilot), but for **feature parity awareness**. If Brella does something clever with QR codes that we're not aware of, we might miss an opportunity or, worse, build something that feels dated to attendees who've used competitors. A quick domain scan would take 30 minutes and give us a reference point.

2. **Technical research: LinkedIn API** — This is **critical**, not optional. LinkedIn's API has gone through significant changes. Their Marketing API, Consumer API, and Sign In with LinkedIn are different products with different scopes and rate limits. We need to verify that `r_liteprofile` and `r_emailaddress` scopes still exist in their current form and that our OAuth flow matches their current documentation. This could be a showstopper if the API changed.

3. **Market research** — Genuinely skip this. You know your market (RUMC attendees), you know the problem (no easy way to connect at events), and you're not seeking funding. Market research would be intellectual entertainment, not actionable input.

**My recommendation:** Run `technical-research` workflow focused narrowly on LinkedIn OAuth API current state + WebSocket deployment patterns. 30-60 minutes, high impact, directly strengthens Architecture and de-risks Stories 1.2 and 2.3.

---

🏃 **Bob (Scrum Master):** Crisp summary from the process perspective:

**Topic 1 — Document airtightness:**
- Planning docs: SOLID. 100% FR coverage, 0 critical issues, validated by readiness check.
- Gap: **implementation-level specificity** in 3-4 areas (WebSocket protocol, OAuth flow, session cookie spec, exact library choices).
- Mitigation: The `create-story` workflow is *designed* to close these gaps. Each story file will contain task/subtask breakdowns with exact file paths and acceptance criteria. That's where the precision goes from "what to build" to "how to build it."
- **Action item:** When running `create-story` for high-risk stories (1.2, 2.3, 4.1), explicitly request that the story include protocol-level detail, exact library choices, and wire format specifications.

**Topic 2 — Research:**
- Consensus forming: **Technical research = yes, Market/Domain = not now.**
- Specifically: LinkedIn OAuth API verification + WebSocket deployment constraints.
- Timing: **Before Story 1.2** (OAuth) and **before Story 2.3** (WebSocket). Could run now or just before those stories.

**Bob's process recommendation:**
1. Run `technical-research` workflow focused on LinkedIn OAuth + WebSocket patterns — **before starting Epic 1 implementation**
2. Feed research findings into Architecture doc as an addendum
3. Proceed to `create-story` for Story 1.1, which is infrastructure and not affected by the research gaps
4. By the time Story 1.2 comes up, research will be integrated

---

**Carlos:** I want you to do the following:
* strengthen ALL the areas mentioned by the party of agents that could help the AI developer create better stories
* perform the following research
 - domain for feature parity awareness
 - technical for all reasons mentioned by the agents
* we will invoke another party mode to have the agents review the research and draw conclusions and recommendations to improve the planning documents at their current state
* what should go first, the research or the reinforcement of the planning docs. or are these independent activities

---

**BMad Master:** **Research first.** These are NOT independent.

Here's why — the panel identified gaps that fall into two categories:

1. **Gaps that research will directly answer:** LinkedIn OAuth exact scopes/payloads, WebSocket library choice + deployment constraints, QR code library for print-ready output. If we reinforce the docs now with assumptions and the research contradicts them, we'd redo the work.

2. **Gaps that are internal decisions:** micro-copy, design tokens, session cookie spec, deployment topology, error message copy. These *could* be done in parallel, but the technical research might influence them (e.g., if LinkedIn's current OAuth response shape differs from what we assumed, the error handling copy changes).

**Recommended sequence:**

1. **Run research** (domain + technical) — two workflows
2. **Party Mode review** of research findings → conclusions + recommendations
3. **Reinforce planning docs** with research-informed specificity
4. **Proceed to implementation** (`create-story` for 1.1)

Story 1.1 (scaffold/database) is unaffected by the research, so if you want, we could run `create-story` for 1.1 in parallel with the research. But the doc reinforcement must wait for research results.
