#!/bin/bash

# EcoBid Frontend Deployment Script
# Usage: ./deploy-frontend.sh

set -e  # Exit on error

echo "🚀 Starting EcoBid Frontend Deployment"
echo "========================================"

# Configuration
APP_ID="d1wltv562fx0fx"
BRANCH="main"
REGION="eu-central-1"

# Step 1: Build
echo ""
echo "📦 Step 1: Building frontend..."
cd frontend
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "✅ Build successful"

# Step 2: Create deployment package
echo ""
echo "📦 Step 2: Creating deployment package..."
cd dist
rm -f ../../frontend-dist.zip
zip -r ../../frontend-dist.zip . > /dev/null
cd ../..

echo "✅ Package created: frontend-dist.zip"

# Step 3: Create Amplify deployment
echo ""
echo "☁️  Step 3: Creating Amplify deployment..."
DEPLOYMENT_JSON=$(aws amplify create-deployment \
  --app-id "$APP_ID" \
  --branch-name "$BRANCH" \
  --region "$REGION" \
  --output json)

UPLOAD_URL=$(echo "$DEPLOYMENT_JSON" | grep -o '"uploadUrl":"[^"]*' | cut -d'"' -f4)
JOB_ID=$(echo "$DEPLOYMENT_JSON" | grep -o '"jobId":"[^"]*' | cut -d'"' -f4)

echo "✅ Deployment created"
echo "   Job ID: $JOB_ID"

# Step 4: Upload build
echo ""
echo "📤 Step 4: Uploading build to S3..."
curl -X PUT "$UPLOAD_URL" \
  --data-binary @frontend-dist.zip \
  -H "Content-Type: application/zip" \
  --progress-bar \
  -o /dev/null

echo "✅ Upload complete"

# Step 5: Start deployment
echo ""
echo "🚀 Step 5: Starting deployment..."
aws amplify start-deployment \
  --app-id "$APP_ID" \
  --branch-name "$BRANCH" \
  --job-id "$JOB_ID" \
  --region "$REGION" \
  --output json > /dev/null

echo "✅ Deployment started"

# Step 6: Monitor deployment
echo ""
echo "⏳ Step 6: Monitoring deployment..."
echo "   (This may take 2-3 minutes)"

ATTEMPTS=0
MAX_ATTEMPTS=60

while [ $ATTEMPTS -lt $MAX_ATTEMPTS ]; do
  STATUS=$(aws amplify get-job \
    --app-id "$APP_ID" \
    --branch-name "$BRANCH" \
    --job-id "$JOB_ID" \
    --region "$REGION" \
    --query 'job.summary.status' \
    --output text)
  
  if [ "$STATUS" = "SUCCEED" ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Production URL: https://main.d1wltv562fx0fx.amplifyapp.com"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Open production URL in browser"
    echo "   2. Test lottery button functionality"
    echo "   3. Verify countdown timers"
    echo "   4. Test on mobile device"
    exit 0
  elif [ "$STATUS" = "FAILED" ] || [ "$STATUS" = "CANCELLED" ]; then
    echo ""
    echo "❌ Deployment failed with status: $STATUS"
    echo ""
    echo "🔍 Check logs:"
    echo "   aws amplify get-job --app-id $APP_ID --branch-name $BRANCH --job-id $JOB_ID --region $REGION"
    exit 1
  fi
  
  echo -n "."
  sleep 5
  ATTEMPTS=$((ATTEMPTS + 1))
done

echo ""
echo "⏱️  Deployment timeout (5 minutes)"
echo "   Check status manually:"
echo "   aws amplify get-job --app-id $APP_ID --branch-name $BRANCH --job-id $JOB_ID --region $REGION"
exit 1
