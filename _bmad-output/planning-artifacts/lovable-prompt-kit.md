# Lovable Prompt Kit — Who Else Is Here

**Created:** 2026-03-08
**Purpose:** Copy-paste-ready prompts for generating front-end mockups in Lovable
**Execution order:** Prompt 0 first (knowledge transfer), then Prompts 1-7 sequentially within the same Lovable project

---

## Prompt 0 — Knowledge Transfer (Context Only)

**Target:** No screen — establish product context and design system
**Expected result:** Lovable acknowledges understanding (or generates a starter UI — either is fine)
**Validation:** If UI is generated, verify indigo primary color (#4F46E5), Inter font, gray-100 page background

```
You are building a front-end mockup for "Who Else Is Here" — a real-time,
event-scoped attendee directory that bridges professional events to LinkedIn.

I will be providing multiple prompts progressively to build out screens.
Each prompt will describe a new page or a modification to an existing one.
Maintain design consistency across all screens using the design system
established here. This is Prompt 0 — the knowledge foundation.

## What This Product Does

Attendees at a professional event scan a QR code, authenticate via LinkedIn
OAuth, and instantly see every other attendee: name, title, company, and
photo. One tap lands directly on that person's LinkedIn profile. No app
download. No registration. QR code to attendee list in under 30 seconds.

The product name IS the user's core question: "Who else is here?"

## Two User Types

**Alex (Attendee):** Mobile-first. Standing at an event, one-handed, being
bumped. The app must be glanceable — scan a name, make a decision, tap to
LinkedIn. The core loop: scroll → identify → tap → LinkedIn → back → repeat.
Each cycle takes 3-5 seconds.

**Karen (Organizer):** Desktop-primary. Never uses the attendee screen. Her
interface is the admin panel: session monitoring, analytics, reports. She
forwards reports to sponsors and leadership. The post-event report is her
"screenshot moment."

## Design Philosophy

Radical simplicity. The attendee view is ONE screen with a list — no tabs,
no navigation, no hamburger menu, no settings. Think Apple Contacts meets
LinkedIn, scoped to a single event session. The app is categorically
different from enterprise event tech (Bizzabo, Swapcard, Whova) — it looks
like nothing else in the market. A high-end restaurant with a 5-item menu,
not a food truck.

No onboarding tours. No notification badges. No engagement loops. The app
pushes users OUT to LinkedIn — it doesn't try to keep them in.

## Design System — Tailwind CSS

**Primary Color (Indigo):**
- primary-50: #EEF2FF (subtle backgrounds, cold-start banner)
- primary-100: #E0E7FF (light accents, initials avatar bg)
- primary-600: #4F46E5 (primary actions, links, buttons)
- primary-700: #4338CA (hover/pressed states)

**Neutrals:**
- gray-900: #111827 (attendee names, headings — maximum contrast)
- gray-700: #374151 (header text)
- gray-600: #4B5563 (title + company secondary text)
- gray-400: #9CA3AF (timestamps, chevrons, placeholders)
- gray-200: #E5E7EB (borders, dividers)
- gray-100: #F3F4F6 (page background)
- gray-50: #F9FAFB (card backgrounds, input fields)

**Semantic Colors:**
- success-500: #22C55E (live/online indicators)
- warning-500: #F59E0B (offline indicator)
- error-500: #EF4444 (error states)

**Typography:**
- Font: Inter (Google Fonts, variable weight)
- Display: 36px / 800 weight (Karen's headline metrics like "38")
- h1: 24px / 700 weight (event names, admin page titles)
- h2: 20px / 600 weight (section headers)
- h3: 16px / 600 weight (attendee name on card)
- body: 14px / 400 weight (title + company, body text)
- caption: 12px / 400 weight (timestamps "joined 5 min ago")
- label: 12px / 500 weight (form labels, metric labels)

**Spacing:** 4px grid. All spacing in multiples of 4px.

**Border Radius:**
- rounded-full (profile photos — circular)
- rounded-lg / 8px (cards, buttons)
- rounded-md / 6px (inputs, badges)

**Shadows:**
- shadow-sm: header bar (sticky)
- shadow-md: admin metric cards
- No shadows on attendee cards — content-forward, minimal chrome

**Transitions:**
- 150ms ease-in-out (button hover/press)
- 300ms ease-in-out (new attendee fade-in)

## Event → Session Hierarchy

Events contain sessions. A single event (e.g., "RUMC Job Networking") can
have up to 7 concurrent sessions in different rooms. Each session gets its
own QR code and its own attendee list. The session is the primary context —
the header shows session name, not event name (on mobile).

## Sample Attendee Data (use across all screens)

Use these realistic attendees for all mockup screens:

1. Sarah Chen — VP Engineering, Google (photo placeholder: SC)
2. Marcus Rivera — Dir. Product, Stripe (photo placeholder: MR)
3. Priya Sharma — CTO, Acme Corp (photo placeholder: PS)
4. David Kim — Sr. Manager BD, Salesforce (photo placeholder: DK)
5. Jennifer Walsh — Head of Talent, HubSpot (photo placeholder: JW)
6. Carlos Mendoza — Founder, NexGen AI (photo placeholder: CM)
7. Aisha Okafor — VP Partnerships, Microsoft (photo placeholder: AO)
8. Robert Tanaka — Principal Engineer, Netflix (photo placeholder: RT)
9. Lisa Park — Chief of Staff, Coinbase (photo placeholder: LP)
10. James Morrison — SVP Sales, Oracle (photo placeholder: JM)

For photo placeholders, use colored circles with initials in primary-100
background with primary-600 text.

## Sample Event/Session Data

- Event: "RUMC Job Networking"
- Session: "Career Quest Workshop" — Room 101 — 1:00 PM – 3:00 PM
- 38 professionals currently in session

## App Structure (Routes)

Build as a single-page app with these routes:
- / → Attendee list (mobile-first, the core product)
- /oauth → Pre-OAuth screen ("Sign in with LinkedIn")
- /loading → OAuth loading screen ("Connecting your profile...")
- /admin → Admin session detail (Karen's metrics dashboard)
- /admin/sessions → Admin session list (concurrent sessions overview)

## Key Constraints

- Mobile-first responsive design (default = mobile, md: = tablet, lg: = desktop)
- All touch targets minimum 44px height
- Attendee cards minimum 72px height
- WCAG 2.1 AA compliance (4.5:1 contrast ratios)
- No hamburger menus, no tabs on attendee side
- Cards have NO borders or shadows — separated by 8px gap
- The entire attendee card is a clickable/tappable link
- Subtle right chevron (›) in gray-400 on each card signals tappability

Please confirm you understand this design system and product context.
I will then provide Prompt 1 to build the first screen.
```

---

## Prompt 1 — Attendee List (The Core Product)

**Target:** Main attendee list page at route `/`
**Expected result:** Mobile-first attendee list with 10 cards, sticky session header, live counter, search icon, cold-start banner, responsive desktop layout
**Validation checklist:**
1. Indigo initials circles (not blue, not purple — #E0E7FF bg, #4F46E5 text)
2. Cards have NO borders or shadows — just 8px gap between them
3. Header is sticky (content scrolls under it)
4. Subtle chevron (›) visible on each card in gray-400

```
Build the main attendee list page at route "/". This is the core product —
the ENTIRE attendee-facing experience is this single screen.

## Page Layout (Mobile-First)

Background: gray-100 (#F3F4F6). Full viewport height.

### Sticky Header

Sticky at top, white background, shadow-sm, px-4 py-3.

Line 1 (flex, justify-between, items-baseline):
- Left: Session name "Career Quest Workshop" — 16px, font-semibold, gray-900
- Right: Time range "1–3 PM" — 14px, gray-600

Line 2 (flex, justify-between, items-center):
- Left: "38 professionals here" — 14px, gray-600
- Right: Search icon (magnifying glass) — 20px, gray-400

### Attendee List

Below the header, a scrollable list of attendee cards. No card borders,
no card shadows. Cards separated by 8px vertical gap. Page has no
horizontal padding — cards run edge-to-edge with their own internal padding.

### Attendee Card (repeat for all 10 sample attendees)

Each card is a single clickable/tappable row. White background.
Minimum height 72px. Internal padding: px-4 py-3.

Layout: flex, items-center, gap-3 (12px).

From left to right:
1. **Photo circle:** 40px × 40px, rounded-full. Use colored circle with
   initials (bg: primary-100 #E0E7FF, text: primary-600 #4F46E5,
   font-semibold, 14px). Two-letter initials centered.
2. **Text stack** (flex-1, min-width-0 to enable truncation):
   - Name: 16px, font-semibold, gray-900 (#111827)
   - Title · Company: 14px, normal weight, gray-600 (#4B5563), single line
     with ellipsis truncation if too long. Format: "VP Engineering · Google"
   - Timestamp (conditional): 12px, gray-400 (#9CA3AF). Show "joined X min
     ago" only for the first 3 attendees (simulating recent arrivals).
     Others have no timestamp.
3. **Chevron:** Right-aligned, flex-shrink-0. A subtle "›" character or
   small right arrow icon, gray-400, 16px.

Cards should have hover state on desktop: bg-gray-50.
Active/pressed state: bg-gray-100.

Sort attendees alphabetically by first name.

### Cold-Start Message

Below the last attendee card, show an encouragement banner:
- Background: primary-50 (#EEF2FF)
- Text color: primary-700 (#4338CA) — NOT primary-600 for better readability
  on the light background
- Border radius: rounded-lg (8px)
- Padding: p-4
- Margin: mx-4 mt-4
- Font size: 14px
- Text: "You're among the first! The list is growing live. New connections
  appear automatically."

NOTE: In the real app this banner only shows when there are fewer than 20
attendees. For this mockup, show it to demonstrate the design. We will
create a separate cold-start variant in a later prompt.

## Desktop Responsive (lg: breakpoint, 1024px+)

At desktop widths:
- Constrain the list to max-width 640px, centered horizontally
- Header line 2 adds event name: "RUMC Job Networking · 38 professionals
  here"
- Header line 1 shows full time: "Career Quest Workshop · 1:00 PM – 3:00 PM"
- Title + Company on cards: allow up to 2 lines (line-clamp-2) instead of
  single-line truncation
- Cards get hover:bg-gray-50 state

## What NOT to Include

- No navigation bar, no sidebar, no hamburger menu, no tabs
- No bottom bar or footer
- No notification bells or badges
- No "pull to refresh" indicator
- No app logo in the header (the session name IS the header)
- No borders or shadows on attendee cards
```

---

## Prompt 2 — Cold-Start Variant (4 Attendees)

**Target:** Variant of attendee list showing early-arrival cold-start experience
**Expected result:** Same page layout but only 4 attendees, all with timestamps, no search icon, encouragement banner prominent
**Validation checklist:**
1. Only 4 attendee cards visible
2. No search icon in header (search appears at 20+)
3. Counter reads "4 professionals here"
4. Cold-start banner below the cards with encouraging tone

```
Create a variant of the attendee list at route "/" that shows the cold-start
experience — what a user sees when they're among the first to scan.

Modify the existing attendee list page to show this state:

### Header Changes
- Counter reads: "4 professionals here"
- NO search icon (search only appears at 20+ attendees)

### Attendee List
Show only 4 attendees from the sample data:
1. Carlos Mendoza — Founder · NexGen AI (joined 3 min ago)
2. David Kim — Sr. Manager BD · Salesforce (joined 2 min ago)
3. Jennifer Walsh — Head of Talent · HubSpot (joined 1 min ago)
4. Sarah Chen — VP Engineering · Google (joined just now)

All 4 show timestamps since they all arrived recently.

### Cold-Start Message
Below the 4 cards, show the encouragement banner:
- Background: primary-50 (#EEF2FF)
- Text: primary-700 (#4338CA)
- Rounded-lg, p-4, mx-4 mt-4, text 14px
- Message: "You're among the first! The list is growing live. New
  connections appear automatically."

The banner should feel encouraging, not apologetic. The empty space
below the banner is intentional — it signals "more names will fill
this space."

### Everything Else
Same sticky header, same card design, same page background. Only the
count, number of cards, timestamps, and banner presence change.
```

---

## Prompt 3 — Pre-OAuth Screen

**Target:** Pre-OAuth screen at route `/oauth`
**Expected result:** Clean centered screen with session context, value proposition, LinkedIn sign-in button, trust signals
**Validation checklist:**
1. Button is indigo primary-600 (#4F46E5), not LinkedIn blue
2. Session name "Career Quest Workshop" visible above the button
3. Trust message visible below the button ("No messages. No connections...")
4. Centered vertically and horizontally, white background

```
Build the pre-OAuth screen at route "/oauth". This is what Alex sees
after scanning the QR code, before LinkedIn authentication.

## Layout

Full-screen centered layout. White background. Content vertically and
horizontally centered (min-h-screen, flex, items-center, justify-center).
Max-width: 400px. Padding: px-6.

## Content (top to bottom, centered)

1. **App name:** "Who Else Is Here?" — 24px, font-bold, gray-900.
   Centered. This is the product name displayed as a question.

2. **Session context** (below app name, 8px gap):
   - "Career Quest Workshop" — 16px, font-semibold, gray-900
   - "RUMC Job Networking" — 14px, gray-600
   - 24px gap below

3. **Value proposition message** (centered text block):
   - "Sign in with LinkedIn so others can find you too" — 16px, gray-700
   - 8px gap
   - "We only access your name, photo, title, and company. Nothing else."
     — 14px, gray-500
   - 32px gap below

4. **LinkedIn sign-in button** (the ONE button in the attendee experience):
   - Full width within the content container
   - Background: primary-600 (#4F46E5)
   - Hover: primary-700 (#4338CA)
   - Text: white, font-semibold, 16px
   - Padding: py-3 px-6
   - Border radius: rounded-lg (8px)
   - Text: "Continue with LinkedIn"
   - Include a LinkedIn logo icon (white) left of the text, 8px gap
   - Min height: 48px (touch target)

5. **Trust footer** (below button, 24px gap):
   - "No messages. No connections. Just your professional profile."
     — 12px, gray-400, centered

## What NOT to Include
- No "sign up" or "create account" option
- No other auth providers (Google, email, etc.)
- No terms of service links for this mockup
- No back button or navigation
```

---

## Prompt 4 — OAuth Loading Screen

**Target:** OAuth loading screen at route `/loading`
**Expected result:** Branded loading screen with session name, "Connecting your profile..." message, subtle loading animation
**Validation checklist:**
1. Session name "Career Quest Workshop" and event name "RUMC Job Networking" visible
2. "Connecting your profile..." in gray-400
3. Loading dots or spinner in indigo primary-600
4. Centered, white background, calm feel — not generic

```
Build the OAuth loading screen at route "/loading". This is the branded
transition screen shown for 2-8 seconds while the server processes
LinkedIn authentication.

## Layout

Full-screen centered. White background. Content vertically and horizontally
centered (min-h-screen, flex, items-center, justify-center, flex-col).

## Content (top to bottom, centered, 16px gaps)

1. **App name:** "Who Else Is Here?" — 24px, font-bold, gray-900

2. **Session context** (16px gap below app name):
   - "Career Quest Workshop" — 16px, font-semibold, gray-900
   - "at RUMC Job Networking" — 14px, gray-600

3. **Loading message** (24px gap below session context):
   - "Connecting your profile..." — 14px, gray-400

4. **Loading indicator** (12px gap below message):
   - Three dots animation: three small circles (8px diameter) in a row
     with 6px gaps. Colors: primary-600, primary-400, primary-200.
     Subtle sequential opacity pulse animation.
   - If animation is complex, a simple centered spinner in primary-600
     is acceptable.

## Feeling

This screen should feel calm and branded — not generic. The user just
gave LinkedIn permission and is waiting. The session name confirms
they're in the right place. The loading is purposeful, not uncertain.

## What NOT to Include
- No progress bar (we don't know the actual duration)
- No cancel button
- No navigation
- No error state (that's a different screen)
```

---

## Prompt 5 — Admin Session Detail (Karen's Metrics Dashboard)

**Target:** Admin session detail page at route `/admin`
**Expected result:** Professional dashboard with 3 headline metric cards, activity timeline bar chart, action buttons. Screenshot-ready for Karen.
**Validation checklist:**
1. Three metric cards with large numbers (36px extrabold): 38, 127, 69%
2. 69% activation rate in primary-600 (indigo), not gray
3. Activity timeline with simple bar chart, peak annotation
4. "Export Report" button in primary-600, "Download QR Code" in secondary style

```
Build the admin session detail page at route "/admin". This is Karen's
view — the organizer dashboard for a single session. Desktop-primary.

## Layout

White background. Max-width: 1024px, centered. Padding: px-8 py-6.

### Admin Header

- Top line: "Who Else Is Here · Admin" — 14px, font-medium, gray-400
- Event name: "RUMC Job Networking" — 20px, font-semibold, gray-900
- Session name + status: "Career Quest Workshop · Room 101" with a
  green status badge "Live" next to it
  - Badge: bg-success-50 (#F0FDF4), text-success-500 (#22C55E),
    text-xs font-medium, px-2 py-0.5, rounded-md
- "← Back to sessions" link below — 14px, primary-600, hover underline

### Metric Cards Row

Three cards in a horizontal row (flex, gap-6). Each card:
- Background: white
- Border radius: rounded-lg (8px)
- Shadow: shadow-md
- Padding: p-6
- Text-center

Card 1:
- Value: "38" — 36px, font-extrabold (800), gray-900
- Label: "Attendees" — 14px, gray-600

Card 2:
- Value: "127" — 36px, font-extrabold (800), gray-900
- Label: "LinkedIn Taps" — 14px, gray-600

Card 3:
- Value: "69%" — 36px, font-extrabold (800), primary-600
- Label: "Activation Rate" — 14px, gray-600

### Activity Timeline

Below metric cards, 24px gap.
- Section header: "Activity Timeline" — 16px, font-semibold, gray-900
- Simple horizontal bar chart showing activity over time:
  - 8 bars representing hourly slots from 1:00 PM to 3:00 PM (15-min
    intervals)
  - Bars in primary-600 (#4F46E5) with varying heights
  - Peak bar (tallest) has annotation: "peak: 2:15 PM" in 12px gray-400
  - X-axis labels: time slots in 12px gray-400
  - The chart can be simple CSS bars — no need for a charting library
- Container: bg-white, rounded-lg, shadow-md, p-6

### Action Buttons

Below timeline, 24px gap. Two buttons side by side:
- "Export Report" — primary button: bg-primary-600, text-white,
  font-semibold, py-2.5 px-4, rounded-lg
- "Download QR Code" — secondary button: bg-white, border border-gray-300,
  text-gray-700, font-medium, py-2.5 px-4, rounded-lg

### Screenshot Test

This entire page must look professional enough that Karen can screenshot
it and forward to her board chair with zero context. Numbers should be
large, labels plain English, visual hierarchy tells the story without
narration.

## Mobile Responsive

On mobile (below md: breakpoint):
- Metric cards stack vertically (flex-col) instead of horizontal row
- Timeline chart remains full-width
- Buttons stack vertically, full-width
```

---

## Prompt 6 — Admin Session List (Concurrent Sessions Overview)

**Target:** Admin sessions overview at route `/admin/sessions`
**Expected result:** List of 5 session cards with live metrics, status badges, action links, cross-session summary
**Validation checklist:**
1. Five session cards with correct data (names, rooms, metrics)
2. Green "Live" badges on sessions 1-4, amber "Upcoming" on session 5
3. Cross-session summary line below all cards
4. Action links (View, QR Code, Export Report) in primary-600 on each card

```
Build the admin sessions overview page at route "/admin/sessions". This
shows all concurrent sessions within an event — Karen's top-level view.

## Layout

White background. Max-width: 1024px, centered. Padding: px-8 py-6.

### Admin Header

- Top line: "Who Else Is Here · Admin" — 14px, font-medium, gray-400
- Event name: "RUMC Job Networking" — 24px, font-bold, gray-900
- Subtitle: "Sessions (5 active)" — 16px, gray-600, mt-1

### Session Cards

Vertical stack of session cards, 12px gap between cards (space-y-3).

Each card:
- Background: white
- Border: 1px solid gray-200 (#E5E7EB)
- Border radius: rounded-lg (8px)
- Padding: p-4
- Hover: border-primary-300, transition-colors

**Card layout (flex, justify-between, items-start):**

Left side:
- Session name + room: "Career Quest Workshop · Room 101" — 16px,
  font-semibold, gray-900
- Metrics line: "38 attendees · 127 taps · 69% activation" — 14px,
  gray-600, mt-1
- Action links: "[View] [QR Code] [Export Report]" — 14px, primary-600,
  mt-2, 16px gaps between links. Hover: underline

Right side:
- Status badge, vertically centered with session name

**5 session cards with this data:**

1. Career Quest Workshop · Room 101 — Live (green badge)
   38 attendees · 127 taps · 69% activation

2. Recruiters Panel · Room 102 — Live (green badge)
   24 attendees · 89 taps · 71% activation

3. Resume Review · Room 103 — Live (green badge)
   31 attendees · 104 taps · 65% activation

4. LinkedIn Optimization · Room 104 — Live (green badge)
   19 attendees · 52 taps · 58% activation

5. Interview Prep · Room 105 — Upcoming (amber badge)
   0 attendees · 0 taps · — activation

**Status badges:**
- Live: "Live" — bg-success-50, text-success-500, text-xs font-medium,
  px-2 py-0.5, rounded-md
- Upcoming: "Upcoming" — bg-warning-50 (#FFFBEB), text-warning-500
  (#F59E0B), same sizing

### Cross-Session Summary

Below all cards, 16px gap:
- "Cross-session: 42 attendees scanned 2+ sessions" — 14px, gray-600

### Create Session Button

Below summary, 24px gap:
- "Create Session" — primary button: bg-primary-600, text-white,
  font-semibold, py-2.5 px-4, rounded-lg

## Mobile Responsive

On mobile: cards remain full-width, action links wrap to new line if
needed, session name and badge stack vertically.
```

---

## Prompt 7 — Full Attendee List (Normal State, 10 Attendees)

**Target:** Full attendee list at route `/full-attendee-list` — the normal state after cold-start phase
**Expected result:** Same layout as cold-start but with 10 attendees, search icon visible, no cold-start banner
**Validation checklist:**
1. All 10 attendees visible, sorted alphabetically by first name
2. Search icon (magnifying glass) IS visible in header
3. Counter reads "38 professionals here"
4. NO cold-start encouragement banner

```
Create the full attendee list view at route "/full-attendee-list". This
is the SAME attendee list design as "/" but showing the normal state —
when 20+ attendees have joined and cold-start is over.

This page and the cold-start page at "/" are the SAME screen at
different points in time. The design, card layout, header, and
interactions are identical. The only differences:

### Header
- Counter: "38 professionals here"
- Search icon (magnifying glass) IS visible — appears at 20+ attendees

### Attendee List
Show ALL 10 sample attendees, sorted alphabetically by first name:
1. Aisha Okafor — VP Partnerships · Microsoft
2. Carlos Mendoza — Founder · NexGen AI
3. David Kim — Sr. Manager BD · Salesforce
4. James Morrison — SVP Sales · Oracle
5. Jennifer Walsh — Head of Talent · HubSpot
6. Lisa Park — Chief of Staff · Coinbase
7. Marcus Rivera — Dir. Product · Stripe
8. Priya Sharma — CTO · Acme Corp
9. Robert Tanaka — Principal Engineer · Netflix
10. Sarah Chen — VP Engineering · Google

Only the FIRST THREE show "joined X min ago" timestamps (they arrived
recently). The rest have no timestamp — they've been here a while.

### No Cold-Start Banner
The encouragement banner is GONE. At 20+ attendees, it disappears.
The list fills the screen naturally.

### Everything Else
Same sticky header, same card design (72px min height, initials
circles, chevrons), same gray-100 background, same desktop responsive
behavior (640px max-width centered, event name in header, line-clamp-2
titles).
```

---

## Prompt 8 — Offline State

**Target:** Offline state variant at route `/offline`
**Expected result:** Full attendee list with subtle amber "Offline" pill in header — no other visual changes
**Validation checklist:**
1. Amber "Offline" pill visible in header (warning-50 bg, warning-500 text)
2. All 10 attendees still visible and browsable
3. No error banners, no modals, no grayed-out cards
4. Counter reads "38 professionals here" (frozen, looks normal)

```
Create an offline state variant at route "/offline". This shows what
Alex sees when WiFi drops while browsing the attendee list.

Start from the full attendee list layout (same as /full-attendee-list)
and add these modifications:

### Header Change
Add an offline indicator pill to the header, on Line 2 between the
counter and search icon:
- Text: "Offline"
- Styling: bg-warning-50 (#FFFBEB), text-warning-500 (#F59E0B),
  text-xs (12px), font-medium, px-2 py-0.5, rounded-md
- Position: inline, after the counter text, before the search icon

### Counter Change
- Counter text: "38 professionals here" (frozen — not updating)
- Counter should look identical to online state — the frozen state
  is invisible to the user

### Attendee List
Same 10 attendees as the full list. No visual change to cards — the
cached list remains fully browsable.

### No Other Changes
No error banners. No modal dialogs. No "retry" buttons. No grayed-out
cards. The ONLY visual difference is the small amber "Offline" pill
in the header. The list looks and feels normal — Alex may not even
notice the WiFi dropped.

This subtlety is intentional — the design philosophy is "invisible
resilience." The app keeps working; it just quietly notes the
connectivity status.
```

---

## Prompt 9 — Session Not Started Screen

**Target:** Session not-started state at route `/not-started`
**Expected result:** Session header + centered message card with start time — calm, informational, not an error
**Validation checklist:**
1. Header shows different session: "Resume Review" / "Room 103"
2. Message card on gray-50 background with "Come back at 7:00 PM"
3. No attendee cards, no cold-start banner, no loading indicators
4. Tone is welcoming, not apologetic

```
Create a "session not started" screen at route "/not-started". This
is what Alex sees when scanning a QR code for a session that hasn't
begun yet.

## Layout

Gray-100 (#F3F4F6) background. Full viewport height.

### Header
Same sticky header structure as the attendee list:
- Line 1 left: "Resume Review" (session name) — 16px, font-semibold,
  gray-900
- Line 1 right: "Room 103" — 14px, gray-600
- Line 2: "RUMC Job Networking" (event name) — 14px, gray-600
- No search icon. No counter.

### Message Card
Centered in the remaining viewport space (not at the very top —
vertically centered in the area below the header).

Card styling:
- Background: gray-50 (#F9FAFB)
- Border radius: rounded-lg (8px)
- Padding: p-6
- Margin: mx-4
- Text alignment: center

Card content:
- "This session hasn't started yet." — 16px, gray-700
- "Come back at 7:00 PM." — 16px, font-semibold, gray-900, mt-2
- "" (empty line for spacing)
- "We'll show you who else is here when it begins." — 14px, gray-500, mt-4

### Nothing Else
No attendee cards. No cold-start banner. No loading indicators.
Just the header confirming which session this is, and a calm message
with the start time.

This is NOT an error state — it's an expected state. The tone is
informational and welcoming, not apologetic.
```

---

## Prompt 10 — Post-Event Read-Only State

**Target:** Post-event attendee list at route `/post-event` — within 5-day access window, session ended
**Expected result:** Full attendee list with info banner ("This session has ended"), past-tense counter, "Ended" label
**Validation checklist:**
1. Primary-50 banner between header and list with end date (March 13, 2026)
2. Counter reads "38 professionals attended" (past tense)
3. Time range shows "Ended" suffix in gray-400
4. All cards still tappable — no visual degradation

```
Create a post-event state at route "/post-event". This shows the
attendee list after the session has ended, within the 5-day access
window. Alex returns from home on a laptop to follow up on connections.

Start from the full attendee list layout (same as /full-attendee-list)
and add these modifications:

### Banner at Top (below header, above list)
A full-width info banner between the header and the attendee list:
- Background: primary-50 (#EEF2FF)
- Text: primary-700 (#4338CA)
- Padding: px-4 py-3
- Font size: 14px
- Text: "This session has ended. Browse the attendee list until
  March 13, 2026."
- No close/dismiss button — it's persistent information

### Header Changes
- Counter: "38 professionals attended" (past tense — "attended" not
  "here")
- Search icon still visible
- Session time shows as completed: "1:00 PM – 3:00 PM · Ended"
  with "Ended" in gray-400

### Attendee List
Same 10 attendees. No timestamps (irrelevant post-event). All cards
still tappable — LinkedIn profiles are still accessible.

### Feeling
This is the reflective follow-up mode. Alex is at home on a laptop,
methodically reviewing who was at the event. The banner confirms the
session is over but the list is still useful. No urgency, no pressure.
```

---

## Prompt 11 — OAuth Error State

**Target:** OAuth error screen at route `/error`
**Expected result:** Centered error message with "Try Again" button, casual reassuring tone, no technical details
**Validation checklist:**
1. Same visual structure as OAuth screen (centered, white, max-w 400px)
2. "Try Again" button in primary-600 indigo
3. Reassurance text: "No worries — your data wasn't shared."
4. No error codes, no technical jargon

```
Create an OAuth error screen at route "/error". This is what Alex sees
when LinkedIn authentication fails.

## Layout

Full-screen centered. White background. Content vertically and
horizontally centered (min-h-screen, flex, items-center, justify-center).
Max-width: 400px. Padding: px-6.

## Content (top to bottom, centered)

1. **App name:** "Who Else Is Here?" — 24px, font-bold, gray-900

2. **Session context** (8px gap below app name):
   - "Career Quest Workshop" — 16px, font-semibold, gray-900
   - "RUMC Job Networking" — 14px, gray-600

3. **Error message** (24px gap below):
   - "Something went wrong connecting to LinkedIn." — 16px, gray-700,
     centered
   - 8px gap
   - "This happens sometimes. Give it another try." — 14px, gray-500,
     centered

4. **Retry button** (24px gap below):
   - Full width within container
   - Background: primary-600 (#4F46E5)
   - Hover: primary-700 (#4338CA)
   - Text: white, font-semibold, 16px
   - Text: "Try Again"
   - Padding: py-3 px-6
   - Border radius: rounded-lg (8px)
   - Min height: 48px

5. **Reassurance** (16px gap below button):
   - "No worries — your data wasn't shared." — 12px, gray-400, centered

## Tone
Honest but not alarming. This is a networking event — Alex shouldn't
feel like the app is broken. It's a hiccup, not a crisis. The copy
is casual and reassuring.

## What NOT to Include
- No error codes or technical details
- No "contact support" link
- No alternative auth options
- No stack trace or debug info
```

---

## Prompt 12 — Session Archived State

**Target:** Archived session screen at route `/archived` — 5-day window expired
**Expected result:** Session header + centered message card confirming session is archived, no attendee list
**Validation checklist:**
1. Header shows "Career Quest Workshop" / "Room 101"
2. Message: "This session has ended and been archived."
3. Thank-you line mentioning session and event name
4. No buttons, no CTAs, no attendee cards — clean closure

```
Create an archived session screen at route "/archived". This is what
Alex sees when scanning a QR code after the 5-day post-event window
has expired.

## Layout

Gray-100 (#F3F4F6) background. Full viewport height.

### Header
Same sticky header structure:
- Line 1 left: "Career Quest Workshop" — 16px, font-semibold, gray-900
- Line 1 right: "Room 101" — 14px, gray-600
- Line 2: "RUMC Job Networking" — 14px, gray-600
- No search icon. No counter.

### Message Card
Centered in the remaining viewport space below the header.

Card styling:
- Background: gray-50 (#F9FAFB)
- Border radius: rounded-lg (8px)
- Padding: p-6
- Margin: mx-4
- Text alignment: center

Card content:
- "This session has ended and been archived." — 16px, gray-700
- "The attendee list is no longer available." — 14px, gray-500, mt-2
- (24px gap)
- "Thanks for joining Career Quest Workshop at RUMC Job Networking."
  — 14px, gray-500, mt-4

### Nothing Else
No attendee list. No buttons. No "sign up for next event" CTA.
Clean closure. The app respects that this event is over.
```

---

## Prompt 13 — Event Aggregate View (V2 Preview)

**Target:** Event-wide aggregate attendee view at route `/event-aggregate` — all attendees across all sessions
**Expected result:** Collapsible session groups, filter pills, multi-session badges, "34 more" links
**Validation checklist:**
1. Header shows event name "RUMC Job Networking" (not session name)
2. Filter pills row with "All Sessions" active in primary-600
3. First group expanded with 4 cards + "34 more" link, other 4 groups collapsed
4. "Also in:" badge on Sarah Chen and David Kim in primary-600

```
Create an event-wide aggregate attendee view at route "/event-aggregate".
This is a V2 feature preview — showing ALL attendees across ALL sessions
at an event, with session grouping.

## Context

RUMC Job Networking has 5 concurrent sessions. Some attendees scanned
into multiple sessions (session hopping). This view shows every unique
attendee across the entire event, grouped by which session(s) they
attended.

## Layout (Mobile-First)

Background: gray-100 (#F3F4F6). Full viewport height.

### Header (sticky, different from session header)

Sticky at top, white background, shadow-sm, px-4 py-3.

Line 1 (flex, justify-between, items-baseline):
- Left: "RUMC Job Networking" — 16px, font-semibold, gray-900
  (event name, NOT session name — this is event-wide)
- Right: "Today" — 14px, gray-600

Line 2 (flex, justify-between, items-center):
- Left: "87 professionals across 5 sessions" — 14px, gray-600
- Right: Search icon + Filter icon (funnel) — 20px, gray-400,
  8px gap between icons

### Filter Bar (below header, collapsible)

When filter icon is tapped, a filter bar expands below the header:
- Background: white, border-b border-gray-200, px-4 py-3
- Horizontal scrollable row of session filter pills:
  - "All Sessions" (default active) — bg-primary-600 text-white
    text-xs font-medium px-3 py-1.5 rounded-full
  - "Career Quest" — bg-gray-100 text-gray-700 text-xs font-medium
    px-3 py-1.5 rounded-full, hover:bg-gray-200
  - "Recruiters Panel" — same inactive style
  - "Resume Review" — same inactive style
  - "LinkedIn Optimization" — same inactive style
  - "Interview Prep" — same inactive style
- Tapping a pill filters the list to only that session's attendees
- "All Sessions" shows everyone (de-duplicated)

### Attendee List (grouped by session)

Collapsible session groups. Each group:

**Group header:**
- Flex row: session name + attendee count + collapse chevron
- "Career Quest Workshop · Room 101" — 14px, font-semibold, gray-700
- "(38)" — 14px, gray-400, ml-2
- Chevron: rotate 90° when expanded, 0° when collapsed — gray-400
- Background: gray-50, px-4 py-2, sticky below main header
- Tap to collapse/expand the group

**Group content (when expanded):**
- Standard attendee cards (same design as main attendee list)
- 72px min height, initials circles, title · company, chevron

**Show these groups with sample data:**

Group 1 — Career Quest Workshop · Room 101 (38) — EXPANDED:
Show 4 attendees:
- Aisha Okafor — VP Partnerships · Microsoft
- Carlos Mendoza — Founder · NexGen AI
- David Kim — Sr. Manager BD · Salesforce
- Sarah Chen — VP Engineering · Google
(+ "34 more" link in primary-600 at bottom of group)

Group 2 — Recruiters Panel · Room 102 (24) — COLLAPSED
Group 3 — Resume Review · Room 103 (31) — COLLAPSED
Group 4 — LinkedIn Optimization · Room 104 (19) — COLLAPSED
Group 5 — Interview Prep · Room 105 (12) — COLLAPSED

### Multi-Session Badge

For attendees who scanned multiple sessions, show a small badge
below their title line:
- "Also in: Recruiters Panel, Resume Review" — 12px, primary-600
- This appears instead of the timestamp line
- Only on attendees in 2+ sessions

Show this badge on Sarah Chen and David Kim in the expanded group.

### Desktop Responsive (lg:)
- Max-width 768px centered (wider than single-session view because
  group headers need room)
- Filter pills don't scroll — they wrap to multiple lines if needed
- Group headers remain sticky

## Design Philosophy
This is the "power user" view — Alex who's been to 3 sessions and
wants to see EVERYONE at the event. It's denser, more structured,
and more navigational than the single-session list. But it still
follows the same card design, same colors, same tap-to-LinkedIn
interaction.
```

---

## Prompt 14 — Search Filter Active

**Target:** Attendee list with search bar expanded and filtering at route `/search`
**Expected result:** Search input showing "Google", one matching result (Sarah Chen), updated counter "1 of 38"
**Validation checklist:**
1. Search input expanded below header with "Google" typed
2. Clear button (x) visible in input
3. Only Sarah Chen card shown
4. Counter reads "1 of 38 professionals"

```
Create a search filter state at route "/search". This shows the
attendee list with the search bar expanded and actively filtering.

Start from the full attendee list layout (/full-attendee-list) and
modify:

### Search Bar (expanded, below header)
The search icon in the header has been tapped. An input field appears
below the header:
- Container: px-4 py-2 bg-gray-50 border-b border-gray-200
- Input: w-full px-3 py-2 text-sm rounded-md border border-gray-200
  focus:border-primary-600 focus:ring-1 focus:ring-primary-600
- Placeholder replaced with typed text: "Google"
- Clear button (x) on the right side of the input: text-gray-400
  hover:text-gray-600

### Filtered List
Only attendees matching "Google" are shown:
1. Sarah Chen — VP Engineering · Google

Show just this one card below the search bar. The rest are filtered out.

### Counter Update
Header counter changes to: "1 of 38 professionals" — 14px, gray-600

### Empty State (show as a comment/note, not rendered)
If search matched zero results, the list area would show centered:
"No one matches 'xyz'. Try a different name, title, or company."
— 14px, gray-500, centered, py-12

For this mockup, show the one matching result (Sarah Chen).

### Everything Else
Same header, same card design. The search is purely visual filtering
— no loading states, no API calls.
```

---

## Prompt 15 — OAuth Denial

**Target:** OAuth denial screen at route `/denied` — Alex tapped "Deny" on LinkedIn
**Expected result:** Centered "No problem!" message with "Scan Again" button, zero guilt tone
**Validation checklist:**
1. "No problem!" headline — friendly, not apologetic
2. "Scan Again" button in primary-600
3. "Nothing was shared with us." reassurance
4. Same visual structure as OAuth/error screens

```
Create an OAuth denial screen at route "/denied". This is what Alex
sees after tapping "Deny" on the LinkedIn OAuth screen.

## Layout

Full-screen centered. White background. Content vertically and
horizontally centered (min-h-screen, flex, items-center, justify-center).
Max-width: 400px. Padding: px-6.

## Content (top to bottom, centered)

1. **App name:** "Who Else Is Here?" — 24px, font-bold, gray-900

2. **Session context** (8px gap below):
   - "Career Quest Workshop" — 16px, font-semibold, gray-900
   - "RUMC Job Networking" — 14px, gray-600

3. **Message** (24px gap below):
   - "No problem!" — 20px, font-semibold, gray-900
   - "You can scan the QR code again anytime you change your mind."
     — 14px, gray-500, mt-2, centered

4. **Scan again button** (24px gap below):
   - Full width
   - Background: primary-600 (#4F46E5)
   - Text: "Scan Again" — white, font-semibold
   - Padding: py-3 px-6, rounded-lg

5. **Reassurance** (16px gap below):
   - "Nothing was shared with us." — 12px, gray-400, centered

## Tone
Zero guilt. Zero pressure. Dave tapped "Deny" and the app says
"cool, no worries." This screen must feel like a shrug, not a
guilt trip. No "you're missing out!" language.
```

---

## Prompt 16 — Event Lobby / Session Chooser

**Target:** Event lobby at route `/lobby` — master QR screen listing sessions to choose from
**Expected result:** Event header + 5 tappable session cards with room, time, attendee count, green live dots
**Validation checklist:**
1. Header shows "RUMC Job Networking" with "Choose a session to join"
2. Five session cards with room numbers and time ranges
3. Green live dots on each session
4. Attendee count per session visible

```
Create an event lobby screen at route "/lobby". This is the optional
master QR code screen — scanned at the registration desk — that lists
all active sessions for the attendee to choose from.

## Layout

Gray-100 (#F3F4F6) background. Full viewport height.

### Header
Sticky, white background, shadow-sm, px-4 py-3.
- "RUMC Job Networking" — 16px, font-semibold, gray-900
- "Choose a session to join" — 14px, gray-600

### Session Cards

Below header, vertical stack of tappable session cards. 8px gap
between cards.

Each card:
- Background: white
- Min height: 80px
- Padding: px-4 py-4
- Full width, no horizontal page padding (edge-to-edge like
  attendee cards)
- Tap navigates to that session's attendee list

Card layout:
- Session name: 16px, font-semibold, gray-900
- Room + time: 14px, gray-600, mt-1. Format: "Room 101 · 1:00 PM – 3:00 PM"
- Attendee count: 14px, gray-400, mt-1. "38 professionals here"
- Chevron: right-aligned, gray-400, flex-shrink-0

**5 session cards:**
1. Career Quest Workshop — Room 101 · 1:00 PM – 3:00 PM — 38 professionals here
2. Recruiters Panel — Room 102 · 1:00 PM – 3:00 PM — 24 professionals here
3. Resume Review — Room 103 · 1:00 PM – 3:00 PM — 31 professionals here
4. LinkedIn Optimization — Room 104 · 1:30 PM – 3:00 PM — 19 professionals here
5. Interview Prep — Room 105 · 2:00 PM – 3:30 PM — 12 professionals here

### Status Indicators
Each card shows a small green dot (8px circle, bg-success-500)
inline before the session name if the session is live. No dot for
upcoming sessions.

All 5 are live in this mockup.

## Feeling
This is the "menu" of the event. Alex walks up to the registration
desk, scans the master QR, and sees all sessions at a glance. Pick
one, tap, you're in. No decisions more complex than "which room?"
```

---

## Prompt 17 — Admin Event Creation Form

**Target:** Event creation form at route `/admin/create` — Carlos's setup interface
**Expected result:** Clean form with event details section + sessions section with add/remove, submit button
**Validation checklist:**
1. Event name, venue, slug fields with proper labels and styling
2. Auto-generated slug with URL preview below
3. Two session cards (one filled, one empty) with date/time fields
4. "+ Add Another Session" link in primary-600

```
Create an admin event creation form at route "/admin/create". This is
Carlos's interface for setting up a new event with sessions.

## Layout

White background. Max-width: 640px, centered. Padding: px-8 py-6.

### Header
- "Who Else Is Here · Admin" — 14px, font-medium, gray-400
- "Create New Event" — 24px, font-bold, gray-900
- "← Back to events" — 14px, primary-600, hover underline, mt-1

### Event Details Section
- Section header: "Event Details" — 16px, font-semibold, gray-900,
  mb-4

Form fields (vertical stack, 16px gap):

1. **Event Name** (required)
   - Label: "Event Name" — 12px, font-medium, gray-700, mb-1
   - Input: border border-gray-300 rounded-md px-3 py-2 text-base
     w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500
   - Placeholder: "e.g., RUMC Job Networking"

2. **Venue**
   - Label: "Venue" — same styling
   - Input: same styling
   - Placeholder: "e.g., Roswell United Methodist Church"

3. **Event Slug** (auto-generated)
   - Label: "Event URL Slug" — same styling
   - Input: same styling, bg-gray-50 (slightly different to signal
     auto-generated)
   - Value: "rumc-job-networking" (pre-filled, editable)
   - Helper text below: "URL: whoelseishere.com/event/rumc-job-networking"
     — 12px, gray-400

### Sessions Section
- Section header: "Sessions" — 16px, font-semibold, gray-900, mb-4,
  mt-8
- Subtext: "Add one or more sessions. Each session gets its own QR
  code." — 14px, gray-500, mb-4

**Session 1 (filled in):**
Card with border border-gray-200 rounded-lg p-4:
- Session Name: "Career Quest Workshop" (filled input)
- Room: "Room 101" (filled input)
- Date: "2026-03-08" (date input)
- Start Time: "1:00 PM" (time input)
- End Time: "3:00 PM" (time input)
- Layout: Session name full-width, then Room + Date on one row,
  Start + End on next row (2-column grid within the card)

**Session 2 (empty, ready to fill):**
Same card structure, all fields empty with placeholders.

**Add Session button:**
Below the session cards:
- "+ Add Another Session" — text button, primary-600, font-medium,
  14px, mt-2

### Submit
Below sessions, 32px gap:
- "Create Event & Generate QR Codes" — primary button, full-width,
  bg-primary-600 text-white font-semibold py-3 rounded-lg
- "Cancel" — secondary button, full-width, mt-2, bg-white border
  border-gray-300 text-gray-700 font-medium py-3 rounded-lg
```

---

## Prompt 18 — QR Code Signage Preview

**Target:** Print-ready QR signage at route `/admin/qr-preview`
**Expected result:** Clean printable sign with headline question, QR placeholder, session/room context, call to action
**Validation checklist:**
1. "Who Else Is Here?" as the big headline
2. QR code placeholder (240x240px)
3. Session name + room below QR
4. No navigation, no buttons — the page IS the printable sign

```
Create a QR code signage preview at route "/admin/qr-preview". This
is the print-ready QR code asset that Karen prints and places in each
room.

## Layout

White background. Max-width: 480px, centered. Padding: p-8.
This page IS the printable sign — what you see is what prints.

### Sign Content (centered, vertical stack)

1. **Question headline:**
   "Who Else Is Here?" — 32px, font-bold, gray-900, text-center

2. **QR Code** (24px gap below headline):
   - Large square placeholder: 240px x 240px, centered
   - Border: 2px solid gray-200, rounded-lg
   - Inside: show a placeholder QR pattern or just text "QR CODE"
     centered in gray-400, 20px
   - Below QR: short URL "whoelseishere.com/event/rumc/session/career-quest"
     — 12px, gray-400, text-center, mt-2

3. **Session context** (24px gap below QR):
   - "Career Quest Workshop" — 20px, font-semibold, gray-900,
     text-center
   - "Room 101" — 16px, gray-600, text-center, mt-1

4. **Call to action** (16px gap below):
   - "Scan to see everyone at this session" — 14px, gray-600,
     text-center

5. **Event branding** (32px gap below, at bottom):
   - Thin divider line: border-t border-gray-200, w-16, mx-auto
   - "RUMC Job Networking" — 12px, gray-400, text-center, mt-4
   - Date: "March 8, 2026" — 12px, gray-400, text-center

### Print Considerations
- No navigation elements, no buttons, no header
- The entire page is the sign — clean, minimal, ready to print
- White background prints cleanly
- High contrast text for readability from 3 feet away
```

---

## Prompt 19 — Karen's Post-Event Report Page

**Target:** Standalone post-event report at route `/admin/report` — Karen's screenshot/forward artifact
**Expected result:** Professional BI-style report with headline metrics, context bar, activity summary, timeline, branded footer
**Validation checklist:**
1. "Connections Facilitated" not "Taps" — Karen's language
2. Context bar with industry average comparison (15-25%)
3. Activity summary with plain English stats
4. Branded footer with generation timestamp
5. Passes the screenshot test — forward to board chair with zero context

```
Create a standalone post-event report at route "/admin/report". This
is Karen's "screenshot moment" — a clean, professional report page
she forwards to sponsors and leadership.

## Layout

White background. Max-width: 768px, centered. Padding: px-8 py-8.
No admin navigation — this is a standalone report page.

### Report Header
- "Who Else Is Here" — 14px, font-medium, primary-600, text-center
- "Post-Event Report" — 12px, gray-400, text-center, mt-1
- Divider: border-t border-gray-200, my-4

### Event Info
- "RUMC Job Networking" — 24px, font-bold, gray-900, text-center
- "Career Quest Workshop · Room 101" — 16px, gray-600, text-center, mt-1
- "March 8, 2026 · 1:00 PM – 3:00 PM" — 14px, gray-400, text-center, mt-1

### Headline Metrics (32px gap below)
Three metric cards in a horizontal row (same as admin dashboard):
- Card style: bg-gray-50 rounded-lg p-6 text-center (no shadow —
  cleaner for screenshots/print)

Card 1: "38" / "Attendees"
Card 2: "127" / "LinkedIn Connections Facilitated"
  (note: "Connections Facilitated" not "Taps" — Karen language)
Card 3: "69%" / "Activation Rate"

### Context Bar (16px below metrics)
- "69% of attendees actively networked through the platform. Industry
  average for event networking tools: 15-25%."
  — 14px, gray-600, text-center, italic

### Activity Summary (24px below)
- Section header: "Activity Summary" — 16px, font-semibold, gray-900
- Simple stats list, left-aligned, 8px gap between items:
  - "Peak networking activity: 2:15 PM" — 14px, gray-700
  - "Most active period: during the afternoon break" — 14px, gray-700
  - "Average LinkedIn taps per attendee: 3.3" — 14px, gray-700
  - "Attendees who returned post-event: 12 (32%)" — 14px, gray-700

### Activity Timeline (24px below)
- Same bar chart as admin dashboard but styled for print:
  - Bars in primary-600
  - Gray background removed (white for print)
  - Peak annotation visible

### Footer (32px below)
- Divider: border-t border-gray-200, my-4
- "Generated by Who Else Is Here · whoelseishere.com" — 12px,
  gray-400, text-center
- "Report generated: March 8, 2026 at 4:30 PM" — 12px, gray-400,
  text-center, mt-1

### Screenshot Test
This ENTIRE page must look like a professional business intelligence
report. If Karen screenshots it and forwards to her board chair
with zero context, it communicates: "Our event created measurable
professional networking value." The language is Karen's language —
"connections facilitated" not "taps," "activation rate" not
"scan percentage."
```

---
