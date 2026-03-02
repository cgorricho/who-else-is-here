---
date: '2026-03-01'
topic: 'UX Responsive & Accessibility Review'
participants: [Winston (Architect), Amelia (Developer), Murat (Test Architect), Sally (UX Designer)]
triggeredBy: 'UX Design workflow step-13 (Responsive Design & Accessibility) — Carlos selected Party Mode to review responsive strategy, accessibility compliance, and testing approach'
---

# Party Mode Transcript: UX Responsive & Accessibility Review

**Date:** 2026-03-01
**Participants:** 🏗️ Winston, 💻 Amelia, 🧪 Murat, 🎨 Sally
**Context:** Carlos selected Party Mode during UX Design step 13 (Responsive Design & Accessibility) to get multi-agent review of the responsive strategy, accessibility compliance, and testing approach before committing.

---

**Carlos:** p

---

🏗️ **Winston**: The responsive strategy is clean and well-reasoned. Two observations:

**1. The `lg:` breakpoint as pointer proxy is pragmatically correct — but document the known exception.** Touch-enabled Chromebooks and Surface devices sit at ≥1024px with touch as the primary input. For Who Else Is Here, this is a non-issue at pilot: Karen isn't running events from a Surface tablet, and Alex isn't scanning QR codes from a Chromebook. But if this ever matters, the escape hatch is `@media (hover: hover) and (pointer: fine)` — Tailwind v4 supports this via `@custom-variant`. Don't implement it now, but acknowledge it exists so the developer agent doesn't try to "fix" the breakpoint approach later.

**2. The testing matrix is missing one critical device: low-end Android on slow WiFi.** You list "iPhone Safari" and "Android Chrome" as critical, but those are flagship assumptions. The PRD specifies the product must work on "3-year-old Android" with "sub-200ms transitions." That means testing on a device like a Samsung Galaxy A14 or Pixel 4a — not a Pixel 8 Pro. The service worker cache, the virtualized list performance, and the initial load time behave *very differently* on a device with 3GB RAM and a Snapdragon 680. I'd add a specific row: "Low-end Android Chrome (3GB RAM, slow 3G)" as a **critical** test target. This is the device that will be in the hands of career-transition attendees at a church networking event — Carlos's exact target market.

💻 **Amelia**: Three implementation precision items:

**1. `motion-safe:` modifier.** You specify wrapping animations in `motion-safe:`. Correct Tailwind v4 syntax. But the developer agent needs to know: `motion-safe:` is the DEFAULT behavior modifier, meaning the animation runs only when the user has NOT set `prefers-reduced-motion: reduce`. The alternative is `motion-reduce:` for explicitly providing reduced-motion alternatives. The pattern should be:

```html
<!-- Default: no animation -->
<!-- motion-safe: adds animation for users who haven't opted out -->
<div class="opacity-0 motion-safe:animate-fade-in">
```

Not:
```html
<!-- WRONG: animation by default, then override -->
<div class="animate-fade-in motion-reduce:animate-none">
```

The first pattern is progressive enhancement — start with no animation, add it for capable/willing users. The second is graceful degradation. Both work, but progressive enhancement is the correct accessibility pattern. Specify which one the developer agent should use.

**2. `aria-live` region for new attendees.** You spec a visually-hidden `aria-live="polite"` region that announces "[Name] has joined." Implementation detail: this element needs to exist in the DOM *before* the announcement text is inserted. If you dynamically create the element AND set its text simultaneously, some screen readers miss the announcement. The pattern:

```html
<!-- Always in DOM, always visually hidden -->
<div aria-live="polite" class="sr-only" id="attendee-announcements"></div>
```

Then on new attendee: update `textContent` of that element. Clear it after 5 seconds so the next announcement is a fresh insertion.

**3. Skip link.** You mention "Skip to main content" for admin panel. The attendee view also needs one — even though it's a single screen, the sticky header with two lines of content sits between the skip link and the list. Screen reader users shouldn't have to tab through the header on every page load. Skip link target: `#attendee-list`.

🧪 **Murat**: The testing strategy is solid but I want to sharpen the **accessibility testing integration with CI**.

**Automated accessibility gates that should block PRs:**

| Gate | Tool | Threshold | Blocks PR? |
|---|---|---|---|
| axe-core violations | `@axe-core/playwright` | 0 violations (impact: critical, serious) | Yes |
| axe-core warnings | `@axe-core/playwright` | 0 violations (impact: moderate) | Yes |
| Lighthouse accessibility | Lighthouse CI | Score ≥ 95 | Yes |
| Color contrast | axe-core rule `color-contrast` | 0 failures | Yes (subset of above) |
| Missing alt text | axe-core rule `image-alt` | 0 failures | Yes (subset of above) |

**What should NOT block PRs (manual testing only):**

| Test | Why Manual |
|---|---|
| VoiceOver/TalkBack journey | Can't automate native screen readers in CI |
| Keyboard-only full journey | Partially automatable via Playwright, but nuanced |
| Cognitive load assessment | Subjective, requires human judgment |

**One critical addition:** You should have a **Playwright accessibility test suite** that runs the full attendee journey (QR landing → OAuth mock → list render → card focus → card activation) with axe-core assertions at each step. This catches regressions that page-level scans miss — like focus management after OAuth redirect, or `aria-live` updates after WebSocket push. I'd estimate 5-7 test cases, all running in under 30 seconds.

**Risk assessment on your testing matrix:** You list VoiceOver and TalkBack testing as "Pre-pilot." I'd push VoiceOver testing earlier — into the first sprint that builds `AttendeeCard` and `AttendeeList`. If the semantic HTML structure is wrong at the card level, it cascades into every screen reader interaction. Fix it early when it's one component, not late when it's integrated.

🎨 **Sally**: The responsive spec is comprehensive and I'm glad it builds on the foundations from Steps 8 and 9 rather than repeating them. Two additions:

**1. The "320px minimum width" test is critical and under-specified.** iPhone SE (1st gen) and small Android devices render at 320px CSS width. At 320px, the attendee card layout gets tight: `[40px photo] [12px gap] [name/title area] [20px chevron]` — that leaves only 248px for the name and title. Long names like "Alejandro Fernández-González" will truncate aggressively. This is fine — `truncate` handles it — but the developer agent should test specifically with names of 25+ characters at 320px to verify the layout doesn't break.

**2. Missing responsive behavior: the `OAuthLoadingScreen`.** Every responsive table covers `SessionHeader`, `AttendeeCard`, `AttendeeList`, admin panels — but the OAuth loading screen is the FIRST thing Alex sees after granting LinkedIn access. On mobile, it should be vertically centered with generous padding. On desktop, it should be a centered card (`max-w-md mx-auto`) with the same visual treatment as the cold-start message. Specify this so the developer agent doesn't build a full-width loading screen on a 1440px monitor.

---

**Carlos:** I don't have anything else to add. Exit Party Mode

---

### Summary of Panel Contributions

| Agent | Contribution | Impact on UX Spec |
|---|---|---|
| 🏗️ Winston | Document `lg:` breakpoint exception for touch laptops (don't implement, just acknowledge); add low-end Android (3GB RAM, slow 3G) as critical test target | Added future escape hatch note; added low-end Android to testing matrix |
| 💻 Amelia | `motion-safe:` progressive enhancement pattern (not graceful degradation); `aria-live` element must pre-exist in DOM; attendee view also needs skip link to `#attendee-list` | Specified progressive enhancement animation pattern; added `aria-live` implementation detail; added skip link for attendee view |
| 🧪 Murat | Sharpen CI accessibility gates (axe-core 0 violations, Lighthouse ≥95); add Playwright accessibility journey test suite (5-7 tests); move VoiceOver testing to first sprint, not pre-pilot | Added CI gate table; specified journey-level accessibility tests; moved screen reader testing earlier |
| 🎨 Sally | Test with 25+ character names at 320px width; add `OAuthLoadingScreen` responsive spec (vertically centered mobile, `max-w-md` card on desktop) | Added 320px name truncation test case; added OAuthLoadingScreen responsive behavior |
