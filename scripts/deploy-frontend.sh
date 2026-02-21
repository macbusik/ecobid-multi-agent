#!/bin/bash
set -e

echo "🚀 Building frontend..."
cd frontend
npm run build

echo "📦 Deploying to S3..."
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name EcoBidStack --query "Stacks[0].Outputs[?OutputKey=='FrontendFrontendBucketNameACC9E00B'].OutputValue" --output text)
DISTRIBUTION_ID=$(aws cloudformation describe-stacks --stack-name EcoBidStack --query "Stacks[0].Outputs[?OutputKey=='FrontendFrontendDistributionId9E829054'].OutputValue" --output text)

aws s3 sync out/ s3://$BUCKET_NAME/ --delete

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "✅ Deployment complete!"
FRONTEND_URL=$(aws cloudformation describe-stacks --stack-name EcoBidStack --query "Stacks[0].Outputs[?OutputKey=='FrontendFrontendUrlE3736ECE'].OutputValue" --output text)
echo "Frontend URL: $FRONTEND_URL"
