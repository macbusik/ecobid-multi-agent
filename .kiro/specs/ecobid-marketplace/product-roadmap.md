# EcoBid Product Roadmap

**Last Updated:** 2026-02-24  
**Product Owner:** User  
**Current Status:** Iteration 3 Complete ✅

---

## Product Vision

EcoBid is a mobile-first serverless marketplace for free household item giveaways, built for the AWS 10,000 AIdeas competition. The platform uses multimodal AI to enable effortless item listing and implements a fair lottery-based reservation system to promote circular economy principles.

---

## Current State (Iteration 3 Complete)

### ✅ What's Working
- **Authentication:** Login/register with Cognito, email verification, session persistence
- **Favorites:** Add/remove favorites with persistent storage, red heart indicators
- **Item Browsing:** Category filtering with scroll indicators, mobile-optimized UX
- **UX Polish:** Toast notifications, loading states, error boundaries, dynamic password validation
- **Backend API:** Lambda + API Gateway + DynamoDB with JWT authorization
- **Frontend:** Next.js 15 on CloudFront + S3
- **Performance:** <400ms page load, <100ms favorites API, 60fps animations
- **100% AWS Free Tier compliant**

### 🎯 Recent Fixes (Iteration 3.2)
- Fixed 403 Unauthorized error (userId mismatch between frontend email and JWT sub claim)
- Favorites now load correctly after logout/login
- Session persistence working automatically via Amplify localStorage

### 📋 Next Priority
- **Iteration 4:** Create Item functionality (manual form or AI-powered listing)

---

## Iteration 3: Authentication + Favorites + UX Polish ✅

**Timeline:** 1 week  
**Priority:** P0 (Critical for MVP)  
**Status:** Complete

### Completed Features
- ✅ User authentication (login/register with Cognito)
- ✅ Email verification with code input
- ✅ Session persistence (automatic via Amplify localStorage)
- ✅ Favorites system with DynamoDB backend
- ✅ Dynamic password validation with visual checklist
- ✅ Category filter with scroll indicators and fade gradients
- ✅ Toast notification system with slide-in animations
- ✅ Error boundary for graceful error handling
- ✅ All touch targets ≥48px (mobile-first)
- ✅ Loading states and optimistic UI updates

### Key Bugfixes
- ✅ Fixed 403 Unauthorized error (userId mismatch: email vs JWT sub claim)
- ✅ Fixed favorites loading after logout/login
- ✅ Fixed duplicate Amplify configuration
- ✅ Fixed server component issue with Amplify.configure()

### Performance Achieved
- Auth flows: <2 seconds ✅
- Favorites API: <100ms ✅
- All touch targets: 48px ✅
- Animations: 60fps ✅

**Detailed tasks:** See `tasks.md` (ITER3-* tasks marked complete)

---

## Iteration 4: AI-Powered Item Creation ✅

**Timeline:** 1 week  
**Priority:** P0 (Core MVP feature)  
**Status:** Complete

### Completed Features
- ✅ Photo upload with preview (5MB max, JPEG/PNG)
- ✅ AI analysis using Amazon Nova Lite multimodal vision
- ✅ Auto-generated title, description, and category
- ✅ User can edit AI suggestions before publishing
- ✅ Lottery window selection (3-24 hours)
- ✅ Complete end-to-end flow in <30 seconds
- ✅ My Items section (view all listings)
- ✅ Edit item functionality
- ✅ Delete item functionality

### Performance Achieved
- Photo upload: <5 seconds ✅
- AI analysis: <10 seconds ✅
- Total listing time: <30 seconds ✅
- Cost per listing: ~$0.02 ✅

**Detailed tasks:** See `tasks.md` (ITER4-* tasks marked complete)

---

## Iteration 5: Lottery System + Reservations

**Timeline:** 1 week  
**Priority:** P0 (Core MVP feature - CRITICAL)  
**Status:** Next Up (Backend Complete, Frontend Needed)

### Goals
Complete the core marketplace flow by implementing lottery and reservation UI. This is the **most critical remaining MVP feature** - without it, items cannot be claimed.

### Current State
**Backend:** ✅ 100% Complete
- ✅ `POST /items/{itemId}/lottery` - Enter lottery endpoint
- ✅ `POST /items/{itemId}/confirm-pickup` - Confirm pickup endpoint
- ✅ `POST /items/{itemId}/mark-picked-up` - Mark as picked up endpoint
- ✅ EventBridge Scheduler for automated lottery execution
- ✅ Reservation expiry handler (24-hour window)
- ✅ Email notifications (SES integration)

**Frontend:** ❌ Not Implemented
- ❌ "Enter Lottery" button on item detail page
- ❌ "You're in lottery" state indicator
- ❌ Countdown timer (lottery closes in X hours)
- ❌ Winner notification UI
- ❌ "Confirm Pickup" button for winners
- ❌ Reservation countdown (24 hours remaining)
- ❌ "Mark as Picked Up" button for sellers

### User Stories

#### US-5.1: Enter Lottery (Buyer)
**As a buyer**, I want to enter a lottery for an item I'm interested in, so that I have a fair chance to claim it.

**Acceptance Criteria:**
- [ ] Item detail page shows "Enter Lottery" button when status is "Available"
- [ ] Button shows countdown timer: "Lottery closes in 3h 45m"
- [ ] Clicking button calls `POST /items/{itemId}/lottery`
- [ ] After entering, button changes to "You're in lottery ✓" (disabled, green)
- [ ] Toast notification: "You're in the lottery! Winner announced in X hours"
- [ ] If lottery closed, show "Lottery Closed" badge

#### US-5.2: Lottery Countdown Timer
**As a buyer**, I want to see how much time is left to enter the lottery, so I can decide if I want to participate.

**Acceptance Criteria:**
- [ ] Item cards in feed show countdown: "3h 45m left"
- [ ] Item detail page shows countdown: "Lottery closes in 3 hours 45 minutes"
- [ ] Timer updates every minute
- [ ] When <1 hour left, show in red: "45m left"
- [ ] When lottery closes, timer shows "Closed"

#### US-5.3: Winner Notification (Buyer)
**As a winner**, I want to be notified immediately and see my reserved item, so I can confirm pickup.

**Acceptance Criteria:**
- [ ] Winner sees banner on home page: "🎉 You won [Item Title]! Confirm pickup within 24 hours"
- [ ] Banner links to item detail page
- [ ] Item detail page shows "Reserved for You" badge
- [ ] Item detail page shows "Confirm Pickup" button (green, prominent)
- [ ] Item detail page shows countdown: "Reservation expires in 23h 15m"
- [ ] Email notification sent (backend already implemented)

#### US-5.4: Confirm Pickup (Winner)
**As a winner**, I want to confirm that I will pick up the item, so the seller knows I'm coming.

**Acceptance Criteria:**
- [ ] "Confirm Pickup" button calls `POST /items/{itemId}/confirm-pickup`
- [ ] After confirmation, button changes to "Pickup Confirmed ✓" (disabled)
- [ ] Status badge changes to "Pickup Confirmed"
- [ ] Toast notification: "Pickup confirmed! Contact seller to arrange details"
- [ ] Seller receives email notification (backend already implemented)

#### US-5.5: Mark as Picked Up (Seller)
**As a seller**, I want to mark an item as picked up after the winner collects it, so the transaction is complete.

**Acceptance Criteria:**
- [ ] Seller sees "Mark as Picked Up" button on item detail page when status is "Pickup_Confirmed"
- [ ] Button calls `POST /items/{itemId}/mark-picked-up`
- [ ] After marking, status changes to "Picked_Up"
- [ ] Item removed from "My Items" active list
- [ ] Toast notification: "Item marked as picked up. Thanks for using EcoBid!"

#### US-5.6: Reservation Expiry (Automatic)
**As a seller**, if the winner doesn't confirm pickup within 24 hours, I want the item automatically re-listed, so I don't lose the opportunity to give it away.

**Acceptance Criteria:**
- [ ] Backend automatically re-lists item if reservation expires (already implemented)
- [ ] Item status changes back to "Available"
- [ ] New lottery window starts (default 6 hours)
- [ ] Previous lottery entries are cleared
- [ ] Seller receives email notification (backend already implemented)

### Technical Implementation

#### Frontend Components to Create
```
frontend/src/components/lottery/
├── LotteryButton.tsx        # Enter lottery button with state management
├── LotteryCountdown.tsx     # Countdown timer component
├── WinnerBanner.tsx         # Winner notification banner
├── ReservationCard.tsx      # Reservation status card
└── PickupActions.tsx        # Confirm/Mark picked up buttons
```

#### API Client Methods to Add
```typescript
// frontend/src/lib/api/client.ts
export const items = {
  // ... existing methods
  enterLottery: async (itemId: string) => {
    return apiRequest(`/items/${itemId}/lottery`, { method: 'POST' });
  },
  confirmPickup: async (itemId: string) => {
    return apiRequest(`/items/${itemId}/confirm-pickup`, { method: 'POST' });
  },
  markPickedUp: async (itemId: string) => {
    return apiRequest(`/items/${itemId}/mark-picked-up`, { method: 'POST' });
  },
};
```

#### State Management
- Use React Context for lottery entries (similar to FavoritesContext)
- Store user's lottery entries in local state
- Poll for status updates when user has active lottery entries

### Performance Requirements
- Lottery entry: <500ms
- Countdown timer: Update every 60 seconds (no performance impact)
- Winner check: Poll every 30 seconds when user has active entries
- Confirm pickup: <500ms

### Testing Checklist
- [ ] Enter lottery for item
- [ ] See "You're in lottery" state
- [ ] Wait for lottery to close (or manually trigger via backend)
- [ ] Winner sees notification banner
- [ ] Winner can confirm pickup
- [ ] Seller can mark as picked up
- [ ] Reservation expiry works (24-hour timeout)
- [ ] Item re-lists if winner doesn't confirm

### Success Criteria
- ✅ Complete item lifecycle: listing → lottery → reservation → pickup
- ✅ MVP feature-complete
- ✅ Ready for beta testing
- ✅ All user flows working end-to-end

**Detailed tasks:** See `tasks.md` (ITER5-* tasks to be created)

---

## Iteration 6: Messaging + Notifications

**Timeline:** 1 week  
**Priority:** P2 (Important for UX)  
**Status:** Planned

### Goals
1. In-app messaging between seller and winner
2. Email notifications for new messages
3. Message history and threading

**Detailed tasks:** See `tasks.md` (ITER6-* tasks)

---

## Iteration 7: Polish + Analytics

**Timeline:** 1 week  
**Priority:** P3 (Nice to have)  
**Status:** Planned

### Goals
1. Advanced search and filtering
2. User reputation system
3. Analytics dashboard

**Detailed tasks:** See `tasks.md` (ITER7-* tasks)

---

## Cost Monitoring

**Current Monthly Cost:** $0 (AWS Free Tier)

### Free Tier Usage
- Lambda: <1K / 1M requests
- DynamoDB: <1GB / 25GB storage
- S3: <100MB / 5GB storage
- API Gateway: <1K / 1M requests
- Cognito: <10 / 50K MAU
- CloudFront: <1GB / 1TB transfer

### Actions
- Billing alerts set for >$1/month
- Weekly usage review
- Document in progress reports

---

## Risk Assessment

**High Risk:**
- Cognito integration complexity → Use AWS Amplify, follow docs

**Medium Risk:**
- Limited mobile device testing → Use DevTools, test on 2+ devices

**Low Risk:**
- Free Tier limits → Monitor weekly, billing alerts

---

## Next Steps

### This Week (Iteration 4)
1. Decide: Manual form vs AI-powered listing
2. Implement item creation form
3. Add photo upload to S3
4. Build item management page

### This Month
1. Complete Iteration 4 (Create Item)
2. Start Iteration 5 (Lottery System)
3. Test on real mobile devices
4. Update documentation

### This Quarter
1. Complete MVP (Iterations 4-6)
2. Launch beta testing
3. Gather user feedback
4. Prepare competition submission

---

---

## V2 Backlog: Future User Actions

### Seller Actions (Post-MVP)
- Pause/unpause listing
- Extend lottery window
- View item analytics (views, favorites, entries)
- Bulk delete items
- Export item history
- Set pickup location on map
- Add multiple photos (up to 5)
- Schedule listing (publish later)
- View lottery entries list
- Cancel lottery before close
- Edit item details after publish

### Buyer Actions (Post-MVP)
- Save searches
- Get alerts for new items (category/keyword)
- View item history (past winners)
- Report inappropriate items
- Block sellers
- Share items (social media)
- Request similar items
- View seller reputation
- Cancel lottery entry before close
- View how many people entered lottery

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

## Related Documents
- [Requirements](./requirements.md) - Business requirements
- [Design](./design.md) - System design & API contracts
- [Tasks](./tasks.md) - Detailed implementation tasks
