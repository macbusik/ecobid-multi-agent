# ITER5 Testing & Deployment Log

**Date:** 2026-03-04  
**Tasks Completed:** ITER5-1 through ITER5-5 (5/12)  
**Status:** Ready for Testing & Deployment

---

## Pre-Deployment Checklist

### Code Changes
- [x] Created LotteryButton component
- [x] Created LotteryCountdown component
- [x] Created LotteryContext for state management
- [x] Integrated lottery UI into ItemDetail page
- [x] Added countdown timers to ItemCard
- [x] Fixed Item type (lotteryCloseTime → lotteryEndTime)
- [x] Wrapped App with LotteryProvider

### Files Created
- `frontend/src/components/lottery/LotteryButton.tsx`
- `frontend/src/components/lottery/LotteryCountdown.tsx`
- `frontend/src/lib/lottery/LotteryContext.tsx`

### Files Modified
- `frontend/src/App.tsx` (added LotteryProvider)
- `frontend/src/pages/ItemDetail.tsx` (added lottery UI)
- `frontend/src/components/item/ItemCard.tsx` (added countdown)
- `frontend/src/lib/types/index.ts` (fixed field name)

---

## Build Test

```bash
cd frontend
npm run build
```

**Expected Result:** Build succeeds with no TypeScript errors

---

## Manual Testing Checklist

### Test 1: View Item with Lottery
- [ ] Navigate to item detail page
- [ ] Verify countdown timer shows correct time
- [ ] Verify "Enter Lottery" button is visible (for non-owners)
- [ ] Verify button is 48px tall (mobile touch target)

### Test 2: Enter Lottery
- [ ] Click "Enter Lottery" button
- [ ] Verify loading spinner appears
- [ ] Verify success toast: "You're in the lottery! Winner announced in X hours"
- [ ] Verify button changes to "You're in lottery ✓" (green, disabled)

### Test 3: Countdown Timer on Cards
- [ ] Navigate to home page
- [ ] Verify item cards show countdown timers
- [ ] Verify format: "3h 45m left"
- [ ] Verify timer is gray text

### Test 4: Lottery State Persistence
- [ ] Enter lottery for an item
- [ ] Refresh page
- [ ] Verify "You're in lottery ✓" state persists

### Test 5: Mobile Responsiveness
- [ ] Open DevTools mobile view (390x844)
- [ ] Test all above scenarios on mobile
- [ ] Verify buttons are easy to tap
- [ ] Verify text is readable

---

## Known Limitations (To Be Implemented)

- ❌ Winner notification banner (ITER5-6)
- ❌ Reservation card (ITER5-7)
- ❌ Confirm pickup button (ITER5-8)
- ❌ Mark as picked up (ITER5-10)
- ⚠️ Lottery entries not persisted across sessions (need backend endpoint)

---

## Deployment Steps

### 1. Build Frontend
```bash
cd frontend
npm run build
```

### 2. Create Deployment Package
```bash
cd dist
zip -r ../../frontend-dist.zip .
cd ../..
```

### 3. Create Amplify Deployment
```bash
aws amplify create-deployment \
  --app-id d1wltv562fx0fx \
  --branch-name main \
  --region eu-central-1
```

**Output:** Returns `uploadUrl` and `jobId`

### 4. Upload Build
```bash
curl -X PUT "<uploadUrl>" \
  --data-binary @frontend-dist.zip \
  -H "Content-Type: application/zip"
```

### 5. Start Deployment
```bash
aws amplify start-deployment \
  --app-id d1wltv562fx0fx \
  --branch-name main \
  --job-id <JOB_ID> \
  --region eu-central-1
```

### 6. Monitor Deployment
```bash
aws amplify get-job \
  --app-id d1wltv562fx0fx \
  --branch-name main \
  --job-id <JOB_ID> \
  --region eu-central-1
```

**Wait for status:** `SUCCEED`

---

## Post-Deployment Verification

### Production URL
https://main.d1wltv562fx0fx.amplifyapp.com

### Test Scenarios
1. **Login** → Navigate to item → Enter lottery
2. **Verify countdown** shows on cards and detail page
3. **Verify button state** changes after entering
4. **Test on mobile** device (real phone if possible)

---

## Expected Behavior

### ✅ What Should Work
- Countdown timers display correctly
- Enter lottery button works
- Button state changes to "You're in lottery ✓"
- Toast notifications appear
- Mobile layout is responsive

### ⚠️ What Won't Work Yet
- Winner notification (not implemented)
- Reservation flow (not implemented)
- Pickup confirmation (not implemented)
- Lottery entries persistence across sessions (needs backend)

---

## Rollback Plan

If critical issues found:

```bash
# Revert frontend changes
cd frontend
git revert HEAD~5  # Revert last 5 commits

# Rebuild and redeploy
npm run build
cd dist && zip -r ../../frontend-dist.zip . && cd ../..
# ... repeat deployment steps
```

---

## Success Criteria

Deployment is successful if:
- [x] Build completes without errors
- [ ] Countdown timers visible on production
- [ ] Enter lottery button works
- [ ] Button state changes after entering
- [ ] No console errors
- [ ] Mobile layout works

---

## Notes

- Backend lottery execution already deployed (EventBridge + Lambda)
- API endpoints already exist and working
- This deployment adds frontend UI only
- Winner notification will be added in next deployment (ITER5-6)
