# Deployment Guide - Iteration 1

## Prerequisites

1. **AWS Credentials:** Ensure you have valid AWS credentials configured
   ```bash
   aws sts get-caller-identity
   ```

2. **Node.js 20.x** installed
3. **AWS CDK CLI** installed globally: `npm install -g aws-cdk`

## Step 1: Deploy Infrastructure

```bash
cd infrastructure
npm install
npm run build
cdk deploy --require-approval never
```

This will deploy:
- DynamoDB table (EcoBidTable)
- Lambda function (EcoBid-Items)
- API Gateway HTTP API
- S3 bucket for item photos
- Cognito User Pool
- IAM roles and policies

**Expected Output:** Stack outputs with API URL, table name, etc. saved to `.env.deployed`

## Step 2: Seed Database

```bash
cd infrastructure
node seed-data.js
```

This will insert 5 mock items into DynamoDB:
- item-001: Vintage Wooden Coffee Table (Furniture, New York)
- item-002: Kitchen Mixer - KitchenAid (Kitchen, San Francisco)
- item-003: Programming Books Collection (Books, Boston)
- item-004: Kids Toys Bundle (Toys, New York)
- item-005: Bluetooth Headphones (Electronics, Seattle)

## Step 3: Update Frontend Environment

Copy the API URL from infrastructure deployment to frontend:

```bash
# infrastructure/.env.deployed contains:
# API_URL=https://xxxxx.execute-api.region.amazonaws.com

# Update frontend/.env.local:
NEXT_PUBLIC_API_URL=<API_URL_from_deployment>
NEXT_PUBLIC_USE_MOCK_DATA=false  # Switch to real API
```

## Step 4: Test Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:3000/items/item-001

**Expected Result:**
- Page loads in <400ms
- Displays "Vintage Wooden Coffee Table"
- Shows photo, description, category, city
- "Back to Feed" button works
- 404 page for non-existent items

## Step 5: Run Unit Tests

```bash
cd infrastructure
npm test
```

**Expected Result:** 5/5 tests passing for getItemById handler

## Verification Checklist

- [ ] Infrastructure deployed successfully
- [ ] DynamoDB table created with correct schema
- [ ] Lambda function deployed and accessible
- [ ] API Gateway endpoint responding
- [ ] Seed data inserted (5 items)
- [ ] Frontend loads item detail page
- [ ] Response time < 500ms
- [ ] 404 handling works
- [ ] Unit tests pass

## Troubleshooting

### AWS Credentials Expired
```bash
aws login  # Re-authenticate
```

### Lambda Function Not Found
Check CloudFormation stack outputs:
```bash
aws cloudformation describe-stacks --stack-name EcoBidStack
```

### DynamoDB Access Denied
Verify IAM role has correct permissions (should be auto-configured by CDK)

### Frontend Can't Connect to API
1. Check CORS configuration in API Gateway
2. Verify API URL in `.env.local`
3. Check browser console for errors

## Next Steps After Deployment

1. Test with different item IDs
2. Verify 404 handling with invalid IDs
3. Check CloudWatch logs for Lambda execution
4. Monitor DynamoDB read capacity
5. Proceed to Iteration 2: Create Item (manual form)
