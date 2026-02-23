# Issue Analysis: Auth UserPool Not Configured

## Problem
When trying to register a user on the deployed frontend (CloudFront), the error "Auth UserPool not configured" appears.

## Root Cause Analysis

### 1. Environment Variable Mismatch
- **Build output shows**: `a.default.env.NEXT_PUBLIC_COGNITO_CLIENT_ID`
- **Actual env var name**: `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`
- The Amplify config is looking for the wrong variable name

### 2. Static Export Limitation
- Next.js static export requires env vars at **build time**
- The `.env.local` file is only used during local development
- Production build needs env vars to be available during `npm run build`

### 3. Configuration Issues Found
```typescript
// amplify-config.ts reads:
userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || ''

// But the build is looking for:
NEXT_PUBLIC_COGNITO_CLIENT_ID  // Wrong name!
```

## Impact
- Users cannot register or login on the deployed site
- Authentication is completely broken in production
- Local development works fine (has access to .env.local)

## Fix Strategy

### Option 1: Fix Environment Variable Names (RECOMMENDED)
1. Update `.env.local` to use consistent naming
2. Rebuild and redeploy frontend
3. Verify env vars are baked into the build

### Option 2: Add .env.production File
1. Create `.env.production` with all required vars
2. Next.js will use this during build
3. Rebuild and redeploy

### Option 3: Use next.config.js env
1. Add `env` section to next.config.js
2. Hardcode values for production
3. Rebuild and redeploy

## Recommended Solution: Option 1

**Why**: Simplest, most maintainable, follows Next.js best practices

## Tasks to Fix

### BUGFIX-1: Verify Environment Variable Names
- Check all references to Cognito env vars
- Ensure consistency across all files
- Document the correct variable names

### BUGFIX-2: Update Environment Variables
- Fix any mismatched variable names
- Ensure all NEXT_PUBLIC_ prefixed vars are correct
- Verify .env.local has all required values

### BUGFIX-3: Rebuild with Environment Variables
- Run `npm run build` with env vars available
- Verify env vars are in the build output
- Check that Amplify config has values

### BUGFIX-4: Redeploy Frontend
- Sync new build to S3
- Invalidate CloudFront cache
- Test registration flow

### BUGFIX-5: Verify Production Auth Flow
- Test registration with real email
- Test login flow
- Test favorites functionality
- Confirm all auth features work

## Success Criteria
- [ ] Registration works on deployed site
- [ ] Login works on deployed site
- [ ] Amplify config has valid Cognito values
- [ ] No console errors related to auth
- [ ] Email verification flow works end-to-end
