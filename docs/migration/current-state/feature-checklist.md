# Current Feature Checklist

**Date:** 2026-03-02  
**CloudFront URL:** https://d29wjvb8fy6ptl.cloudfront.net  
**Status:** Static export (no SSR)

## Working Features ✅

### Authentication
- [x] User registration with email verification
- [x] User login/logout
- [x] Session persistence (localStorage)
- [x] Protected routes redirect to login
- [x] JWT token handling

### Item Browsing
- [x] Home page item feed
- [x] Category filtering (All, Furniture, Electronics, etc.)
- [x] Item cards with photos
- [x] Responsive mobile-first design

### Item Creation
- [x] Photo upload to S3 (presigned URLs)
- [x] AI analysis with Amazon Nova Lite
- [x] Title/description generation
- [x] Category suggestion
- [x] Item publishing to DynamoDB

### Favorites System
- [x] Add/remove favorites
- [x] Red heart icon for favorited items
- [x] Favorites page (/favorites)
- [x] Favorites persistence after logout/login

### User Profile
- [x] View profile information
- [x] Display user's listed items
- [x] Display user's favorites

## Broken Features ❌

### Dynamic Routes (Main Migration Goal)
- [ ] **Item detail page (/items/[id])** - 404 on direct URL access
- [ ] **Page refresh on detail page** - Fails with 403/404
- [ ] **SSR for dynamic routes** - Not supported with static export

**Root Cause:** Next.js 16 cannot use `output: 'export'` with dynamic routes. CloudFront serves static files only, no server-side rendering.

## Performance Metrics

- **Home page load:** ~2.5s (3G)
- **Item creation:** ~8-12s (including AI analysis)
- **Photo upload:** ~2-3s (5MB image)
- **API response time:** <500ms

## Known Issues

1. **Dynamic routes broken** - Requires SSR (Amplify migration)
2. **No real-time updates** - Static site, no WebSocket support
3. **Limited SEO** - No server-side meta tags for item pages

## Migration Success Criteria

After Amplify migration, all features above should work PLUS:
- [x] Item detail pages load on direct URL access
- [x] Page refresh works on all routes
- [x] SSR enables proper meta tags for SEO
- [x] No 403/404 errors on dynamic routes
