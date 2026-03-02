---
inclusion: always
---
# Amplify Gen 2 Migration - Task List

## Overview
Migration from S3+CloudFront to AWS Amplify Gen 2 for Next.js SSR support.

**Branch:** `feature/amplify-gen2-migration`  
**Estimated Time:** 7 hours  
**Priority:** High (Blocking production deployment)

---

## Phase 1: Preparation & Documentation

### AMPLIFY-1: Create Feature Branch
**Priority:** Critical  
**Estimated Time:** 5 minutes  
**Agent:** DevOps Engineer

**Description:**
Create and checkout feature branch for migration work.

**Tasks:**
- [ ] Create branch `feature/amplify-gen2-migration` from `main`
- [ ] Push branch to remote
- [ ] Verify branch protection rules (if any)

**Acceptance Criteria:**
- Branch exists and is checked out
- No uncommitted changes from main

**Commands:**
```bash
git checkout main
git pull origin main
git checkout -b feature/amplify-gen2-migration
git push -u origin feature/amplify-gen2-migration
```

---

### AMPLIFY-2: Document Current State
**Priority:** High  
**Estimated Time:** 30 minutes  
**Agent:** DevOps Engineer

**Description:**
Capture current CloudFront/S3 configuration for rollback purposes.

**Tasks:**
- [ ] Export CloudFront distribution config
- [ ] Document S3 bucket settings
- [ ] List all environment variables
- [ ] Screenshot current deployment
- [ ] Test and document all features

**Acceptance Criteria:**
- Configuration files saved to `docs/migration/current-state/`
- All environment variables documented
- Feature checklist completed

**Deliverables:**
- `docs/migration/current-state/cloudfront-config.json`
- `docs/migration/current-state/s3-config.json`
- `docs/migration/current-state/env-vars.txt`
- `docs/migration/current-state/feature-checklist.md`

---

### AMPLIFY-3: Create Rollback Script
**Priority:** High  
**Estimated Time:** 15 minutes  
**Agent:** DevOps Engineer

**Description:**
Create automated rollback script in case migration fails.

**Tasks:**
- [ ] Create `scripts/rollback-to-cloudfront.sh`
- [ ] Test rollback script on feature branch
- [ ] Document rollback procedure

**Acceptance Criteria:**
- Script successfully redeploys to CloudFront
- Documentation includes step-by-step rollback

**Deliverables:**
- `scripts/rollback-to-cloudfront.sh`
- `docs/migration/ROLLBACK.md`

---

## Phase 2: Amplify Gen 2 Setup

### AMPLIFY-4: Install Amplify CLI
**Priority:** Critical  
**Estimated Time:** 10 minutes  
**Agent:** DevOps Engineer

**Description:**
Install and configure AWS Amplify CLI for Gen 2.

**Tasks:**
- [ ] Install Amplify CLI globally: `npm install -g @aws-amplify/cli`
- [ ] Verify installation: `amplify --version`
- [ ] Configure AWS credentials (if needed)

**Acceptance Criteria:**
- Amplify CLI installed and accessible
- AWS credentials configured
- Can run `amplify` commands

---

### AMPLIFY-5: Initialize Amplify Project
**Priority:** Critical  
**Estimated Time:** 30 minutes  
**Agent:** DevOps Engineer

**Description:**
Initialize Amplify Gen 2 in the frontend directory.

**Tasks:**
- [ ] Run `amplify init` in `frontend/` directory
- [ ] Select Next.js framework
- [ ] Configure project name: `ecobid-marketplace`
- [ ] Set environment: `dev`
- [ ] Review generated `amplify/` directory

**Acceptance Criteria:**
- `frontend/amplify/` directory created
- `amplify/backend.ts` exists
- No errors during initialization

**Deliverables:**
- `frontend/amplify/backend.ts`
- `frontend/amplify/package.json`

---

### AMPLIFY-6: Configure Amplify Hosting
**Priority:** Critical  
**Estimated Time:** 45 minutes  
**Agent:** DevOps Engineer

**Description:**
Set up Amplify Hosting for Next.js with SSR support.

**Tasks:**
- [ ] Run `amplify add hosting`
- [ ] Select "Hosting with Amplify Console"
- [ ] Choose "Manual deployment" (for now)
- [ ] Create `amplify.yml` build configuration
- [ ] Configure environment variables in Amplify Console
- [ ] Test local build: `amplify publish --debug`

**Acceptance Criteria:**
- `amplify.yml` created with correct build commands
- Environment variables set in Amplify Console
- Local build succeeds

**Deliverables:**
- `frontend/amplify.yml`
- Environment variables configured

**amplify.yml Template:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

---

### AMPLIFY-7: Migrate Environment Variables
**Priority:** High  
**Estimated Time:** 15 minutes  
**Agent:** DevOps Engineer

**Description:**
Transfer all environment variables from `.env.local` to Amplify Console.

**Tasks:**
- [ ] List all variables from `frontend/.env.local`
- [ ] Add to Amplify Console → App Settings → Environment Variables
- [ ] Verify variable names match (NEXT_PUBLIC_*)
- [ ] Test variable access in build

**Acceptance Criteria:**
- All environment variables present in Amplify
- Build can access variables
- No hardcoded secrets in code

**Variables to Migrate:**
```
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_COGNITO_USER_POOL_ID
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID
NEXT_PUBLIC_COGNITO_REGION
NEXT_PUBLIC_S3_BUCKET
```

---

## Phase 3: Infrastructure Updates

### AMPLIFY-8: Update CDK Stack
**Priority:** High  
**Estimated Time:** 30 minutes  
**Agent:** AWS Architect

**Description:**
Remove CloudFront/S3 frontend hosting from CDK, keep backend unchanged.

**Tasks:**
- [ ] Comment out `FrontendConstruct` import in `infrastructure-stack.ts`
- [ ] Comment out frontend instantiation
- [ ] Keep S3 items bucket (backend dependency)
- [ ] Update stack outputs (remove CloudFront URL)
- [ ] Test CDK synth: `npm run build && cdk synth`
- [ ] Deploy updated stack: `cdk deploy`

**Acceptance Criteria:**
- CDK synth succeeds
- Backend resources unchanged
- CloudFront distribution removed
- S3 items bucket remains

**Files to Modify:**
- `infrastructure/lib/infrastructure-stack.ts`

---

### AMPLIFY-9: Update Deployment Scripts
**Priority:** Medium  
**Estimated Time:** 20 minutes  
**Agent:** DevOps Engineer

**Description:**
Update deployment scripts to use Amplify instead of S3/CloudFront.

**Tasks:**
- [ ] Update `scripts/deploy-frontend.sh` to use `amplify publish`
- [ ] Remove S3 sync commands
- [ ] Remove CloudFront invalidation commands
- [ ] Test new deployment script

**Acceptance Criteria:**
- Script deploys to Amplify successfully
- Old S3/CloudFront commands removed
- Script is idempotent

**Deliverables:**
- Updated `scripts/deploy-frontend.sh`

---

### AMPLIFY-10: Update CI/CD Pipeline (Optional)
**Priority:** Low  
**Estimated Time:** 30 minutes  
**Agent:** DevOps Engineer

**Description:**
Update GitHub Actions or CI/CD to deploy to Amplify.

**Tasks:**
- [ ] Update `.github/workflows/deploy.yml` (if exists)
- [ ] Replace S3/CloudFront steps with Amplify
- [ ] Test CI/CD pipeline
- [ ] Document new workflow

**Acceptance Criteria:**
- CI/CD deploys to Amplify
- All tests pass
- Deployment is automated

**Note:** Skip if no CI/CD currently exists.

---

## Phase 4: Testing & Validation

### AMPLIFY-11: Deploy to Amplify Staging
**Priority:** Critical  
**Estimated Time:** 15 minutes  
**Agent:** DevOps Engineer

**Description:**
Deploy application to Amplify staging environment.

**Tasks:**
- [ ] Run `amplify publish`
- [ ] Wait for build to complete
- [ ] Note staging URL
- [ ] Verify deployment succeeded

**Acceptance Criteria:**
- Build completes without errors
- Staging URL accessible
- App loads in browser

---

### AMPLIFY-12: Test Authentication Flow
**Priority:** Critical  
**Estimated Time:** 20 minutes  
**Agent:** QA Engineer

**Description:**
Verify Cognito authentication works with Amplify hosting.

**Tasks:**
- [ ] Test user registration
- [ ] Test email verification
- [ ] Test login
- [ ] Test logout
- [ ] Test protected routes
- [ ] Test session persistence

**Acceptance Criteria:**
- All auth flows work
- JWT tokens valid
- Protected routes redirect correctly

---

### AMPLIFY-13: Test Item Creation & AI
**Priority:** Critical  
**Estimated Time:** 30 minutes  
**Agent:** QA Engineer

**Description:**
Verify item creation with photo upload and AI analysis.

**Tasks:**
- [ ] Navigate to `/items/new`
- [ ] Upload photo
- [ ] Verify presigned URL generation
- [ ] Verify S3 upload
- [ ] Verify AI analysis (Nova Lite)
- [ ] Verify item saved to DynamoDB
- [ ] Check item appears on home page

**Acceptance Criteria:**
- Photo uploads successfully
- AI generates title/description
- Item visible on home page
- Photo displays correctly

---

### AMPLIFY-14: Test Dynamic Routes
**Priority:** Critical  
**Estimated Time:** 15 minutes  
**Agent:** QA Engineer

**Description:**
Verify dynamic routes work with SSR (main reason for migration).

**Tasks:**
- [ ] Click on item card from home page
- [ ] Verify `/items/[id]` route loads
- [ ] Verify item details display
- [ ] Test direct URL access (refresh page)
- [ ] Test 404 for invalid item ID

**Acceptance Criteria:**
- Dynamic routes load correctly
- SSR renders item details
- Page refresh works
- 404 page shows for invalid IDs

---

### AMPLIFY-15: Test Favorites System
**Priority:** High  
**Estimated Time:** 15 minutes  
**Agent:** QA Engineer

**Description:**
Verify favorites functionality works end-to-end.

**Tasks:**
- [ ] Add item to favorites
- [ ] Verify heart icon turns red
- [ ] Navigate to `/favorites`
- [ ] Verify item appears
- [ ] Remove from favorites
- [ ] Verify item removed

**Acceptance Criteria:**
- Favorites add/remove works
- State persists across pages
- API calls succeed

---

### AMPLIFY-16: Mobile Responsiveness Test
**Priority:** High  
**Estimated Time:** 20 minutes  
**Agent:** UX/UI Expert

**Description:**
Verify mobile-first design works on Amplify hosting.

**Tasks:**
- [ ] Test on iPhone (375px)
- [ ] Test on Android (360px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1024px+)
- [ ] Verify touch targets (48px minimum)
- [ ] Test category filter scroll

**Acceptance Criteria:**
- All breakpoints work correctly
- Touch targets meet minimum size
- No horizontal scroll
- Smooth animations

---

### AMPLIFY-17: Performance Testing
**Priority:** Medium  
**Estimated Time:** 30 minutes  
**Agent:** DevOps Engineer

**Description:**
Benchmark performance before/after migration.

**Tasks:**
- [ ] Run Lighthouse audit (before)
- [ ] Run Lighthouse audit (after)
- [ ] Compare load times
- [ ] Check Core Web Vitals
- [ ] Test image loading
- [ ] Document results

**Acceptance Criteria:**
- Performance score ≥ 90
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

**Deliverables:**
- `docs/migration/performance-report.md`

---

## Phase 5: Production Deployment

### AMPLIFY-18: Deploy to Production
**Priority:** Critical  
**Estimated Time:** 15 minutes  
**Agent:** DevOps Engineer

**Description:**
Deploy to Amplify production environment.

**Tasks:**
- [ ] Create production environment in Amplify
- [ ] Set production environment variables
- [ ] Deploy: `amplify publish --environment production`
- [ ] Verify production URL
- [ ] Monitor for errors

**Acceptance Criteria:**
- Production deployment succeeds
- No errors in logs
- All features work

---

### AMPLIFY-19: Update DNS (Optional)
**Priority:** Low  
**Estimated Time:** 30 minutes  
**Agent:** DevOps Engineer

**Description:**
Point custom domain to Amplify (if applicable).

**Tasks:**
- [ ] Add custom domain in Amplify Console
- [ ] Update DNS records
- [ ] Wait for SSL certificate
- [ ] Verify HTTPS works

**Acceptance Criteria:**
- Custom domain resolves to Amplify
- SSL certificate valid
- HTTPS enforced

**Note:** Skip if using default Amplify domain.

---

### AMPLIFY-20: Production Smoke Test
**Priority:** Critical  
**Estimated Time:** 30 minutes  
**Agent:** QA Engineer

**Description:**
Final verification of all features in production.

**Tasks:**
- [ ] Test authentication
- [ ] Test item creation
- [ ] Test AI analysis
- [ ] Test dynamic routes
- [ ] Test favorites
- [ ] Test on mobile device
- [ ] Monitor error logs

**Acceptance Criteria:**
- All features work in production
- No errors in logs
- Performance acceptable

---

### AMPLIFY-21: Decommission CloudFront
**Priority:** Medium  
**Estimated Time:** 15 minutes  
**Agent:** DevOps Engineer

**Description:**
Remove old CloudFront distribution and S3 frontend bucket.

**Tasks:**
- [ ] Disable CloudFront distribution
- [ ] Wait 24 hours (safety buffer)
- [ ] Delete CloudFront distribution
- [ ] Empty S3 frontend bucket
- [ ] Delete S3 frontend bucket (optional)

**Acceptance Criteria:**
- CloudFront distribution deleted
- S3 frontend bucket cleaned up
- No unexpected costs

**Note:** Keep S3 items bucket (backend dependency).

---

### AMPLIFY-22: Update Documentation
**Priority:** High  
**Estimated Time:** 45 minutes  
**Agent:** Technical Writer

**Description:**
Update all documentation to reflect Amplify hosting.

**Tasks:**
- [ ] Update `README.md` deployment section
- [ ] Update `design.md` architecture diagram
- [ ] Update `tasks.md` (mark CloudFront tasks deprecated)
- [ ] Create `DEPLOYMENT.md` with Amplify instructions
- [ ] Update architecture diagrams

**Acceptance Criteria:**
- All docs reference Amplify (not CloudFront)
- Deployment instructions accurate
- Architecture diagrams updated

**Files to Update:**
- `README.md`
- `.kiro/specs/ecobid-marketplace/design.md`
- `.kiro/specs/ecobid-marketplace/tasks.md`
- `DEPLOYMENT.md` (create if missing)

---

### AMPLIFY-23: Merge to Main
**Priority:** Critical  
**Estimated Time:** 15 minutes  
**Agent:** DevOps Engineer

**Description:**
Merge feature branch to main after successful production deployment.

**Tasks:**
- [ ] Create pull request
- [ ] Review changes
- [ ] Run final tests
- [ ] Merge to main
- [ ] Delete feature branch
- [ ] Tag release: `v1.0.0-amplify`

**Acceptance Criteria:**
- PR approved
- All tests pass
- Main branch updated
- Release tagged

---

## Summary

**Total Tasks:** 23  
**Estimated Total Time:** 7 hours  
**Critical Path:** AMPLIFY-1 → AMPLIFY-4 → AMPLIFY-5 → AMPLIFY-6 → AMPLIFY-11 → AMPLIFY-14 → AMPLIFY-18 → AMPLIFY-23

**Dependencies:**
- Phase 2 depends on Phase 1
- Phase 3 depends on Phase 2
- Phase 4 depends on Phase 3
- Phase 5 depends on Phase 4

**Rollback Point:**
- If any task in Phase 4 fails, execute rollback script
- CloudFront remains active until AMPLIFY-21

---

## Task Status Tracking

| Task ID | Status | Assignee | Completed |
|---------|--------|----------|-----------|
| AMPLIFY-1 | ⏳ Pending | - | - |
| AMPLIFY-2 | ⏳ Pending | - | - |
| AMPLIFY-3 | ⏳ Pending | - | - |
| ... | ... | ... | ... |

---

**Document Version:** 1.0  
**Created:** 2026-03-02  
**Status:** Ready for Execution
