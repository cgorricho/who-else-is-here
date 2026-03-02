---
date: '2026-03-01'
topic: 'UX Defining Experience Review'
participants: [Sally (UX Designer), John (PM), Winston (Architect), Amelia (Developer), Mary (Business Analyst)]
triggeredBy: 'UX Design workflow step-07 (Defining Experience) — Carlos selected Party Mode to review Sally''s defining experience specification before committing'
---

# Party Mode Transcript: UX Defining Experience Review

**Date:** 2026-03-01
**Participants:** 🎨 Sally, 📋 John, 🏗️ Winston, 💻 Amelia, 📊 Mary
**Context:** Carlos selected Party Mode during UX Design step 7 (Defining Experience) to get multi-agent perspectives on Sally's core interaction mechanics, mental models, and "zero novel patterns" positioning.

---

**Carlos:** P

---

📋 **John**: Sally, strong work. The "Tap a name → land on their LinkedIn" framing is crisp. But I want to push on one thing you listed under Success Criteria: **"3-5 seconds per card decision."** That's the metric for a warm list — where Alex knows some names. At a cold event (career transition meetup, church networking), Alex doesn't know anyone. The card decision isn't "do I know them?" but "should I know them?" That decision relies entirely on title + company. If the title is truncated on mobile because it's too long ("Senior Vice President of Business Development and Strategic Partnerships"), Alex can't make a 3-5 second decision. The card design needs to handle long titles gracefully — truncation with ellipsis, or a second line that still fits within the 44px+ row height. This is a design constraint hiding inside a success metric.

Also — you list "Scroll position preserved on back-navigation" as a success criterion, and that's critical. But I want to elevate it: this isn't just a criterion, it's **the highest-risk UX failure mode**. If Alex taps a name, LinkedIn opens, and the back button reloads the list at the top — the entire browse-tap-return loop breaks. The user loses their place in a list of 200 people. This needs to be called out as a **critical implementation requirement**, not just a row in a table.

📊 **Mary**: I want to build on the "zero novel patterns" claim because I think it's actually your strongest competitive positioning statement — but it needs sharpening.

Here's the market insight: **every competitor in the event networking space introduced novel patterns.** Bizzabo has "smart matchmaking" algorithms. Grip has "AI-powered recommendations." Swapcard has "interest-based networking." These are all novel patterns that require learning, configuration, and trust-building. They're also all features that don't work well at small events (40-200 people) because the recommendation engines need scale.

Your "zero novel patterns" isn't just a design choice — it's a **market positioning weapon.** You're saying: "While competitors invest in novel recommendation algorithms that require scale to function, we give you a contact list that works perfectly at any event size." The UX section should connect this to the competitive landscape more explicitly. The "Novel UX Patterns" subsection currently reads as a design observation. It should read as a strategic advantage.

🏗️ **Winston**: Two technical concerns with the Experience Mechanics.

**First: the OAuth flow timing.** Your table shows "OAuth callback → Loading spinner during token exchange → 1-2s." That's optimistic. The reality: LinkedIn OAuth callback hits your server → server exchanges auth code for access token (network call to LinkedIn API) → server fetches user profile (second network call) → server creates/updates database record → server creates session → redirect to client → client renders. That's 3-5 calls in sequence. On a good day, 2-3 seconds. On event venue WiFi with 200 people competing for bandwidth? Could be 5-8 seconds. The UX needs to plan for this: what does the user see during a slow OAuth exchange? A branded loading screen with the event name? A "Setting things up..." message? This is a micro-moment that matters — it's the last thing before the "aha" of seeing the list.

**Second: "Back = browser back."** Your mechanics assume `browser back` returns Alex to the app from LinkedIn. This is correct on mobile — LinkedIn opens in the same browser tab, back button works. But on desktop (post-event), the architecture specifies opening LinkedIn in a new tab. On desktop, there IS no "back" — Alex switches tabs. The Experience Mechanics should note this platform difference: mobile = back button, desktop = tab switch.

💻 **Amelia**: Implementation precision check. Sally, your mechanics are clear, but I want to flag two things an AI developer agent would need clarified:

**1. "Opacity fade 0→1 over 300ms" for new attendees** — Where in the list does the new attendee appear? Alphabetically? That means if "Aaron" joins while Alex is looking at names starting with "M," Aaron's insertion shifts the list but Alex doesn't see it. If "Zachary" joins, same — appended at the bottom, invisible. The fade animation only matters if the new attendee is inserted into the *visible viewport*. For a virtualized list, the developer agent needs to know: animate only when the new item is within the current scroll viewport? Or always animate regardless of visibility? I'd recommend: animate only if visible, silently insert if off-screen. Less visual noise.

**2. "Search icon appears when list exceeds ~15 attendees."** The tilde (~) is the enemy of AI developer agents. What's the threshold? 15? 20? Pick a number. I'd recommend **20** — it matches the PRD's cold-start threshold boundary and gives enough density for search to be useful. Below 20, scanning is always faster than typing.

🎨 **Sally**: All excellent. Let me respond:

**John — long titles and scroll preservation.** Both accepted. I'll add a design constraint for title handling: single line with ellipsis truncation on mobile, up to two lines on desktop (`md:` breakpoint). And I'll elevate scroll position preservation from a success criterion row to a **Critical Implementation Requirement** callout. You're right — this is the highest-risk failure mode in the core loop.

**Mary — zero novel patterns as positioning.** Great reframing. I'll add a sentence connecting this to the competitive landscape: "While competitors invest in novel recommendation algorithms that require scale to function, Who Else Is Here uses universally familiar patterns that work perfectly at any event size."

**Winston — OAuth timing and desktop back navigation.** Both valid. I'll add an OAuth loading state specification: branded loading screen with event name + "Connecting your profile..." message. And I'll split the back-navigation mechanic into mobile (browser back) and desktop (tab switch), noting that desktop opens LinkedIn in a new tab via `target="_blank"`.

**Amelia — animation viewport and search threshold.** Both accepted with your specific recommendations. New attendee fade animation triggers only when the inserted position is within the visible viewport. Search threshold is **20 attendees** (hard number, no tilde). Below 20, no search icon.

---

**Carlos:** E

---

### Summary of Panel Contributions

| Agent | Contribution | Impact on UX Spec |
|---|---|---|
| 📋 John | Long titles need graceful handling; scroll preservation is highest-risk failure mode | Added title truncation constraint; elevated scroll preservation to Critical Implementation Requirement |
| 📊 Mary | "Zero novel patterns" is a competitive positioning weapon, not just a design observation | Connected to competitive landscape — familiar patterns that work at any event size |
| 🏗️ Winston | OAuth flow timing is 2-8s not 1-2s; desktop opens LinkedIn in new tab (no "back") | Added OAuth loading state spec; split back-navigation into mobile/desktop mechanics |
| 💻 Amelia | Fade animation should only trigger in visible viewport; search threshold needs a hard number | Viewport-only animation; search threshold = 20 attendees (no tilde) |
| 🎨 Sally | Accepted all 5 enhancements with specific implementation details | All changes integrated into Step 7 content |
