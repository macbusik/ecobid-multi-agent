#!/bin/bash
set -e

# Rollback to CloudFront + S3 Static Deployment
# Use this script if Amplify migration fails

echo "🔄 Starting rollback to CloudFront + S3..."

# Configuration
FRONTEND_BUCKET="ecobid-frontend-191138354216"
CLOUDFRONT_DIST_ID="E2YVRTARUE0FFS"
REGION="eu-central-1"

# Step 1: Build static export
echo "📦 Building Next.js static export..."
cd frontend
npm run build
cd ..

# Step 2: Sync to S3
echo "☁️  Syncing to S3 bucket: $FRONTEND_BUCKET..."
aws s3 sync frontend/out s3://$FRONTEND_BUCKET/ --delete --region $REGION

# Step 3: Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_DIST_ID \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text \
  --region us-east-1)

echo "✅ Invalidation created: $INVALIDATION_ID"

# Step 4: Wait for invalidation
echo "⏳ Waiting for invalidation to complete..."
aws cloudfront wait invalidation-completed \
  --distribution-id $CLOUDFRONT_DIST_ID \
  --id $INVALIDATION_ID \
  --region us-east-1

echo "✅ Rollback complete!"
echo "🌐 Frontend URL: https://d29wjvb8fy6ptl.cloudfront.net"
