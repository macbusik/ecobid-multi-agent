# Phase 3: Testing & Quality Assurance

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
