# CI/CD Pipeline Specification for Frontend Deployment

## Business Context
**Problem:** Manual frontend deployment requires developer intervention and is error-prone.
**Goal:** Automate frontend deployment on every push to `main` branch.
**Constraint:** Must stay within AWS Free Tier limits.

## MVP Solution: GitHub Actions + AWS

### Why GitHub Actions?
- ✅ **Free Tier:** 2,000 minutes/month for private repos, unlimited for public repos
- ✅ **Zero AWS Cost:** No CodePipeline ($1/pipeline/month), no CodeBuild charges
- ✅ **Simple Setup:** Single YAML file, no additional AWS resources
- ✅ **Fast Iteration:** Changes take effect immediately

### Architecture
```
GitHub Push (main) → GitHub Actions → Build Next.js → Deploy to S3 → Invalidate CloudFront
```

### Required AWS Resources (Already Exist)
- S3 bucket: `ecobid-frontend-191138354216`
- CloudFront distribution: `E2YVRTARUE0FFS`
- IAM user with deployment permissions (to be created)

### Workflow Triggers
1. **Automatic:** Push to `main` branch
2. **Manual:** Workflow dispatch (for emergency deployments)

### Deployment Steps
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Build Next.js (`npm run build`)
5. Sync to S3 (`aws s3 sync out/ s3://bucket/`)
6. Invalidate CloudFront cache

### Security
- AWS credentials stored as GitHub Secrets (encrypted)
- Least privilege IAM policy (S3 write + CloudFront invalidate only)
- No hardcoded credentials in code

### Cost Analysis
- **GitHub Actions:** $0 (within free tier)
- **S3 PUT requests:** ~50 files × $0.005/1000 = $0.00025 per deployment
- **CloudFront invalidations:** 1,000 free/month, then $0.005 per path
- **Total:** ~$0/month for typical usage

### Rollback Strategy
- CloudFront caches content (5 min TTL)
- Manual rollback: `git revert` + push triggers new deployment
- Emergency: Manual deployment from local machine using existing script

## Out of Scope (V2)
- ❌ Preview deployments for PRs (requires additional CloudFront distributions)
- ❌ Blue-green deployments (requires duplicate infrastructure)
- ❌ Automated testing in pipeline (add later when tests exist)
- ❌ Slack/email notifications (nice-to-have)

## Implementation Tasks

### CICD-1: Create IAM Deployment User
**Priority:** P0 (Blocker)
**Time:** 15 minutes
**Owner:** AWS Architect

Create IAM user with minimal permissions:
- S3: `PutObject`, `DeleteObject`, `ListBucket` on frontend bucket
- CloudFront: `CreateInvalidation` on frontend distribution

### CICD-2: Create GitHub Actions Workflow
**Priority:** P0 (Blocker)
**Time:** 30 minutes
**Owner:** Frontend Engineer

Create `.github/workflows/deploy-frontend.yml`:
- Trigger on push to `main` (paths: `frontend/**`)
- Build and deploy steps
- Use GitHub Secrets for AWS credentials

### CICD-3: Test Deployment Pipeline
**Priority:** P0 (Blocker)
**Time:** 15 minutes
**Owner:** Frontend Engineer

- Make a small change to frontend
- Push to `main`
- Verify deployment succeeds
- Verify CloudFront shows updated content

## Success Criteria
- ✅ Push to `main` triggers automatic deployment
- ✅ Deployment completes in < 5 minutes
- ✅ CloudFront shows updated content within 10 minutes
- ✅ Zero manual steps required
- ✅ Zero additional AWS costs

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| GitHub Actions outage | High | Keep manual deployment script as backup |
| AWS credentials leak | Critical | Use GitHub Secrets, rotate keys quarterly |
| Failed deployment breaks site | Medium | CloudFront caches old content, manual rollback available |
| Exceeds free tier | Low | Monitor GitHub Actions usage, typical usage well within limits |

## Future Enhancements (Post-MVP)
1. Add automated tests before deployment
2. Add preview deployments for PRs
3. Add deployment notifications (Slack/email)
4. Add deployment metrics (success rate, duration)
5. Consider AWS Amplify Hosting (more integrated, but less control)
