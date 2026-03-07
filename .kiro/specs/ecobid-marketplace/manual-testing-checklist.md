# EcoBid Manual Testing Checklist

**Live URL:** https://main.d1wltv562fx0fx.amplifyapp.com  
**Mode:** Mock Data (VITE_USE_MOCK_DATA=true)  
**Last Deployment:** Job #37

---

## 🔐 Authentication Flow

### Registration
- [ ] Navigate to `/auth/register`
- [ ] Fill form: name, email, password, city
- [ ] Password validation shows checkmarks (✓) as you type
- [ ] Submit form
- [ ] Verify email verification code input appears
- [ ] Enter verification code
- [ ] Redirected to home page after verification

### Login
- [ ] Navigate to `/auth/login`
- [ ] Enter email and password
- [ ] Click "Login"
- [ ] Redirected to home page
- [ ] User name appears in navigation

### Session Persistence
- [ ] Login successfully
- [ ] Refresh page (F5)
- [ ] Verify still logged in (no re-login required)
- [ ] Close browser and reopen
- [ ] Navigate to site
- [ ] Verify still logged in

---

## 🏠 Browse Items (Home Page)

### Item Feed
- [ ] See 6 mock items displayed in grid
- [ ] Each card shows: image, title, description, category, city
- [ ] Status badges visible (Reserved, Closed, Completed)
- [ ] **HH:MM:SS countdown** visible on Available items (e.g., "02:45:30")
- [ ] Countdown updates **every second** (watch for 5-10 seconds)
- [ ] Countdown turns **yellow** when <30 minutes
- [ ] Countdown turns **red** when <5 minutes

### Category Filter
- [ ] Click category buttons (Furniture, Electronics, etc.)
- [ ] Items filter by category
- [ ] Scroll indicators visible on mobile
- [ ] Click "All" to reset filter

### Search
- [ ] Type in search box
- [ ] Items filter by title/description
- [ ] Clear search shows all items again

### Favorites
- [ ] Click heart icon on item card
- [ ] Heart turns red (favorited)
- [ ] Click again to unfavorite
- [ ] Heart turns gray
- [ ] Navigate to `/favorites`
- [ ] Verify favorited items appear

---

## 🎲 Lottery System

### Enter Lottery (Not Logged In)
- [ ] Logout if logged in
- [ ] Click on an Available item
- [ ] See "Login to Enter Lottery" button (gray)
- [ ] Click button
- [ ] Redirected to `/login?redirect=/items/{id}`
- [ ] Login
- [ ] Redirected back to item detail page

### Enter Lottery (Logged In)
- [ ] Login
- [ ] Click on Available item (e.g., "IKEA Standing Desk")
- [ ] See **HH:MM:SS countdown** (e.g., "Closes in: 02:45:30")
- [ ] See green "Enter Lottery" button
- [ ] Click button
- [ ] Toast appears: "You're in the lottery! Winner announced in X hours"
- [ ] Button changes to "You're in lottery ✓" with "Leave" button
- [ ] **Green "✓ Entered" badge** appears on item card in feed

### Leave Lottery (NEW!)
- [ ] After entering lottery, see "Leave" button (red)
- [ ] Click "Leave" button
- [ ] Confirmation dialog appears: "Are you sure you want to leave?"
- [ ] Click "Leave Lottery"
- [ ] Toast appears: "You've left the lottery"
- [ ] Button changes back to "Enter Lottery"
- [ ] Green badge disappears from item card

### Owner View
- [ ] Create a new item (see "Create Item" section)
- [ ] View your own item detail page
- [ ] See countdown timer
- [ ] See message: "You can't enter your own lottery"
- [ ] No "Enter Lottery" button visible

### My Lottery Entries
- [ ] Enter 2-3 lotteries
- [ ] Navigate to `/profile`
- [ ] Scroll to "My Lottery Entries" section
- [ ] Verify all entered items appear
- [ ] Each shows: image, title, countdown, status badge
- [ ] Click item to navigate to detail page

---

## 🔔 Winner Notifications (NEW!)

### Notification Badge
- [ ] Login
- [ ] Look at navigation bar (top-right)
- [ ] See **bell icon** 🔔
- [ ] If you have won items, see **red badge with count** (e.g., "2")
- [ ] Click bell icon
- [ ] **Dropdown appears** with won items list
- [ ] Each item shows: image, title, "Confirm pickup" text
- [ ] Click item in dropdown
- [ ] Navigate to item detail page
- [ ] Dropdown closes

### My Wins Page (NEW!)
- [ ] Navigate to `/wins`
- [ ] See "🎉 My Wins" heading
- [ ] If no wins: see empty state with "Keep entering lotteries!" message
- [ ] If wins exist: see two sections:
  - **Pending Confirmation** (orange) - items not yet confirmed
  - **Confirmed** (blue) - items with pickup confirmed
- [ ] Each item shows expiry countdown
- [ ] Click item to navigate to detail page

**Note:** In mock mode, you won't actually win items (no backend lottery execution). To test this, you'd need production backend.

---

## 📝 Create Item (AI-Powered)

### Upload Photo
- [ ] Navigate to `/items/new`
- [ ] Click "Upload Photo" or drag & drop
- [ ] Select image (max 5MB, JPEG/PNG)
- [ ] Preview appears
- [ ] Click "Analyze with AI"

### AI Analysis
- [ ] Loading spinner appears
- [ ] After ~10 seconds, AI suggestions appear:
  - Title
  - Description
  - Category
- [ ] All fields are editable

### Publish Item
- [ ] Edit title/description if needed
- [ ] Select lottery window (3-24 hours)
- [ ] Click "Publish Item"
- [ ] Redirected to item detail page
- [ ] Item appears in feed

---

## ✏️ Edit & Delete Items

### Edit Item
- [ ] Navigate to your item detail page
- [ ] See "Edit Item" button (gray box, owner only)
- [ ] Click "Edit Item"
- [ ] Navigate to `/items/{id}/edit`
- [ ] Modify title, description, category, city
- [ ] Click "Save Changes"
- [ ] Redirected to item detail page
- [ ] Changes visible

### Delete Item
- [ ] Navigate to your item detail page
- [ ] See "Delete Item" button (red text)
- [ ] Click "Delete Item"
- [ ] **Custom confirmation dialog** appears (not browser alert!)
- [ ] Dialog shows: "Delete Item" title, warning message
- [ ] Click "Cancel" - dialog closes, nothing happens
- [ ] Click "Delete Item" again
- [ ] Click "Delete" (red button)
- [ ] Redirected to `/profile`
- [ ] Item removed from "My Items"

---

## 🎉 Reservation & Pickup Flow

**Note:** This requires backend lottery execution, which doesn't run in mock mode. To test:

### Winner Confirmation
- [ ] Win a lottery (backend executes)
- [ ] See **red notification badge** on bell icon
- [ ] Click bell to see won item
- [ ] Navigate to item detail page
- [ ] See **ReservationCard** with:
  - "Reserved for You" badge (green)
  - Countdown: "Reservation expires in 23:45:30"
  - Seller contact info
  - "Confirm Pickup" button (green)
- [ ] Click "Confirm Pickup"
- [ ] Toast: "Pickup confirmed!"
- [ ] Button changes to "Pickup Confirmed ✓"

### Seller Mark Picked Up
- [ ] As seller, view item with confirmed pickup
- [ ] See "Mark as Picked Up" button
- [ ] Click button
- [ ] **Custom confirmation dialog** appears
- [ ] Click "Confirm"
- [ ] Toast: "Item marked as picked up!"
- [ ] Item status changes to "Picked_Up"

---

## 📱 Mobile Responsiveness

### Test on Mobile (or DevTools mobile view)
- [ ] All buttons are **48px tall** (easy to tap)
- [ ] Navigation menu works (hamburger icon)
- [ ] Item cards stack vertically
- [ ] Forms are easy to fill
- [ ] Countdown timers readable
- [ ] Confirmation dialogs fit screen
- [ ] No horizontal scrolling
- [ ] Images don't overflow

### Test Specific Screens
- [ ] Home page (item grid)
- [ ] Item detail page
- [ ] Create item form
- [ ] Profile page
- [ ] Favorites page
- [ ] My Wins page
- [ ] Login/Register forms

---

## 🎨 UX Polish Features

### Empty States
- [ ] Navigate to `/favorites` (no favorites)
- [ ] See: "❤️ No favorites yet" with "Browse Items" button
- [ ] Navigate to `/profile` (no items listed)
- [ ] See: "📝 No items listed yet" with "Create Your First Item" button
- [ ] Navigate to `/wins` (no wins)
- [ ] See: "🎲 No wins yet" with "Browse Items" button
- [ ] Navigate to `/profile` (no lottery entries)
- [ ] See: "🎲 No lottery entries yet" with "Browse Items" button

### Loading Skeletons
- [ ] Refresh home page
- [ ] See **6 skeleton cards** with pulse animation (not "Loading..." text)
- [ ] Refresh favorites page
- [ ] See **4 skeleton cards**
- [ ] Navigate to item detail
- [ ] See **skeleton layout** matching final page

### Status Indicators
- [ ] Item cards show status badges with **colored dots**:
  - 🟢 Available (no badge, just countdown)
  - 🟡 Lottery_Closed - "Closed" (yellow dot)
  - 🟠 Reserved - "Reserved" (orange dot)
  - 🔵 Pickup_Confirmed - "Confirmed" (blue dot)
  - ⚪ Picked_Up - "Completed" (gray dot)
- [ ] Item detail page shows larger status badge below title

### Confirmation Dialogs
- [ ] All confirmation dialogs are **custom modals** (not browser alerts)
- [ ] Delete item: red "Delete" button
- [ ] Mark picked up: green "Confirm" button
- [ ] Leave lottery: red "Leave Lottery" button
- [ ] All have backdrop (dark overlay)
- [ ] Click outside to close (or "Cancel" button)

---

## 🐛 Error Handling

### Network Errors
- [ ] Disconnect internet
- [ ] Try to enter lottery
- [ ] See error toast (not crash)
- [ ] Reconnect internet
- [ ] Try again - works

### Invalid Actions
- [ ] Try to enter lottery you already entered
- [ ] See appropriate error message
- [ ] Try to edit someone else's item (manually navigate to `/items/{id}/edit`)
- [ ] See error or redirect

### Error Boundaries
- [ ] Lottery components wrapped in error boundaries
- [ ] If component crashes, see fallback message
- [ ] Rest of app still works

---

## ⏱️ Performance Checks

### Page Load Times
- [ ] Home page loads in <3 seconds
- [ ] Item detail page loads in <2 seconds
- [ ] No layout shifts during load
- [ ] Images load progressively

### Countdown Performance
- [ ] Open item detail page
- [ ] Watch countdown for 30 seconds
- [ ] Verify updates smoothly every second
- [ ] No lag or stuttering
- [ ] Open 5 items in different tabs
- [ ] All countdowns update independently

---

## 🎯 Critical User Flows (End-to-End)

### Flow 1: New User Registration → Enter Lottery
1. [ ] Register new account
2. [ ] Verify email
3. [ ] Browse items
4. [ ] Click item
5. [ ] Enter lottery
6. [ ] See "You're in lottery ✓"
7. [ ] Navigate to profile
8. [ ] See item in "My Lottery Entries"

### Flow 2: Create Item → Edit → Delete
1. [ ] Login
2. [ ] Create new item with AI
3. [ ] View item detail
4. [ ] Edit item
5. [ ] Save changes
6. [ ] Delete item
7. [ ] Confirm deletion
8. [ ] Verify removed from profile

### Flow 3: Enter Lottery → Leave Lottery → Re-enter
1. [ ] Login
2. [ ] Enter lottery
3. [ ] See "Leave" button
4. [ ] Leave lottery
5. [ ] Confirm leave
6. [ ] See "Enter Lottery" button again
7. [ ] Re-enter lottery
8. [ ] Verify in "My Lottery Entries"

### Flow 4: Favorites Management
1. [ ] Browse items
2. [ ] Favorite 3 items
3. [ ] Navigate to `/favorites`
4. [ ] See all 3 items
5. [ ] Unfavorite 1 item from detail page
6. [ ] Return to favorites
7. [ ] Verify only 2 items remain

---

## 📊 Mock Data Verification

### Check All 6 Mock Items
1. [ ] **IKEA Standing Desk** - Available, 2min countdown
2. [ ] **MacBook Pro 2019** - Available, 5min countdown
3. [ ] **Nespresso Machine** - Available, 1h50min countdown
4. [ ] **Yoga Mat Set** - Reserved (winner selected)
5. [ ] **Kids Books** - Lottery_Closed (ended 5min ago)
6. [ ] **Leather Armchair** - Picked_Up (completed)

### Verify Countdown Behavior
- [ ] Items 1-3 show active countdowns
- [ ] Item 4 shows "Reserved" badge
- [ ] Item 5 shows "Closed" badge
- [ ] Item 6 shows "Completed" badge

---

## ✅ Final Checks

### Cross-Browser Testing
- [ ] Chrome (desktop)
- [ ] Safari (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (iOS)

### Accessibility
- [ ] All buttons have proper labels
- [ ] Images have alt text
- [ ] Forms have labels
- [ ] Keyboard navigation works (Tab key)
- [ ] Color contrast is readable

### Console Errors
- [ ] Open browser DevTools (F12)
- [ ] Check Console tab
- [ ] No red errors (warnings OK)
- [ ] No "getWonItems is not a function" error

---

## 🎬 Demo Preparation (AWS Competition)

### Record These Scenarios
1. [ ] **AI-Powered Listing** (30 sec)
   - Upload photo → AI generates → Publish
2. [ ] **Lottery Entry** (20 sec)
   - Browse → Enter lottery → See countdown
3. [ ] **Leave Lottery** (15 sec)
   - Show "Leave" button → Confirm → Re-enter
4. [ ] **Winner Notification** (20 sec)
   - Show bell badge → Click → See won items
5. [ ] **Mobile Experience** (30 sec)
   - Show responsive design → Touch interactions

### Key Talking Points
- ✅ **100% AWS Free Tier** (zero cost)
- ✅ **AI-powered** (Amazon Nova Lite)
- ✅ **Fair lottery system** (no first-come-first-served)
- ✅ **Mobile-first** (48px touch targets)
- ✅ **Real-time countdowns** (HH:MM:SS)
- ✅ **User control** (leave lottery anytime)
- ✅ **Instant notifications** (bell badge)

---

## 🚨 Known Limitations (Mock Mode)

These features require backend and won't work in mock mode:
- ❌ Lottery execution (no automatic winner selection)
- ❌ Reservation expiry (no 24-hour timeout)
- ❌ Email notifications
- ❌ Real-time updates across users
- ❌ Actual AI analysis (returns mock data)

To test these, you'd need to deploy the backend infrastructure.

---

**Testing Time Estimate:** 45-60 minutes for full checklist  
**Priority Testing:** Critical User Flows (15 minutes)  
**Quick Smoke Test:** Authentication + Browse + Enter Lottery (5 minutes)
