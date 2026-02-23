# EcoBid Iteration 2 Plan

**Date:** 2026-02-23  
**Status:** Planning  
**Previous Iteration:** Iteration 1 Complete (Item listing/detail pages)

## Executive Summary

Iteration 2 focuses on **user authentication, favorites functionality, and critical UX fixes** identified in the UX review. This iteration prioritizes essential user features while addressing mobile usability issues that impact core functionality.

## MVP Scope (Minimal Features Only)

### Core Features
1. **User Authentication** - Login/register pages with Cognito integration
2. **User Favorites** - Save/unsave items with persistent storage
3. **Critical UX Fixes** - Mobile touch targets and visual hierarchy improvements

### Out of Scope (Future Iterations)
- Advanced search and filtering
- Push notifications
- User reputation system
- Item history and analytics
- Direct messaging
- Lottery system implementation

## User Stories with Acceptance Criteria

### Epic 1: User Authentication

#### US-2.1: User Registration
**As a** new user  
**I want to** create an account with email and password  
**So that** I can save favorites and list items

**Acceptance Criteria:**
- [ ] Registration form with email, password, name, city fields
- [ ] Email validation and password strength requirements
- [ ] Cognito User Pool integration
- [ ] Email verification flow
- [ ] Error handling for duplicate emails
- [ ] Redirect to home page after successful registration
- [ ] Form validation with clear error messages

#### US-2.2: User Login
**As a** returning user  
**I want to** log in with my credentials  
**So that** I can access my favorites and account

**Acceptance Criteria:**
- [ ] Login form with email and password
- [ ] Cognito authentication integration
- [ ] Remember me functionality (optional)
- [ ] Error handling for invalid credentials
- [ ] Redirect to intended page after login
- [ ] Loading states during authentication

#### US-2.3: User Profile Management
**As a** logged-in user  
**I want to** view and edit my profile  
**So that** I can keep my information current

**Acceptance Criteria:**
- [ ] Profile page showing name, email, city
- [ ] Edit profile functionality
- [ ] Change password option
- [ ] Logout functionality
- [ ] Account deletion option (soft delete)

### Epic 2: Favorites System

#### US-2.4: Add Item to Favorites
**As a** logged-in user  
**I want to** save items to my favorites  
**So that** I can easily find them later

**Acceptance Criteria:**
- [ ] Heart icon on item cards and detail pages
- [ ] Toggle favorite/unfavorite functionality
- [ ] Visual feedback when favoriting (heart fills/empties)
- [ ] Persist favorites in DynamoDB
- [ ] Require authentication to favorite items
- [ ] Optimistic UI updates

#### US-2.5: View Favorites List
**As a** logged-in user  
**I want to** see all my favorited items  
**So that** I can review items I'm interested in

**Acceptance Criteria:**
- [ ] Favorites page accessible from navigation
- [ ] Grid layout matching home page design
- [ ] Empty state when no favorites exist
- [ ] Remove from favorites functionality
- [ ] Real-time updates when items are unfavorited

### Epic 3: Critical UX Fixes

#### US-2.6: Improve Mobile Touch Targets
**As a** mobile user  
**I want** larger, easier-to-tap buttons  
**So that** I can navigate the app without frustration

**Acceptance Criteria:**
- [ ] Category filter buttons minimum 44px height
- [ ] Increased padding and spacing between buttons
- [ ] Back button on item detail page enlarged
- [ ] All interactive elements meet 44x44px minimum
- [ ] Improved visual feedback on tap

#### US-2.7: Enhanced Item Card Design
**As a** user browsing items  
**I want** clear visual hierarchy on item cards  
**So that** I can quickly scan and find relevant information

**Acceptance Criteria:**
- [ ] Larger, bolder item titles
- [ ] Replace emoji icons with proper SVG icons
- [ ] Improved category badge visibility
- [ ] Clear "Available" status indicator
- [ ] Better location display with icon

## Task Breakdown with Priorities

### Phase 1: Authentication Foundation (P0 - Critical)

#### ITER2-1: Setup Authentication Context (2 hours)
- Create React Context for authentication state
- Implement Cognito SDK integration
- Add authentication hooks (useAuth, useUser)
- Handle token storage and refresh

#### ITER2-2: Login Page Implementation (3 hours)
- Build login form component with validation
- Integrate with Cognito authentication
- Add loading states and error handling
- Implement redirect after successful login

#### ITER2-3: Registration Page Implementation (3 hours)
- Build registration form with all required fields
- Add email verification flow
- Implement form validation
- Handle registration errors and success states

#### ITER2-4: Profile Page Enhancement (2 hours)
- Complete profile page with edit functionality
- Add logout button
- Implement change password flow
- Add account management options

### Phase 2: Favorites System (P0 - Critical)

#### ITER2-5: Favorites Backend Integration (2 hours)
- Create DynamoDB table structure for favorites
- Implement API endpoints for favorites CRUD
- Add authentication middleware
- Create Lambda functions for favorites management

#### ITER2-6: Favorites UI Components (3 hours)
- Create heart icon component with animations
- Add favorite/unfavorite functionality to item cards
- Implement favorites page layout
- Add empty state design

#### ITER2-7: Favorites Integration (2 hours)
- Connect favorites UI to backend APIs
- Implement optimistic updates
- Add error handling and retry logic
- Test favorites persistence

### Phase 3: Critical UX Fixes (P1 - High)

#### ITER2-8: Mobile Touch Target Improvements (2 hours)
- Update category filter button styles
- Enlarge back button on item detail page
- Ensure all buttons meet 44px minimum
- Test on mobile devices

#### ITER2-9: Item Card Visual Hierarchy (3 hours)
- Redesign item cards with better typography
- Replace emoji icons with SVG icons
- Improve category badges and status indicators
- Add proper location display with icons

#### ITER2-10: Loading State Improvements (1 hour)
- Create skeleton components matching final layout
- Add shimmer animations
- Replace generic loading with proper skeletons

### Phase 4: Polish and Testing (P2 - Medium)

#### ITER2-11: Navigation Updates (1 hour)
- Add favorites link to navigation
- Update navigation for authenticated users
- Add user menu dropdown

#### ITER2-12: Error Handling Enhancement (1 hour)
- Improve error messages across the app
- Add retry mechanisms for failed requests
- Implement proper error boundaries

## Estimated Timeline

**Total Effort:** 24 hours  
**Sprint Duration:** 1 week (5 working days)  
**Daily Capacity:** 5 hours

### Day-by-Day Breakdown
- **Day 1:** ITER2-1, ITER2-2 (Authentication foundation + Login)
- **Day 2:** ITER2-3, ITER2-4 (Registration + Profile)
- **Day 3:** ITER2-5, ITER2-6 (Favorites backend + UI)
- **Day 4:** ITER2-7, ITER2-8 (Favorites integration + Touch targets)
- **Day 5:** ITER2-9, ITER2-10, ITER2-11, ITER2-12 (Polish + Testing)

## Dependencies on Existing Infrastructure

### ✅ Already Available
- **Cognito User Pool:** Configured and deployed
- **DynamoDB:** Single-table design ready for favorites
- **API Gateway:** HTTP API endpoints available
- **Lambda Functions:** Shared utilities and response helpers
- **Frontend Framework:** Next.js 15 with TypeScript and Tailwind CSS

### 🔧 Requires Extension
- **DynamoDB Schema:** Add favorites entity pattern
- **API Endpoints:** Create favorites CRUD operations
- **Lambda Functions:** Implement favorites business logic
- **Frontend State:** Add authentication context and favorites management

### 📋 New Components Needed
- Authentication forms and validation
- Favorites UI components
- Enhanced item card design
- Mobile-optimized touch targets

## Success Metrics

### Functional Requirements
- [ ] Users can register and login successfully
- [ ] Users can save/unsave items to favorites
- [ ] Favorites persist across sessions
- [ ] All touch targets meet 44px minimum on mobile
- [ ] Item cards have clear visual hierarchy

### Performance Requirements
- [ ] Authentication flows complete in <2 seconds
- [ ] Favorites toggle responds in <500ms
- [ ] Page load times remain <3 seconds
- [ ] No layout shift during loading states

### User Experience Requirements
- [ ] Zero critical UX issues from Phase 1 fixes
- [ ] Improved mobile usability scores
- [ ] Clear visual feedback for all user actions
- [ ] Intuitive navigation between authenticated features

## Risk Mitigation

### Technical Risks
- **Cognito Integration Complexity:** Start with basic auth, add advanced features later
- **State Management:** Use React Context initially, consider Redux if complexity grows
- **Mobile Testing:** Test on real devices throughout development

### Scope Risks
- **Feature Creep:** Strictly limit to MVP features listed above
- **UX Perfectionism:** Focus on critical issues first, polish later
- **Authentication Edge Cases:** Handle common scenarios, document edge cases for future

## Next Iteration Preview

**Iteration 3 Candidates:**
- AI-powered item listing with photo upload
- Lottery system implementation
- Direct messaging between users
- Advanced search and filtering
- Push notifications setup

**Decision Criteria for Iteration 3:**
- User feedback on authentication and favorites
- Technical debt assessment
- AWS Free Tier usage monitoring
- Mobile performance metrics