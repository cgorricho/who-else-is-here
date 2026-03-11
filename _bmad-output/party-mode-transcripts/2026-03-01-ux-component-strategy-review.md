---
date: '2026-03-01'
topic: 'UX Component Strategy Review'
participants: [Sally (UX Designer), Amelia (Developer), Winston (Architect), John (PM), Murat (Test Architect)]
triggeredBy: 'UX Design workflow step-11 (Component Strategy) — Carlos selected Party Mode to review Sally''s component specifications before committing'
---

# Party Mode Transcript: UX Component Strategy Review

**Date:** 2026-03-01
**Participants:** 🎨 Sally, 💻 Amelia, 🏗️ Winston, 📋 John, 🧪 Murat
**Context:** Carlos selected Party Mode during UX Design step 11 (Component Strategy) to review Sally's 11-component specification including props, states, Tailwind specs, and implementation roadmap.

---

**Carlos:** P

---

💻 **Amelia**: Sally, the component specs are detailed — props, Tailwind classes, accessibility. Good work. But I have three implementation concerns:

**1. AttendeeCard `target` switching.** You specify `target="_self"` on mobile, `target="_blank"` on desktop. The developer agent needs to know HOW to detect this. You can't use CSS media queries for an HTML attribute. The options are: (a) check `window.innerWidth` at render time and set the attribute, (b) use a `useMediaQuery` hook that tracks the `lg` breakpoint, or (c) use a touch detection heuristic (`'ontouchstart' in window`). Option (b) is cleanest — matches Tailwind's breakpoint system. But the spec should state this explicitly so the agent doesn't guess.

**2. Missing component: `AttendeeList`.** You specified `AttendeeCard` but not the list container itself. The architecture says the attendee list is **virtualized**. That means there's an `AttendeeList` component that wraps a virtualization library (like `@tanstack/react-virtual` or `react-window`). This component handles: scroll position preservation, viewport-aware fade-in animations, alphabetical sorting, and the integration point for `SearchFilter`. Without this component specified, the developer agent will build a naive `{attendees.map(a => <AttendeeCard />)}` — which works at 40 attendees but degrades at 200+.

**3. Photo fallback.** `AttendeeCard` takes `photoUrl` as required. But what if LinkedIn returns no photo? Some profiles don't have one. The component needs a fallback: a `bg-primary-100 text-primary-600` circle with the person's initials (first letter of first name + first letter of last name). This is a common pattern the developer agent needs specified.

🏗️ **Winston**: Two architecture-level observations:

**First: the `SearchFilter` component is more complex than it looks.** Sally specified "filters list in real-time as user types." But the attendee list is virtualized and receives data via WebSocket. The filter needs to work on the CLIENT-SIDE data — filtering the local attendee array, not making an API call. This means the `AttendeeList` component (which Amelia correctly identified as missing) needs to accept a `filterText` prop and filter its data source before passing to the virtualizer. The `SearchFilter` component is stateful (tracks input text) and passes its value UP to the list container. This is a state management pattern the developer agent needs to understand — it's not just a styled input.

**Second: `OAuthLoadingScreen` needs the session context before OAuth completes.** Your spec shows the session name and event name on the loading screen. But during OAuth callback, the client might not have this data yet — the user was redirected to LinkedIn and back. Where does the session/event name come from? Two options: (a) pass it as URL query parameters through the OAuth flow, or (b) store it in `sessionStorage` before redirecting to LinkedIn. The developer agent needs to know which approach to use. I'd recommend (b) — store `{sessionName, eventName}` in `sessionStorage` before the OAuth redirect, read it back on the callback page.

📋 **John**: Product observation: the **Implementation Roadmap** has `ReportExport` in Phase 3 (Post-Pilot Enhancement). I'd push back on that. Karen's post-event report is her "screenshot moment" — the artifact she forwards to prove her event creates value. If the first pilot doesn't produce a clean report, Karen's "aha moment" doesn't happen. The report doesn't need to be PDF — even a well-formatted HTML page that screenshots cleanly is enough for MVP. But it needs to exist at pilot time.

I'd move `ReportExport` from Phase 3 to Phase 2, and rename it to `SessionReport` — a dedicated page/route that displays the session's metrics in a screenshot-ready format. PDF export can be Phase 3. The screenshot-ready view is Phase 2.

🧪 **Murat**: Testing perspective on the component list. Every component Sally specified needs at least one test. But the priorities are different:

**Must have unit tests before pilot:**
- `AttendeeCard` — renders correctly, links to correct LinkedIn URL, handles missing photo
- `ColdStartMessage` — renders correct tier message at each threshold boundary (0, 1, 4, 5, 14, 15, 19, 20)
- `SearchFilter` — filters by name, title, and company; handles empty results; clears properly

**Integration tests:**
- `AttendeeList` (the missing component) — virtualization renders correct items, scroll position preserved after navigation, new attendee animation triggers only in viewport

**E2E tests (Playwright):**
- Full journey: QR scan → OAuth → list render → card tap → LinkedIn opens
- Cold-start: verify messaging appears at ≤4 attendees and disappears at 20

The component spec should note which components have test-critical behavior so the developer agent writes tests alongside implementation.

🎨 **Sally**: All excellent catches. Let me address each:

**Amelia — target switching:** Accepted. I'll specify `useMediaQuery` hook tracking the `lg` (1024px) breakpoint. Below `lg`: `target="_self"`. At or above `lg`: `target="_blank" rel="noopener noreferrer"`.

**Amelia — AttendeeList container:** You're right — this is a missing component. I'll add `AttendeeList` as a wrapper that handles virtualization (`@tanstack/react-virtual`), alphabetical sorting, filter integration, scroll position preservation, and viewport-aware new-arrival animations. This is the orchestrator component for the entire attendee view.

**Amelia — photo fallback:** Accepted. I'll add an `AvatarFallback` pattern: `bg-primary-100 text-primary-600 font-semibold` circle with initials when `photoUrl` is null or fails to load.

**Winston — SearchFilter state flow:** I'll clarify: `SearchFilter` owns `filterText` state, passes it up via `onFilterChange` callback. `AttendeeList` receives `filterText` as prop, filters its data array before virtualizing. No API calls — pure client-side filtering.

**Winston — OAuthLoadingScreen session context:** `sessionStorage` approach accepted. Before OAuth redirect, store `{sessionName, eventName}` in `sessionStorage`. The loading screen reads from `sessionStorage` on mount.

**John — ReportExport → SessionReport in Phase 2:** Completely right. Karen's "screenshot moment" is pilot-critical. I'll add `SessionReport` as a Phase 2 component — a dedicated route that renders session metrics in a screenshot-ready layout. PDF export stays Phase 3.

**Murat — test-critical components:** I'll add a "Test Priority" column to the component table noting which components have test-critical behavior.

---

**Carlos:** Thanks agents! Exit.

---

### Summary of Panel Contributions

| Agent | Contribution | Impact on UX Spec |
|---|---|---|
| 💻 Amelia | `target` switching needs `useMediaQuery` hook; missing `AttendeeList` virtualized container; photo fallback needed for missing LinkedIn photos | Added `useMediaQuery` spec; added `AttendeeList` component; added initials avatar fallback |
| 🏗️ Winston | `SearchFilter` is client-side filtering with prop-up pattern; `OAuthLoadingScreen` needs `sessionStorage` for session context through OAuth redirect | Clarified filter state flow; specified `sessionStorage` approach for OAuth context |
| 📋 John | `ReportExport` in Phase 3 is too late — Karen's screenshot moment is pilot-critical | Moved to Phase 2 as `SessionReport` (HTML screenshot-ready); PDF export stays Phase 3 |
| 🧪 Murat | Test priorities: unit tests for card/cold-start/search; integration for virtualized list; E2E for full journey + cold-start | Added test priority annotations to component specifications |
| 🎨 Sally | Accepted all 7 enhancements with specific implementation details | All changes integrated into Step 11 content |
