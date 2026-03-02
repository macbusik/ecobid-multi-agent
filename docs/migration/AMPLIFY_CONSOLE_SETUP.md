# Amplify Console Setup Guide

## AMPLIFY-7: Create Amplify App

### Step 1: Open AWS Amplify Console
1. Navigate to: https://console.aws.amazon.com/amplify/
2. Select region: **eu-central-1** (Frankfurt)
3. Click **"Create new app"**

### Step 2: Connect Repository
1. Select **"GitHub"** as source
2. Click **"Connect branch"**
3. Authorize AWS Amplify to access your GitHub account
4. Select repository: **macbusik/ecobid-multi-agent**
5. Select branch: **feature/amplify-gen2-migration**
6. Click **"Next"**

### Step 3: Configure Build Settings
1. App name: **ecobid-marketplace**
2. Build settings should auto-detect `amplify.yml`
3. Verify the build configuration shows:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci --cache .npm --prefer-offline
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```
4. Click **"Next"**

### Step 4: Add Environment Variables
Click **"Add environment variable"** for each:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://9jvk35eykg.execute-api.eu-central-1.amazonaws.com` |
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` | `eu-central-1_PSOdHsqEA` |
| `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID` | `2se23cclvnsk896gs7k5pffb40` |
| `NEXT_PUBLIC_COGNITO_REGION` | `eu-central-1` |
| `NEXT_PUBLIC_S3_BUCKET` | `ecobid-items-191138354216` |
| `NEXT_PUBLIC_S3_REGION` | `eu-central-1` |

### Step 5: Review and Create
1. Review all settings
2. Click **"Save and deploy"**
3. Wait for initial deployment (~5-10 minutes)

### Step 6: Get Amplify URL
After deployment completes:
1. Copy the Amplify app URL (e.g., `https://feature-amplify-gen2-migration.d3xxxxxxxxx.amplifyapp.com`)
2. Save this URL for testing

### Step 7: Configure Service Role (if needed)
If deployment fails with IAM errors:
1. Go to **App settings → General**
2. Click **"Edit"** under Service role
3. Create new role or select existing **AmplifyServiceRole**
4. Ensure role has permissions for:
   - CloudWatch Logs
   - S3 (for build artifacts)
   - CloudFront (for CDN)

## Verification Checklist
- [ ] App created in Amplify Console
- [ ] GitHub repository connected
- [ ] Branch: feature/amplify-gen2-migration
- [ ] Environment variables configured (6 total)
- [ ] Initial build succeeded
- [ ] Amplify URL accessible
- [ ] No build errors in logs

## Troubleshooting

### Build Fails with "Module not found"
- Check that `amplify.yml` is in the `frontend/` directory
- Verify `npm ci` runs successfully
- Check Node.js version (should be 20.x)

### Environment Variables Not Applied
- Ensure variables are added in **App settings → Environment variables**
- Redeploy the app after adding variables
- Check build logs for `NEXT_PUBLIC_*` values

### 403/404 Errors After Deployment
- Verify `baseDirectory: .next` in `amplify.yml`
- Check that `output: 'export'` is removed from `next.config.ts`
- Ensure dynamic routes are using `generateStaticParams`

## Next Steps
After successful deployment:
- Proceed to **AMPLIFY-8**: Update CDK Stack
- Test dynamic routes on Amplify URL
- Run QA test suite (AMPLIFY-12 to AMPLIFY-17)
