# Brainstorming Session Results - "Who Else Is Here"

**Session Date:** 2025-10-08 - 2025-10-09
**Facilitator:** Business Analyst Mary
**Participant:** Event Networking App Developer

## Executive Summary

**Topic:** Simple LinkedIn-focused event networking app - "Who Else Is Here"

**Session Goals:** Define and validate a simple MVP that solves the core networking problem at events

**Final MVP Decision:** Dead-simple networking app with NO complex integrations, NO AI, NO registration platform connections

**Total Ideas Generated:** Started with 15+ complex concepts, distilled down to 4 core MVP features

### Key Themes Identified:
- **KISS Principle:** Start simple, add complexity only after validation
- **LinkedIn-first approach:** Primary authentication and connection method
- **Standalone solution:** No integration with registration platforms
- **Mobile-responsive web app:** QR code driven, no app store complexity

## Problem Definition

**Core Problem Discovered:** Physical constraints of events limit who you can actually connect with.

**Real Example:** At 1500-person event with table seating, could only connect to 10-15 people at same table. With app, could have connected to many more during and after event.

**Value Proposition:** See everyone → decide quickly → connect easily

## MVP 1.0 Specification

### Core Features (Final Decision)
1. **Event Creation** - Organizer creates simple event, gets QR code/shareable link
2. **Attendee Login** - LinkedIn auth primary, manual profile for non-LinkedIn users
3. **Attendee List** - View all event attendees with basic contact info
4. **One-click Connections** - LinkedIn connection requests or save to contacts

### What We EXCLUDED from MVP
- ❌ Registration platform integration
- ❌ AI curation or matchmaking
- ❌ Curated collections
- ❌ Multi-session functionality
- ❌ Complex analytics or UTM tracking
- ❌ Native mobile apps

### Technical Decisions
- **Platform:** Mobile-responsive web app (not native)
- **Authentication:** LinkedIn primary, manual fallback
- **Sessions:** Single session events only (multi-session in future)
- **Metrics:** Simple counting - # of logins, # of connections made

### User Profiles
**LinkedIn Users:**
- Name, title, company (from LinkedIn)
- One-click connection request

**Non-LinkedIn Users:**
- Name, basic contact info
- 500-character bio field
- "Save to contacts" button

## Validation Plan

### Test Venues
1. **C3G** (in-person) - test QR code scanning, mobile UX
2. **Atlanta Job Seekers** (online via Zoom) - test virtual networking

### Success Metrics
- **# of logins** to the event (no percentage metrics)
- **# of LinkedIn connections made** through the app
- **Organizer feedback** - would you use it again?

### Validation Thresholds
- 50+ logins = people see value in joining
- 20+ connections made = people find networking value
- Organizer says "yes, use again" = sustainable adoption

## Market Research Analysis

### Competitive Landscape (October 2024)

**Enterprise/Complex Solutions:**
- **Bizzabo** - Full event management platform, $5K+ pricing, complex setup
- **Swapcard** - AI-powered matchmaking, corporate focus, extensive features
- **Grip** - AI networking platform, enterprise clients, 2.6/5 app rating

**Simpler/Accessible Solutions:**
- **Whova** - More user-friendly, $1,499+ pricing, still complex event management

### Our Competitive Advantage

**"Who Else Is Here" Market Position:**
✅ **Simplicity:** Pure networking focus vs. complex event management platforms
✅ **Independence:** No registration platform integration required
✅ **LinkedIn-First:** Core feature vs. add-on functionality
✅ **Accessibility:** QR code simplicity vs. complex check-in systems
✅ **Price Point:** Potential for much lower cost than $1,500+ competitors

**Strategic Positioning:** Solving the 80/20 problem - delivering 80% of networking value with 20% of the complexity and cost.

## Future Considerations (Post-MVP)

### Multi-Session Events
- Session selection during check-in
- "Show me people in my current session" vs "Show all attendees"
- Session-based networking with option to see full event

### Advanced Features (Only After MVP Validation)
- Event attendance tracking for organizers
- Basic spam reporting
- Enhanced privacy controls
- Multiple event management

## Next Steps

**Immediate Priority:** Build and test MVP 1.0 at C3G and Atlanta Job Seekers events

**Technical Stack Decision Needed:** Choose development approach for mobile-responsive web app

**Key Success Factor:** Prove people will actually use the basic networking functionality before adding any complexity

---

*Session facilitated using the BMAD-METHOD™ brainstorming framework*