# User Actions Analysis: EcoBid Marketplace

**Date:** 2026-03-03  
**Status:** Analysis Complete  
**Next Iteration:** ITER4.1 (Lottery + Reservations UI)

---

## Executive Summary

**Current State:** Backend is 90% complete. Frontend has core features (auth, AI listing, browse, favorites, profile) but **lottery and reservation flows are not wired up**.

**Critical Gap:** Users can create items and browse, but cannot enter lotteries or complete reservations. This blocks the entire item lifecycle.

**Recommendation:** ITER4.1 should focus on wiring existing backend to frontend for lottery and reservation flows. This is **low effort, high impact** work.

---

## Current Implementation Status

### ✅ IMPLEMENTED (ITER1-4)

#### 1. Authentication
- Register with email/password
- Login/logout
- View profile
- Session persistence

#### 2. Item Listing (AI-Powered)
- Upload photo
- AI generates title/description/category (Nova Lite)
- Edit AI suggestions
- Set lottery window (3-12 hours)
- Publish item

#### 3. Browse Items
- View item feed
- Filter by category
- View item details
- See lottery countdown

#### 4. Favorites
- Add/remove favorites
- View favorites page
- Persistent across sessions

#### 5. My Items (ITER4.1 - Just Added)
- View all my listings
- Delete active items

### ⚠️ PARTIALLY IMPLEMENTED

#### 6. Lottery System (Backend Ready, UI Not Wired)
- ✅ Backend: `enterLottery` handler exists
- ✅ Backend: `executeLottery` handler exists
- ✅ Backend: EventBridge scheduler exists
- ⚠️ Frontend: "Enter Lottery" button exists but not functional
- ❌ Missing: Countdown timer UI
- ❌ Missing: "You're in lottery" state

#### 7. Reservations (Backend Ready, No UI)
- ✅ Backend: `confirmPickup` handler exists
- ✅ Backend: `markPickedUp` handler exists
- ✅ Backend: `reservation-expiry` handler exists
- ❌ Frontend: No reservation UI

### ❌ NOT IMPLEMENTED

#### 8. Direct Messaging
- ✅ Backend: message handlers exist
- ❌ Frontend: No messaging UI

#### 9. Search
- ❌ No keyword search (only category filter)

#### 10. Email Notifications
- ❌ No SNS integration

---

## User Journey Mapping

### SELLER JOURNEY

#### Phase 1: Create Listing ✅ COMPLETE
1. ✅ Upload photo
2. ✅ Review AI suggestions
3. ✅ Edit title/description/category
4. ✅ Set lottery window
5. ✅ Publish item

#### Phase 2: Manage Listings ✅ COMPLETE (NEW)
1. ✅ View my items
2. ✅ Delete active items
3. ❌ Edit item details
4. ❌ Cancel lottery (before close)
5. ❌ View lottery entries count
6. ❌ View who entered lottery

#### Phase 3: Handle Winner 🔴 BLOCKED
1. ❌ Receive notification (winner selected)
2. ❌ View winner contact info
3. ❌ Message winner for pickup
4. ❌ Confirm item picked up
5. ❌ Rate buyer (optional - V2)

---

### BUYER JOURNEY

#### Phase 1: Discover Items ✅ COMPLETE
1. ✅ Browse item feed
2. ✅ Filter by category
3. ✅ View item details
4. ✅ Add to favorites
5. ❌ Search by keyword
6. ❌ Filter by city
7. ❌ Sort by newest/ending soon

#### Phase 2: Enter Lottery 🟡 PARTIALLY BLOCKED
1. ⚠️ Click "Enter Lottery" (button exists, not wired)
2. ❌ See confirmation "You're in lottery"
3. ❌ View countdown timer
4. ❌ Cancel lottery entry (before close)
5. ❌ View how many people entered

#### Phase 3: Win & Pickup 🔴 BLOCKED
1. ❌ Receive notification (won lottery)
2. ❌ View reserved item
3. ❌ Confirm pickup within 24h
4. ❌ Message seller for details
5. ❌ Coordinate pickup time/location
6. ❌ Rate seller (optional - V2)

---

## Critical Gaps Analysis

### 🔴 P0: Lottery Flow (ITER4.1)
**Why Critical:** Core MVP feature. Backend ready, just needs UI wiring.

**Missing Actions:**
1. Wire "Enter Lottery" button to API
2. Show "You're in lottery" state
3. Add countdown timer to item cards
4. Show lottery status on item detail page
5. Handle lottery closed state

**Estimated Effort:** 1 day (5 tasks)  
**Impact:** HIGH - Enables core marketplace flow

---

### 🔴 P0: Reservation Flow (ITER4.1)
**Why Critical:** Completes the item lifecycle. Without this, items never get picked up.

**Missing Actions:**
1. Winner notification UI (banner/modal)
2. "Confirm Pickup" button
3. Reservation countdown (24h)
4. Seller: "Mark as Picked Up" button
5. Handle expiry (item back to available)

**Estimated Effort:** 1 day (5 tasks)  
**Impact:** HIGH - Completes MVP

---

### 🟡 P1: Direct Messaging (ITER5)
**Why Important:** Enables pickup coordination between seller and winner.

**Missing Actions:**
1. Message thread UI
2. Send/receive messages
3. Real-time updates (polling)
4. Notification badge

**Estimated Effort:** 2 days (8 tasks)  
**Impact:** MEDIUM - Improves UX, not blocking

---

### 🟢 P2: Search & Filters (ITER6)
**Why Nice-to-Have:** Improves discovery, but category filter works for MVP.

**Missing Actions:**
1. Keyword search
2. City filter
3. Sort options (newest, ending soon)
4. Distance-based search (future)

**Estimated Effort:** 1 day (4 tasks)  
**Impact:** MEDIUM - Quality of life improvement

---

## Additional Actions (V2 Backlog)

### Seller Actions (Post-MVP)
- Pause/unpause listing
- Extend lottery window
- View item analytics (views, favorites)
- Bulk delete items
- Export item history
- Set pickup location on map
- Add multiple photos
- Schedule listing (publish later)

### Buyer Actions (Post-MVP)
- Save searches
- Get alerts for new items (category/keyword)
- View item history (past winners)
- Report inappropriate items
- Block sellers
- Share items (social media)
- Request similar items
- View seller reputation

### Both Users (Post-MVP)
- Edit profile (name, city, bio, photo)
- View reputation score breakdown
- View transaction history
- Enable push notifications
- Set notification preferences
- Delete account
- Export personal data (GDPR)
- Two-factor authentication

---

## RECOMMENDATION: ITER4.1 Scope

### Goal
**Complete Core MVP: Lottery + Reservations**

### Strategy
**Focus on wiring existing backend to frontend. No new backend work needed.**

### Tasks Breakdown (10 tasks, 2-3 days)

#### Lottery Integration (5 tasks)
1. **ITER4.1-1:** Wire "Enter Lottery" button to API
2. **ITER4.1-2:** Add "You're in lottery" state UI
3. **ITER4.1-3:** Add countdown timer component
4. **ITER4.1-4:** Show lottery entries count (seller view)
5. **ITER4.1-5:** Handle lottery closed state

#### Reservation Flow (5 tasks)
6. **ITER4.1-6:** Add winner notification UI
7. **ITER4.1-7:** Add "Confirm Pickup" button
8. **ITER4.1-8:** Add reservation countdown (24h)
9. **ITER4.1-9:** Add "Mark as Picked Up" button (seller)
10. **ITER4.1-10:** Handle reservation expiry

### Expected Outcome
✅ Complete item lifecycle: listing → lottery → reservation → pickup  
✅ MVP feature-complete  
✅ Ready for beta testing

### Defer to ITER5
- Direct messaging
- Search & filters
- Email notifications

---

## Priority Matrix

| Feature | Impact | Effort | Priority | Iteration | Status |
|---------|--------|--------|----------|-----------|--------|
| Lottery UI | HIGH | LOW | P0 | ITER4.1 | 🔴 Blocked |
| Reservation UI | HIGH | LOW | P0 | ITER4.1 | 🔴 Blocked |
| Messaging | MEDIUM | MEDIUM | P1 | ITER5 | 🟡 Planned |
| Search | MEDIUM | LOW | P2 | ITER6 | 🟢 Nice-to-have |
| Notifications | LOW | MEDIUM | P3 | V2 | ⚪ Backlog |
| Edit Profile | LOW | LOW | P3 | V2 | ⚪ Backlog |
| Multiple Photos | LOW | MEDIUM | P4 | V2 | ⚪ Backlog |

---

## Business Impact

### Without ITER4.1
- ❌ Users cannot enter lotteries
- ❌ Items never get reserved
- ❌ No pickup coordination
- ❌ Platform is non-functional for core use case

### With ITER4.1
- ✅ Complete marketplace flow
- ✅ Users can give away items
- ✅ Users can claim items
- ✅ MVP ready for beta testing
- ✅ Ready for AWS 10,000 AIdeas submission

---

## Next Steps

1. **Review this analysis** with Product Owner
2. **Approve ITER4.1 scope** (10 tasks)
3. **Generate detailed tasks** in `tasks.md`
4. **Execute ITER4.1** (2-3 days)
5. **Test end-to-end flow**
6. **Launch beta**
