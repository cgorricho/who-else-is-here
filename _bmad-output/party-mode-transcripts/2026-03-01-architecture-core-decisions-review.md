---
date: '2026-03-01'
topic: 'Core Architectural Decisions Review'
participants: [Winston (Architect), Amelia (Developer), Barry (Quick Flow Solo Dev), John (PM), Murat (Test Architect)]
triggeredBy: 'Architecture workflow step-04 (Core Architectural Decisions) — Carlos requested Party Mode to review 11 proposed decisions before committing'
---

# Party Mode Transcript: Core Architectural Decisions Review

**Date:** 2026-03-01
**Participants:** 🏗️ Winston, 💻 Amelia, 🚀 Barry, 📋 John, 🧪 Murat
**Context:** Carlos requested Party Mode to review 11 proposed architectural decisions across 5 categories before committing them to the architecture document.

---

**Carlos:** P - let's have the agents review these decisions before we commit

[11 architectural decisions presented across 5 categories: Data Architecture (migration, session storage, caching), Authentication & Security (admin auth, security middleware), API & Communication (API pattern, error handling), Frontend Architecture (state management, routing), Infrastructure & Deployment (CI/CD, logging, env config)]

---

### Category 1: Data Architecture

🏗️ **Winston**: Let me go through each one.

**1a. Drizzle Kit for migrations — Agreed.** No notes. It generates SQL you can review. That's the right tool for someone who thinks in SQL. One clarification: make sure you commit your migration files to git. They're your schema history — the audit trail of every structural change to your data moat.

**1b. PostgreSQL for sessions — Agreed, with a caveat.** `connect-pg-simple` is the right choice for MVP. But I want to flag something: when you have 500 concurrent WebSocket connections AND session lookups hitting the same PostgreSQL instance, you're mixing hot real-time traffic with session I/O on the same database. At pilot scale (40-200 attendees), this is a non-issue. At 500 concurrent, monitor query latency on session lookups. If it becomes a bottleneck, the migration path to Redis is straightforward — swap the session store adapter, no app code changes.

**1c. No dedicated cache for MVP — Strongly agreed.** This is the right "boring technology" instinct. PostgreSQL with proper indexing handles 500 attendees trivially. The attendee list query is a simple `SELECT` with an event scope filter. Adding a cache layer before proving you need one is premature optimization — the worst kind of complexity for a solo operator.

💻 **Amelia**: One addition to 1a: Drizzle Kit also supports `drizzle-kit push` for rapid prototyping — it applies schema changes directly to the database without generating migration files. Use `push` during early development when your schema is evolving fast, switch to `generate` + `migrate` before the first pilot when you need a stable migration history. Best of both worlds.

---

### Category 2: Authentication & Security

🏗️ **Winston**: **2a. Local credentials for admin — Agreed for MVP.** But I want to propose a slight refinement. Instead of building a full username/password auth system with registration, password reset, etc., consider a simpler approach for MVP: **a single admin password set via environment variable.** Carlos is the only admin. One `ADMIN_PASSWORD` in your `.env`, bcrypt-compared at login. No user table for admins, no registration flow, no password reset. When Karen needs access in V2, THAT's when you build proper admin user management with LinkedIn OAuth.

📋 **John**: I agree with Winston's refinement. Building a full credential system for one user is over-engineering. Environment variable password gets Carlos into the admin panel. Ship the product, not the admin system.

💻 **Amelia**: If you go with Winston's env-var approach, pair it with a hardcoded admin email for session identification. `ADMIN_EMAIL` + `ADMIN_PASSWORD` in `.env`. The session stores the email so the admin panel knows who's logged in. Minimal, secure, upgradeable.

🚀 **Barry**: Even simpler consideration: do you even need admin auth for MVP? Carlos, you're the only user of the admin panel. You're deploying on your own VPS. You could gate the admin routes by IP address or just use the `.env` password approach Winston described. Don't build auth infrastructure you'll replace in V2 anyway.

🏗️ **Winston**: Barry raises a fair point, but I'd push back slightly. Even for MVP, having *some* auth on admin routes is important. If the admin panel is exposed at `whoelseishere.com/admin`, anyone who guesses the URL can see your analytics data. The `.env` password approach is 20 minutes of work and protects against casual access. That's worth it.

**2b. Security middleware (helmet + cors + express-rate-limit) — No disagreement anywhere.** These are non-negotiable. The only thing I'd add: configure `cors` to allow only `whoelseishere.com` as an origin. And for `express-rate-limit`, set sensible defaults for the OAuth callback endpoint specifically — LinkedIn callbacks should be rate-limited more aggressively than the attendee list API to prevent abuse.

🧪 **Murat**: Testing note on security middleware: write one integration test that verifies CORS rejects requests from unauthorized origins, and one that verifies rate limiting triggers on excessive requests. These are "set once, verify once" tests — low effort, high confidence that your security layer is actually working.

---

### Category 3: API & Communication

🏗️ **Winston**: **3a. REST vs tRPC — This is the most consequential remaining decision.** Let me lay out the trade-off more sharply.

**REST** gives you:
- Nginx proxy rules you already understand (`/api/events`, `/api/attendees`)
- Standard HTTP semantics (GET, POST, PUT, DELETE)
- Easy to debug with curl or Postman
- Every Node.js tutorial uses REST

**tRPC** gives you:
- Zero API contract maintenance — change a server function, the client TypeScript updates automatically
- No `fetch` calls with manual URL construction and response parsing
- Full autocomplete in your IDE: type `trpc.` and see every available endpoint with input/output types
- Zod validation built-in — your shared Zod schemas ARE the API validation

For a solo dev in a monorepo with shared types already via Zod, tRPC eliminates an entire class of bugs: API contract drift. You never write `fetch('/api/events')` and manually type the response. You write `trpc.events.list.useQuery()` and TypeScript knows the exact return type.

**My honest assessment:** tRPC has a learning curve — maybe 2-3 hours to understand the router/procedure pattern. But once you get it, you'll never go back to REST for a TypeScript monorepo. It's like going from manual SQL string construction to Drizzle — same principle of type safety eliminating a whole category of errors.

**However** — and this is important — Socket.io stays separate. tRPC handles your request/response API (event CRUD, analytics, auth callbacks). Socket.io handles your real-time pub/sub (attendee list broadcasts). They coexist cleanly.

💻 **Amelia**: I'm going to push for **tRPC** here, Carlos. Here's a concrete example of what your code looks like with each:

**REST approach:**
```typescript
// Server
app.get('/api/events/:slug/attendees', async (req, res) => {
  const attendees = await db.select().from(attendeesTable).where(eq(attendeesTable.eventId, eventId));
  res.json(attendees);
});

// Client
const res = await fetch(`/api/events/${slug}/attendees`);
const attendees: Attendee[] = await res.json(); // YOU hope this matches
```

**tRPC approach:**
```typescript
// Server
export const eventRouter = router({
  attendees: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return db.select().from(attendeesTable).where(eq(attendeesTable.eventSlug, input.slug));
    }),
});

// Client
const { data: attendees } = trpc.event.attendees.useQuery({ slug });
// TypeScript KNOWS the exact shape — no manual typing
```

The tRPC version has zero possibility of type drift. The Zod input validation is built-in. And you get React Query caching for free — `useQuery` handles loading states, error states, and refetching automatically.

🚀 **Barry**: I'll play devil's advocate. Carlos, you're learning React AND Node.js/Express for the first time on this project. Adding tRPC means learning THREE new things simultaneously: React patterns, Express middleware, AND tRPC's router/procedure model. REST is "one less thing to learn." You can ALWAYS migrate to tRPC later — it's a refactor, not a rewrite.

Counter-argument to my own point: tRPC actually REDUCES what you need to learn about Express. You don't write route handlers, you don't parse request bodies, you don't construct response objects. tRPC abstracts all of that. So maybe it's "one different thing" rather than "one more thing."

My gut: if you're comfortable adding 2-3 hours of tRPC learning, go tRPC. If you want to minimize unknowns for the first pilot, go REST and migrate later.

📋 **John**: Product lens: tRPC vs REST has zero impact on your users or on time-to-pilot. Both work. The question is: which one makes Carlos faster AFTER the first pilot, when iteration speed matters most? tRPC's "change the server, the client updates automatically" is a velocity multiplier for iteration. I'd lean tRPC if Carlos is willing to invest the 2-3 hours upfront.

🧪 **Murat**: Testing perspective: tRPC is easier to test than REST. You call the procedure directly in your test — no HTTP layer, no supertest needed for unit tests. You test the business logic, not the HTTP plumbing. Integration tests can use tRPC's `createCaller` to test the full procedure pipeline. Playwright E2E tests don't care either way — they interact with the UI, not the API layer.

**3b. Structured error responses — No disagreement.** Standard `{ error: { code, message, details? } }` shape. If you go tRPC, this is handled automatically by tRPC's error formatting. One less thing to build.

---

### Category 4: Frontend Architecture

🏗️ **Winston**: **4a. State management — React Context + useReducer — Agreed, with a nuance.** Your state is genuinely simple: one attendee list (from WebSocket), one connection status, one event object. React Context handles this. But if you go with tRPC (which includes React Query), your server state is already managed — React Query handles caching, loading states, and refetching for all API data. You'd only need Context for truly client-side state: WebSocket connection status and offline indicator. That's even simpler than I originally estimated.

💻 **Amelia**: Agreed. If tRPC is chosen, React Query manages server state. `useState` for connection status and offline indicator — not even Context needed. If REST is chosen, then Context + useReducer for the attendee list makes sense.

**4b. React Router — Agreed, no discussion needed.** 3-4 routes. React Router v7 (which is now just Remix under the hood, but you can use it in SPA mode without the server framework). Simple, well-documented.

🚀 **Barry**: On routing — one thing to flag: your admin panel routes (`/admin/*`) should be in a separate React Router route tree from the attendee routes (`/event/[slug]`). This enables code splitting — attendees never download admin dashboard code, keeping your PWA cache under 2MB (NFR7).

---

### Category 5: Infrastructure & Deployment

🏗️ **Winston**: **5a. CI/CD — Manual deploy for MVP, add GitHub Actions before pilot — Agreed.** One specific recommendation: when you add GitHub Actions, keep it simple. One workflow file: `on push → install → lint → test → build`. Don't deploy automatically from CI for MVP — you want manual control over when production updates during live pilots.

🚀 **Barry**: Agreed. `scp` the build output to the server. You've done this before with your VPS deployments. Add CI when you have tests worth running automatically. Don't add CI to run zero tests.

**5b. Pino for logging — Agreed.**

💻 **Amelia**: One specific integration: `pino-http` as Express middleware gives you request logging (method, URL, status code, response time) automatically. That feeds directly into your NFR41 observability requirement — you can grep your logs for response times during a live event.

🧪 **Murat**: Testing note: don't test logging itself. Test the behaviors that produce log-worthy events (errors, lifecycle transitions, journey data capture). The logs are a side effect, not the system under test.

**5c. Single root .env — Agreed with one safety note.**

🏗️ **Winston**: Add a `.env.example` file to the repo with all required variable names (no values). This serves as documentation for which variables need to be set. And make sure `.env` is in `.gitignore` — which it should be by default. Your LinkedIn OAuth credentials, admin password, and database connection string are in there. Never committed.

---

### Summary of Agent Review Findings

🏗️ **Winston**: Here's where we landed after review:

| Decision | Original Proposal | Agent Review Outcome | Changed? |
|---|---|---|---|
| 1a. Migration | Drizzle Kit | Drizzle Kit + `push` for dev, `generate`+`migrate` for prod | Enhanced |
| 1b. Sessions | PostgreSQL (connect-pg-simple) | Agreed — monitor at 500 concurrent, Redis migration path clear | Confirmed |
| 1c. Caching | No dedicated cache | Agreed — premature optimization at pilot scale | Confirmed |
| 2a. Admin auth | Local credentials (username/password) | Simplified to env-var password (`ADMIN_EMAIL` + `ADMIN_PASSWORD`) for MVP | **Changed** |
| 2b. Security middleware | helmet + cors + rate-limit | Agreed + CORS origin lock + aggressive OAuth rate limit | Enhanced |
| 3a. API pattern | REST (leaning) | **tRPC recommended** — panel majority favors type-safe monorepo approach. REST is valid fallback if Carlos prefers fewer unknowns | **Changed** |
| 3b. Error handling | Structured JSON errors | Agreed — handled automatically if tRPC chosen | Confirmed |
| 4a. State management | React Context + useReducer | Simplified if tRPC chosen: React Query for server state, `useState` for client-only state | Enhanced |
| 4b. Routing | React Router v7 | Agreed + code splitting between attendee/admin route trees | Enhanced |
| 5a. CI/CD | Manual → GitHub Actions | Agreed — CI for lint+test+build only, no auto-deploy | Confirmed |
| 5b. Logging | Pino | Agreed + `pino-http` middleware for request logging | Enhanced |
| 5c. Env config | Single root .env | Agreed + `.env.example` committed to repo | Enhanced |

**Two decisions changed, five enhanced, five confirmed.**

---

**Carlos:** tRPC. remember that my learning will be while I see the BMAD developer plan and write the code. I am the mastermind behind this project, not the actual developer

---

🏗️ **Winston**: That's an important clarification, Carlos, and it actually *strengthens* the case for tRPC. If AI agents are writing the implementation code from the architecture document, tRPC's strict type contracts become a **guardrail for the agents**, not just for you. When the developer agent writes a tRPC procedure, TypeScript enforces the contract end-to-end. The agent can't accidentally create an API endpoint that returns the wrong shape — the compiler catches it. tRPC essentially makes the architecture self-enforcing. For a mastermind directing AI developers, that's exactly the kind of structural safety you want baked into the foundations.

💻 **Amelia**: This reframes every decision we've made. The developer agents will be writing the code. That means our architecture document needs to be unambiguous — no "use your judgment" zones. tRPC eliminates one of the biggest ambiguity sources: API contract definitions. The Zod schemas in `packages/shared` plus tRPC routers ARE the specification. An agent reads the schema, writes the procedure, TypeScript verifies correctness. Zero interpretation required.

🚀 **Barry**: Carlos, this is actually the ideal setup. You architect, the agents implement. The stricter the type system, the less the agents can deviate. tRPC + Zod + TypeScript strict mode = three layers of "you can't write code that doesn't conform to the architecture." That's a mastermind's dream — you define the rules, the compiler enforces them.

📋 **John**: From a product management perspective, this makes complete sense. Carlos, you're operating in the same mode you used at Riopaila Castilla or EnfraGen — you structured the $500M CAPEX programs, you didn't pour the concrete. Your job is to make the architecture so clear that the implementation becomes mechanical. tRPC makes the API layer mechanical. Good call.

🧪 **Murat**: Testing implication update: with AI agents writing the code, the testing strategy becomes even more important as a **verification layer**. The agents write the implementation, the tests verify it conforms to the architecture. Vitest + tRPC's `createCaller` makes this clean — the agent writes a procedure, then writes a test that calls it directly and asserts the output matches the Zod schema. The architecture document should specify test expectations alongside each architectural decision so the developer agent knows what to test.

🏗️ **Winston**: One final architectural note: this "mastermind + AI developer" model means our architecture document is effectively a **build specification**. Every decision we're committing needs to be precise enough that an AI agent can implement it without coming back to ask clarifying questions. The decisions we've made today are at the right level of specificity for that. tRPC confirmed. All 11 decisions finalized.
