# Iteration 1.5: Complete Frontend-Backend Integration

## Context
- Backend API is working (tested with curl)
- Item detail page works when accessed directly
- **Missing**: Home page with item list to navigate from

## Tasks

### ITER1.5-1: Create Home Page with Item List
**Priority:** HIGH  
**Estimated Time:** 30 minutes

**Description:**
Build the home page (`/`) that displays a list of available items with links to detail pages.

**Acceptance Criteria:**
- [ ] Home page fetches items from `GET /items` API endpoint
- [ ] Displays items in a responsive grid (1 column mobile, 2-3 columns desktop)
- [ ] Each item card shows: photo, title, category, city, status badge
- [ ] Clicking an item navigates to `/items/[id]` detail page
- [ ] Loading state while fetching
- [ ] Empty state if no items
- [ ] Error handling for API failures

**Files to Modify:**
- `frontend/app/page.tsx` (currently placeholder)

**Dependencies:**
- Backend `listItems` handler (already exists but not implemented)

---

### ITER1.5-2: Implement Backend listItems Handler
**Priority:** HIGH  
**Estimated Time:** 20 minutes

**Description:**
Implement the `listItems` function in the Lambda handler to return all available items.

**Acceptance Criteria:**
- [ ] Query DynamoDB using GSI1 (STATUS#Available)
- [ ] Return items sorted by createdAt (newest first)
- [ ] Support pagination with `limit` and `lastKey` parameters
- [ ] Response time < 500ms
- [ ] Unit tests for listItems function

**Files to Modify:**
- `infrastructure/lib/lambda/handlers/items.ts`
- `infrastructure/test/lambda/handlers/items.test.ts`

**API Contract:**
```
GET /items?limit=20&category=Furniture&city=New%20York

Response:
{
  "items": [
    {
      "itemId": "item-001",
      "title": "...",
      "photoUrl": "...",
      "category": "...",
      "city": "...",
      "status": "Available",
      "createdAt": "..."
    }
  ],
  "lastKey": "item-001" // for pagination
}
```

---

### ITER1.5-3: Add Navigation from Home to Detail
**Priority:** MEDIUM  
**Estimated Time:** 10 minutes

**Description:**
Ensure smooth navigation between home page and item detail pages.

**Acceptance Criteria:**
- [ ] Item cards on home page are clickable
- [ ] Navigation uses Next.js Link component for client-side routing
- [ ] Back button on detail page returns to home
- [ ] Browser back/forward buttons work correctly

**Files to Modify:**
- `frontend/app/page.tsx` (add Link components)
- `frontend/app/items/[id]/page.tsx` (already has back button)

---

### ITER1.5-4: Test End-to-End User Flow
**Priority:** HIGH  
**Estimated Time:** 15 minutes

**Description:**
Verify the complete user journey from home page to item details.

**Acceptance Criteria:**
- [ ] User can see list of items on home page
- [ ] User can click an item to view details
- [ ] User can navigate back to home page
- [ ] All data displays correctly
- [ ] No console errors
- [ ] Mobile responsive on all pages

**Test Steps:**
1. Start frontend: `npm run dev`
2. Open `http://localhost:3000`
3. Verify items list displays
4. Click on an item
5. Verify detail page shows
6. Click "Back to Feed"
7. Verify returns to home page

---

## Summary

**Total Tasks:** 4  
**Estimated Time:** ~75 minutes  
**Status:** Not Started

**Current State:**
- ✅ Backend API working
- ✅ Item detail page working
- ❌ Home page not implemented
- ❌ listItems handler not implemented
- ❌ Navigation flow incomplete
