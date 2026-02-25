# EcoBid Product Roadmap

**Last Updated:** 2026-02-24  
**Product Owner:** User  
**Current Status:** Iteration 3 Complete ✅

---

## Product Vision

EcoBid is a mobile-first serverless marketplace for free household item giveaways, built for the AWS 10,000 AIdeas competition. The platform uses multimodal AI to enable effortless item listing and implements a fair lottery-based reservation system to promote circular economy principles.

---

## Current State (Iteration 3 Complete)

### ✅ What's Working
- **Authentication:** Login/register with Cognito, email verification, session persistence
- **Favorites:** Add/remove favorites with persistent storage, red heart indicators
- **Item Browsing:** Category filtering with scroll indicators, mobile-optimized UX
- **UX Polish:** Toast notifications, loading states, error boundaries, dynamic password validation
- **Backend API:** Lambda + API Gateway + DynamoDB with JWT authorization
- **Frontend:** Next.js 15 on CloudFront + S3
- **Performance:** <400ms page load, <100ms favorites API, 60fps animations
- **100% AWS Free Tier compliant**

### 🎯 Recent Fixes (Iteration 3.2)
- Fixed 403 Unauthorized error (userId mismatch between frontend email and JWT sub claim)
- Favorites now load correctly after logout/login
- Session persistence working automatically via Amplify localStorage

### 📋 Next Priority
- **Iteration 4:** Create Item functionality (manual form or AI-powered listing)

---

## Iteration 3: Authentication + Favorites + UX Polish ✅

**Timeline:** 1 week  
**Priority:** P0 (Critical for MVP)  
**Status:** Complete

### Completed Features
- ✅ User authentication (login/register with Cognito)
- ✅ Email verification with code input
- ✅ Session persistence (automatic via Amplify localStorage)
- ✅ Favorites system with DynamoDB backend
- ✅ Dynamic password validation with visual checklist
- ✅ Category filter with scroll indicators and fade gradients
- ✅ Toast notification system with slide-in animations
- ✅ Error boundary for graceful error handling
- ✅ All touch targets ≥48px (mobile-first)
- ✅ Loading states and optimistic UI updates

### Key Bugfixes
- ✅ Fixed 403 Unauthorized error (userId mismatch: email vs JWT sub claim)
- ✅ Fixed favorites loading after logout/login
- ✅ Fixed duplicate Amplify configuration
- ✅ Fixed server component issue with Amplify.configure()

### Performance Achieved
- Auth flows: <2 seconds ✅
- Favorites API: <100ms ✅
- All touch targets: 48px ✅
- Animations: 60fps ✅

**Detailed tasks:** See `tasks.md` (ITER3-* tasks marked complete)

---

## Iteration 4: Create Item Functionality

**Timeline:** 1-2 weeks  
**Priority:** P0 (Core MVP feature)  
**Status:** Next Up

### Goals
1. Manual item creation form (title, description, category, city, photos)
2. Photo upload to S3 with presigned URLs
3. Item listing management (edit/delete own items)
4. Form validation and error handling

### User Stories
- As a seller, I want to create a new item listing with photos
- As a seller, I want to edit my item listings
- As a seller, I want to delete my item listings
- As a seller, I want to see all my active listings

### Option A: Manual Form (Simpler, faster)
- Standard form with text inputs
- Manual photo upload
- User writes title/description
- Estimated: 3-4 days

### Option B: AI-Powered Listing (More impressive)
- Upload photo → AI generates title/description
- Amazon Rekognition for object detection
- Amazon Bedrock (Claude Haiku) for text generation
- Estimated: 5-7 days

**Detailed tasks:** See `tasks.md` (ITER4-* tasks)

---

## Iteration 5: Lottery System + Reservations

**Timeline:** 2 weeks  
**Priority:** P1 (Core MVP feature)  
**Status:** Planned

### Goals
1. Automated lottery system for fair distribution
2. 24-hour reservation window for winners
3. Email notifications for winners
4. Automatic re-listing if reservation expires

### User Stories
- As a buyer, I want to enter a lottery for items I'm interested in
- As a winner, I want to receive email notification and confirm pickup
- As a seller, I want automated winner selection after lottery closes
- As a seller, I want items automatically re-listed if winner doesn't confirm

**Detailed tasks:** See `tasks.md` (ITER5-* tasks)

---

## Iteration 6: Messaging + Notifications

**Timeline:** 1 week  
**Priority:** P2 (Important for UX)  
**Status:** Planned

### Goals
1. In-app messaging between seller and winner
2. Email notifications for new messages
3. Message history and threading

**Detailed tasks:** See `tasks.md` (ITER6-* tasks)

---

## Iteration 7: Polish + Analytics

**Timeline:** 1 week  
**Priority:** P3 (Nice to have)  
**Status:** Planned

### Goals
1. Advanced search and filtering
2. User reputation system
3. Analytics dashboard

**Detailed tasks:** See `tasks.md` (ITER7-* tasks)

---

## Cost Monitoring

**Current Monthly Cost:** $0 (AWS Free Tier)

### Free Tier Usage
- Lambda: <1K / 1M requests
- DynamoDB: <1GB / 25GB storage
- S3: <100MB / 5GB storage
- API Gateway: <1K / 1M requests
- Cognito: <10 / 50K MAU
- CloudFront: <1GB / 1TB transfer

### Actions
- Billing alerts set for >$1/month
- Weekly usage review
- Document in progress reports

---

## Risk Assessment

**High Risk:**
- Cognito integration complexity → Use AWS Amplify, follow docs

**Medium Risk:**
- Limited mobile device testing → Use DevTools, test on 2+ devices

**Low Risk:**
- Free Tier limits → Monitor weekly, billing alerts

---

## Next Steps

### This Week (Iteration 4)
1. Decide: Manual form vs AI-powered listing
2. Implement item creation form
3. Add photo upload to S3
4. Build item management page

### This Month
1. Complete Iteration 4 (Create Item)
2. Start Iteration 5 (Lottery System)
3. Test on real mobile devices
4. Update documentation

### This Quarter
1. Complete MVP (Iterations 4-6)
2. Launch beta testing
3. Gather user feedback
4. Prepare competition submission

---

## Related Documents
- [Requirements](./requirements.md) - Business requirements
- [Design](./design.md) - System design & API contracts
- [Tasks](./tasks.md) - Detailed implementation tasks
