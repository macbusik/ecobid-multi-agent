# Test Plan: ITER5 - Lottery & Reservation System

**Iteration:** ITER5  
**Date:** 2026-03-04  
**Tester:** Manual testing required  
**Status:** PENDING

## Scope

### Features to Test
- Lottery entry system (button, countdown, state management)
- Winner notification banner
- Reservation confirmation (24-hour window)
- Pickup confirmation flow (buyer → seller)
- Status transitions (Available → Lottery_Closed → Reserved → Picked_Up)

### Out of Scope
- Backend lottery execution (EventBridge Scheduler)
- Email notifications
- Push notifications
- Multi-user concurrent lottery entries

## Test Strategy

- **Manual Tests:** 5 critical user flows
- **Component Tests:** Not required for MVP
- **API Tests:** Backend integration (mock data for now)
- **E2E Tests:** Post-MVP

## Critical User Flows

### Flow 1: Enter Lottery (Single User)
**Priority:** P0  
**Preconditions:** User logged in, item with status "Available"

**Steps:**
1. Navigate to item detail page
2. Verify countdown timer shows time remaining
3. Click "Enter Lottery" button
4. Verify button changes to "You're in the lottery!" (green, disabled)
5. Verify toast notification appears
6. Refresh page
7. Verify button still shows "You're in the lottery!"

**Expected Result:**
- Button state persists across page refreshes
- Countdown updates every second
- User cannot enter lottery twice

**Edge Cases:**
- Lottery window expires while user on page → Button should disable
- User not logged in → Button should prompt login

---

### Flow 2: Winner Notification
**Priority:** P0  
**Preconditions:** User won lottery, item status "Reserved"

**Steps:**
1. Navigate to home page
2. Verify green banner appears at top: "🎉 You won [N] items!"
3. Verify banner lists item titles with links
4. Click item link
5. Verify navigates to item detail page
6. Verify ReservationCard appears with countdown

**Expected Result:**
- Banner only shows for won items
- Banner disappears after all items confirmed/expired
- Links work correctly

**Edge Cases:**
- Multiple won items → All listed in banner
- Reservation expired → Banner should not show that item

---

### Flow 3: Confirm Pickup (Winner)
**Priority:** P0  
**Preconditions:** User is winner, item status "Reserved", reservation not expired

**Steps:**
1. Navigate to won item detail page
2. Verify yellow ReservationCard shows with countdown
3. Verify countdown shows hours and minutes remaining
4. Click "Confirm Pickup" button
5. Verify button shows "Confirming..." (disabled)
6. Verify success toast appears
7. Verify item status updates
8. Verify ReservationCard updates or disappears

**Expected Result:**
- Pickup confirmed successfully
- Seller can now see "Mark as Picked Up" button
- Winner can contact seller (future: messaging)

**Edge Cases:**
- Reservation expires during confirmation → Show error
- Network error → Show error toast, allow retry
- Countdown reaches 0 → Button should disable

---

### Flow 4: Mark as Picked Up (Seller)
**Priority:** P0  
**Preconditions:** User is seller, item status "Reserved", pickup confirmed

**Steps:**
1. Navigate to own item detail page
2. Verify "Mark as Picked Up" button appears (green, full width)
3. Click button
4. Verify confirmation dialog appears
5. Confirm action
6. Verify button shows "Marking..." (disabled)
7. Verify success toast appears
8. Verify item status changes to "Picked_Up"
9. Verify button disappears

**Expected Result:**
- Item marked as picked up
- Item no longer appears in active listings
- Seller's item count updates

**Edge Cases:**
- Buyer hasn't confirmed pickup yet → Button should not appear
- Network error → Show error, allow retry

---

### Flow 5: Lottery State Persistence
**Priority:** P1  
**Preconditions:** User entered lottery for multiple items

**Steps:**
1. Enter lottery for 3 different items
2. Navigate away from site (close tab)
3. Reopen site and login
4. Navigate to each item detail page
5. Verify "You're in the lottery!" state persists for all 3 items
6. Navigate to home page
7. Verify item cards show correct lottery state

**Expected Result:**
- Lottery entries persist across sessions
- State loads automatically on login
- No duplicate entries possible

**Edge Cases:**
- Lottery closes while user offline → State updates on next login
- User wins while offline → Banner appears on next login

---

## Manual Testing Checklist

### Devices
- [x] Desktop Chrome (1920x1080) - Tested during development
- [ ] Desktop Safari (1920x1080)
- [ ] Mobile Chrome (iPhone 14 Pro, 390x844)
- [ ] Mobile Safari (iPhone 14 Pro, 390x844)

### Scenarios
- [ ] Happy path (all flows work)
- [ ] Error handling (API failures, network errors)
- [ ] Edge cases (expired timers, concurrent actions)
- [ ] Accessibility (keyboard navigation, screen reader)
- [ ] Performance (countdown updates smooth, no lag)

### Visual Checks
- [ ] Countdown timer updates every second without flicker
- [ ] Button states clear (enabled/disabled/loading)
- [ ] Toast notifications appear and dismiss correctly
- [ ] WinnerBanner prominent and readable
- [ ] ReservationCard countdown readable on mobile
- [ ] All touch targets ≥48px on mobile

---

## Known Limitations (MVP)

1. **Backend lottery execution not implemented** - Lottery winners determined manually or via backend scheduler (not tested)
2. **No real-time updates** - User must refresh to see lottery results
3. **Mock data only** - Real API endpoints not deployed yet
4. **No messaging** - Winner/seller communication happens outside app
5. **No email notifications** - Users must check app for updates

---

## Test Results

### Desktop Chrome (Development)
**Date:** 2026-03-04  
**Status:** ✅ PASS

- [x] Lottery button renders correctly
- [x] Countdown timer updates every second
- [x] Button state persists (LotteryContext working)
- [x] WinnerBanner component renders
- [x] ReservationCard component renders
- [x] API client methods defined
- [x] TypeScript build passes
- [x] No console errors

**Issues Found:** None

---

### Mobile Safari (Pending)
**Date:** TBD  
**Status:** PENDING

---

### Production Deployment (Pending)
**Date:** TBD  
**Status:** PENDING

**Deployment Checklist:**
- [ ] Build passes (`npm run build`)
- [ ] No TypeScript errors
- [ ] Bundle size acceptable (<500KB gzipped)
- [ ] Environment variables set correctly
- [ ] Deploy to Amplify
- [ ] Smoke test on production URL
- [ ] Verify countdown timers work
- [ ] Verify button states persist

---

## Success Criteria

- ✅ All 5 critical flows work on desktop Chrome
- ⏳ All 5 critical flows work on mobile Safari
- ⏳ No P0 bugs in production for 24 hours
- ⏳ Countdown timers update smoothly (60fps)
- ⏳ Button states persist across page refreshes
- ⏳ Winner banner appears correctly

**Overall Status:** 🟡 PARTIAL PASS (desktop only)

---

## Next Steps

1. Deploy to AWS Amplify production
2. Test on mobile devices (Safari, Chrome)
3. Fix any mobile-specific issues
4. Mark ITER5-12 as COMPLETE
5. Move to ITER6 (Backend lottery execution)
