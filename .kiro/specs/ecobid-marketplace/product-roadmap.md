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
- Item listing with category filtering
- Item detail pages with full information
- Backend API (Lambda + API Gateway + DynamoDB)
- Frontend (Next.js 15 on CloudFront + S3)
- Performance: <400ms page load, 145ms API response
- 100% AWS Free Tier compliant

### ⚠️ Known Issues
- Category buttons too small (32px vs 44px minimum)
- Item cards lack clear visual hierarchy
- Missing ARIA labels for accessibility
- No user authentication
- No user-specific features

---

## Iteration 2: Authentication + Favorites + UX Fixes

**Timeline:** 1 week  
**Priority:** P0 (Critical for MVP)  
**Status:** Planning

### Goals
1. Enable user authentication (login/register)
2. Add favorites feature for logged-in users
3. Fix critical mobile UX issues
4. Improve accessibility compliance

### User Stories

**Authentication:**
- As a new user, I want to register with email/password
- As a returning user, I want to log in to access my account
- As a logged-in user, I want to view/edit my profile

**Favorites:**
- As a logged-in user, I want to save items to favorites
- As a logged-in user, I want to view my favorites list
- As a logged-in user, I want to remove items from favorites

**UX Improvements:**
- As a mobile user, I want larger touch targets (44px minimum)
- As a mobile user, I want clear visual hierarchy on item cards
- As a screen reader user, I want proper ARIA labels

### Success Metrics
- Auth flows complete in <2 seconds
- Favorites toggle in <500ms
- All touch targets ≥44px
- Lighthouse accessibility score >90

### Out of Scope
- AI-powered item listing (Iteration 3)
- Lottery system (Iteration 3)
- Direct messaging (Iteration 4)

**Detailed tasks:** See `tasks.md` (ITER2-* tasks)

---

## Iteration 3: AI Listing + Lottery System

**Timeline:** 2 weeks  
**Priority:** P1 (Core MVP feature)  
**Status:** Planned

### Goals
1. AI-powered item listing with photo upload
2. Automated lottery system for fair distribution
3. Email notifications for winners
4. 24-hour reservation window

### User Stories
- As a seller, I want to upload a photo and get AI-generated title/description
- As a buyer, I want to enter a lottery for items I'm interested in
- As a winner, I want to receive email notification and confirm pickup
- As a seller, I want automated winner selection after lottery closes

**Detailed tasks:** See `tasks.md` (ITER3-* tasks)

---

## Iteration 4: Messaging + Notifications

**Timeline:** 1 week  
**Priority:** P2 (Important for UX)  
**Status:** Planned

### Goals
1. In-app messaging between seller and winner
2. Email notifications for new messages
3. Message history and threading

**Detailed tasks:** See `tasks.md` (ITER4-* tasks)

---

## Iteration 5: Polish + Analytics

**Timeline:** 1 week  
**Priority:** P3 (Nice to have)  
**Status:** Planned

### Goals
1. Advanced search and filtering
2. User reputation system
3. Analytics dashboard

**Detailed tasks:** See `tasks.md` (ITER5-* tasks)

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

### This Week (Iteration 2)
1. Review and approve scope
2. Start with UX fixes (quick wins)
3. Implement authentication
4. Build favorites feature

### This Month
1. Complete Iteration 2
2. Plan Iteration 3 (AI + lottery)
3. Test on real mobile devices
4. Update documentation

### This Quarter
1. Complete MVP (Iterations 2-4)
2. Launch beta testing
3. Gather user feedback
4. Prepare competition submission

---

## Related Documents
- [Requirements](./requirements.md) - Business requirements
- [Design](./design.md) - System design & API contracts
- [Tasks](./tasks.md) - Detailed implementation tasks
