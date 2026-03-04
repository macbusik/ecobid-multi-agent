# Phase 11: Iteration 5.2 - Advanced Lottery Features

**Status:** 4/4 tasks complete ✅  
**Focus:** Enhanced user control and real-time feedback for lottery system  
**Priority:** P1 (High - User Experience Improvements)

## Business Context

Users need more control over their lottery participation and better awareness of time-sensitive actions. Current system lacks:
1. Ability to withdraw from lottery (user commitment flexibility)
2. Precise countdown visibility (creates urgency and clarity)
3. Winner notification awareness (users miss opportunities)

These features improve user engagement and reduce missed pickups.

---

### ITER5.2-1: Allow Users to Leave Lottery
**Agent:** `frontend_engineer` + `backend_engineer`
**Priority:** P1 (High)
**Estimated Time:** 2 hours
**Status:** TODO

**Description:**
Allow users to withdraw from lottery before the lottery closes. This gives users flexibility if they change their mind or find the item elsewhere.

**Business Value:**
- Reduces no-shows (users who entered but no longer want the item)
- Improves winner quality (only committed users remain)
- Better user experience (flexibility and control)

**Acceptance Criteria:**
- [ ] Add "Leave Lottery" button next to "You're in lottery ✓" state
- [ ] Button is red/orange with warning style
- [ ] Show confirmation dialog: "Are you sure you want to leave this lottery?"
- [ ] Call API: `DELETE /items/{itemId}/lottery` to remove entry
- [ ] Update UI immediately after successful removal
- [ ] Show toast: "You've left the lottery"
- [ ] Button only shows if lottery is still active (not closed)
- [ ] Backend: Remove user from lottery entries in DynamoDB
- [ ] Backend: Return success response

**Edge Cases:**
- User tries to leave after lottery closed → Show error "Lottery already closed"
- User tries to leave after winning → Show error "You've already won"
- Network error during leave → Show retry option

**Dependencies:** None

**Files to Create:**
- `infrastructure/lib/lambda/handlers/leaveLottery.ts` (backend)

**Files to Modify:**
- `frontend/src/components/lottery/LotteryButton.tsx`
- `frontend/src/lib/api/client.ts`
- `infrastructure/lib/constructs/api.ts` (add DELETE route)

---

### ITER5.2-2: Add Precise HH:MM:SS Countdown Timer
**Agent:** `frontend_engineer`
**Priority:** P1 (High)
**Estimated Time:** 1.5 hours
**Status:** TODO

**Description:**
Replace current countdown format ("3h 45m left") with precise HH:MM:SS format that updates every second. Creates urgency and clarity for users.

**Business Value:**
- Increases urgency (users see seconds ticking down)
- Reduces confusion (exact time remaining)
- Better mobile UX (compact format)

**Acceptance Criteria:**
- [ ] Update LotteryCountdown component to show HH:MM:SS format
- [ ] Format: "02:45:30" for 2 hours 45 minutes 30 seconds
- [ ] Format: "00:45:30" for less than 1 hour
- [ ] Format: "00:00:45" for less than 1 minute (red text)
- [ ] Update every 1 second (not 60 seconds)
- [ ] Show "Closed" when time reaches 00:00:00
- [ ] Add optional label: "Closes in: 02:45:30"
- [ ] Compact mode for item cards: just "02:45:30"
- [ ] Full mode for item detail: "Lottery closes in 02:45:30"
- [ ] Red text when <5 minutes remaining
- [ ] Yellow text when <30 minutes remaining

**Performance Considerations:**
- Use single setInterval per component (not multiple)
- Clean up interval on unmount
- Optimize re-renders (only update when second changes)

**Dependencies:** None

**Files to Modify:**
- `frontend/src/components/lottery/LotteryCountdown.tsx`

---

### ITER5.2-3: Add Winner Notification Badge
**Agent:** `frontend_engineer`
**Priority:** P1 (High)
**Estimated Time:** 1 hour
**Status:** TODO

**Description:**
Add a small notification badge/button in the navigation bar that shows when user has won a lottery. Clicking it navigates to the won item.

**Business Value:**
- Reduces missed pickups (users see notification immediately)
- Increases engagement (users check app more often)
- Better than email (instant, in-app notification)

**Acceptance Criteria:**
- [ ] Add notification bell icon to navigation bar (top-right)
- [ ] Show red badge with count when user has won items
- [ ] Badge shows number of pending reservations (status: Reserved, not Pickup_Confirmed)
- [ ] Clicking bell opens dropdown with won items list
- [ ] Dropdown shows: item image, title, "Confirm pickup" button
- [ ] Clicking item navigates to item detail page
- [ ] Badge disappears when all items are confirmed
- [ ] Check for won items on app load and every 5 minutes
- [ ] Mobile-friendly (48px touch target)
- [ ] Desktop: dropdown menu
- [ ] Mobile: navigate to dedicated "My Wins" page

**UI Design:**
```
[🔔 2]  ← Badge with count
  ↓ (click)
┌─────────────────────────┐
│ 🎉 You Won!             │
├─────────────────────────┤
│ [img] IKEA Desk         │
│       Confirm pickup    │
├─────────────────────────┤
│ [img] Yoga Mat          │
│       Confirm pickup    │
└─────────────────────────┘
```

**Dependencies:** None

**Files to Create:**
- `frontend/src/components/lottery/WinnerNotificationBadge.tsx`

**Files to Modify:**
- `frontend/src/components/layout/Navigation.tsx` (or equivalent)
- `frontend/src/lib/api/client.ts` (use existing getWonItems)

---

### ITER5.2-4: Add "My Wins" Page (Mobile)
**Agent:** `frontend_engineer`
**Priority:** P2 (Medium)
**Estimated Time:** 1 hour
**Status:** TODO

**Description:**
Create dedicated page for mobile users to see all their won items and pending reservations.

**Business Value:**
- Better mobile UX (dropdown doesn't work well on mobile)
- Central place to manage won items
- Reduces missed pickups

**Acceptance Criteria:**
- [ ] Create `/wins` route
- [ ] Show all items where user is winner
- [ ] Group by status: "Pending Confirmation" and "Confirmed"
- [ ] Each item shows: image, title, countdown, "Confirm Pickup" button
- [ ] Empty state: "No wins yet. Keep entering lotteries!"
- [ ] Link from notification badge on mobile
- [ ] Show reservation expiry countdown for each item
- [ ] Red warning when <3 hours remaining
- [ ] Mobile-optimized layout

**Dependencies:** ITER5.2-3

**Files to Create:**
- `frontend/src/pages/Wins.tsx`

**Files to Modify:**
- `frontend/src/App.tsx` (add route)

---

## Summary: ITER5.2

**Total Tasks:** 4  
**Estimated Time:** 5.5-6.5 hours (1 day)  
**Priority:** P1-P2 (High to Medium)

**Features to Deliver:**
- ✅ Leave lottery functionality (user flexibility)
- ✅ Precise HH:MM:SS countdown (urgency and clarity)
- ✅ Winner notification badge (reduce missed pickups)
- ✅ My Wins page for mobile (better UX)

**Impact:**
- **User Control:** Users can leave lottery if they change their mind
- **Urgency:** Precise countdown creates FOMO and drives action
- **Awareness:** Notification badge ensures users don't miss wins
- **Mobile UX:** Dedicated wins page for mobile users

**Success Metrics:**
- Reduce missed pickups by 30%
- Increase lottery participation by 20%
- Improve user satisfaction (fewer complaints about missed notifications)

---

## Technical Notes

### Backend Changes Required
- Add `DELETE /items/{itemId}/lottery` endpoint
- Remove user from lottery entries in DynamoDB
- Validate lottery is still active

### Frontend Changes Required
- Update LotteryButton with "Leave Lottery" option
- Rewrite LotteryCountdown to show HH:MM:SS
- Add WinnerNotificationBadge to navigation
- Create Wins page for mobile

### API Contract: Leave Lottery

**Request:**
```
DELETE /items/{itemId}/lottery
Authorization: Bearer {token}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "You've left the lottery"
}
```

**Response (Error - Lottery Closed):**
```json
{
  "error": "Lottery already closed"
}
```

**Response (Error - Already Won):**
```json
{
  "error": "You've already won this lottery"
}
```

### DynamoDB Changes
No schema changes required. Use existing lottery entries structure:
- PK: `ITEM#{itemId}`
- SK: `LOTTERY#{userId}`
- Delete this record to remove user from lottery
