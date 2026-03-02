---
date: '2026-03-01'
topic: 'TEA Step 3 Risk Assessment Review'
participants: [Murat, Winston, Mary, Amelia]
triggeredBy: 'TEA test-design workflow Step 3 (Risk & Testability Assessment) — user requested Party Mode review'
---

# Party Mode Transcript: TEA Step 3 Risk Assessment Review

**Date:** 2026-03-01
**Participants:** 🧪 Murat, 🏗️ Winston, 📊 Mary, 💻 Amelia
**Context:** Review of the TEA Testability & Risk Assessment (14 risks, 5 testability concerns) produced during the test-design workflow Step 3.

---

**Carlos:** p

---

🧪 **Murat**: Let me frame this for the panel. The BMad Master just completed the system-level testability review. 14 risks identified, 1 critical (score 9), 3 high (score 6). The critical one — R-002 — is blunt: there's no test data seeding strategy in the architecture. Without it, every automated test is dead in the water. I have strong conviction on this one — probability 3, impact 3, no debate. But I want Winston to tell me if the architecture already accounts for something I missed before we lock in the blocker designation.

🏗️ **Winston**: Murat's right to flag R-002. The architecture document specifies Drizzle ORM and PostgreSQL, but it deliberately did not prescribe test infrastructure — that's considered an implementation concern, not an architectural decision. However, Murat is correct that this *should* have been called out as a testability constraint. The architecture supports it cleanly — Drizzle transactions can wrap test scenarios, and Docker Compose already provides an isolated database. What's missing is the *contract*: a documented API surface for seeding. I'd recommend we don't create a REST endpoint for seeding. Instead, use Drizzle's programmatic API directly in test fixtures — same database, no HTTP overhead, no surface area to secure. That drops the implementation cost significantly.

As for the LinkedIn OAuth mock (R-003), the architecture deliberately chose JWT-based sessions *because* they're mockable. The test strategy should create JWT tokens directly in test fixtures, bypassing LinkedIn entirely. No mock server needed — just a `createTestJWT()` helper. The architecture was designed with this in mind, but I'll concede it wasn't documented explicitly.

🧪 **Murat**: I'll accept Winston's recommendation on R-002 mitigation — Drizzle programmatic seeding via test fixtures instead of a REST endpoint. That's cleaner and eliminates the security surface of a `/test/seed` endpoint. Score stays at 9 because the *need* is critical, but the mitigation path is simpler than I initially proposed. Risk score doesn't change — the risk is "no seeding strategy exists," not "seeding is technically hard."

On R-003, I partially agree. Direct JWT creation covers the *authenticated session* portion, but it doesn't test the OAuth *flow* itself — callback handling, token exchange, error states (expired tokens, revoked access). I'd split this: JWT fixtures for 95% of tests (fast, isolated), plus 2-3 dedicated integration tests that mock the LinkedIn API response at the HTTP level to validate the OAuth callback handler. That covers both angles without external dependency.

📊 **Mary**: From a business perspective, I want to challenge the priority ordering. R-001 (OAuth token theft) is scored at 6, but for this product, the business impact might be lower than Murat suggests. Here's why: Who Else Is Here stores *zero* sensitive data beyond what's already public on LinkedIn profiles — name, photo, title, company. A token replay attack gives an attacker... the ability to see a conference attendee list they could already browse on LinkedIn. The *perception* risk is real (brand trust), but the *data exposure* impact is minimal. I'd argue R-001 could be a score of 4 (probability 2 × impact 2) instead of 6.

Meanwhile, R-014 (admin panel unauthorized access) is the real security concern. An unauthorized user accessing the admin panel could *create fake events*, *delete attendees*, or *export analytics*. That's where actual business harm lives. I agree with the score of 6 there — if anything, it should be higher.

🧪 **Murat**: Strong point from Mary. I'm willing to adjust R-001 to score 4 — the data exposure argument is sound. Public LinkedIn data in a read-only list isn't high-impact theft material. The token hygiene (short expiry, HTTPS-only cookies) is still a best practice, but it moves to "good engineering" rather than "critical risk." R-014 stays at 6 or bumps to score of 6 — I'll keep it where it is since admin panel access is gated behind an explicit role check in the architecture.

💻 **Amelia**: Implementation reality check on the 5 testability concerns. Concern #1 (test data seeding) — Winston's Drizzle fixture approach: `src/test/fixtures/seed.ts`, direct ORM calls, transaction-wrapped. Straightforward. Concern #2 (OAuth mock) — `createTestJWT(userId, claims)` utility, 20 lines of code. Concern #3 (WebSocket testing) — Playwright has native WebSocket support via `page.waitForEvent('websocket')`. The event contract documentation is the real ask here, not tooling. Concern #4 (QR code isolation) — if QR generation is `generateQR(sessionId: string): string`, it's a pure function and testable with `vitest`. If it's coupled to session creation, refactor to extract. Concern #5 (sample API contracts) — tRPC generates these automatically from the router definitions. The `tRPC panel` dev tool or router introspection gives you sample requests for free. This concern may be overblown.

Bottom line: 4 of 5 concerns have low-effort mitigations. Concern #3 (WebSocket contract documentation) is the only one requiring deliberate architectural work.

🧪 **Murat**: Amelia's implementation gut-check is exactly what I needed. I'll revise the assessment:

- **Concern #5 (sample API contracts)** downgraded from ACTIONABLE to FYI — tRPC self-documents. Good catch.
- **Concern #4 (QR code isolation)** stays ACTIONABLE but with a note that mitigation is trivial (pure function extraction).
- **Concern #3 (WebSocket contract)** remains the real architectural ask.

Final adjusted risk summary after this panel:
- R-001: Score **4** (down from 6) — public data, low exposure
- R-002: Score **9** (unchanged) — still the critical blocker, but mitigation is simpler (Drizzle fixtures, not REST API)
- R-003: Score **6** (unchanged) — split strategy: JWT fixtures + 2-3 HTTP-level OAuth flow tests
- R-014: Score **6** (unchanged) — admin access boundaries

**Panel consensus:** Assessment is solid. Adjustments are minor — one risk rescored, one concern downgraded. The critical path is clear: R-002 seeding strategy must exist before any test automation begins.

---

**Carlos:** exit, fold in the adjustments and continue
