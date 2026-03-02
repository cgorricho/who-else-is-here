---
date: '2026-03-01'
topic: 'Requirements Extraction Review for Epic Creation'
participants: [John (PM), Winston (Architect), Murat (Test Architect), Mary (Business Analyst), Amelia (Developer)]
triggeredBy: 'Carlos requested Party Mode review of the extracted requirements inventory (56 FRs, 42 NFRs, additional requirements) before proceeding to epic design.'
---

# Party Mode Transcript: Requirements Extraction Review

**Date:** 2026-03-01
**Participants:** 📋 John, 🏗️ Winston, 🧪 Murat, 📊 Mary, 💻 Amelia
**Context:** Step 1 of the Create Epics & Stories workflow extracted all requirements from PRD, Architecture, and UX Design Specification into `epics.md`. Carlos requested a Party Mode review to assess completeness before proceeding to epic design.

---

**Carlos:** have a party mode assess and answer this question

---

📋 **John**: Three observations from the PM seat.

1. **FR count looks right but the grouping in the epics file could bite us later.** The extraction lists FR50b and FR55 correctly — those were the two post-concurrent-sessions additions. But I want to flag: the PRD has FR1-FR55 plus FR50b — that's 56 FRs. Confirmed. No gaps.

2. **NFR count discrepancy.** The summary says "42 NFRs" but I count 41 in the PRD (NFR1 through NFR41) plus NFR9b — that's 42. Math checks out. But the extraction file headers say "42" while grouping shows 10 + 8 + 5 + 7 + 8 + 4 = 42. Confirmed correct.

3. **Missing PRD content that affects story creation.** The extraction captures FRs and NFRs but does NOT extract the 7 User Journeys from the PRD. Those journeys (Alex Happy Path, Alex Cold Start, Alex Connectivity Failure, Karen Event Deployment, Carlos Admin Creation, Dave Reluctant Scanner, Alex Session Hop) contain acceptance criteria context that goes BEYOND what the FRs specify. For example, Journey 3 (Connectivity Failure) specifies the copyable URL fallback UX — that detail is in the journey, not just in FR17. The epics workflow should reference these journeys when writing acceptance criteria.

---

🏗️ **Winston**: Two structural observations from the architecture side.

1. **The additional requirements from Architecture are accurate but missing one critical item: the implementation sequence.** The extraction lists the implementation sequence (scaffold → database → Express/tRPC → OAuth → attendee API → Socket.io → React SPA → PWA → admin panel → marketing site), which is good. But it doesn't call out the Architecture's explicit note: "Project initialization using the monorepo scaffold should be the first implementation story." This should be highlighted — it shapes Epic 1 Story 1.

2. **Tailwind v4 @theme vs tailwind.config.js — there's a tension in the extraction.** The additional requirements from Architecture say "Shared Tailwind config between client and marketing packages" and reference `tailwind.config.js`. The UX section says "Tailwind CSS v4 with `@theme` CSS-first configuration (not v3 `tailwind.config.js`)." The Architecture document references `tailwind.config.js` in several places, but the UX spec (written later) correctly identifies that Tailwind v4 uses `@theme` directives in CSS, not a JS config file. The extraction should note this as `packages/shared/theme.css` with `@theme` directives — not `tailwind.config.js`. This is already corrected in the UX spec but the Architecture still has the old reference. Won't block epic creation, but the stories need to use the correct approach.

---

🧪 **Murat**: Risk-based testing perspective on completeness.

1. **The extraction is missing the testing architecture as an additional requirement.** The Architecture specifies: Vitest for unit/integration, Playwright for E2E, `@axe-core/playwright` for accessibility, `@testing-library/react` for component tests, and Supertest for API tests. These aren't FRs or NFRs — they're implementation constraints that affect every story's acceptance criteria. When we write stories, "Done" must include tests. The extraction should list the testing stack explicitly.

2. **NFR coverage is solid but I want to flag NFR30 (WCAG 2.1 AA) as a cross-cutting concern.** It's not one story — it's an acceptance criterion on EVERY attendee-facing component story. The 8 accessibility enforcement rules from the Architecture (ARIA labels, live regions, touch targets, keyboard nav, focus preservation, motion sensitivity, color contrast, zoom support) need to be referenced as a checklist in each UI story. The extraction captures NFR30-37 but doesn't highlight them as cross-cutting.

3. **The E2E test priorities from Architecture are worth extracting.** The Architecture explicitly calls out test risk priority: WebSocket reconnection > OAuth flow > journey data capture > session hop. This should inform which stories get E2E coverage first.

---

📊 **Mary**: Requirements traceability check.

1. **All 56 FRs are present.** I cross-referenced the extraction against the PRD line by line. FR1 through FR55 plus FR50b — all accounted for. No omissions, no duplicates, no paraphrasing errors.

2. **All 42 NFRs are present.** NFR1 through NFR41 plus NFR9b. Confirmed.

3. **One additional requirement I'd add from the PRD that's not an FR or NFR:** The PRD specifies MVP scope boundaries — what's explicitly IN and OUT of MVP. The extraction doesn't capture the "Explicitly Out of MVP Scope" items (dark mode, multi-language, native mobile app, in-app messaging, social features, custom branding per organizer, API for third-party integrations). These matter for story creation because they tell developer agents what NOT to build. When writing stories, "scope" means "these boundaries."

---

💻 **Amelia**: Implementation precision check. Three items.

1. **The 12 custom components from UX are listed but their implementation phases are not.** The UX spec defines a 3-phase roadmap: Phase 1 (MVP Core: AttendeeCard, AttendeeList, SessionHeader, OAuthLoadingScreen, ColdStartMessage), Phase 2 (MVP Complete: SearchFilter, SessionStatusScreen, MetricCard, EventForm, SessionReport), Phase 3 (Post-Pilot: ActivityTimeline, SessionList, PDF export). These phases should map directly to epic ordering. The extraction lists all 12 components but flattens the phasing.

2. **The `.env` required variables are listed — good.** DATABASE_URL, LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET, NODE_ENV. Story 1.1 (scaffold) needs to create `.env.example` with all of these.

3. **Express 5 compatibility note is critical.** Architecture flags: "Verify Passport.js and `connect-pg-simple` compatibility with Express 5.2.1 at scaffold time. If incompatible, use `passport@next` or switch to manual OAuth2 flow." This is a spike/investigation task that should be its own story or a subtask of the auth story.

---

**Panel Summary — Recommendations:**

| # | Finding | Recommended Action |
|---|---|---|
| 1 | User Journeys not extracted | Add 7 user journeys to extraction as reference material for AC writing |
| 2 | "First implementation story = scaffold" not highlighted | Note prominently in additional requirements |
| 3 | Tailwind v4 @theme vs tailwind.config.js tension | Note that stories should use @theme CSS approach per UX spec |
| 4 | Testing stack not listed as additional requirement | Add testing architecture (Vitest, Playwright, axe-core, testing-library, Supertest) |
| 5 | NFR30-37 accessibility rules are cross-cutting | Flag as cross-cutting checklist, not isolated stories |
| 6 | E2E test risk priorities not captured | Add Architecture's test priority ordering |
| 7 | MVP scope boundaries (what's OUT) not captured | Add "Explicitly Out of MVP" list from PRD |
| 8 | UX component phasing (3 phases) not captured | Add phase assignments for implementation ordering |
| 9 | Express 5 compatibility spike needed | Flag as investigation task in auth epic |

All 56 FRs and 42 NFRs are **confirmed complete and accurate**. The panel recommends adding the 9 items above to the additional requirements section before proceeding to epic design.

---

**Carlos:** apply all 9 additions and continue

---

All 9 additions applied to `epics.md`:
- User Journeys section added (7 journeys as reference for AC writing)
- Scaffold-first mandate highlighted in Architecture additional requirements
- Testing architecture added (Vitest, Playwright, axe-core, testing-library, Supertest)
- E2E test risk priorities added
- Express 5 compatibility spike flagged
- Tailwind v4 @theme note added
- UX component implementation phases added (3 phases)
- Cross-cutting accessibility concerns section added (NFR30-37 as per-story checklist)
- MVP Scope Boundaries section added (17 deferred items)

### Key Decisions

1. **User journeys are reference material, not separate stories** — they inform acceptance criteria on existing stories
2. **Accessibility is cross-cutting** — 8 enforcement rules as checklist on every UI story, not isolated epic
3. **Component phasing maps to epic ordering** — Phase 1 (MVP Core) before Phase 2 (MVP Complete) before Phase 3 (Post-Pilot)
4. **Express 5 compatibility is a spike** — investigation task within the auth epic
5. **MVP scope boundaries prevent scope creep** — 17 items explicitly listed as "do NOT build"
