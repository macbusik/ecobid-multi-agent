# Rollback Procedure

## When to Rollback

Execute rollback if:
- Amplify deployment fails repeatedly
- Critical bugs discovered in production
- Performance degradation after migration
- User-facing errors that cannot be fixed quickly

## Automatic Rollback (Recommended)

Use the automated rollback script:

```bash
./scripts/rollback-to-cloudfront.sh
```

**What it does:**
1. Builds Next.js static export (`npm run build`)
2. Syncs `out/` directory to S3 bucket
3. Invalidates CloudFront cache
4. Waits for invalidation to complete

**Time:** ~5 minutes

## Manual Rollback Steps

If the script fails, follow these manual steps:

### 1. Build Static Export
```bash
cd frontend
npm run build
```

### 2. Sync to S3
```bash
aws s3 sync out s3://ecobid-frontend-191138354216/ --delete --region eu-central-1
```

### 3. Invalidate CloudFront
```bash
aws cloudfront create-invalidation \
  --distribution-id E2YVRTARUE0FFS \
  --paths "/*" \
  --region us-east-1
```

### 4. Verify Deployment
```bash
curl -I https://d29wjvb8fy6ptl.cloudfront.net
```

## Rollback CDK Infrastructure

If CDK stack was modified (FrontendConstruct removed):

```bash
cd infrastructure
git checkout main
npm run build
cdk deploy --require-approval never
```

## Post-Rollback Verification

- [ ] Home page loads: https://d29wjvb8fy6ptl.cloudfront.net
- [ ] Login/register works
- [ ] Item creation works
- [ ] Favorites work
- [ ] No console errors

## Known Limitations After Rollback

⚠️ **Dynamic routes will still be broken** - This is the original issue that triggered the migration. Rollback restores the static export, which does not support `/items/[id]` routes.

## Emergency Contact

If rollback fails, contact:
- AWS Support (if infrastructure issue)
- Check CloudWatch logs for Lambda errors
- Review CloudFront distribution status

## Rollback Testing

Test the rollback script on feature branch before production:

```bash
git checkout feature/amplify-gen2-migration
./scripts/rollback-to-cloudfront.sh
```

Verify the script works before proceeding with Amplify migration.
