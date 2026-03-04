# Phase 10: Iteration 5.1 - Marketplace UX Polish

**Status:** 0/8 tasks complete  
**Focus:** Essential marketplace patterns and user experience improvements

### ITER5.1-1: Require Login to Enter Lottery
**Agent:** `frontend_engineer`
**Priority:** P0 (Critical)
**Estimated Time:** 30 minutes
**Status:** TODO

**Description:**
Prevent unauthenticated users from entering lottery. Show login prompt instead.

**Acceptance Criteria:**
- [ ] Check if user is logged in before showing "Enter Lottery" button
- [ ] If not logged in, show "Login to Enter Lottery" button (gray, disabled style)
- [ ] Clicking button shows toast: "Please log in to enter the lottery"
- [ ] Button links to `/login` page
- [ ] After login, redirect back to item detail page
- [ ] Same check on item cards (don't show countdown if not logged in)

**Dependencies:** None

**Files to Modify:**
- `frontend/src/components/lottery/LotteryButton.tsx`
- `frontend/src/pages/ItemDetail.tsx`

---

### ITER5.1-2: Prevent Owner from Entering Own Lottery
**Agent:** `frontend_engineer`
**Priority:** P0 (Critical)
**Estimated Time:** 20 minutes
**Status:** TODO

**Description:**
Item owners should not be able to enter their own lottery.

**Acceptance Criteria:**
- [ ] Check if current user is item owner
- [ ] If owner, hide "Enter Lottery" button completely
- [ ] Show message: "You can't enter your own lottery"
- [ ] Owner sees countdown timer but no action button
- [ ] Test with owner and non-owner accounts

**Dependencies:** None

**Files to Modify:**
- `frontend/src/pages/ItemDetail.tsx`

---

### ITER5.1-3: Show "Already Entered" State Across App
**Agent:** `frontend_engineer`
**Priority:** P1 (High)
**Estimated Time:** 45 minutes
**Status:** TODO

**Description:**
Visually indicate which lotteries user has entered on item cards in feed.

**Acceptance Criteria:**
- [ ] Add green checkmark badge to item cards: "✓ Entered"
- [ ] Badge appears on top-right corner of item image
- [ ] Use LotteryContext to check if user entered
- [ ] Badge only shows for Available items
- [ ] Badge is visible but doesn't block image
- [ ] Mobile-friendly size and positioning

**Dependencies:** None

**Files to Modify:**
- `frontend/src/components/item/ItemCard.tsx`

---

### ITER5.1-4: Add Empty States
**Agent:** `frontend_engineer` + `ux_ui_expert`
**Priority:** P1 (High)
**Estimated Time:** 1 hour
**Status:** TODO

**Description:**
Add friendly empty states for key pages.

**Acceptance Criteria:**
- [ ] **Home page (no items):** "No items available yet. Be the first to list something!"
- [ ] **Favorites (empty):** "No favorites yet. Browse items and tap ❤️ to save them here."
- [ ] **Profile - My Items (empty):** "You haven't listed any items yet. Tap 'New Item' to get started!"
- [ ] **Profile - My Lottery Entries (empty):** "You haven't entered any lotteries yet. Browse items and join a lottery!"
- [ ] Each empty state has icon, heading, and call-to-action button
- [ ] Mobile-friendly centered layout

**Dependencies:** None

**Files to Modify:**
- `frontend/src/pages/Home.tsx`
- `frontend/src/pages/Favorites.tsx`
- `frontend/src/pages/Profile.tsx`

---

### ITER5.1-5: Add Loading Skeletons
**Agent:** `frontend_engineer`
**Priority:** P2 (Medium)
**Estimated Time:** 1 hour
**Status:** TODO

**Description:**
Replace "Loading..." text with skeleton screens for better perceived performance.

**Acceptance Criteria:**
- [ ] Create `frontend/src/components/ui/ItemCardSkeleton.tsx`
- [ ] Skeleton matches ItemCard layout (image, title, description, countdown)
- [ ] Use gray animated pulse effect
- [ ] Show 6 skeletons on Home page while loading
- [ ] Show 1 skeleton on ItemDetail page while loading
- [ ] Show 4 skeletons on Favorites page while loading
- [ ] Mobile-friendly responsive layout

**Dependencies:** None

**Files to Create:**
- `frontend/src/components/ui/ItemCardSkeleton.tsx`

**Files to Modify:**
- `frontend/src/pages/Home.tsx`
- `frontend/src/pages/ItemDetail.tsx`
- `frontend/src/pages/Favorites.tsx`

---

### ITER5.1-6: Add Item Status Indicators
**Agent:** `ux_ui_expert`
**Priority:** P1 (High)
**Estimated Time:** 45 minutes
**Status:** TODO

**Description:**
Improve visual clarity of item status across the app.

**Acceptance Criteria:**
- [ ] **Available:** Green dot + "Active Lottery"
- [ ] **Lottery_Closed:** Yellow dot + "Selecting Winner..."
- [ ] **Reserved:** Orange dot + "Reserved"
- [ ] **Pickup_Confirmed:** Blue dot + "Pickup Confirmed"
- [ ] **Picked_Up:** Gray dot + "Completed"
- [ ] Status badge appears on item cards and detail page
- [ ] Use consistent color scheme across app
- [ ] Mobile-friendly badge size

**Dependencies:** None

**Files to Modify:**
- `frontend/src/components/item/ItemCard.tsx`
- `frontend/src/pages/ItemDetail.tsx`

---

### ITER5.1-7: Add Confirmation Dialogs
**Agent:** `frontend_engineer`
**Priority:** P1 (High)
**Estimated Time:** 1.5 hours
**Status:** TODO

**Description:**
Replace browser `confirm()` with custom modal dialogs for better UX.

**Acceptance Criteria:**
- [ ] Create `frontend/src/components/ui/ConfirmDialog.tsx`
- [ ] Modal has title, message, Cancel button, Confirm button
- [ ] Confirm button is red for destructive actions (delete)
- [ ] Confirm button is green for positive actions (mark picked up)
- [ ] Modal is centered, has backdrop, and is mobile-friendly
- [ ] Replace all `confirm()` calls with ConfirmDialog
- [ ] Test on delete item, mark picked up, confirm pickup

**Dependencies:** None

**Files to Create:**
- `frontend/src/components/ui/ConfirmDialog.tsx`

**Files to Modify:**
- `frontend/src/pages/ItemDetail.tsx`
- `frontend/src/pages/Profile.tsx`

---

### ITER5.1-8: Add Error Boundaries for Lottery Components
**Agent:** `frontend_engineer`
**Priority:** P2 (Medium)
**Estimated Time:** 45 minutes
**Status:** TODO

**Description:**
Prevent lottery component errors from crashing the entire app.

**Acceptance Criteria:**
- [ ] Wrap LotteryButton in error boundary
- [ ] Wrap LotteryCountdown in error boundary
- [ ] Wrap ReservationCard in error boundary
- [ ] On error, show fallback: "Unable to load lottery info. Please refresh."
- [ ] Log errors to console for debugging
- [ ] App remains functional even if lottery components fail

**Dependencies:** None

**Files to Modify:**
- `frontend/src/pages/ItemDetail.tsx`
- `frontend/src/pages/Home.tsx`
- `frontend/src/components/item/ItemCard.tsx`

---

## Summary: ITER5.1

**Total Tasks:** 8  
**Estimated Time:** 2-3 days  
**Priority:** P0-P2 (Mixed)

**Focus Areas:**
- 🔐 Authentication guards (login required, owner restrictions)
- 🎨 Visual feedback (status indicators, entered badges)
- 📭 Empty states (friendly messages, CTAs)
- ⚡ Loading states (skeletons instead of spinners)
- ✅ Confirmation dialogs (replace browser alerts)
- 🛡️ Error handling (boundaries for lottery components)

**Why This Matters:**
These are the "obvious" marketplace patterns that users expect. Without them, the app feels incomplete even though the core lottery logic works.

---

## Summary: ITER5

**Total Tasks:** 12  
**Estimated Time:** 5-7 days  
**Priority:** P0 (CRITICAL)

**Features to Deliver:**
- ✅ Enter lottery button with state management
- ✅ Countdown timers on cards and detail page
- ✅ Winner notification banner
- ✅ Reservation card with countdown
- ✅ Confirm pickup button (winner)
- ✅ Mark as picked up button (seller)
- ✅ Complete lottery context for state management
- ✅ All API client methods

**Success Criteria:**
- Complete item lifecycle: listing → lottery → reservation → pickup
- MVP feature-complete
- Ready for beta testing
- All user flows working end-to-end

**After ITER5:**
- MVP is 100% complete
- Ready for AWS 10,000 AIdeas submission
- Can start beta testing with real users
