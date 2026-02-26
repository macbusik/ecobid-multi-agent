# Iteration 4 Troubleshooting Summary - Nova Lite Integration

## Problem
AI listing feature returned 500 errors after initial deployment. Frontend connected but Lambda failed.

## Root Cause
**IAM permissions issue with Amazon Bedrock cross-region inference profiles**

## Key Learnings

### 1. Model ID vs Inference Profile
- ❌ Direct model ID doesn't work: `amazon.nova-lite-v1:0`
- ✅ Must use inference profile: `eu.amazon.nova-lite-v1:0`
- ✅ Or full ARN: `arn:aws:bedrock:eu-central-1:191138354216:inference-profile/eu.amazon.nova-lite-v1:0`

### 2. Cross-Region Routing
- Inference profile `eu.amazon.nova-lite-v1:0` in `eu-central-1` routes to model in `eu-west-3`
- Cannot predict exact ARN → must use wildcard in IAM policy

### 3. Final Working Configuration

**Lambda Code** (`infrastructure/lib/lambda/shared/nova.ts`):
```typescript
const NOVA_LITE_MODEL_ID = `arn:aws:bedrock:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:inference-profile/eu.amazon.nova-lite-v1:0`;
```

**IAM Policy** (`infrastructure/lib/infrastructure-stack.ts`):
```typescript
analyzeItemFunction.addToRolePolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ['bedrock:InvokeModel'],
    resources: ['*'], // Required for cross-region inference profiles
  })
);
```

**Environment Variables**:
```typescript
environment: {
  AWS_ACCOUNT_ID: this.account,
  BUCKET_NAME: storage.bucket.bucketName,
  TABLE_NAME: database.table.tableName,
}
```

## Debugging Steps Used
1. Check CloudWatch logs: `aws logs tail /aws/lambda/EcoBid-AnalyzeItem --since 5m`
2. List available models: `aws bedrock list-foundation-models --region eu-central-1`
3. List inference profiles: `aws bedrock list-inference-profiles --region eu-central-1`
4. Test with full access: Temporarily added `AmazonBedrockFullAccess` managed policy
5. Narrow down to minimal permissions: `bedrock:InvokeModel` on `*`

## Final Status
✅ **WORKING** - AI analysis generates title, description, category from photos
- Latency: ~2-3 seconds
- Cost: ~$0.0004 per listing
- Model: Amazon Nova Lite via cross-region inference profile

## Files Modified
- `infrastructure/lib/lambda/shared/nova.ts` - Use full inference profile ARN
- `infrastructure/lib/infrastructure-stack.ts` - Add AWS_ACCOUNT_ID env var, wildcard IAM policy
- Frontend already connected (no changes needed)

## Next Steps
1. Test end-to-end item creation flow
2. Commit fixes as ITER4.1 sub-iteration
3. Update README with Nova Lite configuration notes
