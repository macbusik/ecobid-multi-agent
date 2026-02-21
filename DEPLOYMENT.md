# Frontend Deployment Guide

## Prerequisites
- AWS CDK infrastructure deployed (`InfrastructureStack`)
- AWS CLI configured with credentials
- Node.js 20+ installed

## Deployment Steps

### 1. Deploy Infrastructure (First Time)
```bash
cd infrastructure
npm run build
npx cdk deploy
```

This creates:
- S3 bucket for frontend static files
- CloudFront distribution for HTTPS delivery
- Outputs: Frontend URL, Bucket Name, Distribution ID

### 2. Build and Deploy Frontend
```bash
# Option A: Using deployment script (recommended)
./scripts/deploy-frontend.sh

# Option B: Manual deployment
cd frontend
npm run build
aws s3 sync out/ s3://$(aws cloudformation describe-stacks --stack-name InfrastructureStack --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" --output text)/ --delete
```

### 3. Access Frontend
Get the CloudFront URL:
```bash
aws cloudformation describe-stacks --stack-name InfrastructureStack --query "Stacks[0].Outputs[?OutputKey=='FrontendUrl'].OutputValue" --output text
```

## Environment Variables

Update `frontend/.env.local` with deployed values:
```bash
NEXT_PUBLIC_API_URL=<API Gateway URL from stack outputs>
NEXT_PUBLIC_COGNITO_USER_POOL_ID=<User Pool ID from stack outputs>
NEXT_PUBLIC_COGNITO_CLIENT_ID=<Client ID from stack outputs>
NEXT_PUBLIC_AWS_REGION=eu-central-1
NEXT_PUBLIC_USE_MOCK_DATA=false  # Set to false when backend is ready
```

## Free Tier Compliance

✅ **S3**: 5GB storage, 20,000 GET requests/month (12 months free)
✅ **CloudFront**: 1TB data transfer out, 10M HTTP/HTTPS requests/month (Always Free)

**Estimated Cost**: $0/month within Free Tier limits

## Troubleshooting

### CloudFront shows 403 error
- Wait 5-10 minutes for distribution to fully deploy
- Check S3 bucket has files: `aws s3 ls s3://<bucket-name>/`

### Changes not visible
- CloudFront caches content. Invalidate cache:
```bash
aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
```

### Build fails
- Ensure `output: 'export'` is set in `next.config.ts`
- Check all pages are static (no server-side rendering)
