# EcoBid Product Roadmap

**Last Updated:** 2026-02-23  
**Product Owner:** User  
**Current Status:** Iteration 1 Complete ✅

---

## Product Vision

EcoBid is a mobile-first serverless marketplace for free household item giveaways, built for the AWS 10,000 AIdeas competition. The platform uses multimodal AI to enable effortless item listing and implements a fair lottery-based reservation system to promote circular economy principles.

---

## Current State (Iteration 1 Complete)

### ✅ What's Working
- **Item Listing:** Browse available items with category filtering
- **Item Details:** View full item information with photos
- **Backend API:** Lambda + API Gateway + DynamoDB deployed
- **Frontend:** Next.js 15 static site on CloudFront + S3
- **Performance:** <400ms page load, 145ms API response time
- **Infrastructure:** 100% AWS Free Tier compliant

### ⚠️ Known Issues
- **UX Problems:** Category buttons too small (32px vs 44px minimum)
- **Visual Hierarchy:** Item cards lack clear information priority
- **Accessibility:** Missing ARIA labels for screen readers
- **No Authentication:** Users can't log in or save favorites
- **Static Content:** No user-specific features yet

---

## Iteration 2: Authentication + Favorites + UX Fixes

**Timeline:** 1 week (5 days)  
**Priority:** P0 (Critical for MVP)  
**Estimated Effort:** 24 hours

### Goals
1. Enable user authentication (login/register)
2. Add favorites feature for logged-in users
3. Fix critical mobile UX issues
4. Improve accessibility compliance

### Features

#### 1. User Authentication (Days 1-2)
**User Stories:**
- As a new user, I want to register with email/password
- As a returning user, I want to log in to access my account
- As a logged-in user, I want to view/edit my profile

**Tasks:**
- [ ] **AUTH-1:** Integrate Cognito authentication in frontend (3h)
  - Add AWS Amplify library
  - Create auth context provider
  - Handle token storage and refresh
  
- [ ] **AUTH-2:** Build login page (2h)
  - Mobile-first form with 44px touch targets
  - Email/password validation
  - Error handling and loading states
  
- [ ] **AUTH-3:** Build register page (2h)
  - Form with email, password, name, city
  - Password strength validation
  - Email verification flow
  
- [ ] **AUTH-4:** Build profile page (2h)
  - Display user info (name, email, city)
  - Edit profile functionality
  - Logout button
  - Account settings navigation

**Acceptance Criteria:**
- ✅ Users can register and receive verification email
- ✅ Users can log in and stay authenticated
- ✅ Profile page shows user information
- ✅ Auth flows complete in <2 seconds
- ✅ Forms are mobile-friendly with proper validation

#### 2. Favorites System (Day 3)
**User Stories:**
- As a logged-in user, I want to save items to favorites
- As a logged-in user, I want to view my favorites list
- As a logged-in user, I want to remove items from favorites

**Tasks:**
- [ ] **FAV-1:** Create favorites Lambda handler (2h)
  - POST /users/{userId}/favorites/{itemId} - Add favorite
  - DELETE /users/{userId}/favorites/{itemId} - Remove favorite
  - GET /users/{userId}/favorites - List favorites
  - DynamoDB operations with proper error handling
  
- [ ] **FAV-2:** Add heart icon to item cards (1h)
  - Toggle favorite/unfavorite
  - Optimistic UI updates
  - Require authentication
  - Visual feedback (filled/empty heart)
  
- [ ] **FAV-3:** Build favorites page (2h)
  - Grid layout matching home page
  - Empty state with call-to-action
  - Remove from favorites functionality
  - Loading and error states

**Acceptance Criteria:**
- ✅ Heart icon appears on all item cards
- ✅ Favorites persist across sessions
- ✅ Favorites page shows saved items
- ✅ Toggle favorite completes in <500ms
- ✅ Unauthenticated users see login prompt

#### 3. Critical UX Fixes (Day 4)
**User Stories:**
- As a mobile user, I want larger touch targets
- As a mobile user, I want clear visual hierarchy
- As a screen reader user, I want proper ARIA labels

**Tasks:**
- [ ] **UX-1:** Fix category filter buttons (30min)
  - Increase height to 44px minimum
  - Add category icons (🏠📱🪑👕📚🧸🍳⚽📦)
  - Increase gap between buttons (gap-3)
  - Add ARIA labels
  
- [ ] **UX-2:** Improve item card hierarchy (1h)
  - Larger, bolder titles (text-lg font-bold)
  - Replace emoji with SVG icons
  - Better status badges with pulse animation
  - Proper spacing and alignment
  
- [ ] **UX-3:** Add ARIA labels throughout (30min)
  - Navigation elements
  - Interactive buttons
  - Form inputs
  - Links and cards
  
- [ ] **UX-4:** Update navigation (1h)
  - Add "Favorites" link (authenticated only)
  - Add "Profile" link (authenticated only)
  - Show login/register for guests
  - Mobile hamburger menu

**Acceptance Criteria:**
- ✅ All touch targets are minimum 44x44px
- ✅ Item cards have clear visual hierarchy
- ✅ ARIA labels present on all interactive elements
- ✅ Navigation adapts to auth state
- ✅ Lighthouse accessibility score >90

#### 4. Polish & Testing (Day 5)
**Tasks:**
- [ ] **TEST-1:** Manual testing on real mobile device (2h)
  - Test auth flows end-to-end
  - Test favorites functionality
  - Verify touch targets are easy to tap
  - Check visual hierarchy improvements
  
- [ ] **TEST-2:** Write unit tests for new features (2h)
  - Favorites Lambda handler tests
  - Auth context tests
  - Component tests for new pages
  
- [ ] **DOC-1:** Update README with new features (30min)
  - Document authentication setup
  - Document favorites feature
  - Update screenshots

**Acceptance Criteria:**
- ✅ All features tested on iPhone and Android
- ✅ Unit tests passing (>80% coverage)
- ✅ README reflects current state
- ✅ No critical bugs found

### Success Metrics
- **Performance:** Auth flows <2s, favorites toggle <500ms
- **Usability:** All touch targets ≥44px, clear visual hierarchy
- **Accessibility:** Lighthouse score >90, WCAG 2.1 AA compliance
- **Functionality:** Users can register, login, save favorites

### Out of Scope (Future Iterations)
- AI-powered item listing (Iteration 3)
- Lottery system (Iteration 3)
- Direct messaging (Iteration 4)
- Push notifications (Iteration 4)
- Advanced search/filters (Iteration 5)
- User reputation system (Iteration 5)

---

## Iteration 3: AI Listing + Lottery System (Future)

**Timeline:** 2 weeks  
**Priority:** P1 (Core MVP feature)

### Features
1. **AI-Powered Listing**
   - Upload photo from camera/gallery
   - Amazon Rekognition object detection
   - Amazon Bedrock (Claude Haiku) text generation
   - Edit AI suggestions before publishing
   
2. **Lottery System**
   - Users enter lottery for items
   - Automated winner selection (EventBridge Scheduler)
   - Email notifications to winner and seller
   - 24-hour reservation window
   - Re-list if pickup not confirmed

3. **Item Management**
   - Create new item listings
   - Edit/delete own items
   - Mark items as picked up
   - View item history

---

## Iteration 4: Messaging + Notifications (Future)

**Timeline:** 1 week  
**Priority:** P2 (Important for UX)

### Features
1. **Direct Messaging**
   - In-app chat between seller and winner
   - 500 character limit per message
   - Email notifications for new messages
   - Message history
   
2. **Push Notifications** (Optional)
   - Lottery winner notification
   - Pickup reminder
   - New message alert

---

## Iteration 5: Polish + Analytics (Future)

**Timeline:** 1 week  
**Priority:** P3 (Nice to have)

### Features
1. **Advanced Search**
   - Filter by distance/location
   - Sort by date, popularity
   - Keyword search in descriptions
   
2. **User Reputation**
   - Track items given/received
   - Reputation score
   - Badges and achievements
   
3. **Analytics Dashboard**
   - Item views and favorites count
   - User engagement metrics
   - Popular categories

---

## Technical Debt & Improvements

### High Priority
- [ ] Add error boundaries for better error handling
- [ ] Implement retry logic for failed API calls
- [ ] Add service worker for offline support
- [ ] Optimize image loading with lazy loading
- [ ] Add CloudWatch alarms for Lambda errors

### Medium Priority
- [ ] Write E2E tests with Playwright
- [ ] Add Storybook for component documentation
- [ ] Implement rate limiting on API endpoints
- [ ] Add request/response logging
- [ ] Set up staging environment

### Low Priority
- [ ] Add dark mode support
- [ ] Implement i18n for multiple languages
- [ ] Add PWA manifest for "Add to Home Screen"
- [ ] Optimize bundle size with code splitting

---

## Cost Monitoring

**Current Monthly Cost:** $0 (AWS Free Tier)

### Free Tier Limits
- **Lambda:** 1M requests/month (Current: <1K)
- **DynamoDB:** 25GB storage + 25 RCU/WCU (Current: <1GB)
- **S3:** 5GB storage + 20K GET requests (Current: <100MB)
- **API Gateway:** 1M HTTP API requests/month (Current: <1K)
- **Cognito:** 50K MAU (Current: <10)
- **CloudFront:** 1TB data transfer + 10M requests (Current: <1GB)

### Monitoring
- [ ] Set up billing alerts for >$1/month
- [ ] Weekly Free Tier usage review
- [ ] Document usage in progress reports

---

## Next Steps (Immediate Actions)

### For Product Owner
1. **Review Iteration 2 plan** - Approve scope and priorities
2. **Provide feedback** - Any changes to features or timeline?
3. **Test current app** - Visit https://d29wjvb8fy6ptl.cloudfront.net/

### For Development Team
1. **Start AUTH-1** - Integrate Cognito authentication
2. **Implement UX-1** - Fix category button sizes (quick win)
3. **Create FAV-1** - Build favorites Lambda handler
4. **Daily standups** - Track progress and blockers

### For UX/UI Expert
1. **Review designs** - Validate login/register/profile mockups
2. **Create design system** - Document colors, typography, spacing
3. **Accessibility audit** - Test with screen readers

---

## Questions & Decisions Needed

### Open Questions
1. **Password Reset:** Should we implement "Forgot Password" flow in Iteration 2?
   - **Recommendation:** Yes, it's critical for user retention
   
2. **Social Login:** Should we add Google/Facebook login?
   - **Recommendation:** No, keep it simple for MVP (add in Iteration 5)
   
3. **Profile Photos:** Should users have profile pictures?
   - **Recommendation:** No, not needed for MVP (add in Iteration 5)
   
4. **Favorites Limit:** Should we limit number of favorites per user?
   - **Recommendation:** No limit for MVP, monitor usage

### Decisions Made
- ✅ Use Cognito for authentication (no custom auth)
- ✅ Store favorites in DynamoDB (not in Cognito attributes)
- ✅ Fix UX issues before adding new features
- ✅ Mobile-first design for all new pages
- ✅ Maintain AWS Free Tier compliance

---

## Risk Assessment

### High Risk
- **Cognito Integration Complexity:** First time integrating auth
  - **Mitigation:** Use AWS Amplify library, follow official docs
  
- **DynamoDB Access Patterns:** Favorites queries might be slow
  - **Mitigation:** Use GSI for user favorites, test with seed data

### Medium Risk
- **Mobile Testing:** Limited real device testing
  - **Mitigation:** Use browser DevTools, test on at least 2 devices
  
- **Accessibility Compliance:** First time implementing ARIA labels
  - **Mitigation:** Use Lighthouse audits, follow WCAG guidelines

### Low Risk
- **AWS Free Tier Limits:** Might exceed limits with more users
  - **Mitigation:** Monitor usage weekly, set up billing alerts

---

## Success Criteria for Iteration 2

### Must Have (P0)
- ✅ Users can register and log in
- ✅ Users can save/unsave favorites
- ✅ All touch targets are ≥44px
- ✅ Item cards have clear hierarchy
- ✅ ARIA labels on interactive elements

### Should Have (P1)
- ✅ Profile page with user info
- ✅ Favorites page with saved items
- ✅ Navigation adapts to auth state
- ✅ Unit tests for new features

### Nice to Have (P2)
- ⚠️ Password reset flow
- ⚠️ Remember me functionality
- ⚠️ Account deletion
- ⚠️ E2E tests with Playwright

---

## Appendix

### Related Documents
- [Iteration 2 Plan](./.kiro/specs/ecobid-marketplace/iteration-2-plan.md)
- [UX Fixes Iteration 2](./.kiro/specs/ecobid-marketplace/ux-fixes-iteration-2.md)
- [UX Review](./.kiro/specs/ecobid-marketplace/ux-review.md)
- [Design Document](./.kiro/specs/ecobid-marketplace/design.md)
- [Requirements](./.kiro/specs/ecobid-marketplace/requirements.md)
- [Tasks](./.kiro/specs/ecobid-marketplace/tasks.md)

### Agent Assignments
- **Business Analyst:** Scope validation, requirements refinement
- **AWS Architect:** Favorites Lambda handler, Cognito integration
- **Frontend Engineer:** Auth pages, favorites UI, UX fixes
- **UX/UI Expert:** Design review, accessibility audit
- **Backend Engineer:** API testing, unit tests

### Timeline Visualization
```
Week 1 (Iteration 2):
Mon-Tue: Authentication (AUTH-1, AUTH-2, AUTH-3, AUTH-4)
Wed:     Favorites (FAV-1, FAV-2, FAV-3)
Thu:     UX Fixes (UX-1, UX-2, UX-3, UX-4)
Fri:     Testing & Polish (TEST-1, TEST-2, DOC-1)

Week 2-3 (Iteration 3):
AI Listing + Lottery System

Week 4 (Iteration 4):
Messaging + Notifications

Week 5 (Iteration 5):
Polish + Analytics
```
