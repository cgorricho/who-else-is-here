---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/epics.md'
workflowType: 'research'
lastStep: 2
research_type: 'technical'
research_topic: 'LinkedIn OAuth API, WebSocket deployment patterns, QR code libraries'
research_goals: 'Verify Architecture assumptions, de-risk Stories 1.2/2.3/4.1, pin down exact scopes/payloads/library choices'
user_name: 'Carlos'
date: '2026-03-04'
web_research_enabled: true
source_verification: true
---

# Technical Research Report: LinkedIn OAuth, WebSocket, & QR Code Libraries

**Date:** 2026-03-04
**Author:** Carlos
**Research Type:** Technical
**Context:** Pre-implementation research to verify Architecture assumptions and de-risk high-risk stories for the "Who Else Is Here" event networking application.

---

## Research Overview

This research was triggered by a Party Mode expert panel review (2026-03-04) that identified three technical areas where Architecture assumptions needed verification before AI coding agents begin implementation. The panel specifically flagged:

1. **LinkedIn OAuth API** — scopes, payloads, and recent breaking changes
2. **WebSocket deployment patterns** — library choice and Vercel/Docker constraints
3. **QR code libraries** — print-ready generation with text labels

**Methodology:** Live web research against official documentation (Microsoft Learn / LinkedIn Developer), npm registries, community discussions, and verified technical blogs. All claims cross-referenced against multiple sources.

---

## Technical Research Scope Confirmation

**Research Topic:** LinkedIn OAuth API, WebSocket deployment patterns, QR code libraries
**Research Goals:** Verify Architecture assumptions, de-risk Stories 1.2/2.3/4.1, pin down exact scopes/payloads/library choices

**Technical Research Scope:**

- Architecture Analysis - design patterns, frameworks, system architecture
- Implementation Approaches - development methodologies, coding patterns
- Technology Stack - languages, frameworks, tools, platforms
- Integration Patterns - APIs, protocols, interoperability
- Performance Considerations - scalability, optimization, patterns

**Research Methodology:**

- Current web data with rigorous source verification
- Multi-source validation for critical technical claims
- Confidence level framework for uncertain information
- Comprehensive technical coverage with architecture-specific insights

**Scope Confirmed:** 2026-03-04

---

## Technology Stack Analysis

### Area 1: LinkedIn OAuth API

#### 1.1 CRITICAL FINDING: Deprecated Scopes

**Impact: HIGH — Architecture and database schema changes required**

Our Architecture document references `r_liteprofile` and `r_emailaddress` OAuth scopes. These are **DEPRECATED** as of August 1, 2023 and will return `unauthorized_scope_error` for all new LinkedIn developer applications.

**Old scopes (DEPRECATED — do NOT use):**
- `r_liteprofile` — ❌ Rejected by LinkedIn
- `r_emailaddress` — ❌ Rejected by LinkedIn

**New scopes (REQUIRED):**
- `openid` — Required for OIDC authentication, returns ID Token (JWT)
- `profile` — Returns member's name, headline, and photo
- `email` — Returns member's primary email address

_Source: [LinkedIn scopes deprecated - Strapi GitHub Issue](https://github.com/strapi/strapi/issues/19641)_
_Source: [Auth0 Community - LinkedIn login deprecated](https://community.auth0.com/t/the-linkedin-login-is-deprecated-updating-to-the-new-scopes-is-necessary/113696)_
_Source: [LinkedIn OpenID Connect Official Docs](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2)_

**Confidence: VERIFIED** — Confirmed against LinkedIn's official Microsoft Learn documentation (updated 2024-08-08) and LinkedIn's OIDC discovery document.

#### 1.2 CRITICAL FINDING: Title and Company Are NOT Separate Fields

**Impact: HIGH — FR2, database schema, and UI component changes required**

Our PRD (FR2) specifies: _"Attendee can authenticate via LinkedIn OAuth, providing name, photo, title, and company."_

Our `attendees` table has separate `title` and `company` columns.

**Reality:** LinkedIn's self-serve "Sign In with LinkedIn using OpenID Connect" product provides:

| Field | Available Via | Notes |
|-------|-------------|-------|
| `given_name` | OIDC userinfo (`/v2/userinfo`) | First name |
| `family_name` | OIDC userinfo (`/v2/userinfo`) | Last name |
| `name` | OIDC userinfo (`/v2/userinfo`) | Full display name |
| `picture` | OIDC userinfo (`/v2/userinfo`) | Profile photo URL |
| `email` | OIDC userinfo (`/v2/userinfo`) | **Optional** — may be absent |
| `headline` | REST API (`/v2/me`) | Combined string, e.g., "CFO at RUMC" |
| `vanityName` | REST API (`/v2/me`) | LinkedIn URL slug: `linkedin.com/in/{vanityName}` |
| `profilePicture` | REST API (`/v2/me`) | Profile photo with multiple sizes |

**What is NOT available (requires LinkedIn Partner Program approval):**
- Separate `title` field
- Separate `company` field
- Position history
- Company details
- Connections

The `headline` field is a **user-controlled free-text string** (max 220 characters). Common formats include:
- "CFO at RUMC" (title at company)
- "Product Manager | Google — Helping teams ship faster"
- "Retired | Board Member | Angel Investor"
- "Looking for my next opportunity"

**Parsing headline into separate title/company is unreliable** — there is no guaranteed format.

_Source: [LinkedIn Sign In with OIDC - Official](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2)_
_Source: [LinkedIn Getting Access - Open Permissions](https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access)_
_Source: [LinkedIn Basic Profile Fields Reference](https://learn.microsoft.com/en-us/linkedin/shared/references/v2/profile/basic-profile)_

**Confidence: VERIFIED** — Confirmed against three separate official LinkedIn documentation pages.

**Recommended Architecture Change:**
- Replace `title` and `company` columns in `attendees` table with a single `headline` column (VARCHAR 255)
- Update AttendeeCard component to display headline as a single line instead of "Title • Company"
- Update FR2 wording to reflect "name, photo, headline" instead of "name, photo, title, and company"
- Use `vanityName` to construct LinkedIn profile URL (`https://linkedin.com/in/{vanityName}`) instead of storing a separate profile URL

#### 1.3 OAuth Flow: Complete Technical Specification

**Product Required:** "Sign In with LinkedIn using OpenID Connect" (self-serve, available in Developer Portal)

**OIDC Discovery Document:** `https://www.linkedin.com/oauth/.well-known/openid-configuration`

```json
{
    "issuer": "https://www.linkedin.com",
    "authorization_endpoint": "https://www.linkedin.com/oauth/v2/authorization",
    "token_endpoint": "https://www.linkedin.com/oauth/v2/accessToken",
    "userinfo_endpoint": "https://api.linkedin.com/v2/userinfo",
    "jwks_uri": "https://www.linkedin.com/oauth/openid/jwks",
    "response_types_supported": ["code"],
    "subject_types_supported": ["pairwise"],
    "id_token_signing_alg_values_supported": ["RS256"],
    "scopes_supported": ["openid", "profile", "email"],
    "claims_supported": [
        "iss", "aud", "iat", "exp", "sub",
        "name", "given_name", "family_name",
        "picture", "email", "email_verified", "locale"
    ]
}
```

**Step-by-step flow:**

**Step 1: Authorization Request**
```
GET https://www.linkedin.com/oauth/v2/authorization
  ?response_type=code
  &client_id={CLIENT_ID}
  &redirect_uri={REDIRECT_URI}  // Must be HTTPS, absolute, registered in Developer Portal
  &state={CSRF_TOKEN}           // Random, hard-to-guess string
  &scope=openid%20profile%20email
```

**Step 2: User authorizes → LinkedIn redirects to callback**
```
GET {REDIRECT_URI}?code={AUTHORIZATION_CODE}&state={CSRF_TOKEN}
```
- Authorization code expires in **30 minutes**
- Validate `state` matches original to prevent CSRF

**Error cases on callback:**
- `error=user_cancelled_login` — user declined to log in
- `error=user_cancelled_authorize` — user refused permissions

**Step 3: Exchange authorization code for tokens**
```
POST https://www.linkedin.com/oauth/v2/accessToken
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code={AUTHORIZATION_CODE}
&client_id={CLIENT_ID}
&client_secret={CLIENT_SECRET}
&redirect_uri={REDIRECT_URI}
```

**Token response:**
```json
{
    "access_token": "AQUvlL_DYEzvT2wz1QJiEPeLioeA",
    "expires_in": 5184000,
    "scope": "openid profile email",
    "token_type": "Bearer",
    "id_token": "eyJ...JWT..."
}
```

- `access_token`: ~500 characters (plan for 1000+). **60-day TTL.**
- `id_token`: JWT containing OIDC claims (sub, name, given_name, family_name, picture, email, email_verified)
- `refresh_token`: **NOT available** for self-serve "Sign In with LinkedIn" product (partner-only feature)

**Step 4: Retrieve profile data (two calls)**

**Call A — OIDC Userinfo (basic identity):**
```
GET https://api.linkedin.com/v2/userinfo
Authorization: Bearer {ACCESS_TOKEN}
```
Response:
```json
{
    "sub": "782bbtaQ",
    "name": "John Doe",
    "given_name": "John",
    "family_name": "Doe",
    "picture": "https://media.licdn-ei.com/dms/image/.../profile-displayphoto-shrink_100_100/0/",
    "locale": "en-US",
    "email": "doe@email.com",
    "email_verified": true
}
```
Note: `email` and `email_verified` are **optional** and may be absent.

**Call B — REST Profile API (headline + vanityName):**
```
GET https://api.linkedin.com/v2/me
Authorization: Bearer {ACCESS_TOKEN}
```
Response includes: `id`, `firstName`, `lastName`, `headline`, `localizedHeadline`, `profilePicture`, `vanityName`

_Source: [LinkedIn 3-Legged OAuth Flow](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow)_
_Source: [LinkedIn Sign In with OIDC](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2)_
_Source: [3-Step Guide to LinkedIn OpenID 2025](https://dev.to/lovestaco/3-step-guide-to-add-linkedin-openid-sign-in-to-your-app-2025-edition-1mjh)_

**Confidence: VERIFIED** — Confirmed against official documentation updated November 2025.

#### 1.4 Token Lifecycle & Refresh Strategy

| Token | TTL | Refresh Available? |
|-------|-----|-------------------|
| Access token | 60 days (5,184,000 seconds) | Only via re-authorization flow |
| Refresh token | 365 days | **NOT available** for self-serve product |
| Authorization code | 30 minutes | N/A — single use |

**Impact on Architecture:**
- For a 1-3 day event + 5-day post-event window = **max 8 days**. The 60-day access token is more than sufficient.
- No need for programmatic refresh tokens — the token will not expire during the event lifecycle.
- Store `access_token` server-side, associated with the HTTP session cookie.
- If token is somehow revoked, fall back to re-authorization flow (redirect to LinkedIn again).

_Source: [LinkedIn Programmatic Refresh Tokens](https://learn.microsoft.com/en-us/linkedin/shared/authentication/programmatic-refresh-tokens)_

**Confidence: VERIFIED**

#### 1.5 Rate Limits

LinkedIn's rate limiting is **opaque** — exact numbers per endpoint are not publicly documented for the Sign In product. Key constraints:

- Per-user and per-application limits exist
- High QPS (queries per second) burst patterns will trigger throttling
- Exceeding limits returns HTTP 429 "Too Many Requests"
- Recovery: exponential backoff with random jitter
- Developer Portal shows current usage under "Usage & Limits"

**Impact on Architecture:**
- Our use case (single OAuth call per attendee + single profile fetch) is extremely low-volume
- Even at 500 attendees joining simultaneously, the calls are spread across different user sessions
- Rate limiting is **not a risk** for this application pattern

_Source: [LinkedIn API Rate Limiting](https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/rate-limits)_

**Confidence: HIGH** — Rate limit structure confirmed, exact numbers not published.

#### 1.6 Redirect URI Requirements

- Must be **HTTPS** (no HTTP, even for development — use localhost with HTTPS or tunneling)
- Must be **absolute** (no relative paths)
- Must be **pre-registered** in LinkedIn Developer Portal under Auth tab
- Query parameters are **ignored** when matching
- Fragment identifiers (#) are **not allowed**

_Source: [LinkedIn 3-Legged OAuth Flow](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow)_

**Confidence: VERIFIED**

---

### Area 2: WebSocket Deployment Patterns

#### 2.1 CRITICAL FINDING: Vercel Does NOT Support WebSocket

**Impact: HIGH — Deployment strategy confirmation required**

Vercel's serverless architecture does not support persistent WebSocket connections. This was confirmed from multiple sources:

- Socket.IO official docs: _"You won't be able to deploy your application on Vercel, as it does not support WebSocket connections."_
- Vercel community feature requests confirm this is an ongoing limitation
- A **Rivet for Vercel Functions** solution emerged in 2025, but it's a new/experimental actor-model approach, not standard WebSocket

**Our Architecture already specifies Docker deployment**, so this is a **confirmation, not a change**. But it must be explicit in the Architecture to prevent an AI agent from attempting Vercel deployment.

_Source: [Socket.IO + Next.js Guide](https://socket.io/how-to/use-with-nextjs)_
_Source: [Rivet WebSocket on Vercel](https://www.rivet.dev/blog/2025-10-20-how-we-built-websocket-servers-for-vercel-functions/)_
_Source: [Vercel Feature Request - WebSocket](https://community.vercel.com/t/feature-request-native-websocket-support-for-next-js-applications-on-vercel/32017)_

**Confidence: VERIFIED**

#### 2.2 Library Recommendation: `ws` (Not Socket.IO)

| Feature | `ws` | Socket.IO |
|---------|------|-----------|
| Size | ~30 KB | ~300+ KB (with client) |
| Protocol | Standard WebSocket | Custom protocol over WebSocket |
| Auto-reconnect | No (client-side library needed) | Built-in |
| Rooms/channels | No (implement manually) | Built-in |
| Fallback transports | No (WebSocket only) | Yes (long-polling, etc.) |
| Performance | Highest — minimal overhead | Good — but protocol overhead |
| Browser support | Native WebSocket API | Broader (fallback transports) |

**Recommendation: `ws` on the server, `reconnecting-websocket` on the client.**

Rationale:
- Our target browsers all support WebSocket natively (Chrome 80+, Safari 14+, Samsung Internet 13+, Firefox 78+)
- No need for fallback transports — WebSocket is universally supported on our target matrix
- `ws` gives maximum performance and control for our broadcast pattern
- `reconnecting-websocket` (npm) handles client-side auto-reconnect with exponential backoff
- Socket.IO's rooms feature could simplify session-scoped broadcasting, but we can implement session-scoped channels with a simple Map

_Source: [ws npm package](https://www.npmjs.com/package/ws)_
_Source: [ws GitHub](https://github.com/websockets/ws)_
_Source: [WebSocket libraries for Node comparison - Ably](https://ably.com/blog/websocket-libraries-for-node)_
_Source: [reconnecting-websocket npm](https://www.npmjs.com/package/reconnecting-websocket)_

**Confidence: HIGH**

#### 2.3 Custom Server Pattern for Next.js + ws

**Architecture pattern:**

```
server.js (entry point)
├── Next.js app (HTTP handler)
├── WebSocket server (ws, noServer: true)
└── HTTP server (createServer)
    ├── Routes HTTP → Next.js
    └── Handles 'upgrade' → WebSocket server
```

**Key implementation details:**
- Use `noServer: true` for WebSocketServer — allows routing upgrade requests by pathname
- Handle the `'upgrade'` event on the HTTP server to route `/ws` paths to WebSocket
- Production: `NODE_ENV=production node server.js`
- Dev: `node server.js` (not `next dev`)
- `package.json` scripts: `"dev": "node server.js"`, `"build": "next build"`, `"start": "NODE_ENV=production node server.js"`

**Docker deployment:**
- `Dockerfile` runs `node server.js` as entrypoint
- Expose the single HTTP port (handles both HTTP and WebSocket upgrade)
- Nginx reverse proxy passes `Upgrade` and `Connection` headers for WebSocket

_Source: [WebSocket with Next.js - DEV Community](https://dev.to/addwebsolutionpvtltd/websocket-implementation-with-nextjs-nodejs-react-in-one-app-gb6)_
_Source: [WebSockets with Next.js on Fly.io](https://fly.io/javascript-journal/websockets-with-nextjs/)_

**Confidence: HIGH**

#### 2.4 WebSocket Message Protocol (Proposed)

Based on our FR requirements, the WebSocket protocol should define these message types:

**Server → Client messages:**
```typescript
// New attendee joined the session
type NewAttendeeMessage = {
  type: 'attendee_joined';
  sessionId: string;
  attendee: {
    id: string;
    name: string;
    headline: string;  // Changed from title+company
    photoUrl: string;
    linkedinVanityName: string;
    joinedAt: string;  // ISO 8601
  };
};

// Attendee count update
type CountUpdateMessage = {
  type: 'count_update';
  sessionId: string;
  count: number;
};

// Missed updates (sent on reconnection)
type MissedUpdatesMessage = {
  type: 'missed_updates';
  sessionId: string;
  attendees: Array<NewAttendeeMessage['attendee']>;
  currentCount: number;
};
```

**Client → Server messages:**
```typescript
// Subscribe to a session's updates
type SubscribeMessage = {
  type: 'subscribe';
  sessionId: string;
  lastKnownCount: number;  // For missed update detection
};
```

#### 2.5 Reconnection State Machine (Proposed)

Per FR54: exponential backoff (initial 1s, max 30s), 60s timeout before offline fallback.

```
CONNECTED → (connection drops) → RECONNECTING
RECONNECTING → (backoff: 1s, 2s, 4s, 8s, 16s, 30s, 30s, ...) → CONNECTED (with missed_updates)
RECONNECTING → (60s total elapsed) → OFFLINE
OFFLINE → (connectivity restored) → RECONNECTING → CONNECTED (with missed_updates)
```

The `reconnecting-websocket` library handles the backoff automatically. On reconnection, the client sends a `subscribe` message with `lastKnownCount`, and the server responds with any missed attendees.

#### 2.6 Scaling Pattern

For 500 concurrent connections per event (NFR18):
- Single Node.js process can handle 500 WebSocket connections easily (tested up to 40K+ in production by community members)
- **For multi-instance scaling** (future): Redis Pub/Sub for cross-instance broadcasting
- MVP: Single process is sufficient. Redis Pub/Sub is a post-pilot optimization.

_Source: [Scaling 40K WebSocket connections](https://khelechy.medium.com/how-i-scaled-a-legacy-nodejs-application-handling-over-40k-active-long-lived-websocket-connections-aa11b43e0db0)_

**Confidence: HIGH**

---

### Area 3: QR Code Libraries

#### 3.1 Library Evaluation

| Library | Output Formats | Text Labels | Print-Ready | Weekly Downloads | Notes |
|---------|---------------|-------------|-------------|-----------------|-------|
| `qrcode` (node-qrcode) | PNG, SVG, UTF8 | No built-in | SVG scales infinitely | ~2.5M | Most popular, well-maintained |
| `qrcode-svg` | SVG only | No built-in | Excellent (vector) | ~200K | Pure SVG, crisp rendering |
| `EasyQRCodeJS-NodeJS` | PNG, JPEG, SVG, Base64 | **Yes — built-in title** | Good | ~30K | Built-in title, logo, styling |
| `bwip-js` | PNG, SVG | No built-in | Good (DPI support) | ~500K | Broader barcode support |
| `qr-code-styling` | PNG, SVG | No built-in | Good | ~150K | Styling focus, eye shapes |

#### 3.2 Recommendation: `qrcode` + `sharp` for Print Signage

**For QR code generation:** `qrcode` (node-qrcode) — most popular, well-tested, SVG output

**For print-ready signage composition:** `sharp` — already likely in our stack for image processing, can compose QR code SVG with text labels (session name, room, URL)

**Print signage workflow (FR30):**
1. Generate QR code as SVG using `qrcode` library (encodes session URL)
2. Compose print-ready image using `sharp`:
   - QR code graphic (center)
   - Session name (above QR)
   - Room number/location (below QR)
   - Short URL as visible text (below room)
3. Output as high-DPI PNG (300 DPI for print) or PDF

**Alternative:** `EasyQRCodeJS-NodeJS` has built-in title support but lower adoption. Using `qrcode` + `sharp` keeps us on well-maintained, high-download libraries.

_Source: [node-qrcode npm](https://www.npmjs.com/package/qrcode)_
_Source: [node-qrcode GitHub](https://github.com/soldair/node-qrcode)_
_Source: [EasyQRCodeJS-NodeJS GitHub](https://github.com/ushelp/EasyQRCodeJS-NodeJS)_
_Source: [qrcode-svg npm](https://www.npmjs.com/package/qrcode-svg)_

**Confidence: HIGH**

---

## Architecture Impact Summary

### Critical Changes Required (Before Implementation)

| # | Finding | Impact | Affected Artifacts |
|---|---------|--------|-------------------|
| 1 | LinkedIn scopes deprecated (`r_liteprofile` → `openid profile email`) | Architecture OAuth section needs rewrite | Architecture, Stories 1.2, 4.1 |
| 2 | Title/Company not available as separate fields — only `headline` | Database schema change (`title` + `company` → `headline`), UI component change, FR2 wording | Architecture, PRD, Epics, UX Spec |
| 3 | `vanityName` available for LinkedIn URL construction | Simplifies LinkedIn profile linking (FR16) | Architecture, Story 1.3 |
| 4 | No refresh tokens for self-serve product | Architecture should note 60-day token is sufficient for event lifecycle | Architecture |
| 5 | Vercel cannot host WebSocket — Docker confirmed | Architecture should explicitly prohibit Vercel deployment | Architecture |

### Library Decisions (New)

| Purpose | Library | npm Package | Rationale |
|---------|---------|-------------|-----------|
| WebSocket server | ws | `ws` | Lightweight, performant, standard WebSocket |
| WebSocket client reconnect | reconnecting-websocket | `reconnecting-websocket` | Auto-reconnect with exponential backoff |
| QR code generation | node-qrcode | `qrcode` | Most popular, SVG output, well-maintained |
| Image composition (signage) | sharp | `sharp` | High-performance, print-ready PNG/PDF output |

### Existing Assumptions Confirmed

| Assumption | Status |
|-----------|--------|
| Docker deployment | ✅ Confirmed — required for WebSocket |
| Next.js custom server | ✅ Confirmed — needed for ws integration |
| PostgreSQL + Drizzle ORM | ✅ No impact from research |
| tRPC + Zod | ✅ No impact from research |
| Tailwind v4 | ✅ No impact from research |
| 500 concurrent connections | ✅ Single Node.js process is sufficient |

---

## Integration Patterns Analysis

### 3.1 SIGNIFICANT FINDING: Auth.js (NextAuth.js) for LinkedIn OIDC

**Impact: MEDIUM-HIGH — Simplifies OAuth implementation significantly, reduces AI agent drift risk**

Our Architecture currently implies a custom OAuth implementation. Research reveals that **Auth.js v5** (formerly NextAuth.js) has built-in LinkedIn OIDC support that would eliminate most custom OAuth code.

**Auth.js advantages for our project:**
- Built-in LinkedIn provider with OIDC support (scopes: `openid`, `profile`, `email`)
- Automatic session cookie management (HttpOnly, Secure, SameSite flags handled)
- CSRF protection built-in
- Token storage and lifecycle management
- Works with App Router (`app/api/auth/[...nextauth]/route.ts`)
- Middleware for route protection
- Well-documented, widely used (~2M weekly npm downloads)

**Custom OAuth disadvantages:**
- 3-6 months of development for enterprise-grade (per Clerk analysis)
- AI coding agents must implement CSRF protection, cookie management, token storage manually
- Higher risk of security vulnerabilities
- More code = more drift surface for AI agents

**Auth.js LinkedIn configuration pattern:**
```typescript
// auth.ts
import NextAuth from "next-auth"
import LinkedIn from "next-auth/providers/linkedin"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      // OIDC scopes automatically configured
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Extract headline + vanityName from profile
      if (profile) {
        token.headline = profile.headline
        token.vanityName = profile.vanityName
        token.picture = profile.picture
      }
      return token
    }
  }
})
```

**Key consideration:** Auth.js handles the userinfo endpoint automatically, but we ALSO need to call `/v2/me` to get `headline` and `vanityName` (not included in OIDC userinfo). This requires a custom profile callback in the LinkedIn provider configuration.

**Recommendation:** Use Auth.js for the OAuth flow + session management. Customize the profile callback to fetch `/v2/me` for headline and vanityName. This gives us secure-by-default authentication with minimal custom code.

_Source: [Auth.js NextAuth LinkedIn Provider](https://next-auth.js.org/providers/linkedin)_
_Source: [NextAuth LinkedIn OIDC Issue #8316](https://github.com/nextauthjs/next-auth/issues/8316)_
_Source: [Auth.js v5 Migration Guide](https://authjs.dev/getting-started/migrating-to-v5)_
_Source: [Auth.js Configuring OAuth Providers](https://authjs.dev/guides/configuring-oauth-providers)_

**Confidence: HIGH**

### 3.2 SIGNIFICANT FINDING: tRPC SSE Subscriptions as WebSocket Alternative

**Impact: MEDIUM-HIGH — Simpler real-time architecture with type-safety**

Our Architecture specifies WebSocket for real-time attendee list updates. Research reveals that **tRPC v11 supports Server-Sent Events (SSE) subscriptions** — a potentially better fit for our use case.

**Our real-time communication pattern:**
- **Server → Client** (95% of traffic): New attendee joined, count update, missed updates
- **Client → Server** (5%): Subscribe to session (could be a regular tRPC mutation/query)

SSE is **unidirectional** (server → client only) — which matches our pattern exactly.

**SSE via tRPC vs Raw WebSocket comparison:**

| Feature | tRPC SSE Subscriptions | Raw ws WebSocket |
|---------|----------------------|-----------------|
| Type safety | ✅ End-to-end Zod validation | ❌ Manual protocol definition |
| Server setup | ✅ Standard HTTP (no custom server for SSE) | ❌ Custom server.js required |
| Reconnection | ✅ Built-in `tracked()` with last-event-ID | ❌ Manual with `reconnecting-websocket` |
| Missed updates | ✅ Automatic via EventSource `lastEventId` | ❌ Manual implementation required |
| Vercel compatible | ✅ Yes (standard HTTP) | ❌ No |
| Bidirectional | ❌ Server→Client only | ✅ Both directions |
| Protocol overhead | Medium (HTTP headers per event) | Low (binary frames) |
| Latency | ~same for our volume | ~same for our volume |
| Browser support | ✅ All target browsers | ✅ All target browsers |
| tRPC integration | ✅ Native (splitLink) | ⚠️ Requires wsLink + separate adapter |

**tRPC SSE subscription pattern:**
```typescript
// server: attendeeRouter.ts
export const attendeeRouter = router({
  onNewAttendee: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .subscription(async function* ({ input, ctx }) {
      // Yield existing attendees on connect
      const existing = await getSessionAttendees(input.sessionId);
      for (const attendee of existing) {
        yield tracked(attendee.id, attendee);
      }
      // Listen for new attendees
      for await (const attendee of attendeeEventIterator(input.sessionId)) {
        yield tracked(attendee.id, attendee);
      }
    }),
});

// client: uses httpSubscriptionLink via splitLink
// Automatic reconnection, type-safe, Zod-validated
```

**Key advantages for AI agent implementation:**
1. **No separate WebSocket protocol to define** — tRPC subscription input/output is Zod-validated, eliminating the wire format ambiguity the Party Mode panel flagged
2. **No custom server.js for SSE** — SSE works over standard HTTP. However, we still need custom server for Docker deployment, so this is a minor benefit
3. **Built-in missed update recovery** — the `tracked()` helper with event IDs means the browser's native EventSource handles reconnection and replays automatically (FR54)
4. **Less code for AI agents to write** — subscriptions are just another tRPC procedure

**Tradeoff:** If we later need bidirectional real-time (e.g., typing indicators, chat), SSE won't suffice and we'd need to add WebSocket. For our current requirements, SSE is sufficient.

**Important note on Docker deployment:** Even with SSE (which doesn't require a custom server for the real-time part), we still need a Docker deployment for production (self-hosted, no Vercel dependency). The custom `server.js` remains for Docker but is simpler without WebSocket upgrade handling.

_Source: [tRPC Subscriptions Docs](https://trpc.io/docs/server/subscriptions)_
_Source: [tRPC v11 Announcement](https://trpc.io/blog/announcing-trpc-v11)_
_Source: [tRPC SSE Chat Example](https://github.com/trpc/examples-next-sse-chat)_
_Source: [SSE vs WebSocket comparison - Ably](https://ably.com/blog/websockets-vs-sse)_
_Source: [SSE vs WebSocket scalability - freeCodeCamp](https://www.freecodecamp.org/news/server-sent-events-vs-websockets/)_

**Confidence: HIGH**

### 3.3 Session Cookie Specification for Frictionless Session Hop

Per FR55, attendees who scan a QR code for a different session within the same event should bypass re-authentication using the existing HTTP session cookie.

**Cookie specification (whether using Auth.js or custom):**

| Attribute | Value | Rationale |
|-----------|-------|-----------|
| Name | `__session` (or Auth.js default: `authjs.session-token`) | Standard naming |
| HttpOnly | `true` | Prevent XSS access to session token |
| Secure | `true` (production), `false` (dev localhost) | HTTPS-only in production |
| SameSite | `lax` | Allow cookie on same-site navigation (QR scan opens same domain) |
| Path | `/` | Available across all routes |
| Domain | `.yourdomain.com` | Shared across subdomains if needed |
| Max-Age | `5184000` (60 days) | Match LinkedIn token TTL |

**Why `SameSite=lax` (not `strict`):**
- QR code scan opens a URL in the browser (top-level navigation)
- `strict` would NOT send the cookie on the first navigation from QR scan (cross-site context)
- `lax` sends cookies on top-level navigations (GET requests), which is exactly our QR scan flow

**Frictionless session hop flow:**
1. Attendee scans Session A QR code → browser opens `yourdomain.com/event/rumc/session/room1`
2. Auth.js/custom middleware checks for session cookie → not found → redirect to LinkedIn OAuth
3. After OAuth, session cookie is set with attendee profile data
4. Later, attendee scans Session B QR code → browser opens `yourdomain.com/event/rumc/session/room2`
5. Auth.js/custom middleware checks for session cookie → **FOUND** → skip OAuth
6. Server creates attendee record in Session B using cached profile from cookie/session store
7. Server records `session_switch` journey event (FR50b)

_Source: [Next.js Cookie Security - Medium](https://medium.com/@itself_tools/enhancing-web-security-with-secure-cookie-attributes-in-next-js-b389b9e49e6e)_
_Source: [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication)_
_Source: [Next.js Cookies API](https://nextjs.org/docs/app/api-reference/functions/cookies)_

**Confidence: HIGH**

### 3.4 Nginx Reverse Proxy Configuration

**For Docker production deployment with WebSocket (or SSE):**

```nginx
# /etc/nginx/conf.d/who-else-is-here.conf
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

upstream nextjs_app {
    server app:3000;  # Docker service name
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate     /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    location / {
        proxy_pass http://nextjs_app;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support (also needed for SSE keep-alive)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        # Prevent premature timeout for long-lived connections
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
        proxy_buffering off;  # Critical for SSE streaming
    }
}
```

**Key configuration points:**
- `proxy_buffering off` — **critical for SSE** (Nginx buffers by default, which delays streamed events)
- `proxy_read_timeout 86400s` — 24 hours, prevents Nginx from closing idle WebSocket/SSE connections
- `map $http_upgrade` — handles WebSocket upgrade requests gracefully
- HTTPS termination at Nginx, unencrypted proxy to Next.js app container

_Source: [Nginx WebSocket Proxying](https://nginx.org/en/docs/http/websocket.html)_
_Source: [Nginx WebSocket Configuration Guide](https://websocket.org/guides/infrastructure/nginx/)_
_Source: [NGINX as a WebSocket Proxy - F5](https://www.f5.com/company/blog/nginx/websocket-nginx)_
_Source: [Nginx WebSocket Reverse Proxy - OneUptime](https://oneuptime.com/blog/post/2026-01-24-websocket-nginx-reverse-proxy/view)_

**Confidence: VERIFIED**

### 3.5 Integration Security Patterns

**OAuth 2.0 + OIDC Security (LinkedIn):**
- CSRF protection: `state` parameter on authorization request (Auth.js handles automatically)
- Authorization code: single-use, 30-minute expiry
- Client secret: server-side only, never exposed to browser
- ID Token validation: verify `iss`, `aud`, `exp` claims against JWKS endpoint
- JWKS URI: `https://www.linkedin.com/oauth/openid/jwks` for RS256 signature verification

**Session Security:**
- HttpOnly cookies prevent XSS token theft
- SameSite=lax prevents CSRF while allowing QR scan navigation
- Secure flag enforces HTTPS-only transmission
- Session data stored server-side (database or encrypted JWT), only session ID in cookie

**API Security (tRPC):**
- tRPC procedures can check session via context (`ctx.session`)
- Admin routes protected by role check in tRPC middleware
- All tRPC calls over HTTPS (Nginx TLS termination)
- Input validation via Zod schemas on every procedure

---

## Integration Patterns Impact Summary

### New Architectural Recommendations

| # | Recommendation | Impact | Decision Required |
|---|---------------|--------|-------------------|
| 6 | Use **Auth.js v5** for LinkedIn OIDC instead of custom OAuth | Eliminates ~500 lines of custom auth code, reduces AI agent drift | Yes — Architecture change |
| 7 | Consider **tRPC SSE subscriptions** instead of raw WebSocket | Type-safe real-time, built-in reconnection, simpler server | Yes — Architecture change |
| 8 | **SameSite=lax** for session cookie (not strict) | Required for QR scan navigation to carry cookies | Yes — Cookie spec |
| 9 | **Nginx config** with `proxy_buffering off` and 24h timeout | Required for SSE/WebSocket streaming | Document in Architecture |
| 10 | Custom **profile callback** in Auth.js to fetch `/v2/me` | Required to get `headline` and `vanityName` beyond OIDC userinfo | Implementation detail |

---

## Architectural Decisions Synthesis

This section consolidates all research findings into architectural decisions for the Party Mode review panel.

### Decision 1: LinkedIn OAuth Implementation Strategy

**Current Architecture:** Custom OAuth 2.0 implementation with `r_liteprofile` scope
**Recommended:** Auth.js v5 with LinkedIn OIDC provider + custom profile callback

**Rationale:**
- `r_liteprofile` is deprecated — must use OIDC scopes (`openid`, `profile`, `email`)
- Auth.js handles the entire OAuth flow, session management, CSRF protection, and cookie lifecycle
- Custom profile callback fetches `/v2/me` for `headline` and `vanityName`
- Reduces ~500 lines of custom auth code → ~50 lines of Auth.js configuration
- Dramatically reduces AI agent drift risk — Auth.js is well-documented, widely used, battle-tested

**Auth.js profile callback pattern for headline + vanityName:**
```typescript
// The profile callback receives the OIDC profile + tokens
// We make an additional call to /v2/me for headline and vanityName
LinkedIn({
  clientId: env.LINKEDIN_CLIENT_ID,
  clientSecret: env.LINKEDIN_CLIENT_SECRET,
  async profile(profile, tokens) {
    // profile contains OIDC fields: sub, name, given_name, family_name, picture, email
    // Fetch additional fields from REST API
    const meResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const me = await meResponse.json();
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
      headline: me.localizedHeadline ?? '',
      vanityName: me.vanityName ?? '',
    };
  },
})
```

_Source: [Auth.js LinkedIn Provider](https://authjs.dev/getting-started/providers/linkedin)_
_Source: [Auth.js Custom Profile Callback](https://authjs.dev/guides/configuring-oauth-providers)_
_Source: [NextAuth LinkedIn OIDC Fix Guide](https://dev.to/shubham_bhilare_3611/how-to-fix-linkedin-authentication-in-nextauthjs-a-custom-provider-setup-guide-5g8f)_

**Confidence: HIGH**

### Decision 2: Real-Time Communication Pattern

**Current Architecture:** WebSocket (unspecified library)
**Recommended:** tRPC v11 SSE subscriptions via `httpSubscriptionLink`

**Rationale:**
- Our traffic is 95% server→client (new attendees, count updates) — SSE is purpose-built for this
- tRPC subscriptions give us **Zod-validated, type-safe message shapes** — eliminates the "wire format ambiguity" the panel flagged as a drift risk
- `tracked()` helper with event IDs provides **automatic reconnection with missed update recovery** (FR54) — built into the browser's native EventSource spec
- No separate WebSocket protocol to define or implement
- Simpler server setup (no `server.js` WebSocket upgrade handling for the real-time part)
- Official tRPC SSE chat example demonstrates the exact pattern we need

**tRPC SSE reconnection flow (solves FR54 automatically):**
1. Client subscribes via `httpSubscriptionLink` → receives events with `tracked(id, data)`
2. Connection drops → browser's EventSource automatically reconnects
3. On reconnect, browser sends `Last-Event-ID` header → tRPC passes as `lastEventId` in input
4. Server yields only events after `lastEventId` → client catches up seamlessly
5. If 60s without reconnect → client falls back to offline mode (FR54)

**Note:** We still need Docker/custom server for production deployment, but the server.js is simpler without WebSocket upgrade handling. If we later need bidirectional communication, we can add WebSocket alongside SSE.

_Source: [tRPC Subscriptions - tracked() and lastEventId](https://trpc.io/docs/server/subscriptions)_
_Source: [tRPC httpSubscriptionLink](https://trpc.io/docs/client/links/httpSubscriptionLink)_
_Source: [tRPC v11 Announcement - SSE support](https://trpc.io/blog/announcing-trpc-v11)_

**Confidence: HIGH**

### Decision 3: Database Schema Change — headline vs title+company

**Current Architecture:** `attendees` table has `title VARCHAR(255)` and `company VARCHAR(255)` columns
**Recommended:** Replace with single `headline VARCHAR(255)` column + add `vanity_name VARCHAR(100)`

**Rationale:**
- LinkedIn's self-serve API does NOT provide separate title/company fields
- `headline` is the only professional identity field available (e.g., "CFO at RUMC")
- Parsing headline into title/company is unreliable — no guaranteed format
- `vanity_name` enables constructing LinkedIn profile URL: `linkedin.com/in/{vanityName}`

**Schema change:**
```sql
-- Remove
title VARCHAR(255)
company VARCHAR(255)

-- Add
headline VARCHAR(255)       -- LinkedIn headline (e.g., "CFO at RUMC")
vanity_name VARCHAR(100)    -- LinkedIn vanity name for profile URL
```

**UI impact:**
- AttendeeCard: Display `headline` as single line instead of "Title • Company"
- This is actually a simpler, more authentic representation — shows what the user chose as their identity

**Confidence: VERIFIED**

### Decision 4: Deployment Architecture

**Current Architecture:** Docker + Nginx (confirmed)
**Recommended:** No change — Docker deployment is required and correct

**Docker Compose structure:**
```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://...
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app
```

**Nginx must have:**
- `proxy_buffering off` (critical for SSE streaming)
- `proxy_read_timeout 86400s` (prevent premature connection close)
- WebSocket upgrade headers (for future-proofing, even if using SSE now)
- HTTPS termination with TLS 1.2+

**Confidence: VERIFIED**

### Decision 5: QR Code Generation Pipeline

**Current Architecture:** Not specified
**Recommended:** `qrcode` (SVG generation) + `sharp` (print composition)

**Pipeline:**
1. Admin creates session → server generates QR code as SVG (encodes session URL)
2. For print signage (FR30): compose with `sharp`:
   - Session name (header)
   - QR code graphic (center, high-resolution)
   - Room/location (below QR)
   - Short URL as readable text (footer)
3. Output: High-DPI PNG (300 DPI) for print, SVG for screen display

**Confidence: HIGH**

---

## Executive Summary

### Critical Findings

| # | Finding | Severity | Action Required |
|---|---------|----------|----------------|
| 1 | LinkedIn `r_liteprofile`/`r_emailaddress` scopes deprecated | 🔴 CRITICAL | Rewrite OAuth section of Architecture |
| 2 | Title/Company not available — only `headline` | 🔴 CRITICAL | Change database schema, PRD wording, UI component |
| 3 | Auth.js v5 eliminates custom OAuth code | 🟠 SIGNIFICANT | Adopt Auth.js — reduces drift risk |
| 4 | tRPC SSE subscriptions superior to raw WebSocket | 🟠 SIGNIFICANT | Adopt SSE — type-safe, built-in reconnection |
| 5 | Vercel cannot host WebSocket/SSE long-lived | 🟡 CONFIRMED | Docker deployment already in Architecture |
| 6 | `vanityName` available for LinkedIn URL | 🟢 ENHANCEMENT | Simplifies FR16 implementation |
| 7 | 60-day token lifetime sufficient for event cycle | 🟢 CONFIRMED | No refresh token complexity needed |

### Recommended Architecture Changes

**Before implementation begins, update these documents:**

1. **Architecture doc:**
   - Replace custom OAuth section with Auth.js v5 + LinkedIn OIDC
   - Replace WebSocket section with tRPC SSE subscriptions
   - Update `attendees` table: `title`+`company` → `headline`+`vanity_name`
   - Add library decisions: `qrcode`, `sharp`, `reconnecting-websocket` (fallback)
   - Add Nginx configuration specification
   - Add session cookie specification (SameSite=lax, HttpOnly, Secure)
   - Fix Tailwind v4 `@theme` references (remove `tailwind.config.js`)

2. **PRD:**
   - Update FR2: "name, photo, title, and company" → "name, photo, and professional headline"
   - Update FR12: AttendeeCard display description to reflect headline

3. **Epics:**
   - Update Story 1.1: schema change (headline + vanity_name columns)
   - Update Story 1.2: Auth.js implementation instead of custom OAuth
   - Update Story 1.3: tRPC SSE subscription instead of WebSocket
   - Update Story 2.3: tRPC `tracked()` reconnection instead of manual WebSocket reconnection

4. **UX Spec:**
   - Update AttendeeCard component: single `headline` line instead of "Title • Company"

### Technology Stack Summary (Updated)

| Layer | Technology | Status |
|-------|-----------|--------|
| Framework | Next.js (App Router) | ✅ Confirmed |
| API | tRPC v11 + Zod | ✅ Confirmed |
| Authentication | **Auth.js v5** + LinkedIn OIDC | 🆕 NEW |
| Real-time | **tRPC SSE subscriptions** (`tracked()`) | 🆕 CHANGED from WebSocket |
| Database | PostgreSQL + Drizzle ORM | ✅ Confirmed |
| Styling | Tailwind v4 (`@theme` CSS) | ✅ Confirmed |
| QR Generation | `qrcode` + `sharp` | 🆕 NEW |
| Monorepo | Turborepo | ✅ Confirmed |
| Deployment | Docker + Nginx | ✅ Confirmed |
| Type Safety | TypeScript strict + Zod schemas | ✅ Confirmed |

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| LinkedIn API changes during development | Low | High | Pin to current OIDC spec, monitor deprecation notices |
| Auth.js LinkedIn provider bugs | Low | Medium | Well-maintained, 2M+ weekly downloads, fallback to custom if needed |
| tRPC SSE performance at 500 connections | Very Low | Medium | SSE is lighter than WebSocket for unidirectional broadcast |
| `headline` field missing for some users | Low | Low | Display "LinkedIn Member" as fallback |
| `vanityName` missing for some users | Low | Low | Generate profile URL from `sub` identifier |

---

## Source Documentation

### Primary Sources (Official Documentation)
- [LinkedIn Sign In with OIDC](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2) — Updated 2024-08-08
- [LinkedIn 3-Legged OAuth Flow](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow) — Updated 2025-11-17
- [LinkedIn Getting Access](https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access) — Updated 2026-02-18
- [LinkedIn Basic Profile Fields](https://learn.microsoft.com/en-us/linkedin/shared/references/v2/profile/basic-profile)
- [LinkedIn API Rate Limiting](https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/rate-limits)
- [tRPC Subscriptions](https://trpc.io/docs/server/subscriptions)
- [tRPC v11 Announcement](https://trpc.io/blog/announcing-trpc-v11)
- [tRPC httpSubscriptionLink](https://trpc.io/docs/client/links/httpSubscriptionLink)
- [Auth.js LinkedIn Provider](https://authjs.dev/getting-started/providers/linkedin)
- [Socket.IO + Next.js Guide](https://socket.io/how-to/use-with-nextjs)
- [Nginx WebSocket Proxying](https://nginx.org/en/docs/http/websocket.html)

### Secondary Sources (Community / Tutorials)
- [3-Step LinkedIn OpenID 2025 Guide](https://dev.to/lovestaco/3-step-guide-to-add-linkedin-openid-sign-in-to-your-app-2025-edition-1mjh)
- [NextAuth LinkedIn OIDC Fix](https://dev.to/shubham_bhilare_3611/how-to-fix-linkedin-authentication-in-nextauthjs-a-custom-provider-setup-guide-5g8f)
- [SSE vs WebSocket Comparison - Ably](https://ably.com/blog/websockets-vs-sse)
- [WebSocket with Next.js - DEV Community](https://dev.to/addwebsolutionpvtltd/websocket-implementation-with-nextjs-nodejs-react-in-one-app-gb6)
- [ws npm package](https://www.npmjs.com/package/ws)
- [node-qrcode npm](https://www.npmjs.com/package/qrcode)
- [Scaling 40K WebSocket Connections](https://khelechy.medium.com/how-i-scaled-a-legacy-nodejs-application-handling-over-40k-active-long-lived-websocket-connections-aa11b43e0db0)
- [Rivet WebSocket on Vercel](https://www.rivet.dev/blog/2025-10-20-how-we-built-websocket-servers-for-vercel-functions/)

### npm Packages Referenced
- `ws` — WebSocket server (alternative, if SSE not adopted)
- `reconnecting-websocket` — Client-side WebSocket reconnection (alternative)
- `qrcode` — QR code generation (SVG/PNG)
- `sharp` — Image processing for print signage
- `next-auth` / `@auth/core` — Auth.js v5 authentication framework

---

**Technical Research Completion Date:** 2026-03-04
**Research Period:** Current comprehensive technical analysis
**Source Verification:** All critical facts cited with current official sources
**Confidence Level:** HIGH — based on multiple authoritative sources, official documentation verified

_This technical research report identifies 2 critical findings, 2 significant architectural improvements, and 3 confirmed assumptions for the "Who Else Is Here" project. The findings should be reviewed by the expert panel before updating planning documents._
