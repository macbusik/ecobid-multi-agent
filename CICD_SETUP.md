# GitHub Actions CI/CD Setup Guide

## Prerequisites
- GitHub repository created
- AWS CDK infrastructure deployed

## Step 1: Deploy IAM Role

Set your GitHub repository name and deploy:

```bash
export GITHUB_REPOSITORY="YOUR_USERNAME/ecobid-multi-agent"
cd infrastructure
npm run build
npx cdk deploy
```

This creates:
- OIDC Provider for GitHub Actions
- IAM Role with AdministratorAccess
- Trust policy allowing your GitHub repo to assume the role

## Step 2: Get Stack Outputs

```bash
aws cloudformation describe-stacks --stack-name EcoBidStack --query "Stacks[0].Outputs" --output table
```

You need:
- `GitHubActionsRoleArn` (e.g., arn:aws:iam::123456789012:role/GitHubActionsDeploymentRole)
- `FrontendFrontendBucketNameACC9E00B` (e.g., ecobid-frontend-191138354216)
- `FrontendFrontendDistributionId9E829054` (e.g., E2YVRTARUE0FFS)

## Step 3: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `AWS_ROLE_ARN`: The GitHubActionsRoleArn from stack outputs
- `S3_BUCKET_NAME`: The frontend bucket name
- `CLOUDFRONT_DISTRIBUTION_ID`: The CloudFront distribution ID

## Step 4: Test Deployment

Make a change to the frontend and push:

```bash
cd frontend
# Make a small change (e.g., edit app/page.tsx)
git add .
git commit -m "test: Trigger CI/CD pipeline"
git push origin main
```

Go to GitHub → Actions tab to watch the deployment.

## How It Works

1. **OIDC Authentication**: GitHub Actions gets a temporary token from GitHub
2. **Assume Role**: Uses token to assume the AWS IAM role (no access keys needed)
3. **Build**: Runs `npm ci && npm run build` in frontend directory
4. **Deploy**: Syncs `out/` directory to S3
5. **Invalidate**: Clears CloudFront cache so changes are visible immediately

## Security Benefits

✅ **No Access Keys**: No long-lived credentials stored in GitHub
✅ **Temporary Credentials**: AWS credentials expire after 1 hour
✅ **Scoped Trust**: Only your specific GitHub repo can assume the role
✅ **Audit Trail**: All actions logged in AWS CloudTrail

## Troubleshooting

### Error: "Not authorized to perform sts:AssumeRoleWithWebIdentity"
- Check `AWS_ROLE_ARN` secret matches the role ARN from stack outputs
- Verify `GITHUB_REPOSITORY` environment variable was set correctly during deployment
- Ensure you're pushing from the correct repository

### Deployment succeeds but changes not visible
- CloudFront invalidation takes 1-2 minutes to propagate
- Check CloudFront distribution → Invalidations tab
- Try hard refresh in browser (Ctrl+Shift+R)

### Build fails
- Check Node.js version matches (20.x)
- Verify `frontend/package-lock.json` is committed
- Check build logs in GitHub Actions

## Future: Restrict Permissions

Once stable, replace AdministratorAccess with minimal policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::ecobid-frontend-*",
        "arn:aws:s3:::ecobid-frontend-*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::*:distribution/*"
    }
  ]
}
```
