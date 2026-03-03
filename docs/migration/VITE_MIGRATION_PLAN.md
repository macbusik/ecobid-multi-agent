# Vite + React Migration Plan

## Executive Summary

**Goal:** Migrate from Next.js to Vite + React for reliable Amplify deployment

**Reason:** Next.js SSR on Amplify WEB_COMPUTE is unstable. Vite SPA works perfectly on Amplify WEB platform.

**Timeline:** 2-3 hours

---

## Task Breakdown

### ✅ TASK 1: Create Migration Branch (5 min)
**Status:** COMPLETE
- Created `feature/vite-migration` from main
- Clean slate for migration

### ⏳ TASK 2: Install Vite Dependencies (10 min)
**Status:** IN PROGRESS

Install:
```bash
cd frontend
npm install vite @vitejs/plugin-react react-router-dom
npm install -D @types/node
```

Remove Next.js:
```bash
npm uninstall next
```

### ⏳ TASK 3: Create Vite Configuration (15 min)

Files to create:
- `frontend/vite.config.ts` - Vite config
- `frontend/index.html` - Entry HTML
- `frontend/src/main.tsx` - App entry point

### ⏳ TASK 4: Migrate Routing (45 min)

Convert Next.js App Router to React Router:
- `app/page.tsx` → `src/pages/Home.tsx`
- `app/items/[id]/page.tsx` → `src/pages/ItemDetail.tsx`
- `app/items/new/page.tsx` → `src/pages/NewItem.tsx`
- `app/auth/login/page.tsx` → `src/pages/Login.tsx`
- `app/auth/register/page.tsx` → `src/pages/Register.tsx`
- `app/favorites/page.tsx` → `src/pages/Favorites.tsx`
- `app/profile/page.tsx` → `src/pages/Profile.tsx`

Create `src/App.tsx` with React Router setup.

### ⏳ TASK 5: Migrate Components (30 min)

Move components (no changes needed):
- `components/` → `src/components/`
- `lib/` → `src/lib/`

Update imports to use relative paths.

### ⏳ TASK 6: Update Package Scripts (5 min)

Update `frontend/package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### ⏳ TASK 7: Configure Amplify (10 min)

Create `amplify.yml`:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend && npm ci
    build:
      commands:
        - cd frontend && npm run build
  artifacts:
    baseDirectory: frontend/dist
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

### ⏳ TASK 8: Test Locally (15 min)

```bash
cd frontend
npm run dev
```

Test:
- Home page
- Item detail (dynamic route)
- Authentication
- Favorites

### ⏳ TASK 9: Deploy to Amplify (15 min)

1. Delete old Amplify app
2. Create new app
3. Connect to `feature/vite-migration` branch
4. Add environment variables
5. Deploy

### ⏳ TASK 10: Verify Production (15 min)

Test all routes in production:
- ✅ Home page
- ✅ Dynamic routes work on refresh
- ✅ Authentication
- ✅ API integration

---

## Key Differences: Next.js vs Vite

| Feature | Next.js | Vite + React |
|---------|---------|--------------|
| **Routing** | File-based (App Router) | React Router (code-based) |
| **Build Output** | `.next/` | `dist/` |
| **Dev Server** | `next dev` | `vite` |
| **Build Command** | `next build` | `vite build` |
| **SSR** | Yes (causing issues) | No (not needed) |
| **Amplify Platform** | WEB_COMPUTE (broken) | WEB (works perfectly) |
| **Build Time** | ~2-3 min | ~30 sec |

---

## Migration Benefits

1. ✅ **Reliable Deployment** - Vite SPAs work perfectly on Amplify
2. ✅ **Faster Builds** - 30 seconds vs 3 minutes
3. ✅ **Simpler Config** - No SSR complexity
4. ✅ **Same Functionality** - All features work the same
5. ✅ **Better DX** - Faster HMR, simpler debugging

---

## What Stays the Same

- ✅ All React components (no changes)
- ✅ Tailwind CSS styling
- ✅ AWS Amplify Auth
- ✅ API client
- ✅ Backend (API Gateway, Lambda, DynamoDB)
- ✅ User experience

---

## Rollback Plan

If migration fails:
```bash
git checkout main
# Continue with CloudFront static deployment
```

---

## Next Steps

1. Execute TASK 2-10
2. Test thoroughly
3. Deploy to Amplify
4. Document final setup

**Estimated Completion:** 2-3 hours from now
