---
inclusion: always
---
# AWS Amplify Gen 2 Migration Plan

## Executive Summary

**Current Issue:** Next.js 15+ with dynamic routes (`/items/[id]`) cannot be deployed to S3+CloudFront using static export. The app requires server-side rendering (SSR) support.

**Solution:** Migrate frontend hosting from S3+CloudFront to AWS Amplify Gen 2, which natively supports Next.js SSR while remaining AWS-native and Free Tier compliant.

**Impact:** 
- ✅ Maintains AWS 10,000 AIdeas competition compliance
- ✅ Enables full Next.js SSR functionality
- ✅ Simplifies deployment pipeline
- ✅ Stays within AWS Free Tier
- ⚠️ Requires infrastructure changes (CDK updates)

---

## Current Architecture

### Frontend Hosting (Current)
```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────┐
│   CloudFront    │ (Distribution: E2YVRTARUE0FFS)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  S3 Bucket      │ (ecobid-frontend-191138354216)
│  Static Files   │ (Next.js build output)
└─────────────────┘
```

**Limitations:**
- ❌ No SSR support (static files only)
- ❌ Dynamic routes require workarounds
- ❌ No automatic API route handling
- ❌ Manual deployment process

### Backend (Unchanged)
```
API Gateway → Lambda → DynamoDB
              ↓
         S3 (Items)
              ↓
      Bedrock (AI)
```

---

## Target Architecture

### Frontend Hosting (Amplify Gen 2)
```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────────┐
│   AWS Amplify Hosting (Gen 2)       │
│   - Built-in CDN                    │
│   - SSR Support                     │
│   - Automatic deployments           │
│   - Environment variables           │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   Next.js App (SSR)                 │
│   - Dynamic routes work             │
│   - Server components               │
│   - API routes (optional)           │
└─────────────────────────────────────┘
```

### Backend (Unchanged)
- API Gateway, Lambda, DynamoDB remain as-is
- No changes to backend infrastructure
- Frontend calls existing API endpoints

---

## Migration Strategy

### Phase 1: Preparation (Current State Preservation)
**Goal:** Document and verify current working state before migration

**Tasks:**
1. Create feature branch `feature/amplify-gen2-migration`
2. Document current CloudFront/S3 configuration
3. Export current environment variables
4. Create rollback plan
5. Test current functionality baseline

**Deliverables:**
- Branch created
- Configuration backup
- Test results documented

---

### Phase 2: Amplify Gen 2 Setup
**Goal:** Set up Amplify hosting without breaking existing backend

**Tasks:**
1. Install Amplify Gen 2 CLI
2. Initialize Amplify project in `frontend/`
3. Configure Amplify hosting for Next.js
4. Set up environment variables in Amplify
5. Configure build settings
6. Connect GitHub repository (optional)

**Deliverables:**
- `amplify/` directory created
- Build configuration defined
- Environment variables migrated

---

### Phase 3: Infrastructure Updates
**Goal:** Update CDK to remove CloudFront/S3 frontend hosting

**Tasks:**
1. Remove `frontend.ts` construct from CDK
2. Update stack to exclude CloudFront distribution
3. Keep S3 bucket for item photos (backend dependency)
4. Update deployment scripts
5. Document new deployment process

**Deliverables:**
- Updated CDK stack
- Deployment documentation
- CI/CD pipeline updated (if applicable)

---

### Phase 4: Testing & Validation
**Goal:** Verify all functionality works with Amplify hosting

**Tasks:**
1. Deploy to Amplify staging environment
2. Test authentication flow (Cognito)
3. Test item creation with photo upload
4. Test AI analysis functionality
5. Test dynamic routes (`/items/[id]`)
6. Test favorites system
7. Performance testing
8. Mobile responsiveness verification

**Deliverables:**
- Test results report
- Performance metrics
- Bug fixes (if any)

---

### Phase 5: Production Deployment
**Goal:** Switch production traffic to Amplify

**Tasks:**
1. Deploy to Amplify production
2. Update DNS (if custom domain)
3. Monitor for errors
4. Verify all features in production
5. Decommission CloudFront distribution
6. Clean up old S3 frontend bucket

**Deliverables:**
- Production deployment complete
- Old infrastructure removed
- Documentation updated

---

## Technical Implementation Details

### Amplify Gen 2 Configuration

**File: `amplify/backend.ts`**
```typescript
import { defineBackend } from '@aws-amplify/backend';

const backend = defineBackend({
  // Amplify Gen 2 uses existing AWS resources
  // No need to recreate DynamoDB, Cognito, etc.
});
```

**File: `amplify.yml` (Build Configuration)**
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

**Environment Variables (Amplify Console)**
```
NEXT_PUBLIC_API_URL=https://9jvk35eykg.execute-api.eu-central-1.amazonaws.com
NEXT_PUBLIC_COGNITO_USER_POOL_ID=eu-central-1_xxxxxxxxx
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_REGION=eu-central-1
NEXT_PUBLIC_S3_BUCKET=ecobid-items-191138354216
```

---

## CDK Changes Required

### Files to Modify

**1. `infrastructure/lib/infrastructure-stack.ts`**
```typescript
// REMOVE:
// import { FrontendConstruct } from './constructs/frontend';

// REMOVE:
// const frontend = new FrontendConstruct(this, 'Frontend', {
//   itemsBucket: storage.itemsBucket,
// });

// KEEP: All backend constructs (API, Database, Storage, Auth)
```

**2. `infrastructure/lib/constructs/frontend.ts`**
- Mark as deprecated or delete
- Document that Amplify Gen 2 replaces this

**3. `scripts/deploy-frontend.sh`**
```bash
#!/bin/bash
# OLD: aws s3 sync .next/static s3://...
# NEW: amplify publish (or GitHub auto-deploy)
```

---

## Rollback Plan

### If Migration Fails

**Step 1: Revert to main branch**
```bash
git checkout main
```

**Step 2: Redeploy CloudFront/S3**
```bash
cd infrastructure
npm run deploy
cd ../frontend
npm run build
aws s3 sync out s3://ecobid-frontend-191138354216/ --delete
aws cloudfront create-invalidation --distribution-id E2YVRTARUE0FFS --paths "/*"
```

**Step 3: Verify functionality**
- Test at https://d29wjvb8fy6ptl.cloudfront.net

---

## Cost Analysis

### Current (S3 + CloudFront)
- S3: $0/month (Free Tier: 5GB storage)
- CloudFront: $0/month (Free Tier: 1TB transfer)
- **Total: $0/month**

### After Migration (Amplify Gen 2)
- Amplify Hosting: $0/month (Free Tier: 1000 build minutes, 15GB storage, 15GB transfer)
- S3 (items only): $0/month (Free Tier)
- **Total: $0/month**

**Conclusion:** Migration maintains Free Tier compliance ✅

---

## Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Preparation | 1 hour | None |
| Phase 2: Amplify Setup | 2 hours | Phase 1 |
| Phase 3: Infrastructure Updates | 1 hour | Phase 2 |
| Phase 4: Testing | 2 hours | Phase 3 |
| Phase 5: Production Deployment | 1 hour | Phase 4 |
| **Total** | **7 hours** | Sequential |

---

## Success Criteria

### Must Have (Blocking)
- ✅ All current features work (auth, items, favorites, AI)
- ✅ Dynamic routes (`/items/[id]`) load correctly
- ✅ Photo uploads work
- ✅ Mobile responsiveness maintained
- ✅ AWS Free Tier compliance
- ✅ Deployment process documented

### Nice to Have (Non-blocking)
- ✅ Faster build times
- ✅ Automatic deployments from GitHub
- ✅ Preview deployments for PRs
- ✅ Built-in monitoring

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Amplify build fails | High | Low | Test locally first, use feature branch |
| Environment variables missing | High | Medium | Document all vars, use checklist |
| Performance degradation | Medium | Low | Benchmark before/after, use Amplify CDN |
| Cost overruns | High | Very Low | Monitor Free Tier usage, set billing alerts |
| Rollback needed | Medium | Low | Keep CloudFront active until verified |

---

## Documentation Updates Required

### Files to Update

1. **README.md**
   - Update deployment instructions
   - Replace S3/CloudFront with Amplify
   - Update architecture diagram

2. **design.md**
   - Update Section 1.1 (High-Level Architecture)
   - Replace CloudFront with Amplify Hosting

3. **tasks.md**
   - Mark CloudFront tasks as deprecated
   - Add Amplify migration tasks

4. **DEPLOYMENT.md** (if exists)
   - Complete rewrite for Amplify workflow

---

## Next Steps

1. **Review this document** with stakeholders
2. **Create feature branch** `feature/amplify-gen2-migration`
3. **Execute Phase 1** (Preparation)
4. **Proceed sequentially** through phases
5. **Merge to main** after successful production deployment

---

## References

- [AWS Amplify Gen 2 Documentation](https://docs.amplify.aws/gen2/)
- [Next.js on Amplify](https://docs.amplify.aws/guides/hosting/nextjs/)
- [AWS Free Tier Details](https://aws.amazon.com/free/)
- [Amplify Pricing](https://aws.amazon.com/amplify/pricing/)

---

**Document Version:** 1.0  
**Created:** 2026-03-02  
**Author:** AI Assistant  
**Status:** Draft - Awaiting Approval
