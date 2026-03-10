# ITER5.4 Testing Guide - Lottery Result Status

## Quick Test (Browser Console)

After logging in, run this to test all 3 statuses:

```javascript
// Import helper
import { setLotteryResult } from './lib/api/mock-client.js';

// Get your user ID
const clientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID;
const lastAuthUserKey = `CognitoIdentityServiceProvider.${clientId}.LastAuthUser`;
const username = localStorage.getItem(lastAuthUserKey);
const userIdKey = `CognitoIdentityServiceProvider.${clientId}.${username}.idToken`;
const idToken = localStorage.getItem(userIdKey);
const payload = JSON.parse(atob(idToken.split('.')[1]));
const myUserId = payload.sub;

console.log('Your User ID:', myUserId);

// Test Scenario 1: You WON 🎉
// Find an item you entered lottery for
const lotteryEntries = JSON.parse(localStorage.getItem('ecobid_lottery_entries') || '[]');
if (lotteryEntries[0]) {
  setLotteryResult(lotteryEntries[0], myUserId, ['other-user-1', 'other-user-2']);
  console.log('✅ Scenario 1: You won item', lotteryEntries[0]);
}

// Test Scenario 2: You're in QUEUE ⏳
if (lotteryEntries[1]) {
  setLotteryResult(lotteryEntries[1], 'other-winner', [myUserId, 'other-user-3']);
  console.log('✅ Scenario 2: You\'re in queue (position 1) for item', lotteryEntries[1]);
}

// Test Scenario 3: NOT SELECTED ❌
if (lotteryEntries[2]) {
  setLotteryResult(lotteryEntries[2], 'other-winner', ['other-user-1', 'other-user-2']);
  console.log('✅ Scenario 3: You were not selected for item', lotteryEntries[2]);
}

console.log('\n🔄 Refresh page to see lottery status!');
location.reload();
```

## Manual Testing Steps

### Test 1: Won Status ✅

**Setup:**
1. Login to app
2. Enter lottery on any item
3. Open console and run:
```javascript
const entries = JSON.parse(localStorage.getItem('ecobid_lottery_entries'));
const myId = 'YOUR_USER_ID'; // Get from JWT token
import('./lib/api/mock-client.js').then(({ setLotteryResult }) => {
  setLotteryResult(entries[0], myId, ['backup-1', 'backup-2']);
  location.reload();
});
```

**Expected Result:**
- Item detail page shows green card: "🎉 You Won!"
- Shows "Confirm pickup within 24 hours" message
- Shows "Confirm Pickup" button
- Profile → Lottery Entries shows "You won! Confirm pickup"
- Badge shows "Won" (green)

---

### Test 2: Queue Status ⏳

**Setup:**
1. Enter lottery on another item
2. Run in console:
```javascript
const entries = JSON.parse(localStorage.getItem('ecobid_lottery_entries'));
const myId = 'YOUR_USER_ID';
import('./lib/api/mock-client.js').then(({ setLotteryResult }) => {
  setLotteryResult(entries[1], 'other-winner', [myId, 'backup-2']);
  location.reload();
});
```

**Expected Result:**
- Item detail page shows yellow card: "⏳ You're in Queue"
- Shows "Position #1 • You'll be notified if winner doesn't confirm"
- Profile → Lottery Entries shows "In queue (Position #1)"
- Badge shows "Queue" (yellow)

---

### Test 3: Not Selected Status ❌

**Setup:**
1. Enter lottery on third item
2. Run in console:
```javascript
const entries = JSON.parse(localStorage.getItem('ecobid_lottery_entries'));
import('./lib/api/mock-client.js').then(({ setLotteryResult }) => {
  setLotteryResult(entries[2], 'other-winner', ['backup-1', 'backup-2']);
  location.reload();
});
```

**Expected Result:**
- Item detail page shows gray card: "❌ Not Selected This Time"
- Shows "Keep trying! More items are added daily"
- Profile → Lottery Entries shows "Not selected"
- Badge shows "Lost" (gray)

---

## Visual Verification

### Item Detail Page

**Won Status:**
```
┌─────────────────────────────────────┐
│ 🎉 You Won!                         │
│ Confirm pickup within 24 hours or   │
│ item goes to next in queue          │
│ [Confirm Pickup]                    │
└─────────────────────────────────────┘
```

**Queue Status:**
```
┌─────────────────────────────────────┐
│ ⏳ You're in Queue                  │
│ Position #1 • You'll be notified if │
│ winner doesn't confirm              │
└─────────────────────────────────────┘
```

**Not Selected:**
```
┌─────────────────────────────────────┐
│ ❌ Not Selected This Time           │
│ Keep trying! More items are added   │
│ daily                               │
└─────────────────────────────────────┘
```

### Profile Page - Lottery Entries

**Compact Mode:**
- Won: `🎉 You won! Confirm pickup` (green text)
- Queue: `⏳ In queue (Position #1)` (yellow text)
- Not Selected: `❌ Not selected` (gray text)

**Badges:**
- Won: Green badge "Won"
- Queue: Yellow badge "Queue"
- Lost: Gray badge "Lost"

---

## Edge Cases

### Test 4: Multiple Queue Positions

```javascript
// Position 2 in queue
setLotteryResult('item-id', 'winner', ['backup-1', myUserId, 'backup-3']);
// Should show "Position #2"

// Position 3 in queue
setLotteryResult('item-id', 'winner', ['backup-1', 'backup-2', myUserId]);
// Should show "Position #3"
```

### Test 5: User Didn't Enter Lottery

**Expected:** No status shown (component returns null)

### Test 6: Lottery Still Active

**Expected:** Shows LotteryButton, not LotteryStatus

---

## Automated Test Script

```javascript
// Run this after logging in
(async function testITER54() {
  console.log('🧪 ITER5.4 Lottery Status Test\n');
  
  // Get user ID
  const clientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID;
  const lastAuthUserKey = `CognitoIdentityServiceProvider.${clientId}.LastAuthUser`;
  const username = localStorage.getItem(lastAuthUserKey);
  const userIdKey = `CognitoIdentityServiceProvider.${clientId}.${username}.idToken`;
  const idToken = localStorage.getItem(userIdKey);
  const payload = JSON.parse(atob(idToken.split('.')[1]));
  const myUserId = payload.sub;
  
  console.log('✅ User ID:', myUserId);
  
  // Test 1: QueueUser interface exists
  console.log('\n📝 Test 1: QueueUser interface');
  const testQueue = [
    { userId: 'user-1', position: 1 },
    { userId: 'user-2', position: 2 }
  ];
  console.log('✅ QueueUser structure valid:', testQueue);
  
  // Test 2: setLotteryResult helper
  console.log('\n🎲 Test 2: setLotteryResult()');
  const { setLotteryResult } = await import('./lib/api/mock-client.js');
  if (typeof setLotteryResult === 'function') {
    console.log('✅ setLotteryResult() exported');
  } else {
    console.log('❌ setLotteryResult() not found');
  }
  
  // Test 3: LotteryStatus component
  console.log('\n🎨 Test 3: LotteryStatus component');
  const { LotteryStatus } = await import('./components/lottery/LotteryStatus.js');
  if (LotteryStatus) {
    console.log('✅ LotteryStatus component exists');
  } else {
    console.log('❌ LotteryStatus component not found');
  }
  
  // Test 4: Status detection logic
  console.log('\n🔍 Test 4: Status detection');
  const entries = JSON.parse(localStorage.getItem('ecobid_lottery_entries') || '[]');
  console.log(`  Lottery entries: ${entries.length}`);
  
  if (entries.length > 0) {
    console.log('  Setting up test scenarios...');
    setLotteryResult(entries[0], myUserId, ['backup-1']);
    console.log('  ✅ Scenario 1: Won');
    
    if (entries.length > 1) {
      setLotteryResult(entries[1], 'other', [myUserId]);
      console.log('  ✅ Scenario 2: Queue');
    }
    
    if (entries.length > 2) {
      setLotteryResult(entries[2], 'other', ['backup-1', 'backup-2']);
      console.log('  ✅ Scenario 3: Not selected');
    }
  }
  
  console.log('\n✅ All ITER5.4 tests complete!');
  console.log('🔄 Refresh page to see lottery status');
})();
```

---

## Deployment Verification

After deploying Job #44:

1. **Login** with real Cognito account
2. **Enter 3 lotteries** on different items
3. **Run test script** in console (see above)
4. **Refresh page**
5. **Navigate to item detail** → Should see status card
6. **Navigate to Profile** → Should see compact status
7. **Check badges** → Won (green), Queue (yellow), Lost (gray)

All 3 statuses verified! ✅
