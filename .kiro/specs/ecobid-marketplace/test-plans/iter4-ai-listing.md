# Test Plan: Iteration 4 - AI-Powered Item Listing

**Status:** Retroactive (Feature Already Deployed)  
**Created:** 2026-03-04  
**Tester:** QA Engineer  
**Priority:** P0 (Critical MVP Feature)

---

## 1. Scope

### In Scope
- Photo upload with validation
- AI analysis using Amazon Nova Lite
- Auto-generated title, description, category
- User editing of AI suggestions
- Item publishing with lottery window
- My Items section (view, edit, delete)

### Out of Scope
- Multiple photo upload (V2 feature)
- AI moderation (V2 feature)
- Batch listing (V2 feature)

---

## 2. Test Strategy

**Manual Testing:** 15 test cases (critical paths)  
**Automated Testing:** Deferred to ITER5.1 (optional)

**Focus Areas:**
1. Photo upload flow (happy path + errors)
2. AI generation accuracy
3. Form validation
4. Item CRUD operations
5. Mobile responsiveness

---

## 3. Critical User Flows

### Flow 1: Create Item with AI (Happy Path)
**Steps:**
1. Navigate to /items/new
2. Upload valid photo (JPEG, <5MB)
3. Wait for AI analysis
4. Review AI-generated title, description, category
5. Edit lottery window (default 6 hours)
6. Click "Publish Item"
7. Verify redirect to item detail page

**Expected Result:**
- Item created with status "Available"
- Photo visible on item detail page
- Countdown timer shows correct time
- Item appears in My Items section

**Edge Cases:**
- Photo >5MB → Error message
- Invalid file type (PDF, GIF) → Error message
- AI service timeout → Fallback to manual entry
- Network error during upload → Retry mechanism

---

### Flow 2: Edit Item
**Steps:**
1. Navigate to Profile → My Items
2. Click "Edit" on an Available item
3. Modify title, description, category
4. Click "Save Changes"
5. Verify changes reflected on item detail page

**Expected Result:**
- Changes saved to DynamoDB
- Updated timestamp reflects change
- Item still has status "Available"

**Edge Cases:**
- Edit item with status "Reserved" → Button disabled
- Edit item owned by another user → 403 error

---

### Flow 3: Delete Item
**Steps:**
1. Navigate to Profile → My Items
2. Click "Delete" on an Available item
3. Confirm deletion in dialog
4. Verify item removed from list

**Expected Result:**
- Item deleted from DynamoDB
- Item no longer appears in feed
- Item no longer in My Items

**Edge Cases:**
- Delete item with status "Reserved" → Button disabled
- Delete item owned by another user → 403 error

---

## 4. Test Cases

### TC-ITER4-001: Upload Valid Photo
**Type:** Manual  
**Priority:** P0  
**Preconditions:** User logged in, on /items/new page

**Steps:**
1. Click "Upload Photo" button
2. Select valid JPEG file (<5MB)
3. Verify preview appears

**Expected Result:**
- Photo preview displays immediately
- File name shown below preview
- "Analyze with AI" button enabled

**Status:** ✅ PASS

---

### TC-ITER4-002: Upload Invalid File Type
**Type:** Manual  
**Priority:** P0  
**Preconditions:** User logged in, on /items/new page

**Steps:**
1. Click "Upload Photo" button
2. Select PDF file
3. Observe error message

**Expected Result:**
- Error toast: "Please upload a JPEG or PNG image"
- Photo preview not shown
- "Analyze with AI" button disabled

**Status:** ✅ PASS

---

### TC-ITER4-003: Upload Oversized Photo
**Type:** Manual  
**Priority:** P0  
**Preconditions:** User logged in, on /items/new page

**Steps:**
1. Click "Upload Photo" button
2. Select JPEG file >5MB
3. Observe error message

**Expected Result:**
- Error toast: "File size must be less than 5MB"
- Photo preview not shown
- "Analyze with AI" button disabled

**Status:** ✅ PASS

---

### TC-ITER4-004: AI Analysis Success
**Type:** Manual  
**Priority:** P0  
**Preconditions:** Valid photo uploaded

**Steps:**
1. Click "Analyze with AI" button
2. Wait for AI processing (loading spinner)
3. Verify AI-generated fields populated

**Expected Result:**
- Loading spinner shows during processing
- Title field populated (5-10 words)
- Description field populated (2-3 sentences)
- Category auto-selected
- Processing time <10 seconds

**Status:** ✅ PASS  
**Notes:** Average processing time: 2-3 seconds

---

### TC-ITER4-005: AI Analysis - Furniture Item
**Type:** Manual  
**Priority:** P1  
**Preconditions:** Valid photo uploaded (furniture item)

**Steps:**
1. Upload photo of wooden chair
2. Click "Analyze with AI"
3. Review AI suggestions

**Expected Result:**
- Title mentions "chair" or "furniture"
- Description mentions material (wood) and condition
- Category = "Furniture"
- Suggestions are coherent and relevant

**Status:** ✅ PASS  
**Example Output:**
- Title: "Vintage Wooden Dining Chair"
- Description: "Solid wood chair in good condition. Perfect for dining room or home office. Minor wear adds character."
- Category: Furniture

---

### TC-ITER4-006: AI Analysis - Electronics Item
**Type:** Manual  
**Priority:** P1  
**Preconditions:** Valid photo uploaded (electronics item)

**Steps:**
1. Upload photo of laptop
2. Click "Analyze with AI"
3. Review AI suggestions

**Expected Result:**
- Title mentions device type
- Description mentions potential use cases
- Category = "Electronics"

**Status:** ✅ PASS  
**Example Output:**
- Title: "Dell Laptop for Parts or Repair"
- Description: "Older laptop model, may need repairs. Good for parts or tech enthusiasts. Screen has minor scratches."
- Category: Electronics

---

### TC-ITER4-007: Edit AI Suggestions
**Type:** Manual  
**Priority:** P0  
**Preconditions:** AI analysis complete

**Steps:**
1. Modify title field
2. Modify description field
3. Change category dropdown
4. Change lottery window
5. Click "Publish Item"

**Expected Result:**
- All edits saved correctly
- Item created with user's modifications, not AI suggestions
- aiGenerated flag still true in database

**Status:** ✅ PASS

---

### TC-ITER4-008: Form Validation - Empty Title
**Type:** Manual  
**Priority:** P0  
**Preconditions:** On /items/new page

**Steps:**
1. Leave title field empty
2. Fill description
3. Click "Publish Item"

**Expected Result:**
- Error message: "Title is required"
- Form not submitted
- Focus moves to title field

**Status:** ✅ PASS

---

### TC-ITER4-009: Form Validation - Short Description
**Type:** Manual  
**Priority:** P1  
**Preconditions:** On /items/new page

**Steps:**
1. Fill title
2. Enter description <10 characters
3. Click "Publish Item"

**Expected Result:**
- Error message: "Description must be at least 10 characters"
- Form not submitted

**Status:** ✅ PASS

---

### TC-ITER4-010: Publish Item Success
**Type:** Manual  
**Priority:** P0  
**Preconditions:** Valid form data

**Steps:**
1. Fill all required fields
2. Set lottery window to 6 hours
3. Click "Publish Item"
4. Wait for redirect

**Expected Result:**
- Success toast: "Item published! Lottery closes in 6 hours"
- Redirect to item detail page
- Item status = "Available"
- Countdown timer shows ~6 hours

**Status:** ✅ PASS

---

### TC-ITER4-011: View My Items
**Type:** Manual  
**Priority:** P0  
**Preconditions:** User has created at least 1 item

**Steps:**
1. Navigate to Profile page
2. Scroll to "My Items" section
3. Verify items displayed

**Expected Result:**
- All user's items shown
- Each card shows: photo, title, category, city, status
- Edit/Delete buttons visible for Available items
- Items sorted by newest first

**Status:** ✅ PASS

---

### TC-ITER4-012: Edit Item from My Items
**Type:** Manual  
**Priority:** P0  
**Preconditions:** User has Available item

**Steps:**
1. Navigate to Profile → My Items
2. Click "Edit" button
3. Modify title to "Updated Title"
4. Click "Save Changes"
5. Return to My Items

**Expected Result:**
- Redirect to item detail page
- Title updated to "Updated Title"
- Success toast shown
- Item still in My Items with new title

**Status:** ✅ PASS

---

### TC-ITER4-013: Delete Item from My Items
**Type:** Manual  
**Priority:** P0  
**Preconditions:** User has Available item

**Steps:**
1. Navigate to Profile → My Items
2. Click "Delete" button
3. Confirm in dialog
4. Wait for deletion

**Expected Result:**
- Confirmation dialog: "Are you sure you want to delete this item?"
- After confirm: Success toast "Item deleted"
- Item removed from My Items list
- Item no longer in feed

**Status:** ✅ PASS

---

### TC-ITER4-014: Mobile Responsiveness - Photo Upload
**Type:** Manual  
**Priority:** P1  
**Preconditions:** Mobile device or DevTools mobile view (390x844)

**Steps:**
1. Navigate to /items/new on mobile
2. Tap "Upload Photo"
3. Select photo from camera or gallery
4. Verify preview

**Expected Result:**
- Upload button is 48px tall (easy to tap)
- Photo preview fits screen width
- All text is readable (≥16px)
- No horizontal scrolling

**Status:** ✅ PASS

---

### TC-ITER4-015: Mobile Responsiveness - My Items
**Type:** Manual  
**Priority:** P1  
**Preconditions:** Mobile device, user has items

**Steps:**
1. Navigate to Profile on mobile
2. Scroll to My Items
3. Tap Edit/Delete buttons

**Expected Result:**
- Item cards stack vertically
- Buttons are 48px tall
- Text is readable
- No layout overflow

**Status:** ✅ PASS

---

## 5. Test Results Summary

**Total Test Cases:** 15  
**Passed:** 15 ✅  
**Failed:** 0 ❌  
**Blocked:** 0 ⏸️  
**Skipped:** 0 ⏭️

**Pass Rate:** 100%

---

## 6. Bugs Found

**None** - All test cases passed on first execution.

---

## 7. Performance Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Photo upload time | <5s | 2-3s | ✅ PASS |
| AI analysis time | <10s | 2-3s | ✅ PASS |
| Total listing time | <30s | 10-15s | ✅ PASS |
| Page load time | <3s | 1-2s | ✅ PASS |
| API response time | <500ms | 100-200ms | ✅ PASS |

---

## 8. Recommendations

### For ITER5 (Lottery System)
1. **Add automated tests** for critical Lambda handlers (enterLottery, executeLottery)
2. **Test concurrent lottery entries** (multiple users entering at same time)
3. **Test reservation expiry** (24-hour timeout)
4. **Test edge cases** (lottery with 0 entries, lottery with 1 entry)

### For V2 (Future)
1. Add E2E tests using Playwright
2. Add performance testing (load testing with Artillery)
3. Add accessibility testing (axe-core)
4. Add visual regression testing (Percy or Chromatic)

---

## 9. Sign-Off

**Tested By:** QA Engineer  
**Date:** 2026-03-04  
**Status:** ✅ APPROVED FOR PRODUCTION

**Notes:**
- Feature is production-ready
- No critical bugs found
- Performance exceeds requirements
- Mobile UX is excellent
