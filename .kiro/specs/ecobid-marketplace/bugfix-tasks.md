# Bugfix Tasks: Auth Configuration

## BUGFIX-1: Remove Duplicate Amplify Configuration ✅
**Priority:** P0 (Blocker)
**Estimated Time:** 15 minutes

**Problem:**
- `lib/api/client.ts` is configuring Amplify with wrong env var name
- `lib/auth/amplify-config.ts` already configures Amplify correctly
- Duplicate configuration causes conflicts

**Solution:**
- Remove Amplify.configure() from `lib/api/client.ts`
- Keep only the configuration in `lib/auth/amplify-config.ts`
- Import amplify-config in layout.tsx (already done)

**Files to Modify:**
- `frontend/lib/api/client.ts` - Remove lines 22-31

---

## BUGFIX-2: Rebuild Frontend with Correct Config
**Priority:** P0 (Blocker)
**Estimated Time:** 5 minutes

**Steps:**
1. Run `cd frontend && npm run build`
2. Verify no errors
3. Check build output for correct env vars

---

## BUGFIX-3: Redeploy to CloudFront
**Priority:** P0 (Blocker)
**Estimated Time:** 5 minutes

**Steps:**
1. Sync build to S3: `aws s3 sync out/ s3://ecobid-frontend-191138354216/ --delete`
2. Invalidate CloudFront: `aws cloudfront create-invalidation --distribution-id E2YVRTARUE0FFS --paths "/*"`
3. Wait for invalidation to complete (~2-3 minutes)

---

## BUGFIX-4: Test Production Auth Flow
**Priority:** P0 (Blocker)
**Estimated Time:** 10 minutes

**Test Cases:**
1. Open https://d29wjvb8fy6ptl.cloudfront.net
2. Click "Register"
3. Fill form with real email
4. Submit and verify no errors
5. Check email for verification code
6. Verify code and login
7. Test favorites functionality

**Expected Results:**
- No "Auth UserPool not configured" error
- Registration completes successfully
- Email verification works
- Login works
- All auth features functional

---

## Root Cause Summary

**Issue:** Duplicate Amplify configuration with mismatched environment variable names

**Location 1 (WRONG):**
```typescript
// frontend/lib/api/client.ts
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!, // WRONG NAME
    },
  },
});
```

**Location 2 (CORRECT):**
```typescript
// frontend/lib/auth/amplify-config.ts
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || '', // CORRECT
    },
  },
};
```

**Fix:** Remove duplicate configuration from api/client.ts
