#!/bin/bash
set -e

echo "🚀 Building frontend..."
cd frontend
npm run build

echo "📦 Deploying to S3..."
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name InfrastructureStack --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" --output text)
DISTRIBUTION_ID=$(aws cloudformation describe-stacks --stack-name InfrastructureStack --query "Stacks[0].Outputs[?OutputKey=='FrontendDistributionId'].OutputValue" --output text)

aws s3 sync out/ s3://$BUCKET_NAME/ --delete

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "✅ Deployment complete!"
echo "Frontend URL: https://$(aws cloudformation describe-stacks --stack-name InfrastructureStack --query "Stacks[0].Outputs[?OutputKey=='FrontendUrl'].OutputValue" --output text)"
