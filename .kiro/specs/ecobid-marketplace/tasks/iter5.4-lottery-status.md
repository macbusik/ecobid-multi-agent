# Phase 13: Iteration 5.4 - Lottery Result Status

**Status:** 0/3 tasks complete  
**Focus:** Clear lottery participation status after lottery closes  
**Priority:** P1 (High - User Experience)

## Business Context

**Problem:** Users don't know their lottery outcome after it closes. Current system shows:
- "Lottery closed - waiting for results" (no status)
- "Winner selected" (but am I the winner?)
- No indication if user is in queue (backup winner)

**User Confusion:**
- "Did I win?"
- "Should I wait for pickup confirmation?"
- "Can I enter other lotteries?"

**Solution:** Show clear status badges for each lottery participation:
1. **🎉 Won** - You're the winner, confirm pickup
2. **⏳ In Queue** - You're backup (position #2, #3, etc.)
3. **❌ Not Selected** - Better luck next time

---

## Lottery Result States

### Current Backend Logic (EventBridge Scheduler)
When lottery closes, Lambda selects:
1. **Winner** - First selected user (status: Reserved, winnerId set)
2. **Queue** - Next 2-3 users as backup (if winner doesn't confirm)
3. **Not Selected** - All other participants

### Frontend Display Logic

**Item Detail Page:**
```
┌─────────────────────────────────┐
│ Lottery Status                  │
├─────────────────────────────────┤
│ 🎉 You Won!                     │
│ Confirm pickup within 24 hours  │
│ [Confirm Pickup]                │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Lottery Status                  │
├─────────────────────────────────┤
│ ⏳ You're in Queue (Position #2)│
│ You'll be notified if winner    │
│ doesn't confirm pickup          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Lottery Status                  │
├─────────────────────────────────┤
│ ❌ Not Selected This Time       │
│ Keep trying! More items daily   │
└─────────────────────────────────┘
```

**Profile Page - My Lottery Entries:**
```
[Photo] Vintage Chair
        🎉 You won! Confirm pickup
        [Won] badge (green)

[Photo] IKEA Desk
        ⏳ In queue (Position #2)
        [Queue] badge (yellow)

[Photo] Yoga Mat
        ❌ Not selected
        [Lost] badge (gray)
```

---

### ITER5.4-1: Add Queue Position to Item Model
**Agent:** `backend_engineer` + `frontend_engineer`
**Priority:** P1 (High)
**Estimated Time:** 1 hour
**Status:** TODO

**Description:**
Add `queuePosition` field to Item model to track backup winners. When lottery closes, Lambda assigns:
- `winnerId` = first selected user
- `queueUsers` = array of backup user IDs with positions

**Backend Changes:**
```typescript
// Item interface
interface Item {
  // ... existing fields
  winnerId?: string;           // Current winner
  queueUsers?: QueueUser[];    // Backup winners
}

interface QueueUser {
  userId: string;
  position: number;  // 1, 2, 3
  notifiedAt?: string;
}
```

**Mock Implementation:**
```typescript
// mock-client.ts
export const setLotteryResult = (itemId: string, winnerId: string, queueUserIds: string[]): void => {
  const item = mockItems.find(i => i.itemId === itemId);
  if (item) {
    item.status = 'Reserved';
    item.winnerId = winnerId;
    item.queueUsers = queueUserIds.map((userId, index) => ({
      userId,
      position: index + 1,
    }));
  }
  
  // Save winner to localStorage
  const wonIds = getWonItemIds();
  if (!wonIds.includes(itemId)) {
    wonIds.push(itemId);
    localStorage.setItem(STORAGE_KEYS.WON_ITEMS, JSON.stringify(wonIds));
  }
};
```

**Acceptance Criteria:**
- [ ] Add `queueUsers` field to Item interface in types/index.ts
- [ ] Add `QueueUser` interface with userId and position
- [ ] Create `setLotteryResult()` helper in mock-client.ts
- [ ] Export helper for manual testing
- [ ] Update mock data to include queue examples
- [ ] Test: Set lottery result → Item has winnerId and queueUsers

**Files to Modify:**
- `frontend/src/lib/types/index.ts` - Add queueUsers field
- `frontend/src/lib/api/mock-client.ts` - Add setLotteryResult helper

---

### ITER5.4-2: Add Lottery Status Component
**Agent:** `frontend_engineer`
**Priority:** P1 (High)
**Estimated Time:** 1.5 hours
**Status:** TODO

**Description:**
Create reusable `LotteryStatus` component that shows user's participation status after lottery closes.

**Component API:**
```typescript
interface LotteryStatusProps {
  item: Item;
  userId: string;
  compact?: boolean;  // For item cards
}

// Usage:
<LotteryStatus item={item} userId={user.userId} />
```

**Status Logic:**
```typescript
function getLotteryStatus(item: Item, userId: string): LotteryStatusType {
  if (item.status !== 'Reserved' && item.status !== 'Lottery_Closed') {
    return 'active'; // Lottery still running
  }
  
  if (item.winnerId === userId) {
    return 'won';
  }
  
  const queuePosition = item.queueUsers?.find(q => q.userId === userId)?.position;
  if (queuePosition) {
    return { type: 'queue', position: queuePosition };
  }
  
  // User entered but not selected
  const lotteryEntries = getLotteryEntries();
  if (lotteryEntries.includes(item.itemId)) {
    return 'not_selected';
  }
  
  return 'not_entered';
}
```

**UI Design:**
```tsx
// Won status
<div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
  <div className="flex items-center gap-2 mb-2">
    <span className="text-2xl">🎉</span>
    <h3 className="font-bold text-green-900">You Won!</h3>
  </div>
  <p className="text-sm text-green-700 mb-3">
    Confirm pickup within 24 hours or item goes to next in queue
  </p>
  <button className="w-full bg-green-600 text-white py-2 rounded-lg">
    Confirm Pickup
  </button>
</div>

// Queue status
<div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-4">
  <div className="flex items-center gap-2 mb-2">
    <span className="text-2xl">⏳</span>
    <h3 className="font-bold text-yellow-900">You're in Queue</h3>
  </div>
  <p className="text-sm text-yellow-700">
    Position #{position} • You'll be notified if winner doesn't confirm
  </p>
</div>

// Not selected status
<div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
  <div className="flex items-center gap-2 mb-2">
    <span className="text-2xl">❌</span>
    <h3 className="font-bold text-gray-900">Not Selected This Time</h3>
  </div>
  <p className="text-sm text-gray-600">
    Keep trying! More items are added daily
  </p>
</div>
```

**Acceptance Criteria:**
- [ ] Create `LotteryStatus.tsx` component
- [ ] Implement status detection logic (won/queue/not_selected)
- [ ] Design 3 status cards (won, queue, not selected)
- [ ] Add compact mode for item cards
- [ ] Show countdown for winner (24h to confirm)
- [ ] Show queue position for backup winners
- [ ] Test: Won status → Shows confirm button
- [ ] Test: Queue status → Shows position number
- [ ] Test: Not selected → Shows encouragement message

**Dependencies:** ITER5.4-1 (queueUsers field must exist)

**Files to Create:**
- `frontend/src/components/lottery/LotteryStatus.tsx`

---

### ITER5.4-3: Integrate Lottery Status in UI
**Agent:** `frontend_engineer`
**Priority:** P1 (High)
**Estimated Time:** 1 hour
**Status:** TODO

**Description:**
Add `LotteryStatus` component to item detail page and profile lottery entries.

**Item Detail Page:**
```tsx
// ItemDetail.tsx
{item.status === 'Reserved' || item.status === 'Lottery_Closed' ? (
  <LotteryStatus item={item} userId={user.userId} />
) : (
  <LotteryButton itemId={item.itemId} />
)}
```

**Profile Page - Lottery Entries:**
```tsx
// Profile.tsx
{lotteryItems.map(item => (
  <div key={item.itemId}>
    {/* ... item info ... */}
    <LotteryStatus item={item} userId={user.userId} compact />
  </div>
))}
```

**Acceptance Criteria:**
- [ ] Add LotteryStatus to ItemDetail page (replace lottery button when closed)
- [ ] Add LotteryStatus to Profile lottery entries (compact mode)
- [ ] Update item card badges to show Won/Queue/Lost
- [ ] Test: Item detail shows correct status
- [ ] Test: Profile shows status for all lottery entries
- [ ] Test: Badges match status (green/yellow/gray)

**Dependencies:** ITER5.4-2 (LotteryStatus component must exist)

**Files to Modify:**
- `frontend/src/pages/ItemDetail.tsx`
- `frontend/src/pages/Profile.tsx`
- `frontend/src/components/item/ItemCard.tsx` (optional - add badge)

---

## Manual Testing Tool

**Set Lottery Result (Browser Console):**
```javascript
// Import helper
import { setLotteryResult } from './lib/api/mock-client';

// Get current user ID
const clientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID;
const lastAuthUserKey = `CognitoIdentityServiceProvider.${clientId}.LastAuthUser`;
const username = localStorage.getItem(lastAuthUserKey);
const userIdKey = `CognitoIdentityServiceProvider.${clientId}.${username}.idToken`;
const idToken = localStorage.getItem(userIdKey);
const payload = JSON.parse(atob(idToken.split('.')[1]));
const myUserId = payload.sub;

// Scenario 1: I won
setLotteryResult('item-123', myUserId, ['other-user-1', 'other-user-2']);

// Scenario 2: I'm in queue (position 2)
setLotteryResult('item-456', 'other-user-winner', [myUserId, 'other-user-3']);

// Scenario 3: I'm not selected (just close lottery, don't add me)
setLotteryResult('item-789', 'other-user-winner', ['other-user-1', 'other-user-2']);

// Refresh to see status
location.reload();
```

---

## Summary: ITER5.4

**Total Tasks:** 3  
**Estimated Time:** 3.5 hours  
**Priority:** P1 (High)

**Features to Deliver:**
- ✅ Queue position tracking (backup winners)
- ✅ Clear status display (won/queue/not selected)
- ✅ Integrated in item detail and profile pages

**Impact:**
- **User Clarity:** No more confusion about lottery outcome
- **Engagement:** Queue users stay engaged (might still win)
- **Transparency:** Clear feedback on participation

**User Experience:**
```
Before ITER5.4:
"Lottery closed - waiting for results" 🤷 (What does this mean?)

After ITER5.4:
"🎉 You won! Confirm pickup" ✅ (Clear action)
"⏳ In queue (Position #2)" ✅ (Clear status)
"❌ Not selected" ✅ (Clear outcome)
```

**Business Value:**
- Reduces support questions ("Did I win?")
- Increases trust (transparent lottery system)
- Improves retention (queue users stay hopeful)
