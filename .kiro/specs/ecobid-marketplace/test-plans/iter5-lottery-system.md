# Test Plan: Iteration 5 - Lottery & Reservation System

**Status:** Pre-Implementation  
**Created:** 2026-03-04  
**Tester:** QA Engineer  
**Priority:** P0 (CRITICAL - Core MVP Feature)

---

## 1. Scope

### In Scope
- Enter lottery button and state management
- Countdown timers (lottery and reservation)
- Winner notification banner
- Confirm pickup flow (winner)
- Mark as picked up flow (seller)
- Reservation expiry (automatic re-listing)
- Lottery execution (automated via EventBridge)

### Out of Scope
- Email notifications (backend already implemented, not testing UI)
- Direct messaging (ITER6)
- Push notifications (V2)
- Multiple winners (V2)

---

## 2. Test Strategy

**Manual Testing:** 25 test cases  
**Automated Testing:** 10 unit tests (Lambda handlers)  
**E2E Testing:** 3 critical flows

**Focus Areas:**
1. Lottery entry and state persistence
2. Automated lottery execution
3. Winner selection (randomness)
4. Reservation countdown and expiry
5. Pickup confirmation flow
6. Edge cases (0 entries, 1 entry, concurrent entries)

---

## 3. Critical User Flows

### Flow 1: Single Buyer Lottery (Happy Path)
**Steps:**
1. Seller creates item with 1-hour lottery window
2. Buyer enters lottery
3. Verify "You're in lottery" state
4. Wait for lottery to close (or trigger manually)
5. Verify winner notification appears
6. Winner confirms pickup
7. Seller marks as picked up
8. Verify item status = "Picked_Up"

**Expected Result:**
- Complete lifecycle works end-to-end
- Winner receives notification
- Seller can mark as picked up
- Item removed from active listings

**Edge Cases:**
- Buyer tries to enter lottery twice → Error message
- Buyer tries to enter after lottery closes → Error message
- Winner doesn't confirm within 24h → Item re-listed

---

### Flow 2: Multiple Buyers Lottery
**Steps:**
1. Seller creates item with 6-hour lottery window
2. Buyer A enters lottery
3. Buyer B enters lottery
4. Buyer C enters lottery
5. Wait for lottery to close
6. Verify only 1 winner selected
7. Verify losers don't see notification
8. Winner confirms pickup

**Expected Result:**
- Random winner selected (equal probability)
- Only winner sees notification
- Losers can enter lottery for other items
- Winner can confirm pickup

**Edge Cases:**
- All buyers enter at exact same time → All entries recorded
- One buyer enters multiple times → Only 1 entry counted

---

### Flow 3: Reservation Expiry (No Confirmation)
**Steps:**
1. Seller creates item with 1-hour lottery window
2. Buyer enters lottery
3. Buyer wins lottery
4. Buyer does NOT confirm pickup
5. Wait 24 hours (or trigger expiry manually)
6. Verify item re-listed with status "Available"
7. Verify new lottery window started

**Expected Result:**
- Item automatically re-listed after 24h
- Previous lottery entries cleared
- New lottery window = 6 hours (default)
- Seller receives email notification

**Edge Cases:**
- Winner confirms at 23h 59m → Confirmation accepted
- Winner confirms after 24h → Error message

---

## 4. Test Cases

### Backend API Tests (Automated)

---

### TC-ITER5-001: Enter Lottery - Success
**Type:** API (Automated)  
**Priority:** P0  
**Preconditions:** Item exists with status "Available", lottery not closed

**Test Code:**
```typescript
test('POST /items/{itemId}/lottery - success', async () => {
  const response = await apiClient.post(`/items/${itemId}/lottery`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });
  
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Successfully entered lottery');
  
  // Verify entry in DynamoDB
  const entry = await getItem(`ITEM#${itemId}`, `LOTTERY#${userId}`);
  expect(entry).toBeDefined();
  expect(entry.userId).toBe(userId);
});
```

**Status:** PENDING

---

### TC-ITER5-002: Enter Lottery - Already Entered
**Type:** API (Automated)  
**Priority:** P0  
**Preconditions:** User already entered lottery

**Test Code:**
```typescript
test('POST /items/{itemId}/lottery - already entered', async () => {
  // Enter lottery first time
  await apiClient.post(`/items/${itemId}/lottery`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });
  
  // Try to enter again
  const response = await apiClient.post(`/items/${itemId}/lottery`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });
  
  expect(response.status).toBe(400);
  expect(response.body.error).toBe('Already entered lottery');
});
```

**Status:** PENDING

---

### TC-ITER5-003: Enter Lottery - Lottery Closed
**Type:** API (Automated)  
**Priority:** P0  
**Preconditions:** Item lottery window expired

**Test Code:**
```typescript
test('POST /items/{itemId}/lottery - lottery closed', async () => {
  // Create item with lottery that already closed
  const item = await createItem({
    lotteryEndTime: new Date(Date.now() - 1000).toISOString()
  });
  
  const response = await apiClient.post(`/items/${item.itemId}/lottery`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });
  
  expect(response.status).toBe(400);
  expect(response.body.error).toBe('Lottery has closed');
});
```

**Status:** PENDING

---

### TC-ITER5-004: Execute Lottery - Single Entry
**Type:** Unit (Automated)  
**Priority:** P0  
**Preconditions:** Item has 1 lottery entry

**Test Code:**
```typescript
test('executeLottery - single entry', async () => {
  const itemId = 'test-item-1';
  const userId = 'test-user-1';
  
  // Create item and entry
  await createItem({ itemId, status: 'Available' });
  await createLotteryEntry({ itemId, userId });
  
  // Execute lottery
  await executeLottery(itemId);
  
  // Verify winner
  const item = await getItem(`ITEM#${itemId}`, 'METADATA');
  expect(item.status).toBe('Reserved');
  expect(item.winnerUserId).toBe(userId);
  expect(item.reservationExpiryTime).toBeDefined();
});
```

**Status:** PENDING

---

### TC-ITER5-005: Execute Lottery - Multiple Entries
**Type:** Unit (Automated)  
**Priority:** P0  
**Preconditions:** Item has 3 lottery entries

**Test Code:**
```typescript
test('executeLottery - multiple entries', async () => {
  const itemId = 'test-item-2';
  const users = ['user-1', 'user-2', 'user-3'];
  
  // Create item and entries
  await createItem({ itemId, status: 'Available' });
  for (const userId of users) {
    await createLotteryEntry({ itemId, userId });
  }
  
  // Execute lottery
  await executeLottery(itemId);
  
  // Verify winner
  const item = await getItem(`ITEM#${itemId}`, 'METADATA');
  expect(item.status).toBe('Reserved');
  expect(users).toContain(item.winnerUserId);
  expect(item.reservationExpiryTime).toBeDefined();
});
```

**Status:** PENDING

---

### TC-ITER5-006: Execute Lottery - Zero Entries
**Type:** Unit (Automated)  
**Priority:** P0  
**Preconditions:** Item has 0 lottery entries

**Test Code:**
```typescript
test('executeLottery - zero entries', async () => {
  const itemId = 'test-item-3';
  
  // Create item with no entries
  await createItem({ itemId, status: 'Available' });
  
  // Execute lottery
  await executeLottery(itemId);
  
  // Verify item expired
  const item = await getItem(`ITEM#${itemId}`, 'METADATA');
  expect(item.status).toBe('Expired');
  expect(item.winnerUserId).toBeUndefined();
});
```

**Status:** PENDING

---

### TC-ITER5-007: Confirm Pickup - Success
**Type:** API (Automated)  
**Priority:** P0  
**Preconditions:** User is winner, item status = "Reserved"

**Test Code:**
```typescript
test('POST /items/{itemId}/confirm-pickup - success', async () => {
  const response = await apiClient.post(`/items/${itemId}/confirm-pickup`, {
    headers: { Authorization: `Bearer ${winnerToken}` }
  });
  
  expect(response.status).toBe(200);
  
  // Verify status updated
  const item = await getItem(`ITEM#${itemId}`, 'METADATA');
  expect(item.status).toBe('Pickup_Confirmed');
});
```

**Status:** PENDING

---

### TC-ITER5-008: Confirm Pickup - Not Winner
**Type:** API (Automated)  
**Priority:** P0  
**Preconditions:** User is NOT winner

**Test Code:**
```typescript
test('POST /items/{itemId}/confirm-pickup - not winner', async () => {
  const response = await apiClient.post(`/items/${itemId}/confirm-pickup`, {
    headers: { Authorization: `Bearer ${otherUserToken}` }
  });
  
  expect(response.status).toBe(403);
  expect(response.body.error).toBe('Unauthorized');
});
```

**Status:** PENDING

---

### TC-ITER5-009: Mark as Picked Up - Success
**Type:** API (Automated)  
**Priority:** P0  
**Preconditions:** User is seller, item status = "Pickup_Confirmed"

**Test Code:**
```typescript
test('POST /items/{itemId}/mark-picked-up - success', async () => {
  const response = await apiClient.post(`/items/${itemId}/mark-picked-up`, {
    headers: { Authorization: `Bearer ${sellerToken}` }
  });
  
  expect(response.status).toBe(200);
  
  // Verify status updated
  const item = await getItem(`ITEM#${itemId}`, 'METADATA');
  expect(item.status).toBe('Picked_Up');
});
```

**Status:** PENDING

---

### TC-ITER5-010: Reservation Expiry - Re-listing
**Type:** Unit (Automated)  
**Priority:** P0  
**Preconditions:** Reservation expired (24h passed)

**Test Code:**
```typescript
test('reservationExpiry - re-list item', async () => {
  const itemId = 'test-item-4';
  
  // Create reserved item with expired reservation
  await createItem({
    itemId,
    status: 'Reserved',
    winnerUserId: 'user-1',
    reservationExpiryTime: new Date(Date.now() - 1000).toISOString()
  });
  
  // Execute expiry handler
  await handleReservationExpiry(itemId);
  
  // Verify item re-listed
  const item = await getItem(`ITEM#${itemId}`, 'METADATA');
  expect(item.status).toBe('Available');
  expect(item.winnerUserId).toBeUndefined();
  expect(item.lotteryEndTime).toBeDefined();
});
```

**Status:** PENDING

---

### Frontend Manual Tests

---

### TC-ITER5-011: Display Enter Lottery Button
**Type:** Manual  
**Priority:** P0  
**Preconditions:** User logged in, viewing Available item (not owner)

**Steps:**
1. Navigate to item detail page
2. Verify "Enter Lottery" button visible
3. Verify countdown timer shows time remaining

**Expected Result:**
- Button is green, 48px tall
- Text: "Enter Lottery"
- Countdown shows: "Lottery closes in Xh Ym"
- Button is enabled

**Status:** PENDING

---

### TC-ITER5-012: Enter Lottery - Click Button
**Type:** Manual  
**Priority:** P0  
**Preconditions:** User logged in, viewing Available item

**Steps:**
1. Click "Enter Lottery" button
2. Wait for API response
3. Verify button state changes

**Expected Result:**
- Loading spinner shows during API call
- Success toast: "You're in the lottery! Winner announced in X hours"
- Button changes to "You're in lottery ✓" (green, disabled)
- Countdown timer still visible

**Status:** PENDING

---

### TC-ITER5-013: Countdown Timer - Updates
**Type:** Manual  
**Priority:** P1  
**Preconditions:** Item with lottery ending in 2 hours

**Steps:**
1. View item detail page
2. Note countdown time
3. Wait 1 minute
4. Refresh page
5. Verify countdown decreased by 1 minute

**Expected Result:**
- Timer updates correctly
- Format: "1h 59m left" → "1h 58m left"
- Timer turns red when <1 hour left

**Status:** PENDING

---

### TC-ITER5-014: Winner Notification Banner
**Type:** Manual  
**Priority:** P0  
**Preconditions:** User won lottery

**Steps:**
1. Navigate to home page
2. Verify banner appears at top
3. Click banner

**Expected Result:**
- Banner shows: "🎉 You won [Item Title]! Confirm pickup within 24 hours"
- Banner is green, prominent
- Clicking banner navigates to item detail page
- Banner has dismiss button (X)

**Status:** PENDING

---

### TC-ITER5-015: Reservation Card - Winner View
**Type:** Manual  
**Priority:** P0  
**Preconditions:** User is winner, item status = "Reserved"

**Steps:**
1. Navigate to item detail page
2. Verify reservation card visible
3. Verify countdown timer

**Expected Result:**
- Card shows "Reserved for You" badge (green)
- Countdown: "Reservation expires in 23h 45m"
- Seller contact info visible (name, city)
- "Confirm Pickup" button visible (green, 48px tall)

**Status:** PENDING

---

### TC-ITER5-016: Confirm Pickup - Click Button
**Type:** Manual  
**Priority:** P0  
**Preconditions:** User is winner, viewing reservation card

**Steps:**
1. Click "Confirm Pickup" button
2. Wait for API response
3. Verify status changes

**Expected Result:**
- Loading spinner during API call
- Success toast: "Pickup confirmed! Contact seller to arrange details"
- Button changes to "Pickup Confirmed ✓" (disabled)
- Status badge changes to "Pickup Confirmed"

**Status:** PENDING

---

### TC-ITER5-017: Mark as Picked Up - Seller View
**Type:** Manual  
**Priority:** P0  
**Preconditions:** User is seller, item status = "Pickup_Confirmed"

**Steps:**
1. Navigate to item detail page
2. Verify "Mark as Picked Up" button visible
3. Click button
4. Confirm in dialog

**Expected Result:**
- Button visible below item details
- Confirmation dialog: "Confirm that [Winner Name] picked up this item?"
- After confirm: Success toast "Item marked as picked up"
- Redirect to profile page
- Item removed from My Items

**Status:** PENDING

---

### TC-ITER5-018: Countdown Timer - Item Cards
**Type:** Manual  
**Priority:** P1  
**Preconditions:** Viewing home page with Available items

**Steps:**
1. Navigate to home page
2. Verify countdown timers on item cards
3. Verify format

**Expected Result:**
- Each Available item shows countdown
- Format: "3h 45m left" (compact)
- Text is gray, subtle
- No layout overflow

**Status:** PENDING

---

### TC-ITER5-019: Lottery State Persistence
**Type:** Manual  
**Priority:** P0  
**Preconditions:** User entered lottery

**Steps:**
1. Enter lottery for item
2. Refresh page
3. Verify "You're in lottery" state persists

**Expected Result:**
- Button still shows "You're in lottery ✓"
- State loaded from LotteryContext
- No API call needed (cached)

**Status:** PENDING

---

### TC-ITER5-020: Mobile - Enter Lottery
**Type:** Manual  
**Priority:** P0  
**Preconditions:** Mobile device (390x844)

**Steps:**
1. Navigate to item detail on mobile
2. Tap "Enter Lottery" button
3. Verify responsive layout

**Expected Result:**
- Button is 48px tall (easy to tap)
- Countdown timer readable (≥16px)
- Toast notification visible
- No horizontal scrolling

**Status:** PENDING

---

### TC-ITER5-021: Mobile - Winner Notification
**Type:** Manual  
**Priority:** P0  
**Preconditions:** Mobile device, user won lottery

**Steps:**
1. Navigate to home page on mobile
2. Verify banner visible
3. Tap banner

**Expected Result:**
- Banner full width
- Text readable (≥16px)
- Tapping navigates to item detail
- Banner doesn't overflow

**Status:** PENDING

---

### TC-ITER5-022: Mobile - Reservation Card
**Type:** Manual  
**Priority:** P0  
**Preconditions:** Mobile device, user is winner

**Steps:**
1. Navigate to item detail on mobile
2. Verify reservation card layout
3. Tap "Confirm Pickup"

**Expected Result:**
- Card fits screen width
- All text readable
- Button is 48px tall
- Countdown visible

**Status:** PENDING

---

### E2E Tests (Critical Flows)

---

### TC-ITER5-023: E2E - Complete Lottery Flow
**Type:** E2E (Manual or Playwright)  
**Priority:** P0  
**Preconditions:** Clean database

**Steps:**
1. Register and login as Seller
2. Create item with 1-hour lottery window
3. Logout
4. Register and login as Buyer
5. Enter lottery
6. Manually trigger lottery execution (backend)
7. Verify winner notification
8. Confirm pickup
9. Logout
10. Login as Seller
11. Mark as picked up
12. Verify item status = "Picked_Up"

**Expected Result:**
- Complete flow works end-to-end
- All state transitions correct
- All notifications shown
- No errors in console

**Status:** PENDING

---

### TC-ITER5-024: E2E - Multiple Buyers
**Type:** E2E (Manual)  
**Priority:** P0  
**Preconditions:** Clean database

**Steps:**
1. Create item as Seller
2. Enter lottery as Buyer A
3. Enter lottery as Buyer B
4. Enter lottery as Buyer C
5. Trigger lottery execution
6. Verify only 1 winner
7. Verify losers don't see notification

**Expected Result:**
- Random winner selected
- Only winner sees banner
- Losers can still browse items

**Status:** PENDING

---

### TC-ITER5-025: E2E - Reservation Expiry
**Type:** E2E (Manual)  
**Priority:** P0  
**Preconditions:** Clean database

**Steps:**
1. Create item as Seller
2. Enter lottery as Buyer
3. Win lottery
4. DO NOT confirm pickup
5. Manually trigger expiry (backend)
6. Verify item re-listed
7. Verify new lottery window

**Expected Result:**
- Item status = "Available"
- New lottery window = 6 hours
- Previous entries cleared
- Item appears in feed again

**Status:** PENDING

---

## 5. Test Execution Plan

### Phase 1: Backend API Tests (Day 1)
- Run automated tests: TC-ITER5-001 through TC-ITER5-010
- Fix any failing tests
- Verify 100% pass rate

### Phase 2: Frontend Manual Tests (Days 2-3)
- Execute manual tests: TC-ITER5-011 through TC-ITER5-022
- Test on desktop and mobile
- Document any bugs

### Phase 3: E2E Tests (Day 4)
- Execute E2E tests: TC-ITER5-023 through TC-ITER5-025
- Test complete user flows
- Verify all integrations work

### Phase 4: Regression Testing (Day 5)
- Re-run ITER4 test cases
- Verify no regressions
- Test edge cases

---

## 6. Risk Assessment

### High Risk Areas
1. **Concurrent lottery entries** - Multiple users entering at exact same time
2. **Reservation expiry timing** - EventBridge scheduler accuracy
3. **State synchronization** - Frontend state vs backend state
4. **Random winner selection** - Ensure true randomness, no bias

### Mitigation Strategies
1. Add database constraints to prevent duplicate entries
2. Test EventBridge scheduler with short windows (1 minute)
3. Implement polling for winner status
4. Use crypto.randomInt() for winner selection

---

## 7. Performance Requirements

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Enter lottery API | <500ms | Chrome DevTools Network tab |
| Confirm pickup API | <500ms | Chrome DevTools Network tab |
| Lottery execution | <5s | CloudWatch logs |
| Winner notification load | <1s | Page load time |
| Countdown timer update | 60s interval | No performance impact |

---

## 8. Accessibility Checklist

- [ ] All buttons have aria-labels
- [ ] Countdown timers have aria-live regions
- [ ] Winner banner has role="alert"
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Screen reader announces state changes
- [ ] Color contrast meets WCAG AA (4.5:1)

---

## 9. Success Criteria

This iteration is successful when:
- [ ] All 25 test cases pass
- [ ] Zero P0 bugs found
- [ ] Complete lottery flow works end-to-end
- [ ] Mobile UX is excellent
- [ ] Performance meets requirements
- [ ] No regressions in ITER4 features

---

## 10. Test Results Summary

**Total Test Cases:** 25  
**Passed:** 0 (not executed yet)  
**Failed:** 0  
**Blocked:** 0  
**Skipped:** 0

**Pass Rate:** TBD

---

## 11. Notes for Developers

### Testing Tips
1. **Use short lottery windows** (1-5 minutes) for faster testing
2. **Mock EventBridge** in local tests to avoid waiting
3. **Use multiple browser profiles** to simulate multiple users
4. **Check CloudWatch logs** for lottery execution details

### Common Issues to Watch For
1. Race conditions in concurrent lottery entries
2. Timezone issues with countdown timers
3. State not updating after API calls
4. Winner notification not appearing immediately

---

## 12. Sign-Off

**Created By:** QA Engineer  
**Date:** 2026-03-04  
**Status:** 📋 READY FOR IMPLEMENTATION

**Next Steps:**
1. Developers implement ITER5 tasks
2. QA executes test cases during development
3. QA performs final regression testing
4. QA signs off for production deployment
