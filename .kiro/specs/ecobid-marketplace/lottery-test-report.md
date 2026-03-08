# Lottery Functionality Test Report
**Date:** 2026-03-08  
**Tester:** Product Owner  
**Environment:** Mock Mode (`VITE_USE_MOCK_DATA=true`)  
**Deployment:** Job #42

---

## Executive Summary

**Status:** ⚠️ PARTIALLY WORKING - Critical issues found

**Working Features:** 3/7 (43%)  
**Broken Features:** 4/7 (57%)

---

## Test Results

### ✅ WORKING

#### 1. Enter Lottery
- **Status:** ✅ PASS
- **Test:** Click "Enter Lottery" button on item detail page
- **Result:** Button changes to "You're in lottery ✓"
- **Persistence:** Saved to localStorage
- **Notes:** Works correctly

#### 2. Leave Lottery (ITER5.2-1)
- **Status:** ✅ PASS
- **Test:** Click "Leave" button next to "You're in lottery ✓"
- **Result:** Confirmation dialog appears, entry removed
- **UI Update:** Button reverts to "Enter Lottery"
- **Notes:** Works correctly

#### 3. HH:MM:SS Countdown (ITER5.2-2)
- **Status:** ✅ PASS
- **Test:** View countdown on item cards and detail page
- **Result:** Shows format "02:45:30", updates every second
- **Color Coding:** Red when <5 min, yellow when <30 min
- **Notes:** Works correctly

---

### ❌ BROKEN

#### 4. My Items on Profile Page
- **Status:** ❌ FAIL
- **Issue:** Created items don't appear in "My Items" section
- **Root Cause:** 
  - Mock `items.create()` sets `sellerId: 'current-user'`
  - Profile page filters by `user?.userId` (real Cognito UUID)
  - Mismatch: `'current-user'` !== `'abc-123-cognito-uuid'`
- **Expected:** Show items created by logged-in user
- **Actual:** Empty state "No items listed yet"
- **Impact:** HIGH - Users can't manage their listings

**Fix Required:**
```typescript
// In mock-client.ts, line 52
sellerId: 'current-user',  // ❌ Wrong
// Should be:
sellerId: data.sellerId || 'mock-user-id',  // ✅ Pass from NewItem.tsx
```

#### 5. Winner Notification Badge (ITER5.2-3)
- **Status:** ❌ FAIL
- **Issue:** Badge never appears even when user wins lottery
- **Root Cause:** 
  - Calls `apiClient.getWonItems()` which doesn't exist
  - Mock API has no `getWonItems()` method
  - No lottery winner selection logic in mock mode
- **Expected:** Bell icon with red badge showing won items count
- **Actual:** Badge never appears
- **Impact:** HIGH - Users miss pickup opportunities

**Fix Required:**
1. Add `getWonItems()` to mock API
2. Implement mock lottery winner selection
3. Store winners in localStorage

#### 6. My Wins Page (ITER5.2-4)
- **Status:** ❌ FAIL
- **Issue:** Page exists but shows no data
- **Root Cause:** Same as #5 - no `getWonItems()` method
- **Expected:** List of won items with "Confirm Pickup" buttons
- **Actual:** Empty or error
- **Impact:** MEDIUM - Workaround via notification badge (but that's also broken)

#### 7. Lottery Entries on Profile Page
- **Status:** ⚠️ PARTIAL
- **Issue:** Shows entered lotteries but no winner indication
- **Root Cause:** No mock lottery execution logic
- **Expected:** 
  - Show "🎉 You won!" for won items
  - Show "❌ Not selected" for lost lotteries
- **Actual:** All items show as "Active" or "Closed" with no winner info
- **Impact:** MEDIUM - Users don't know if they won

---

## Critical Issues Summary

### Issue #1: My Items Not Showing (HIGH Priority)
**Problem:** `sellerId` mismatch between mock creation and real user ID  
**Affected:** Profile page "My Items" section  
**User Impact:** Can't see, edit, or delete their own items  

**Solution:**
```typescript
// frontend/src/lib/api/mock-client.ts
create: async (data: CreateItemRequest): Promise<CreateItemResponse> => {
  await delay(1500);
  const newItem: Item = {
    itemId: `item-${Date.now()}`,
    sellerId: data.sellerId, // ✅ Use real user ID from request
    // ... rest of fields
  };
  mockItems.unshift(newItem);
  return { itemId: newItem.itemId, photoUrl: newItem.photoUrl };
},
```

```typescript
// frontend/src/pages/NewItem.tsx (line ~150)
const response = await items.create({
  title: aiResult.title,
  description: aiResult.description,
  category: aiResult.category,
  city: user.city || 'Unknown',
  photoUrl: s3Url,
  lotteryWindowHours: parseInt(lotteryWindow),
  sellerId: user.userId, // ✅ Pass real user ID
});
```

### Issue #2: No Winner Notifications (HIGH Priority)
**Problem:** Missing `getWonItems()` API and lottery execution logic  
**Affected:** Winner notification badge, My Wins page  
**User Impact:** Users don't know when they win, miss pickup deadlines  

**Solution:**
1. Add `getWonItems()` to mock API:
```typescript
// frontend/src/lib/api/mock-client.ts
getWonItems: async (): Promise<Item[]> => {
  await delay(300);
  const wonItemIds = getWonItems(); // From localStorage
  return mockItems.filter(item => wonItemIds.includes(item.itemId));
},
```

2. Add localStorage helper:
```typescript
const STORAGE_KEYS = {
  LOTTERY_ENTRIES: 'ecobid_lottery_entries',
  WON_ITEMS: 'ecobid_won_items', // ✅ New
};

const getWonItems = (): string[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.WON_ITEMS);
  return stored ? JSON.parse(stored) : [];
};
```

3. Mock lottery execution (simulate winner selection):
```typescript
// Run when lottery closes (manual trigger or timer)
const executeLottery = (itemId: string, winnerId: string): void => {
  const wonItems = getWonItems();
  wonItems.push(itemId);
  localStorage.setItem(STORAGE_KEYS.WON_ITEMS, JSON.stringify(wonItems));
  
  // Update item status to Reserved
  const item = mockItems.find(i => i.itemId === itemId);
  if (item) {
    item.status = 'Reserved';
    item.winnerId = winnerId;
  }
};
```

### Issue #3: No Lottery Winner Indication (MEDIUM Priority)
**Problem:** Users don't know if they won or lost after lottery closes  
**Affected:** Profile page "My Lottery Entries" section  
**User Impact:** Confusion, users keep checking manually  

**Solution:**
- Add winner badge to lottery entries list
- Show "🎉 You won!" or "Not selected this time"
- Link to item detail for pickup confirmation

---

## Recommendations

### Immediate Fixes (Before Demo)
1. **Fix My Items** - Add `sellerId` to create request (30 min)
2. **Add getWonItems()** - Mock API method (1 hour)
3. **Manual Winner Selection** - Add dev tool to mark winners (30 min)

### Post-MVP Improvements
4. **Automatic Lottery Execution** - Timer-based winner selection
5. **Push Notifications** - Real-time alerts when user wins
6. **Email Notifications** - Backup for missed in-app notifications

---

## Test Environment Details

**Mock Data:**
- 10 pre-seeded items in `mock-data.ts`
- localStorage for lottery entries
- No automatic lottery execution

**Real Services:**
- ✅ Cognito authentication (real login required)
- ✅ S3 photo upload
- ✅ Amazon Nova Lite AI analysis

**Mocked Services:**
- ✅ Item creation (adds to feed)
- ✅ Lottery entry/leave (localStorage)
- ❌ Lottery execution (not implemented)
- ❌ Winner selection (not implemented)

---

## Next Steps

1. **Create tasks in tasks.md** for fixes
2. **Prioritize:** Issue #1 (My Items) and #2 (Winner Notifications)
3. **Implement fixes** (estimated 2-3 hours)
4. **Re-test** all lottery flows
5. **Deploy** updated version

---

## Appendix: Manual Test Steps

### Test 1: Create Item and Verify in Profile
1. Login with real Cognito account
2. Navigate to "New Item"
3. Upload photo (real AI analysis)
4. Publish item
5. Navigate to Profile → My Items
6. **Expected:** See newly created item
7. **Actual:** ❌ Empty state

### Test 2: Enter Lottery and Check Notifications
1. Browse items
2. Click "Enter Lottery" on any item
3. Wait for lottery to close (or manually change `lotteryEndTime`)
4. Check notification bell icon
5. **Expected:** Red badge with count
6. **Actual:** ❌ No badge appears

### Test 3: View My Wins Page
1. Navigate to `/wins` (or click notification badge)
2. **Expected:** List of won items
3. **Actual:** ❌ Empty or error

### Test 4: Leave Lottery
1. Enter lottery on any item
2. Click "Leave" button
3. Confirm in dialog
4. **Expected:** Entry removed, button reverts
5. **Actual:** ✅ Works correctly

### Test 5: Countdown Timer
1. View any active lottery item
2. Observe countdown format
3. **Expected:** "HH:MM:SS" updating every second
4. **Actual:** ✅ Works correctly
