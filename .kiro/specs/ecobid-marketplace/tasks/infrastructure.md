# Phase 1: Infrastructure Foundation (AWS CDK)

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

### INFRA-8: Create Messages Lambda Handler ✅
**Agent:** `aws_cdk_architect`
**Priority:** P1 (Critical)
**Estimated Time:** 1 hour
**Status:** COMPLETED

**Description:**
Implement Messages Lambda handler for in-app messaging.

**Acceptance Criteria:**
- [x] Create `lib/lambda/handlers/messages.ts`
- [x] Implement POST /items/{itemId}/messages: create message, validate 500 char limit
- [x] Implement GET /items/{itemId}/messages: query messages ordered by timestamp
- [x] Verify sender is either seller or winner
- [x] Send email notification to recipient using SES
- [x] Add error handling

**Dependencies:** INFRA-2, INFRA-5

---

### INFRA-9: Create Users Lambda Handler ✅
**Agent:** `aws_cdk_architect`
**Priority:** P1 (Critical)
**Estimated Time:** 45 minutes
**Status:** COMPLETED

**Description:**
Implement Users Lambda handler for profile operations.

**Acceptance Criteria:**
- [x] Create `lib/lambda/handlers/users.ts`
- [x] Implement GET /users/{userId}: get user profile
- [x] Implement GET /users/me: get current user profile from Cognito token
- [x] Add error handling

**Dependencies:** INFRA-2, INFRA-4, INFRA-5

---

### INFRA-10: Create Reservation Expiry Lambda Handler ✅
**Agent:** `aws_cdk_architect`
**Priority:** P2 (Important)
**Estimated Time:** 45 minutes
**Status:** COMPLETED

**Description:**
Implement Reservation Expiry Lambda handler for expired reservations.

**Acceptance Criteria:**
- [x] Create `lib/lambda/handlers/reservation-expiry.ts`
- [x] Check if item status is still "Reserved" (not "Pickup_Confirmed")
- [x] If expired, update status to "Expired"
- [x] Send email to seller notifying expiry
- [x] Add error handling

**Dependencies:** INFRA-2, INFRA-5

---


### INFRA-11: Create API Gateway Construct ✅
**Agent:** `aws_cdk_architect`
**Priority:** P0 (Blocker)
**Estimated Time:** 1.5 hours
**Status:** COMPLETED

**Description:**
Create API Gateway HTTP API with Cognito authorizer and Lambda integrations.

**Acceptance Criteria:**
- [x] Create `lib/constructs/api.ts`
- [x] Define HTTP API (not REST API for cost savings)
- [x] Configure Cognito JWT authorizer
- [x] Add CORS configuration for frontend domain
- [x] Integrate Items Lambda: POST /items, PUT /items/{itemId}, GET /items, GET /items/{itemId}, POST /items/{itemId}/lottery, POST /items/{itemId}/confirm-pickup, POST /items/{itemId}/mark-picked-up
- [x] Integrate Messages Lambda: POST /items/{itemId}/messages, GET /items/{itemId}/messages
- [x] Integrate Users Lambda: GET /users/{userId}, GET /users/me
- [x] Add auth routes (handled by Cognito directly): POST /auth/register, POST /auth/login
- [x] Export API endpoint URL as stack output

**Dependencies:** INFRA-4, INFRA-6, INFRA-8, INFRA-9

---

### INFRA-12: Configure EventBridge Scheduler ✅
**Agent:** `aws_cdk_architect`
**Priority:** P2 (Important)
**Estimated Time:** 1 hour
**Status:** COMPLETED

**Description:**
Set up EventBridge Scheduler for lottery and reservation expiry.

**Acceptance Criteria:**
- [x] Create `lib/constructs/scheduler.ts`
- [x] Grant Items Lambda permission to create one-time schedules
- [x] Grant Lottery Lambda permission to create one-time schedules
- [x] Configure IAM role for EventBridge to invoke Lambda targets
- [x] Document schedule creation pattern in JSDoc

**Dependencies:** INFRA-6, INFRA-7, INFRA-10

---

### INFRA-13: Configure Amazon SES ✅
**Agent:** `aws_cdk_architect`
**Priority:** P2 (Important)
**Estimated Time:** 30 minutes
**Status:** COMPLETED

**Description:**
Configure Amazon SES for email notifications.

**Acceptance Criteria:**
- [x] Add SES email identity (use sandbox mode for MVP)
- [x] Grant Lottery Lambda permission to send emails
- [x] Grant Messages Lambda permission to send emails
- [x] Grant Reservation Expiry Lambda permission to send emails
- [x] Document email verification requirement in JSDoc
- [x] Add SES_FROM_EMAIL to Lambda environment variables

**Dependencies:** INFRA-7, INFRA-8, INFRA-10

---

### INFRA-14: Create Main CDK Stack ✅
**Agent:** `aws_cdk_architect`
**Priority:** P0 (Blocker)
**Estimated Time:** 1 hour
**Status:** COMPLETED

**Description:**
Assemble all constructs into the main EcoBid stack.

**Acceptance Criteria:**
- [x] Create `lib/ecobid-stack.ts`
- [x] Instantiate all constructs: database, storage, auth, api, scheduler
- [x] Wire up dependencies between constructs
- [x] Pass environment variables to Lambda functions (TABLE_NAME, BUCKET_NAME, etc.)
- [x] Configure Lambda functions: ARM64 architecture, Node.js 20.x runtime, 512MB memory, 30s timeout
- [x] Add stack tags: Project=EcoBid, Environment=Prod
- [x] Export all critical outputs (API URL, User Pool ID, Client ID, Bucket Name)

**Dependencies:** INFRA-2, INFRA-3, INFRA-4, INFRA-11, INFRA-12, INFRA-13

---

### INFRA-15: Create CDK App Entry Point ✅
**Agent:** `aws_cdk_architect`
**Priority:** P0 (Blocker)
**Estimated Time:** 15 minutes
**Status:** COMPLETED

**Description:**
Create CDK app entry point and configure deployment.

**Acceptance Criteria:**
- [x] Create `bin/app.ts`
- [x] Instantiate EcoBidStack with proper environment (account, region)
- [x] Add app-level tags
- [x] Verify `cdk synth` generates CloudFormation template
- [x] Verify `cdk diff` shows expected resources

**Dependencies:** INFRA-14
- [ ] Verify `cdk synth` generates CloudFormation template
- [ ] Verify `cdk diff` shows expected resources

**Dependencies:** INFRA-14

---

### INFRA-16: Deploy Infrastructure to AWS ✅
**Agent:** `aws_cdk_architect`
**Priority:** P0 (Blocker)
**Estimated Time:** 30 minutes
**Status:** COMPLETED

**Description:**
Deploy the CDK stack to AWS and verify all resources.

**Acceptance Criteria:**
- [x] Run `cdk bootstrap` (if first time)
- [x] Run `cdk deploy --require-approval never`
- [x] Verify all resources created successfully in AWS Console
- [x] Verify API Gateway endpoint is accessible
- [x] Verify DynamoDB table exists with correct GSIs
- [x] Verify S3 bucket exists and is publicly readable
- [x] Verify Cognito User Pool exists
- [x] Save stack outputs to `.env` file for frontend

**Deployment Details:**
- Stack Name: EcoBidStack
- Region: eu-central-1
- API Endpoint: https://9jvk35eykg.execute-api.eu-central-1.amazonaws.com
- Deployment Time: 126.76s
- Total Resources: 57

**Dependencies:** INFRA-15

---
