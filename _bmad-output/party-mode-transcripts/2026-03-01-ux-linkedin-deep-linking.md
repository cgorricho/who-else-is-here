---
date: '2026-03-01'
topic: 'UX LinkedIn Deep Linking'
participants: [Winston (Architect), Amelia (Developer), Sally (UX Designer), John (PM)]
triggeredBy: 'UX Design workflow step-12 (UX Consistency Patterns) — Carlos observed that LinkedIn navigation on mobile will open the LinkedIn app, not the browser, and asked whether the architecture needs to handle this'
---

# Party Mode Transcript: UX LinkedIn Deep Linking

**Date:** 2026-03-01
**Participants:** 🏗️ Winston, 💻 Amelia, 🎨 Sally, 📋 John
**Context:** During Step 12 (UX Consistency Patterns), Carlos made a remark: "LinkedIn navigation will most likely be into the LI app in the phone. Only those who not have it will go to the browser. Is this something we need to worry about from the architecture POV, or we just let each phone handle the transition from our app into LI."

---

**Carlos:** small remark * LinkedIN navigation will most likely be into the LI app in the phone. Only those who not have it will go to the browser. Is this something we need to worry about from the architecture POV, or we just let each phone handle the transition from our app into LI invoke party mode

---

🏗️ **Winston**: Carlos, this is a great instinct to check, but the short answer is: **we don't need to worry about it. Let the OS handle it.**

Here's why. When your PWA renders `<a href="https://linkedin.com/in/john-doe">`, the **operating system** handles the URL dispatch, not your app. On both iOS and Android, LinkedIn has registered **Universal Links** (iOS) and **App Links** (Android) for the `linkedin.com` domain. The OS intercepts the navigation and routes it to the LinkedIn app if installed, or falls back to the browser if not.

**From our architecture's perspective, nothing changes.** We render a standard `<a>` tag with a standard `https://linkedin.com/in/...` URL. We don't need to:
- Detect whether the LinkedIn app is installed (we can't reliably do this from a PWA anyway — `navigator.canShare` and custom URL schemes are unreliable)
- Use LinkedIn's deep link scheme (`linkedin://`) — this is actually WORSE because it fails hard if the app isn't installed
- Add any conditional logic for app vs. browser routing

The `https://` URL is the **universal approach** that works in all cases. LinkedIn's own app registration with the OS handles the routing transparently.

**One architecture note worth documenting:** On mobile, when the LinkedIn app opens, the user returns to our PWA via the OS app switcher (swipe back or tap our app in recents) — not via browser back button. This is actually *better* than browser-based LinkedIn navigation because:
1. Our PWA stays in memory — scroll position is naturally preserved
2. No page reload on return — the WebSocket connection stays alive
3. The user's mental model is "switch between apps" which is a familiar phone pattern

The only scenario where this matters architecturally is **if we were trying to track "return from LinkedIn" as an analytics event** — we can't detect when a user comes back from the LinkedIn app the way we might detect a browser back-navigation. But that's not in our current requirements, and I'd argue it shouldn't be.

**Bottom line:** Standard `https://linkedin.com/in/...` links. Let iOS Universal Links and Android App Links do their job. Zero architecture changes needed.

💻 **Amelia**: Winston covered the architecture. Let me add the **implementation precision** the developer agent needs.

The `AttendeeCard` component already specifies `<a href={profileUrl}>` with `target="_self"` on mobile. That's correct and sufficient. When the OS intercepts the `https://linkedin.com/in/...` URL for the LinkedIn app, the `target` attribute is irrelevant — the OS takes over before the browser processes it.

One edge case worth noting for the spec: **`rel="noopener noreferrer"`**. We specified this for `target="_blank"` on desktop. On mobile with `target="_self"`, we don't need it — and we shouldn't add it, because `rel="noreferrer"` strips the `Referer` header, which could theoretically affect LinkedIn's deep link routing on some Android implementations. Keep it simple: mobile gets a bare `<a href={url}>`, desktop gets `<a href={url} target="_blank" rel="noopener noreferrer">`.

One more thing: **the `useMediaQuery` hook for target switching is still correct.** Even though the LinkedIn app opens on mobile regardless of `target`, the `_self` vs `_blank` distinction still matters for the fallback case (user doesn't have LinkedIn app installed). With `target="_self"` on mobile, LinkedIn opens in the same browser tab — user hits back to return. With `target="_blank"` on desktop, LinkedIn opens in a new tab — user switches tabs. Both are correct behaviors.

🎨 **Sally**: From a UX perspective, this is actually a **positive discovery**, not a problem. The LinkedIn app experience is *better* than the browser experience for our users:

1. **Alex is already logged into the LinkedIn app** — they see the full profile immediately, can connect with one tap, can message directly. In the browser, they might hit a login wall or see a limited profile.

2. **The app-switching mental model is intuitive on mobile** — swipe to our app, tap a name, LinkedIn app opens, swipe back. It's the same pattern as tapping a phone number to open the dialer or tapping an address to open Maps. Zero learning curve.

3. **Scroll position preservation is stronger** — as Winston noted, our PWA stays in memory. This is actually more reliable than the browser back-button approach we were originally designing for.

The only UX consideration: we should **not** add any "opening LinkedIn..." interstitial or loading state. The OS app switch is instant — adding our own transition would slow it down and feel wrong. The `<a>` tap should feel native: tap → LinkedIn app appears. No intermediate UI from us.

📋 **John**: Quick product lens. Carlos, your instinct to ask this question is exactly right — but the answer is the best kind of answer: **the platform handles it for free, and it's better than what we designed.**

The one thing I'd flag for the PRD is: our success metric "LinkedIn profile views per attendee" might need a footnote. If the LinkedIn app opens instead of the browser, we can't track whether the user actually viewed the profile (no `window.open` reference, no redirect callback). We're tracking the **tap** (client-side click event), not the **view**. The tap is our metric. The actual LinkedIn profile view happens in LinkedIn's domain — app or browser — and we have no visibility into it either way. This isn't a problem, just a clarification: our metric is "LinkedIn profile taps," not "LinkedIn profile views."

---

**Carlos:** thanks! Exit party mode

---

### Summary of Panel Contributions

| Agent | Contribution | Impact on UX Spec |
|---|---|---|
| 🏗️ Winston | Standard `https://` links work universally — iOS Universal Links and Android App Links handle routing to LinkedIn app. No architecture changes needed. PWA stays in memory during app switch, preserving scroll and WebSocket. | No architecture changes; documented that app-switch preserves state better than browser navigation |
| 💻 Amelia | `target="_self"` on mobile is correct; don't add `rel="noreferrer"` on mobile (could affect deep link routing); `useMediaQuery` hook still needed for desktop `target="_blank"` | Implementation note: bare `<a href>` on mobile, `target="_blank" rel="noopener noreferrer"` on desktop only |
| 🎨 Sally | LinkedIn app experience is better for users (already logged in, one-tap connect). No "opening LinkedIn..." interstitial — let the OS app switch feel native. | No interstitial UI for LinkedIn navigation; app-switch is a positive UX outcome |
| 📋 John | Success metric should be "LinkedIn profile taps" not "LinkedIn profile views" — we track the click event, not what happens in LinkedIn's domain | Metric clarification: taps (measurable) vs views (not measurable) |
