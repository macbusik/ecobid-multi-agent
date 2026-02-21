# Task List: EcoBid Marketplace

## Phase 1: Infrastructure Foundation (AWS CDK)

### INFRA-1: Initialize CDK Project Structure ✅
**Agent:** `aws_cdk_architect`
**Priority:** P0 (Blocker)
**Estimated Time:** 30 minutes
**Status:** COMPLETED

**Description:**
Set up the AWS CDK project structure with TypeScript configuration.

**Acceptance Criteria:**
- [x] Create `/infrastructure` directory
- [x] Initialize CDK project with `cdk init app --language typescript`
- [x] Configure `cdk.json` with project context (projectName: "ecobid", environment: "prod")
- [x] Create directory structure: `bin/`, `lib/`, `lib/constructs/`, `lib/lambda/handlers/`, `lib/lambda/shared/`
- [x] Install required CDK dependencies: `aws-cdk-lib`, `constructs`
- [x] Verify CDK synth runs without errors

**Dependencies:** None

---

### INFRA-2: Create DynamoDB Table Construct ✅
**Agent:** `aws_cdk_architect`
**Priority:** P0 (Blocker)
**Estimated Time:** 45 minutes
**Status:** COMPLETED

**Description:**
Create DynamoDB single-table design with GSIs as specified in design.md.

**Acceptance Criteria:**
- [x] Create `lib/constructs/database.ts`
- [x] Define table with PK (String), SK (String)
- [x] Add GSI1: GSI1PK (Partition Key), GSI1SK (Sort Key) for status queries
- [x] Add GSI2: GSI2PK (Partition Key), GSI2SK (Sort Key) for category/city filtering
- [x] Use On-Demand billing mode
- [x] Enable point-in-time recovery
- [x] Add removal policy: RETAIN (for production safety)
- [x] Export table name and ARN as stack outputs

**Dependencies:** INFRA-1

---

### INFRA-3: Create S3 Bucket Construct ✅
**Agent:** `aws_cdk_architect`
**Priority:** P0 (Blocker)
**Estimated Time:** 30 minutes
**Status:** COMPLETED

**Description:**
Create S3 bucket for item photos with public read access.

**Acceptance Criteria:**
- [x] Create `lib/constructs/storage.ts`
- [x] Define S3 bucket with unique name: `ecobid-items-<account-id>`
- [x] Configure public read access for objects
- [x] Enable CORS for frontend uploads
- [x] Set lifecycle policy: delete objects after 365 days
- [x] Block public ACLs but allow public bucket policies
- [x] Export bucket name and ARN as stack outputs

**Dependencies:** INFRA-1

---

### INFRA-4: Create Cognito User Pool Construct ✅
**Agent:** `aws_cdk_architect`
**Priority:** P0 (Blocker)
**Estimated Time:** 45 minutes
**Status:** COMPLETED

**Description:**
Create Cognito User Pool for authentication.

**Acceptance Criteria:**
- [x] Create `lib/constructs/auth.ts`
- [x] Configure email as username
- [x] Set password policy: min 8 chars, uppercase, lowercase, number, special char
- [x] Enable email verification (required)
- [x] Add custom attributes: name (String), city (String)
- [x] Create User Pool Client with auth flows: USER_PASSWORD_AUTH
- [x] Set token expiry: 24 hours
- [x] Export User Pool ID, Client ID, and ARN as stack outputs

**Dependencies:** INFRA-1

---

### INFRA-5: Create Lambda Shared Utilities ✅
**Agent:** `aws_cdk_architect`
**Priority:** P0 (Blocker)
**Estimated Time:** 1 hour
**Status:** COMPLETED

**Description:**
Create shared TypeScript utilities for Lambda functions.

**Acceptance Criteria:**
- [x] Create `lib/lambda/shared/types.ts` with all entity interfaces (User, Item, LotteryEntry, Message)
- [x] Create `lib/lambda/shared/dynamodb.ts` with helper functions: putItem, getItem, query, updateItem
- [x] Create `lib/lambda/shared/s3.ts` with helper functions: uploadImage, getSignedUrl
- [x] Create `lib/lambda/shared/response.ts` with API response formatters (success, error)
- [x] Add proper TypeScript types for all functions
- [x] Add JSDoc comments for all exported functions

**Dependencies:** INFRA-1

---

### INFRA-6: Create Items Lambda Handler ✅
**Agent:** `aws_cdk_architect`
**Priority:** P1 (Critical)
**Estimated Time:** 2 hours
**Status:** COMPLETED

**Description:**
Implement Items Lambda handler with all item-related operations.

**Acceptance Criteria:**
- [x] Create `lib/lambda/handlers/items.ts`
- [x] Implement POST /items: upload photo to S3, invoke Rekognition, invoke Bedrock, return AI suggestions
- [x] Implement PUT /items/{itemId}: update item details and publish
- [x] Implement GET /items: list items with filters (category, search, city) and pagination
- [x] Implement GET /items/{itemId}: get item details
- [x] Implement POST /items/{itemId}/lottery: add user to lottery entries
- [x] Implement POST /items/{itemId}/confirm-pickup: update status to Pickup_Confirmed
- [x] Implement POST /items/{itemId}/mark-picked-up: update status to Picked_Up, increment reputation
- [x] Add error handling for all operations
- [x] Use shared utilities from INFRA-5

**Dependencies:** INFRA-2, INFRA-3, INFRA-5

---

### INFRA-7: Create Lottery Lambda Handler ✅
**Agent:** `aws_cdk_architect`
**Priority:** P1 (Critical)
**Estimated Time:** 1.5 hours
**Status:** COMPLETED

**Description:**
Implement Lottery Lambda handler for winner selection.

**Acceptance Criteria:**
- [x] Create `lib/lambda/handlers/lottery.ts`
- [x] Implement selectWinner function: query all lottery entries, select random winner
- [x] Update item status to "Reserved"
- [x] Store winnerUserId and reservationExpiryTime (24 hours from now)
- [x] Send email to winner using SES with item details
- [x] Send email to seller using SES with winner contact info
- [x] Create EventBridge schedule for reservation expiry check
- [x] Add error handling and logging

**Dependencies:** INFRA-2, INFRA-5

---

### INFRA-8: Create Messages Lambda Handler
**Agent:** `aws_cdk_architect`
**Priority:** P1 (Critical)
**Estimated Time:** 1 hour

**Description:**
Implement Messages Lambda handler for in-app messaging.

**Acceptance Criteria:**
- [ ] Create `lib/lambda/handlers/messages.ts`
- [ ] Implement POST /items/{itemId}/messages: create message, validate 500 char limit
- [ ] Implement GET /items/{itemId}/messages: query messages ordered by timestamp
- [ ] Verify sender is either seller or winner
- [ ] Send email notification to recipient using SES
- [ ] Add error handling

**Dependencies:** INFRA-2, INFRA-5

---

### INFRA-9: Create Users Lambda Handler
**Agent:** `aws_cdk_architect`
**Priority:** P1 (Critical)
**Estimated Time:** 45 minutes

**Description:**
Implement Users Lambda handler for profile operations.

**Acceptance Criteria:**
- [ ] Create `lib/lambda/handlers/users.ts`
- [ ] Implement GET /users/{userId}: get user profile
- [ ] Implement GET /users/me: get current user profile from Cognito token
- [ ] Add error handling

**Dependencies:** INFRA-2, INFRA-4, INFRA-5

---

### INFRA-10: Create Reservation Expiry Lambda Handler
**Agent:** `aws_cdk_architect`
**Priority:** P2 (Important)
**Estimated Time:** 45 minutes

**Description:**
Implement Reservation Expiry Lambda handler for expired reservations.

**Acceptance Criteria:**
- [ ] Create `lib/lambda/handlers/reservation-expiry.ts`
- [ ] Check if item status is still "Reserved" (not "Pickup_Confirmed")
- [ ] If expired, update status to "Expired"
- [ ] Send email to seller notifying expiry
- [ ] Add error handling

**Dependencies:** INFRA-2, INFRA-5

---


### INFRA-11: Create API Gateway Construct
**Agent:** `aws_cdk_architect`
**Priority:** P0 (Blocker)
**Estimated Time:** 1.5 hours

**Description:**
Create API Gateway HTTP API with Cognito authorizer and Lambda integrations.

**Acceptance Criteria:**
- [ ] Create `lib/constructs/api.ts`
- [ ] Define HTTP API (not REST API for cost savings)
- [ ] Configure Cognito JWT authorizer
- [ ] Add CORS configuration for frontend domain
- [ ] Integrate Items Lambda: POST /items, PUT /items/{itemId}, GET /items, GET /items/{itemId}, POST /items/{itemId}/lottery, POST /items/{itemId}/confirm-pickup, POST /items/{itemId}/mark-picked-up
- [ ] Integrate Messages Lambda: POST /items/{itemId}/messages, GET /items/{itemId}/messages
- [ ] Integrate Users Lambda: GET /users/{userId}, GET /users/me
- [ ] Add auth routes (handled by Cognito directly): POST /auth/register, POST /auth/login
- [ ] Export API endpoint URL as stack output

**Dependencies:** INFRA-4, INFRA-6, INFRA-8, INFRA-9

---

### INFRA-12: Configure EventBridge Scheduler
**Agent:** `aws_cdk_architect`
**Priority:** P2 (Important)
**Estimated Time:** 1 hour

**Description:**
Set up EventBridge Scheduler for lottery and reservation expiry.

**Acceptance Criteria:**
- [ ] Create `lib/constructs/scheduler.ts`
- [ ] Grant Items Lambda permission to create one-time schedules
- [ ] Grant Lottery Lambda permission to create one-time schedules
- [ ] Configure IAM role for EventBridge to invoke Lambda targets
- [ ] Document schedule creation pattern in JSDoc

**Dependencies:** INFRA-6, INFRA-7, INFRA-10

---

### INFRA-13: Configure Amazon SES
**Agent:** `aws_cdk_architect`
**Priority:** P2 (Important)
**Estimated Time:** 30 minutes

**Description:**
Configure Amazon SES for email notifications.

**Acceptance Criteria:**
- [ ] Add SES email identity (use sandbox mode for MVP)
- [ ] Grant Lottery Lambda permission to send emails
- [ ] Grant Messages Lambda permission to send emails
- [ ] Grant Reservation Expiry Lambda permission to send emails
- [ ] Document email verification requirement in JSDoc
- [ ] Add SES_FROM_EMAIL to Lambda environment variables

**Dependencies:** INFRA-7, INFRA-8, INFRA-10

---

### INFRA-14: Create Main CDK Stack
**Agent:** `aws_cdk_architect`
**Priority:** P0 (Blocker)
**Estimated Time:** 1 hour

**Description:**
Assemble all constructs into the main EcoBid stack.

**Acceptance Criteria:**
- [ ] Create `lib/ecobid-stack.ts`
- [ ] Instantiate all constructs: database, storage, auth, api, scheduler
- [ ] Wire up dependencies between constructs
- [ ] Pass environment variables to Lambda functions (TABLE_NAME, BUCKET_NAME, etc.)
- [ ] Configure Lambda functions: ARM64 architecture, Node.js 20.x runtime, 512MB memory, 30s timeout
- [ ] Add stack tags: Project=EcoBid, Environment=Prod
- [ ] Export all critical outputs (API URL, User Pool ID, Client ID, Bucket Name)

**Dependencies:** INFRA-2, INFRA-3, INFRA-4, INFRA-11, INFRA-12, INFRA-13

---

### INFRA-15: Create CDK App Entry Point
**Agent:** `aws_cdk_architect`
**Priority:** P0 (Blocker)
**Estimated Time:** 15 minutes

**Description:**
Create CDK app entry point and configure deployment.

**Acceptance Criteria:**
- [ ] Create `bin/app.ts`
- [ ] Instantiate EcoBidStack with proper environment (account, region)
- [ ] Add app-level tags
- [ ] Verify `cdk synth` generates CloudFormation template
- [ ] Verify `cdk diff` shows expected resources

**Dependencies:** INFRA-14

---

### INFRA-16: Deploy Infrastructure to AWS
**Agent:** `aws_cdk_architect`
**Priority:** P0 (Blocker)
**Estimated Time:** 30 minutes

**Description:**
Deploy the CDK stack to AWS and verify all resources.

**Acceptance Criteria:**
- [ ] Run `cdk bootstrap` (if first time)
- [ ] Run `cdk deploy --require-approval never`
- [ ] Verify all resources created successfully in AWS Console
- [ ] Verify API Gateway endpoint is accessible
- [ ] Verify DynamoDB table exists with correct GSIs
- [ ] Verify S3 bucket exists and is publicly readable
- [ ] Verify Cognito User Pool exists
- [ ] Save stack outputs to `.env` file for frontend

**Dependencies:** INFRA-15

---

## Phase 2: Frontend Foundation (Next.js)

### FE-1: Initialize Next.js Project
**Agent:** `frontend_engineer`
**Priority:** P0 (Blocker)
**Estimated Time:** 30 minutes

**Description:**
Set up Next.js 14 project with TypeScript and Tailwind CSS.

**Acceptance Criteria:**
- [ ] Create `/frontend` directory
- [ ] Initialize Next.js with `npx create-next-app@latest` (App Router, TypeScript, Tailwind, ESLint)
- [ ] Configure `tailwind.config.js` with mobile-first breakpoints
- [ ] Configure `next.config.js` for image optimization
- [ ] Install additional dependencies: `aws-amplify` (for Cognito auth)
- [ ] Create `.env.local` with placeholder values for API_URL, COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID
- [ ] Verify `npm run dev` starts successfully

**Dependencies:** None

---

### FE-2: Create TypeScript Types
**Agent:** `frontend_engineer`
**Priority:** P0 (Blocker)
**Estimated Time:** 30 minutes

**Description:**
Define TypeScript interfaces matching backend data models.

**Acceptance Criteria:**
- [ ] Create `lib/types/index.ts`
- [ ] Define User interface
- [ ] Define Item interface with all status types
- [ ] Define Message interface
- [ ] Define API request/response types for all endpoints
- [ ] Export all types

**Dependencies:** FE-1

---

### FE-3: Create API Client
**Agent:** `frontend_engineer`
**Priority:** P0 (Blocker)
**Estimated Time:** 1.5 hours

**Description:**
Create API client with all backend endpoints.

**Acceptance Criteria:**
- [ ] Create `lib/api/client.ts`
- [ ] Implement auth methods: register, login
- [ ] Implement items methods: create, update, getById, list, enterLottery, confirmPickup, markPickedUp
- [ ] Implement messages methods: send, list
- [ ] Implement users methods: getProfile, getMe
- [ ] Add Authorization header injection from Cognito token
- [ ] Add error handling and response parsing
- [ ] Add TypeScript types for all methods

**Dependencies:** FE-2

---

### FE-4: Create Mock Data Provider
**Agent:** `frontend_engineer`
**Priority:** P1 (Critical)
**Estimated Time:** 45 minutes

**Description:**
Create mock data for testing UI before backend is deployed.

**Acceptance Criteria:**
- [ ] Create `lib/api/mock-data.ts`
- [ ] Generate 20+ mock items with realistic data
- [ ] Generate mock users
- [ ] Generate mock messages
- [ ] Create mock API client that returns mock data
- [ ] Add environment variable to toggle between real and mock API

**Dependencies:** FE-2

---

### FE-5: Create Base UI Components
**Agent:** `frontend_engineer`
**Priority:** P0 (Blocker)
**Estimated Time:** 1.5 hours

**Description:**
Create reusable UI components with mobile-first design.

**Acceptance Criteria:**
- [ ] Create `components/ui/Button.tsx` with variants (primary, secondary, danger)
- [ ] Create `components/ui/Input.tsx` with label and error states
- [ ] Create `components/ui/Card.tsx` for content containers
- [ ] Create `components/ui/Modal.tsx` for dialogs
- [ ] Create `components/ui/Spinner.tsx` for loading states
- [ ] All components use Tailwind CSS with mobile-first approach
- [ ] All components have proper TypeScript props interfaces
- [ ] Ensure touch-friendly tap targets (min 44x44px)

**Dependencies:** FE-1

---

### FE-6: Create Root Layout
**Agent:** `frontend_engineer`
**Priority:** P0 (Blocker)
**Estimated Time:** 45 minutes

**Description:**
Create root layout with navigation and Tailwind setup.

**Acceptance Criteria:**
- [ ] Create `app/layout.tsx`
- [ ] Add Tailwind CSS imports
- [ ] Add mobile-first viewport meta tags
- [ ] Create navigation bar with logo and user menu
- [ ] Add responsive navigation (hamburger menu on mobile)
- [ ] Configure font (system fonts for performance)
- [ ] Add Cognito auth provider wrapper

**Dependencies:** FE-1, FE-5

---

### FE-7: Create Authentication Pages
**Agent:** `frontend_engineer`
**Priority:** P1 (Critical)
**Estimated Time:** 2 hours

**Description:**
Create login and registration pages with Cognito integration.

**Acceptance Criteria:**
- [ ] Create `app/auth/login/page.tsx`
- [ ] Create `app/auth/register/page.tsx`
- [ ] Create `components/auth/LoginForm.tsx` with email and password fields
- [ ] Create `components/auth/RegisterForm.tsx` with email, password, name, city fields
- [ ] Integrate with Cognito using aws-amplify
- [ ] Add form validation (client-side)
- [ ] Add error message display
- [ ] Add loading states
- [ ] Redirect to home page after successful auth
- [ ] Mobile-first responsive design

**Dependencies:** FE-3, FE-5, FE-6

---

### FE-8: Create Item Card Component
**Agent:** `frontend_engineer`
**Priority:** P1 (Critical)
**Estimated Time:** 1 hour

**Description:**
Create item card component for the feed.

**Acceptance Criteria:**
- [ ] Create `components/item/ItemCard.tsx`
- [ ] Display item photo (optimized with Next.js Image)
- [ ] Display title, category badge, city
- [ ] Display lottery countdown timer
- [ ] Display seller name and reputation
- [ ] Add tap/click handler to navigate to item details
- [ ] Mobile-first responsive design
- [ ] Add skeleton loading state

**Dependencies:** FE-2, FE-5

---

### FE-9: Create Home Page (Item Feed)
**Agent:** `frontend_engineer`
**Priority:** P1 (Critical)
**Estimated Time:** 1.5 hours

**Description:**
Create home page with item feed and filters.

**Acceptance Criteria:**
- [ ] Create `app/page.tsx`
- [ ] Create `components/item/CategoryFilter.tsx` with category chips
- [ ] Add search input field
- [ ] Fetch items from API (or mock data)
- [ ] Display items in grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
- [ ] Implement category filtering
- [ ] Implement keyword search
- [ ] Add pagination (load more button)
- [ ] Add loading states
- [ ] Mobile-first responsive design

**Dependencies:** FE-3, FE-4, FE-6, FE-8

---

### FE-10: Create Photo Upload Component
**Agent:** `frontend_engineer`
**Priority:** P1 (Critical)
**Estimated Time:** 1.5 hours

**Description:**
Create photo upload component with camera/gallery support.

**Acceptance Criteria:**
- [ ] Create `components/item/PhotoUpload.tsx`
- [ ] Support file input (accept JPEG, PNG)
- [ ] Support camera capture on mobile devices
- [ ] Validate file size (max 5MB)
- [ ] Display preview of uploaded photo
- [ ] Convert to base64 for API upload
- [ ] Add error messages for invalid files
- [ ] Mobile-first responsive design

**Dependencies:** FE-5

---


### FE-11: Create New Item Page
**Agent:** `frontend_engineer`
**Priority:** P1 (Critical)
**Estimated Time:** 2 hours

**Description:**
Create page for listing new items with AI-powered generation.

**Acceptance Criteria:**
- [ ] Create `app/items/new/page.tsx`
- [ ] Add PhotoUpload component
- [ ] Add lottery window selector (3-12 hours)
- [ ] Call POST /items API to upload photo and get AI suggestions
- [ ] Display AI-generated title, description, category
- [ ] Allow editing of AI suggestions
- [ ] Add "Publish" button to finalize listing
- [ ] Show loading state during AI generation
- [ ] Add error handling
- [ ] Mobile-first responsive design

**Dependencies:** FE-3, FE-5, FE-10

---

### FE-12: Create Item Details Page
**Agent:** `frontend_engineer`
**Priority:** P1 (Critical)
**Estimated Time:** 2 hours

**Description:**
Create item details page with lottery entry and status display.

**Acceptance Criteria:**
- [ ] Create `app/items/[id]/page.tsx`
- [ ] Fetch item details from API
- [ ] Display full-size photo, title, description, category
- [ ] Display seller info (name, city, reputation)
- [ ] Display lottery countdown timer
- [ ] Create `components/item/LotteryButton.tsx` with states: "I'm Interested", "You're in the lottery", "Lottery Closed"
- [ ] Handle lottery entry on button click
- [ ] Show "Confirm Pickup" button if user is winner and status is "Reserved"
- [ ] Show "Mark as Picked Up" button if user is seller and status is "Pickup_Confirmed"
- [ ] Add loading and error states
- [ ] Mobile-first responsive design

**Dependencies:** FE-3, FE-5, FE-6

---

### FE-13: Create User Profile Page
**Agent:** `frontend_engineer`
**Priority:** P2 (Important)
**Estimated Time:** 1 hour

**Description:**
Create user profile page with statistics.

**Acceptance Criteria:**
- [ ] Create `app/profile/page.tsx`
- [ ] Create `components/profile/UserStats.tsx`
- [ ] Fetch current user data from API
- [ ] Display name, city, email
- [ ] Display items given count, items received count, reputation score
- [ ] Add visual representation (badges or progress bars)
- [ ] Mobile-first responsive design

**Dependencies:** FE-3, FE-5, FE-6

---

### FE-14: Create Messaging Interface
**Agent:** `frontend_engineer`
**Priority:** P2 (Important)
**Estimated Time:** 2 hours

**Description:**
Create in-app messaging interface for pickup coordination.

**Acceptance Criteria:**
- [ ] Create `app/messages/[itemId]/page.tsx`
- [ ] Create `components/messages/MessageList.tsx` to display messages
- [ ] Create `components/messages/MessageInput.tsx` for sending messages
- [ ] Fetch messages from API
- [ ] Display messages in chat-like interface (sender on right, recipient on left)
- [ ] Validate message length (max 500 chars)
- [ ] Send message on submit
- [ ] Add auto-scroll to latest message
- [ ] Add loading and error states
- [ ] Mobile-first responsive design

**Dependencies:** FE-3, FE-5, FE-6

---

### FE-15: Add Loading and Error States
**Agent:** `frontend_engineer`
**Priority:** P2 (Important)
**Estimated Time:** 1 hour

**Description:**
Add consistent loading and error handling across all pages.

**Acceptance Criteria:**
- [ ] Create `app/loading.tsx` for page-level loading
- [ ] Create `app/error.tsx` for page-level errors
- [ ] Add skeleton loaders for ItemCard components
- [ ] Add error boundaries for critical components
- [ ] Add retry mechanisms for failed API calls
- [ ] Ensure all async operations show loading states

**Dependencies:** FE-5, FE-9, FE-12

---

### FE-16: Optimize for Mobile Performance
**Agent:** `frontend_engineer`
**Priority:** P2 (Important)
**Estimated Time:** 1 hour

**Description:**
Optimize frontend for mobile performance and 4G connections.

**Acceptance Criteria:**
- [ ] Configure Next.js Image optimization for all photos
- [ ] Add lazy loading for images below the fold
- [ ] Minimize JavaScript bundle size (check with `npm run build`)
- [ ] Add service worker for offline support (optional)
- [ ] Test page load time on simulated 4G connection (< 3 seconds)
- [ ] Verify touch targets are min 44x44px
- [ ] Test on real mobile device

**Dependencies:** FE-9, FE-11, FE-12

---

### FE-17: Connect to Real Backend API
**Agent:** `frontend_engineer`
**Priority:** P1 (Critical)
**Estimated Time:** 1 hour

**Description:**
Replace mock data with real API calls after infrastructure is deployed.

**Acceptance Criteria:**
- [ ] Update `.env.local` with real API endpoint from INFRA-16
- [ ] Update `.env.local` with real Cognito User Pool ID and Client ID
- [ ] Remove mock data toggle
- [ ] Test all API endpoints with real backend
- [ ] Verify authentication flow works end-to-end
- [ ] Verify item creation with AI generation works
- [ ] Verify lottery entry and winner selection works
- [ ] Verify messaging works

**Dependencies:** FE-3, INFRA-16

---

## Phase 3: Testing & Quality Assurance

### TEST-1: Write Lambda Handler Unit Tests
**Agent:** `senior_test_engineer`
**Priority:** P2 (Important)
**Estimated Time:** 2 hours

**Description:**
Write unit tests for all Lambda handlers using Vitest.

**Acceptance Criteria:**
- [ ] Create `infrastructure/test/handlers/` directory
- [ ] Write tests for items.ts handler (all endpoints)
- [ ] Write tests for lottery.ts handler (winner selection logic)
- [ ] Write tests for messages.ts handler
- [ ] Write tests for users.ts handler
- [ ] Mock AWS SDK calls (DynamoDB, S3, Rekognition, Bedrock, SES)
- [ ] Achieve >80% code coverage
- [ ] All tests pass with `npm run test`

**Dependencies:** INFRA-6, INFRA-7, INFRA-8, INFRA-9, INFRA-10

---

### TEST-2: Write CDK Infrastructure Tests
**Agent:** `senior_test_engineer`
**Priority:** P2 (Important)
**Estimated Time:** 1.5 hours

**Description:**
Write snapshot and property tests for CDK constructs.

**Acceptance Criteria:**
- [ ] Create `infrastructure/test/constructs/` directory
- [ ] Write snapshot tests for database.ts construct
- [ ] Write snapshot tests for storage.ts construct
- [ ] Write snapshot tests for auth.ts construct
- [ ] Write snapshot tests for api.ts construct
- [ ] Write property assertions (e.g., DynamoDB billing mode is ON_DEMAND)
- [ ] All tests pass with `npm run test`

**Dependencies:** INFRA-2, INFRA-3, INFRA-4, INFRA-11

---

### TEST-3: Write Frontend Component Tests
**Agent:** `senior_test_engineer`
**Priority:** P3 (Nice to have)
**Estimated Time:** 2 hours

**Description:**
Write unit tests for critical React components.

**Acceptance Criteria:**
- [ ] Set up Vitest for React component testing
- [ ] Write tests for ItemCard component
- [ ] Write tests for LotteryButton component
- [ ] Write tests for PhotoUpload component
- [ ] Write tests for LoginForm component
- [ ] Mock API calls
- [ ] All tests pass with `npm run test`

**Dependencies:** FE-8, FE-10, FE-12, FE-7

---

### TEST-4: Write E2E Tests with Playwright
**Agent:** `senior_test_engineer`
**Priority:** P2 (Important)
**Estimated Time:** 3 hours

**Description:**
Write end-to-end tests for critical user flows.

**Acceptance Criteria:**
- [ ] Set up Playwright in frontend project
- [ ] Write E2E test: User registration and login
- [ ] Write E2E test: Create new item listing (with mock AI response)
- [ ] Write E2E test: Browse items and filter by category
- [ ] Write E2E test: Enter lottery for an item
- [ ] Write E2E test: View user profile
- [ ] All tests pass with `npx playwright test`
- [ ] Generate HTML report

**Dependencies:** FE-7, FE-9, FE-11, FE-12, FE-13, FE-17

---

### TEST-5: Manual QA Testing
**Agent:** `senior_test_engineer`
**Priority:** P1 (Critical)
**Estimated Time:** 2 hours

**Description:**
Perform manual testing of all user flows on real mobile device.

**Acceptance Criteria:**
- [ ] Test on real Android or iOS device
- [ ] Verify registration and login flow
- [ ] Verify photo upload from camera
- [ ] Verify AI-generated title and description
- [ ] Verify item listing appears in feed
- [ ] Verify lottery entry
- [ ] Verify winner notification email
- [ ] Verify pickup confirmation
- [ ] Verify messaging between seller and winner
- [ ] Verify reputation score updates
- [ ] Document any bugs found

**Dependencies:** FE-17, INFRA-16

---

## Phase 4: Documentation & Deployment

### DOC-1: Create README.md
**Agent:** `business_analyst`
**Priority:** P2 (Important)
**Estimated Time:** 30 minutes

**Description:**
Create project README with setup instructions.

**Acceptance Criteria:**
- [ ] Create root `README.md`
- [ ] Add project description and value proposition
- [ ] Add architecture diagram (text-based or link to design.md)
- [ ] Add setup instructions for infrastructure (CDK deploy)
- [ ] Add setup instructions for frontend (npm install, env vars)
- [ ] Add AWS Free Tier compliance notes
- [ ] Add competition submission details

**Dependencies:** INFRA-16, FE-17

---

### DOC-2: Create Weekly Progress Report
**Agent:** `project_journalist`
**Priority:** P3 (Nice to have)
**Estimated Time:** 20 minutes

**Description:**
Create first weekly progress report for Product Owner.

**Acceptance Criteria:**
- [ ] Create `PROGRESS.md` in root directory
- [ ] Analyze git log and completed tasks
- [ ] Write 2-minute summary (max 300 words)
- [ ] Highlight completed features and business value
- [ ] Mention upcoming goals
- [ ] Use professional, non-technical tone

**Dependencies:** Multiple tasks completed

---

### DEPLOY-1: Deploy to Production
**Agent:** `aws_cdk_architect`
**Priority:** P0 (Blocker)
**Estimated Time:** 30 minutes

**Description:**
Final production deployment and verification.

**Acceptance Criteria:**
- [ ] Run `cdk deploy` to production AWS account
- [ ] Verify all resources created successfully
- [ ] Verify SES email identity (move out of sandbox if needed)
- [ ] Test API endpoints with curl/Postman
- [ ] Deploy frontend to Vercel or AWS Amplify Hosting
- [ ] Configure custom domain (optional)
- [ ] Verify end-to-end flow works in production

**Dependencies:** INFRA-16, FE-17, TEST-5

---

### DEPLOY-2: Monitor AWS Free Tier Usage
**Agent:** `aws_cdk_architect`
**Priority:** P1 (Critical)
**Estimated Time:** 30 minutes

**Description:**
Set up monitoring for AWS Free Tier usage.

**Acceptance Criteria:**
- [ ] Enable AWS Billing Alerts
- [ ] Set up CloudWatch alarm for estimated charges > $1
- [ ] Check Free Tier usage dashboard weekly
- [ ] Document current usage in PROGRESS.md
- [ ] Verify all services are within Free Tier limits

**Dependencies:** DEPLOY-1

---

## Task Summary

**Total Tasks:** 47
- **Phase 1 (Infrastructure):** 16 tasks
- **Phase 2 (Frontend):** 17 tasks
- **Phase 3 (Testing):** 5 tasks
- **Phase 4 (Documentation & Deployment):** 4 tasks

**Priority Breakdown:**
- **P0 (Blocker):** 11 tasks - Must complete first
- **P1 (Critical):** 18 tasks - Core functionality
- **P2 (Important):** 14 tasks - Quality and polish
- **P3 (Nice to have):** 2 tasks - Optional enhancements

**Estimated Total Time:** ~45 hours

**Recommended Execution Order:**
1. Complete all P0 tasks first (infrastructure foundation + frontend setup)
2. Complete P1 tasks (core features)
3. Complete P2 tasks (testing and optimization)
4. Complete P3 tasks if time permits

**Agent Workload:**
- `aws_cdk_architect`: 18 tasks (~15 hours)
- `frontend_engineer`: 17 tasks (~20 hours)
- `senior_test_engineer`: 5 tasks (~10 hours)
- `business_analyst`: 1 task (~30 minutes)
- `project_journalist`: 1 task (~20 minutes)
