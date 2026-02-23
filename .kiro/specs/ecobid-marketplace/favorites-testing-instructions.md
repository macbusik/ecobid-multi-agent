# Favorites Fix - Testing Instructions

## Status
- ✅ Frontend fix deployed (use currentUser.username)
- ✅ Backend logging deployed
- ⏳ Waiting for browser cache to clear

## The Fix
Changed `AuthContext.tsx` to use `currentUser.username` instead of `currentUser.userId`
- `currentUser.username` = JWT sub claim
- Backend validates: `pathUserId === JWT sub claim`

## Testing Steps

### 1. Clear Browser Cache
**CRITICAL:** You must clear your browser cache to get the new code.

**Option A: Hard Refresh**
- Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**Option B: DevTools**
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

**Option C: Incognito Window**
- Open https://d29wjvb8fy6ptl.cloudfront.net in incognito/private window

### 2. Test Favorites
1. Click heart icon on any item
2. Check browser console for logs
3. Should see: ✅ "Added to favorites" toast
4. Heart should turn red
5. Refresh page - heart should stay red

### 3. Check Console Output
Look for these logs:
```
🔍 Favorites Debug:
  User ID: [should match JWT sub]
  Item ID: item-XXX
  Action: ADD
  
🌐 API Request: { endpoint, method, hasToken: true }
📡 API Response: { status: 200, ok: true }  ← Should be 200, not 403
✅ API Success: { data }
✓ Added to favorites: item-XXX
```

### 4. If Still 403 Error
Share the console output and I'll check CloudWatch logs:

```bash
aws logs tail /aws/lambda/EcoBid-Favorites --since 5m --follow
```

Backend will log:
```
🔍 Favorites Handler Debug: {
  userId_from_jwt: "xxx",
  pathUserId: "xxx",
  match: true/false
}
```

## Expected Behavior

### Success (200 OK)
- Toast: "Added to favorites" (green)
- Console: ✓ Added to favorites
- Heart icon: Red (filled)
- No errors

### Still Failing (403)
- Toast: "Failed: HTTP 403" (red)
- Console: ✗ Favorites API error
- Heart icon: Gray (reverts)
- Need to check backend logs

## Troubleshooting

### If User ID Still Wrong Format
The fix might not be deployed yet. Check:
1. CloudFront invalidation status
2. Browser cache cleared
3. Try incognito window

### If 403 Still Happening
1. Share console output
2. I'll check CloudWatch logs
3. Verify JWT sub claim matches path userId

## CloudWatch Logs Command
```bash
# Check backend logs
aws logs tail /aws/lambda/EcoBid-Favorites --since 10m --follow --format short

# Look for:
# - "🔍 Favorites Handler Debug"
# - "userId_from_jwt" vs "pathUserId"
# - "match: true" or "match: false"
```

## Success Criteria
- [ ] No 403 errors
- [ ] Toast shows "Added to favorites"
- [ ] Heart icon turns red
- [ ] Favorites persist on reload
- [ ] Console shows success logs
- [ ] Backend logs show match: true
