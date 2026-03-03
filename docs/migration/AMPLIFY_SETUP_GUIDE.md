# Amplify Hosting Setup - Fresh Start

## Step 1: Create Amplify App in Console

1. Go to: https://console.aws.amazon.com/amplify/home?region=eu-central-1
2. Click **"Create new app"**
3. Choose **"GitHub"** → Click **"Next"**
4. Authorize AWS Amplify (if needed)
5. Select:
   - Repository: `macbusik/ecobid-multi-agent`
   - Branch: `feature/amplify-hosting`
6. Click **"Next"**

## Step 2: Configure Build Settings

Amplify should **auto-detect** the `amplify.yml` file. Verify it shows:

```yaml
version: 1
applications:
  - appRoot: frontend
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
```

**Important:** Make sure it detects the monorepo structure with `appRoot: frontend`

## Step 3: Add Environment Variables

Click **"Advanced settings"** and add these 6 variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://9jvk35eykg.execute-api.eu-central-1.amazonaws.com` |
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` | `eu-central-1_PSOdHsqEA` |
| `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID` | `2se23cclvnsk896gs7k5pffb40` |
| `NEXT_PUBLIC_COGNITO_REGION` | `eu-central-1` |
| `NEXT_PUBLIC_S3_BUCKET` | `ecobid-items-191138354216` |
| `NEXT_PUBLIC_S3_REGION` | `eu-central-1` |

## Step 4: Enable SSR Logs (IMPORTANT!)

In **"Advanced settings"** → **"Server-Side Rendering (SSR) deployment"**:
- ✅ Check **"Enable SSR app logs"**

## Step 5: Service Role

- Choose **"Create and use a new service role"**
- Or select existing **"AmplifyServiceRole"** if available

## Step 6: Review and Deploy

1. Click **"Next"**
2. Review all settings
3. Click **"Save and deploy"**
4. Wait ~5-7 minutes for deployment

## Step 7: Test

Once deployed, test these URLs:

1. **Home page:** `https://[branch-name].[app-id].amplifyapp.com`
2. **Dynamic route:** `https://[branch-name].[app-id].amplifyapp.com/items/test-id`

If dynamic routes work → ✅ SUCCESS!

## Troubleshooting

If build fails, check:
1. Is `appRoot: frontend` detected?
2. Are environment variables set?
3. Is SSR logging enabled?
4. Check build logs in Amplify Console

## Why This Should Work

1. ✅ Clean repository (no previous failed attempts)
2. ✅ Proper monorepo structure with `appRoot`
3. ✅ Next.js 16 (Amplify supports Next.js 15+)
4. ✅ No static export (SSR enabled)
5. ✅ Simple, standard Next.js app structure

---

**After you create the app, tell me the App ID and I'll monitor the deployment!**
