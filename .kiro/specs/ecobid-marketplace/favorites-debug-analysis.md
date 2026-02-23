# Favorites Feature Analysis - Deep Dive

## Problem Statement
Favorites feature still not working after ITER3-1 implementation.

## Investigation Results

### 1. Frontend Code ✅ CORRECT
**File:** `frontend/lib/api/client.ts`

```typescript
export const favorites = USE_MOCK ? mockApi.favorites : {
  list: (userId: string) =>
    apiRequest<Item[]>(`/users/${userId}/favorites`, { method: 'GET' }),
  
  add: (userId: string, itemId: string) =>
    apiRequest<{ message: string }>(`/users/${userId}/favorites/${itemId}`, { method: 'POST' }),
  
  remove: (userId: string, itemId: string) =>
    apiRequest<{ message: string }>(`/users/${userId}/favorites/${itemId}`, { method: 'DELETE' }),
};
```

**Status:** ✅ API client correctly configured
- Uses real API (USE_MOCK=false)
- Correct endpoints
- JWT token sent via Authorization header

### 2. Backend Routes ✅ CORRECT
**File:** `infrastructure/lib/constructs/api.ts`

Routes configured:
- `GET /users/{userId}/favorites` - List favorites
- `POST /users/{userId}/favorites/{itemId}` - Add favorite
- `DELETE /users/{userId}/favorites/{itemId}` - Remove favorite

**Status:** ✅ All routes exist with Cognito authorizer

### 3. Lambda Handler ✅ CORRECT
**File:** `infrastructure/lib/lambda/handlers/favorites.ts`

- Extracts userId from JWT token
- Validates user can only access own favorites
- Implements add/remove/list operations
- Returns full item details for list operation

**Status:** ✅ Handler logic correct

## Root Cause Analysis

### Likely Issues:

#### Issue #1: User ID Mismatch (HIGH PROBABILITY)
**Problem:** Frontend passes `user.userId` but backend expects `sub` claim from JWT

**Evidence:**
```typescript
// Frontend (ItemCard.tsx)
await favorites.add(user.userId, item.itemId);

// Backend (favorites.ts)
const userId = event.requestContext.authorizer?.claims?.sub;
```

**Question:** Is `user.userId` the same as the JWT `sub` claim?

#### Issue #2: Build Not Deployed (MEDIUM PROBABILITY)
**Problem:** ITER3 changes built but not deployed to production

**Evidence:**
- Build successful (3.2s)
- Deployed to S3/CloudFront
- BUT: Did we check if the built code includes the changes?

#### Issue #3: API Gateway Not Returning Item Details (LOW PROBABILITY)
**Problem:** `listFavorites()` returns favorites but not full item details

**Evidence:**
```typescript
// Handler returns item details
const items = await Promise.all(
  favorites.map(async (fav) => {
    const item = await getItem(`ITEM#${fav.itemId}`, 'METADATA');
    return item;
  })
);
```

But frontend expects `Item[]` type.

#### Issue #4: CORS or Authorization Headers (LOW PROBABILITY)
**Problem:** Browser blocking requests or JWT not sent

**Evidence:**
- CORS configured with `allowHeaders: ['Content-Type', 'Authorization']`
- JWT token fetched via `fetchAuthSession()`

## Testing Needed

### Test 1: Check User ID
```typescript
// Add to ItemCard.tsx handleFavoriteClick
console.log('User ID:', user.userId);
console.log('Item ID:', item.itemId);
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

### Test 2: Check JWT Token
```typescript
// Add to client.ts getAuthToken
const session = await fetchAuthSession();
console.log('JWT sub claim:', session.tokens?.idToken?.payload?.sub);
console.log('User userId:', user.userId);
```

### Test 3: Check API Response
```typescript
// Add to ItemCard.tsx
try {
  const response = await favorites.add(user.userId, item.itemId);
  console.log('API Response:', response);
} catch (error) {
  console.error('API Error:', error);
  console.error('Error details:', JSON.stringify(error, null, 2));
}
```

### Test 4: Check Network Tab
- Open DevTools → Network
- Click heart icon
- Check request:
  - URL: Should be `https://9jvk35eykg.execute-api.eu-central-1.amazonaws.com/users/{userId}/favorites/{itemId}`
  - Method: POST
  - Headers: Should include `Authorization: Bearer <token>`
  - Response: Check status code and body

## Proposed Fix Tasks

### ITER3-6: Debug Favorites API Calls
**Priority:** P0 (Critical)
**Time:** 30 minutes

**Tasks:**
1. Add detailed console logging to ItemCard
2. Log user.userId vs JWT sub claim
3. Log API request/response
4. Test in browser and check console
5. Check Network tab for actual API calls

**Acceptance Criteria:**
- Console shows exact API call being made
- Can see if request succeeds or fails
- Can see exact error message if fails

### ITER3-7: Fix User ID Mismatch (If Found)
**Priority:** P0 (Critical)
**Time:** 15 minutes

**Tasks:**
1. Verify user.userId matches JWT sub claim
2. If mismatch, update AuthContext to use sub claim
3. Rebuild and redeploy
4. Test favorites add/remove

**Acceptance Criteria:**
- user.userId matches JWT sub claim
- API calls succeed
- Favorites persist

### ITER3-8: Verify Backend Deployment
**Priority:** P1 (High)
**Time:** 10 minutes

**Tasks:**
1. Check if favorites Lambda is deployed
2. Check CloudWatch logs for favorites function
3. Verify API Gateway routes exist
4. Test API directly with curl/Postman

**Acceptance Criteria:**
- Favorites Lambda exists in AWS
- API Gateway routes configured
- Can call API directly and get response

### ITER3-9: Add Better Error Handling
**Priority:** P2 (Medium)
**Time:** 20 minutes

**Tasks:**
1. Show specific error messages in toast
2. Log full error details to console
3. Add retry button for failed requests
4. Handle network errors gracefully

**Acceptance Criteria:**
- User sees specific error message
- Console shows full error details
- Can retry failed requests
- Network errors handled

## Quick Test Script

Run this in browser console on production site:

```javascript
// Test 1: Check if API URL is set
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

// Test 2: Check if user is logged in
// (Open DevTools → Application → Local Storage → Check for auth tokens)

// Test 3: Try to call API directly
fetch('https://9jvk35eykg.execute-api.eu-central-1.amazonaws.com/items')
  .then(r => r.json())
  .then(d => console.log('Items API works:', d))
  .catch(e => console.error('Items API failed:', e));
```

## Expected Behavior

### When Working:
1. User clicks heart icon
2. Console logs: "✓ Added to favorites: item-123"
3. Toast shows: "Added to favorites"
4. Heart icon turns red
5. Page reload: heart still red

### Current Behavior:
1. User clicks heart icon
2. Console logs: "✗ Favorites API error: [error message]"
3. Toast shows: "Failed to update favorites"
4. Heart icon reverts to gray
5. Page reload: heart gray

## Next Steps

1. **IMMEDIATE:** Run ITER3-6 to add debug logging
2. **THEN:** Test in production and check console
3. **ANALYZE:** Determine exact failure point
4. **FIX:** Implement appropriate fix (ITER3-7, ITER3-8, or ITER3-9)
5. **VERIFY:** Test end-to-end and confirm working

## Success Criteria

- [ ] Can add item to favorites
- [ ] Can remove item from favorites
- [ ] Favorites persist on page reload
- [ ] Favorites page shows favorited items
- [ ] No console errors
- [ ] Toast notifications work
- [ ] Heart icon state correct
