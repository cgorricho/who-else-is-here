---
date: '2026-03-01'
topic: 'NFR Assessment Expert Panel Review'
participants: [Murat (TEA), Winston (Architect), Mary (Analyst), Amelia (Developer)]
triggeredBy: 'TEA NFR Assessment workflow completion — user requested Party Mode review'
---

# Party Mode Transcript: NFR Assessment Expert Panel Review

**Date:** 2026-03-01
**Participants:** 🧪 Murat, 🏗️ Winston, 📊 Mary, 💻 Amelia
**Context:** Expert panel review of the completed NFR Assessment for Who Else Is Here, evaluating cross-domain risks, pre-implementation readiness, and assessment quality.

---

**Carlos:** c

---

🧪 **Murat**: Right. Let me frame what we're reviewing. This NFR assessment scored **19/29 on the ADR checklist — 66%**, which lands in the "significant gaps" range. But I want to be precise about what that number actually means.

The 19 PASS criteria are concentrated in **design-level categories**: testability (4/4), test data strategy (3/3), and QoS/QoE (4/4). These are the categories where architecture decisions directly determine the outcome — and the architecture is solid. tRPC, Zod, Drizzle, session-scoped data model — all PASS.

The 9 CONCERNS are concentrated in **operational categories**: disaster recovery (0/3), monitoring (1/4 with 1 N/A), scalability (2/4), deployability (2/3). These are categories that *require runtime infrastructure* — infrastructure that doesn't exist yet because we're pre-implementation.

So the real question for this panel is: **are the 6 pre-implementation actions sufficient, or did we miss something?**

---

🏗️ **Winston**: Murat's framing is correct. The architecture was designed to be simple and shippable — single VPS, PM2, Docker Compose. That was a deliberate trade-off for MVP. But the NFR assessment surfaced one finding that Winston considers a **genuine architectural oversight**, not just a missing operational concern:

**CDR-1: PM2 cluster mode + Socket.io without Redis adapter.**

This isn't a "nice to have" operational item. If we deploy PM2 in cluster mode — which we will, because a single Node.js process can't handle 500 concurrent WebSocket connections — then Socket.io broadcasts will silently fail across workers. Attendee A joins on worker 1, attendee B is connected to worker 2, and B never sees A appear. The core product feature breaks.

This needs to be in the architecture document as a **hard requirement**, not a recommendation. Redis must be in Docker Compose from day 1. The architecture document currently doesn't mention Redis at all.

---

📊 **Mary**: Winston's point is exactly where I'd focus too, but let me add the business lens. The PRD defines the core value proposition as: *"frictionless way to see who else is at a professional event."* If the real-time attendee list doesn't update reliably, the product has zero value. It's not a degraded experience — it's a broken product.

So CDR-1 isn't a medium-priority operational concern. From a business impact perspective, it's a **P0 blocker** that should be elevated.

But I want to raise something the assessment *didn't* flag. Looking at the 6 pre-implementation actions:

1. Socket.io auth middleware
2. PM2 + Redis adapter
3. Health endpoint
4. SIGTERM handler
5. CORS origins
6. ulimit config

Items 3-6 are legitimate but they're **implementation details**, not architecture decisions. They belong in Epic 1 stories, not as pre-implementation blockers. If we make the developer agent resolve all 6 before writing a single line of code, we're front-loading operational concerns that are better addressed during infrastructure setup.

My recommendation: **Promote #1 and #2 to architecture document updates. Demote #3-6 to Epic 1 story acceptance criteria.**

---

💻 **Amelia**: `+1` on Mary's demotion recommendation. From implementation perspective:

- Health endpoint → standard Express middleware, 15 lines, Epic 1 infrastructure story
- SIGTERM handler → `process.on('SIGTERM', ...)`, 20 lines, same story
- CORS origins → `cors({ origin: process.env.CORS_ORIGINS.split(',') })`, 1 line in Express setup
- ulimit → Dockerfile `CMD` or docker-compose `ulimits:` section, deployment config

These are trivial to implement. Blocking architecture review on them adds ceremony without value.

What I *do* need from architecture before I can implement: **the Redis adapter pattern**. Specifically:

1. Does Redis go in Docker Compose `dev` profile, `prod` profile, or both?
2. Is Redis used *only* for Socket.io adapter, or also for session store / caching?
3. What's the Redis connection string pattern — same env var convention as `DATABASE_URL`?

Winston, those 3 decisions need to be in the architecture doc.

---

🧪 **Murat**: Strong input all around. Let me synthesize what I'm hearing as assessment adjustments:

**Adjustment 1: Reclassify CDR-1 severity.** The assessment rated it HIGH impact but kept it as a "pre-implementation action." Mary and Winston are right — it's a **P0 architectural blocker**. The architecture document must be updated with Redis as a required service before epic/story creation begins.

**Adjustment 2: Reduce pre-implementation blockers from 6 to 2.** Only Socket.io auth middleware (#1) and PM2 + Redis adapter (#2) are true architecture decisions. The other 4 become Epic 1 acceptance criteria. This is cleaner and more honest about what actually blocks progress.

**Adjustment 3: Amelia's 3 Redis questions** need answers in the architecture doc. These are genuine decision points that a developer agent can't resolve autonomously.

One more thing I want to flag. The assessment identified **NFR5 "real-time sync"** as having an ambiguous threshold. Looking at the PRD, NFR5 says "real-time synchronization across all connected clients." That's not measurable. It needs a number — I'd recommend `<1s from server broadcast to all connected clients receiving the update`. This is a PRD fix, not an architecture fix.

---

🏗️ **Winston**: To answer Amelia's questions directly:

1. **Redis in both profiles.** Dev needs it for local WebSocket testing with PM2. Prod obviously needs it. Same service, different resource limits.
2. **Socket.io adapter only for MVP.** Don't add session store or caching scope — that's premature optimization. Single purpose: `createAdapter(pubClient, subClient)`.
3. **`REDIS_URL` env var**, same convention as `DATABASE_URL`. Default: `redis://localhost:6379` for dev, configurable for prod.

Those 3 decisions plus the Socket.io auth middleware pattern are what need to go into the architecture document. Everything else the developer agent can handle.

---

📊 **Mary**: One final observation. The assessment's **Gate YAML Snippet** shows `blockers: false`. After this discussion, that should change to `blockers: true` with a note that the architecture document requires Redis addition before proceeding to epic/story creation. The conditional pass becomes: *"CONDITIONAL PASS — update architecture document with Redis requirement and Socket.io auth pattern, then proceed."*

---

🧪 **Murat**: Agreed. Let me summarize the panel's consensus findings:

### Panel Consensus

| # | Finding | Action | Owner |
|---|---|---|---|
| 1 | CDR-1 elevated to P0 architectural blocker | Add Redis to architecture doc (Docker Compose, env vars, Socket.io adapter pattern) | Architect |
| 2 | Socket.io auth middleware is architecture decision | Document JWT verification on WebSocket handshake in architecture doc | Architect |
| 3 | Pre-implementation blockers reduced 6→2 | Demote health endpoint, SIGTERM, CORS, ulimit to Epic 1 stories | Assessment update |
| 4 | NFR5 needs measurable threshold | Change "real-time sync" to "<1s broadcast-to-client" in PRD | PM/Analyst |
| 5 | Gate status updated | `blockers: true` until architecture doc updated with Redis | Assessment update |
| 6 | Winston's 3 Redis decisions | Document in architecture: both profiles, adapter-only, REDIS_URL | Architect |

**Assessment quality verdict:** Thorough and well-structured. The parallel subprocess approach covered all 4 domains effectively. Cross-domain risk analysis was the most valuable section — it caught CDR-1 which is genuinely critical. The operational items (health, SIGTERM, backups) were correctly identified but over-classified as pre-implementation blockers.

**Revised recommendation:** Update architecture document with Redis + Socket.io auth, fix NFR5 in PRD, then proceed to BMAD Create Epics & Stories.

---

**Carlos:** e
