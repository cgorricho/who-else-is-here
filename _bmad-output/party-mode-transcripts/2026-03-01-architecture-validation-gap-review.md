---
date: '2026-03-01'
topic: 'Architecture Validation Gap Review'
participants: [Winston (Architect), Amelia (Developer), Barry (Quick Flow Solo Dev), Murat (Test Architect), Sally (UX Designer)]
triggeredBy: 'Architecture workflow step-07 (Validation) — Carlos selected Party Mode to review validation findings before committing'
---

# Party Mode Transcript: Architecture Validation Gap Review

**Date:** 2026-03-01
**Participants:** 🏗️ Winston, 💻 Amelia, 🚀 Barry, 🧪 Murat, 🎨 Sally
**Context:** Carlos selected Party Mode during architecture validation (step 7) to review the gap analysis findings. The validation found 47/54 FRs fully covered, 21/41 NFRs fully covered, 2 critical gaps, 8 important gaps, and 8 nice-to-haves.

---

**Carlos:** P

---

🏗️ **Winston**: Let me address the elephant in the room first: **the missing database schema**.

The validation correctly flags this as critical. Right now, an AI developer agent implementing the database layer would know the table *names* (`events`, `attendees`, `journey_events`) and the column *naming convention* (`snake_case`), but they wouldn't know the column types, constraints, or relationships. That's not a build specification — that's a suggestion.

However — and this is the nuance — **the Drizzle schema IS part of the project structure**, mapped to `server/src/db/schema.ts`. The question is: should we define the full schema here in the architecture document, or should it be defined in the developer stories?

My position: **define the schema here.** The schema IS an architectural decision. It encodes data boundaries, event scoping, relationship patterns, and lifecycle states. A developer story should say "implement this schema," not "design this schema." The schema is the data architecture — it belongs in this document.

Specific tables needed:
- `events` — slug, name, dates, venue, agenda, status, lifecycle timestamps
- `attendees` — event_id FK, linkedin data (name, title, company, photo_url, linkedin_url), scanned_at
- `journey_events` — event_id FK, attendee_id FK, type (scan/tap/browse/return), timestamp, metadata
- `feedback` — event_id FK, attendee_id FK, text, submitted_at
- Session tables managed by `connect-pg-simple` (auto-created)

💻 **Amelia**: Winston is right — the schema belongs here. Let me be more specific about what the developer agent needs to see:

```typescript
// packages/server/src/db/schema.ts
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  venue: varchar('venue', { length: 255 }),
  agenda: text('agenda'),
  scheduledStart: timestamp('scheduled_start', { withTimezone: true }).notNull(),
  scheduledEnd: timestamp('scheduled_end', { withTimezone: true }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  postEventEndsAt: timestamp('post_event_ends_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
```

That's the level of specificity an AI developer agent needs. Every column, every type, every constraint. We should add the full schema definition to the architecture. Not the implementation code — the **specification** of tables, columns, types, constraints, and relationships that the developer agent translates into Drizzle code.

🧪 **Murat**: From a testing perspective, the missing schema is a **test-blocking gap**. I can't write schema validation tests, I can't write integration tests against the database, I can't define test fixtures — all of that depends on knowing the column types and relationships. The schema needs to be in the architecture. Full stop.

Now, on the **accessibility gaps** — this is where I want to push. The validation found NFR30-37 with zero architectural guidance. That's **eight NFRs** with no patterns. The PRD specifies WCAG 2.1 AA as a firm requirement. Without patterns, AI agents will either skip accessibility entirely or implement it inconsistently. I'd recommend adding a dedicated **Accessibility Patterns** subsection to the Implementation Patterns section. It doesn't need to be exhaustive — just the enforcement rules:

1. All interactive elements must have ARIA labels
2. Attendee list must use `aria-live="polite"` for real-time updates
3. All touch targets minimum 44x44px (Tailwind: `min-h-11 min-w-11`)
4. Keyboard navigation: all interactive elements reachable via Tab
5. Focus preservation: when list updates, focus stays on current element
6. `prefers-reduced-motion`: wrap all animations in `@media (prefers-reduced-motion: no-preference)`
7. Color contrast: use Tailwind palette values that meet 4.5:1 ratio

Add `@axe-core/playwright` to the E2E test stack for automated accessibility scanning.

🚀 **Barry**: Alright, let me be the pragmatist here. We've got **2 critical gaps, 8 important gaps, and 8 nice-to-haves.** That's 18 items. If we try to address all 18 in the architecture document, we'll be writing a novel, not a build spec.

Here's my take on what to address **now** vs. **defer to developer stories**:

**Address NOW in architecture (4 items):**
1. Database schema — critical, blocks implementation. Add the full table specification.
2. Accessibility patterns — add the 7-rule enforcement section Murat described. Takes 10 lines.
3. Passport.js + Express 5 — add a note: "verify compatibility at scaffold time; if incompatible, use `passport@next` or switch to manual OAuth2 flow with `openid-client`."
4. Event lifecycle scheduling — one sentence: "Use `node-cron` or PM2 cron for scheduled lifecycle checks every 60 seconds."

**Defer to developer stories (14 items):**
Everything else. Token refresh, report export format, scanning disable mechanism, anonymization approach, circuit breaker, deployment scripts, observability dashboard, design tokens, ESLint config, self-identification UX, feedback trigger mechanism, Tailwind v4 config, spike handling, analytics indexing — these are **implementation details** that belong in stories, not architecture. The architecture tells you WHAT to build and WHERE to put it. The stories tell you HOW to build it.

Carlos, the architecture already maps every FR to a specific file. That's the architecture's job done. The developer story for FR35 will specify "export as PDF using `@react-pdf/renderer`." That's story-level detail, not architecture-level.

🎨 **Sally**: I want to support Murat's accessibility point and add the UX lens. The PRD specifies WCAG 2.1 AA for a reason — this app is used at professional events where attendees may have disabilities. If the attendee list isn't screen-reader accessible, we're excluding people. If touch targets are too small, people with motor impairments can't tap to LinkedIn.

The 7-rule pattern Murat proposed is the right level for architecture. It tells the developer agent: "every component you build must follow these rules." Without it, the agent has no accessibility guardrails at all. And adding `@axe-core/playwright` to the E2E stack means accessibility gets verified automatically — it's not a manual checklist someone forgets.

One addition to Murat's list: **color contrast enforcement.** Rather than picking specific colors in the architecture, add a rule: "All text/background color combinations must meet WCAG 2.1 AA contrast ratio (4.5:1 for normal text, 3:1 for large text). Verify with Tailwind's built-in contrast checking or browser DevTools." The actual colors are a UX/design decision, but the *rule* that they must pass contrast is architectural.

🏗️ **Winston**: Good convergence. Let me summarize the panel's recommendation:

**Add to architecture document NOW:**

| Item | What to Add | Where |
|---|---|---|
| Database schema | Full table specifications (5 tables: events, attendees, journey_events, feedback, sessions) with columns, types, constraints, relationships | New subsection under "Core Architectural Decisions" |
| Accessibility patterns | 8 enforcement rules + `@axe-core/playwright` in test stack | New subsection under "Implementation Patterns" |
| Lifecycle scheduling | One-line decision: scheduling mechanism | Add to Decision 1b or event lifecycle section |
| Express 5 compatibility note | Verification note for Passport.js and connect-pg-simple | Add to Decision 2a or as a footnote |

**Defer to developer stories:**
All 14 remaining gaps — these are implementation-level details that the architecture correctly delegates to the file structure and requirements mapping.

**Net result:** 4 additions to the architecture, roughly 40-50 lines of content. The document stays focused and the 14 deferred items become story acceptance criteria, not architectural decisions.

---

**Carlos:** I agree. Exit.

---

### Summary of Agent Review Findings

| Gap | Category | Resolution |
|---|---|---|
| Database schema definitions | Critical | **Address NOW** — Add full 5-table schema specification to architecture |
| Accessibility patterns (NFR30-37) | Critical | **Address NOW** — Add 8-rule enforcement section + `@axe-core/playwright` |
| Passport.js + Express 5 compatibility | Important | **Address NOW** — Add verification note with fallback path |
| Event lifecycle scheduling mechanism | Important | **Address NOW** — Specify `node-cron` or PM2 cron approach |
| Token refresh mechanism (NFR12) | Important | Defer to developer stories |
| LinkedIn API ToS compliance (NFR16) | Important | Defer to developer stories |
| Report export format (FR35) | Important | Defer to developer stories |
| Scanning disable mechanism (FR42) | Important | Defer to developer stories |
| Anonymization approach (FR45) | Important | Defer to developer stories |
| LinkedIn API circuit breaker (NFR38) | Important | Defer to developer stories |
| Deployment strategy (NFR28) | Important | Defer to developer stories |
| Spike handling config (NFR20) | Nice-to-have | Defer to developer stories |
| Analytics indexing (NFR22) | Nice-to-have | Defer to developer stories |
| Uptime monitoring (NFR23) | Nice-to-have | Defer to developer stories |
| Error rate monitoring (NFR29) | Nice-to-have | Defer to developer stories |
| Observability dashboard (NFR41) | Nice-to-have | Defer to developer stories |
| Design tokens / color palette | Nice-to-have | Defer to UX design phase |
| ESLint configuration | Nice-to-have | Defer to developer stories |

**4 gaps addressed in architecture, 14 deferred to developer stories.**
