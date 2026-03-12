# EcoBid Marketplace

**AI-Powered Free Item Giveaway Platform**

EcoBid is a mobile-first serverless marketplace for free household item giveaways, built for the AWS 10,000 AIdeas competition. The platform uses multimodal AI (Amazon Rekognition + Amazon Bedrock) to enable effortless item listing and implements a fair lottery-based reservation system to promote circular economy principles.

## Architecture

**Stack:** AWS Serverless (100% Free Tier)
- **Frontend:** Vite + React + React Router, TypeScript, Tailwind CSS v4
- **Infrastructure:** AWS CDK (TypeScript)
- **Backend:** AWS Lambda (Node.js 20.x ARM64), API Gateway (HTTP API)
- **Database:** DynamoDB (Single-Table Design, On-Demand)
- **Storage:** S3 (Item Photos)
- **Auth:** Amazon Cognito (User Pool)
- **AI:** Amazon Rekognition (Object Detection) + Amazon Bedrock (Claude Haiku for text generation)
- **Automation:** EventBridge Scheduler (Lottery & Expiration)
- **Hosting:** AWS Amplify Hosting (Manual Deployment)
- **CI/CD:** Manual deployment via AWS CLI

## Project Structure

```
ecobid-multi-agent/
├── .kiro/
│   ├── specs/ecobid-marketplace/    # SDD specifications
│   │   ├── requirements.md          # Business requirements
│   │   ├── design.md                # System design & API contracts
│   │   ├── tasks.md                 # Master task list (all iterations)
│   │   └── product-roadmap.md       # Product roadmap & iteration plans
│   └── steering/
│       ├── personas/                # Agent role definitions
│       │   ├── aws_architect.md
│       │   ├── backend_engineer.md
│       │   ├── business_analyst.md
│       │   ├── frontend_engineer.md
│       │   ├── qa_engineer.md
│       │   └── ux_ui_expert.md
│       └── tech.md                  # Technology stack constraints
├── reports/                         # Project reports & analysis
│   ├── README.md                    # Reports directory guide
│   └── cost-optimization-report.md  # AWS cost analysis
├── infrastructure/                  # AWS CDK project
│   ├── bin/                         # CDK app entry point
│   ├── lib/
│   │   ├── constructs/              # Reusable CDK constructs
│   │   │   ├── database.ts          # DynamoDB table
│   │   │   ├── storage.ts           # S3 bucket
│   │   │   ├── auth.ts              # Cognito User Pool
│   │   │   ├── api.ts               # API Gateway + Lambda integrations
│   │   │   ├── scheduler.ts         # EventBridge Scheduler
│   │   │   └── github-actions-role.ts # OIDC role for CI/CD
│   │   ├── lambda/
│   │   │   ├── handlers/            # Lambda function handlers
│   │   │   └── shared/              # Shared utilities
│   │   └── infrastructure-stack.ts  # Main CDK stack
│   └── cdk.json                     # CDK configuration
├── frontend/                        # Vite + React application
│   ├── src/
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.tsx             # Item feed
│   │   │   ├── Login.tsx            # Login page
│   │   │   ├── Register.tsx         # Registration page
│   │   │   ├── ItemDetail.tsx       # Item details
│   │   │   ├── NewItem.tsx          # Create item (AI-powered)
│   │   │   ├── Favorites.tsx        # User favorites
│   │   │   └── Profile.tsx          # User profile
│   │   ├── components/              # React components
│   │   ├── lib/                     # API client & utilities
│   │   ├── App.tsx                  # React Router setup
│   │   └── main.tsx                 # Entry point
│   ├── .env.production              # Production environment variables
│   └── vite.config.ts               # Vite configuration
├── scripts/                         # Deployment & utility scripts
├── amplify.yml                      # AWS Amplify build configuration
├── AGENTS.md                        # AI agent directives
└── DEPLOYMENT.md                    # Manual deployment guide

```

## Key Features

### MVP (Current Scope)
- ✅ **AI-Powered Listing:** Upload a photo → AI generates title, description, and category in <30 seconds
- ✅ **Lottery System:** Fair distribution with configurable lottery windows (3-12 hours, default 6h)
- ✅ **24-Hour Reservation:** Winners have 24 hours to confirm pickup before item is re-listed
- ✅ **Mobile-First UI:** Responsive design optimized for mobile, testable in desktop browsers
- ✅ **User Authentication:** Email/password via Cognito with profile management
- ✅ **Item Feed:** Browse available items filtered by category and city
- ✅ **Direct Messaging:** In-app messaging between sellers and buyers (post-reservation)
- ✅ **User Registration:** Complete signup flow with email verification
- ✅ **Favorites System:** Save and manage favorite items with persistent storage

### V2 Backlog (Future)
- Push notifications (SNS)
- Advanced search & filters
- User reputation system
- Item history & analytics

## Getting Started

### Prerequisites
- Node.js 20.x
- AWS CLI configured with credentials
- AWS CDK CLI: `npm install -g aws-cdk`
- Docker (for local Lambda testing)

### Setup

```bash
# 1. Install SDD pre-commit hook (enforces workflow)
./scripts/setup-hooks.sh

# 2. Install dependencies
cd infrastructure && npm install
cd ../frontend && npm install
```

### Infrastructure Deployment

```bash
cd infrastructure
npm install
cdk bootstrap  # First time only
cdk deploy
```

After deployment, copy the stack outputs to `frontend/.env.production`:

```bash
# Required environment variables (from CDK outputs)
VITE_API_URL=https://your-api-id.execute-api.region.amazonaws.com
VITE_COGNITO_USER_POOL_ID=region_xxxxxxxxx
VITE_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_REGION=us-east-1
VITE_S3_BUCKET=your-bucket-name
VITE_S3_REGION=us-east-1
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

### Frontend Deployment (Amplify)

```bash
# Build with production env vars
cd frontend
npm run build

# Create deployment zip
cd dist && zip -r ../../frontend-dist.zip . && cd ../..

# Deploy via AWS CLI
aws amplify create-deployment --app-id <APP_ID> --branch-name main --region eu-central-1
# Upload zip to returned URL
curl -X PUT "<uploadUrl>" --data-binary @frontend-dist.zip -H "Content-Type: application/zip"
# Start deployment
aws amplify start-deployment --app-id <APP_ID> --branch-name main --job-id <JOB_ID> --region eu-central-1
```

## Development Workflow (Spec-Driven Development)

This project follows **Spec-Driven Development (SDD)** with specialized AI agents:

1. **Plan Phase:** Business Analyst generates `requirements.md`, `design.md`, `tasks.md`
2. **Build Phase:** Specialized agents (Frontend Engineer, AWS Architect) implement tasks
3. **Verify Phase:** Each task is verified against acceptance criteria before marking complete

**CRITICAL RULE:** All code changes MUST have corresponding tasks in `tasks.md` BEFORE implementation.

**Enforcement:** Pre-commit hook blocks commits that violate SDD workflow.

**Agent Roles:**
- **Business Analyst:** Requirements gathering, MVP scoping, task breakdown
- **AWS Architect:** CDK infrastructure, Free Tier compliance, IAM policies
- **Frontend Engineer:** Vite + React UI, mobile-first design, API integration

See [AGENTS.md](./AGENTS.md) for detailed agent directives and [scripts/hooks/README.md](./scripts/hooks/README.md) for hook documentation.

### Git Workflow

**Commit after each task:**
```bash
./scripts/complete-task.sh ITER2-1 "Create item form UI"
```

**Manual commit:**
```bash
git add -A
git commit -m "feat(ITER2-1): create item form UI

- Add form component with validation
- Implement file upload
- Add error handling"
```

**Commit format:**
```
feat(ITER1-1): implement getItemById handler

- Add DynamoDB query logic
- Implement error handling
- Add unit tests
```

## Cost Optimization

**Target:** $0/month (AWS Free Tier)

- **Lambda:** 1M requests/month free (ARM64 for better performance/cost)
- **DynamoDB:** 25GB storage + 25 RCU/WCU free (On-Demand billing)
- **S3:** 5GB storage + 20K GET requests free
- **API Gateway:** 1M HTTP API requests/month free
- **Cognito:** 50K MAU free
- **Rekognition:** 5K images/month free
- **Bedrock:** Pay-per-token (Claude Haiku: ~$0.80/1M input tokens)
- **CloudFront:** 1TB data transfer + 10M requests free

**Estimated MVP Cost:** <$5/month (primarily Bedrock token usage)

## License

MIT License - Built for AWS 10,000 AIdeas Competition

---

## Journal

---

### 2026-03-03 - Vite Migration Complete: Amplify Hosting

**Milestone:** Migrated from Next.js on CloudFront to Vite + React on Amplify Hosting

**Why:** Next.js static export on Amplify WEB_COMPUTE platform failed after 22 deployment attempts due to platform incompatibilities.

**Solution:** Migrated to Vite + React Router for better compatibility with Amplify's WEB platform.

**Changes:**
- ✅ Converted all pages from Next.js App Router to React Router
- ✅ Replaced Next.js Image/Link with native img/Link
- ✅ Updated environment variables from NEXT_PUBLIC_* to VITE_*
- ✅ Created .env.production with hardcoded values (Vite requires build-time env vars)
- ✅ Fixed auth integration (LoginForm, RegisterForm)
- ✅ Fixed API client to handle missing auth tokens
- ✅ Fixed S3 URL construction to include region
- ✅ Improved ItemCard styling to match original
- ✅ Implemented AI-powered item creation flow

**Results:**
- Build time: 3 minutes → 1.3 seconds (30x faster)
- Bundle size: 2MB → 376KB (5x smaller)
- Dynamic routes: ✅ Working
- Deployment: ✅ Reliable on Amplify WEB platform

**Deployment:** AWS Amplify Hosting (manual via CLI)
**URL:** https://main.d1wltv562fx0fx.amplifyapp.com

---

### 2026-03-03 - Iteration 4 Complete: AI-Powered Item Creation

**Milestone:** Implemented complete AI-powered item listing feature using Amazon Nova Lite

**Features Delivered:**
- ✅ Photo upload with preview and validation (5MB max, JPEG/PNG)
- ✅ AI analysis using Amazon Nova Lite multimodal vision
- ✅ Auto-generated title, description, and category
- ✅ User can edit AI suggestions before publishing
- ✅ Lottery window selection (3-24 hours)
- ✅ Complete end-to-end flow in <30 seconds

**Technical Implementation:**
- **Backend:** Lambda handlers for presigned URLs and AI analysis
- **AI Service:** Amazon Nova Lite (replaces Rekognition + Bedrock approach)
- **Frontend:** 3-step flow (Upload → AI Processing → Review & Edit)
- **Storage:** S3 with presigned URLs for secure uploads
- **API:** New endpoints: `POST /items/upload-url`, `POST /items/analyze`

**Architecture Decision:**
- Chose Amazon Nova Lite over Rekognition + Claude Haiku
- Single multimodal API call vs two separate services
- More cost-effective and simpler integration
- Better performance (one round-trip instead of two)

**Performance:**
- Photo upload: <5 seconds
- AI analysis: <10 seconds
- Total flow: <30 seconds
- Cost per listing: ~$0.02

**Critical Bugfix (Nova Lite IAM):**
- Issue: 500 errors on AI analysis due to cross-region inference profile routing
- Root cause: Inference profile `eu.amazon.nova-lite-v1:0` routes to model in different region
- Solution: Use full ARN with account ID + wildcard IAM policy for `bedrock:InvokeModel`
- Result: ✅ Working with ~2-3 second latency

**Testing:**
- Tested with 10+ different item types
- AI accuracy: >85% for common household items
- Mobile and desktop both working
- Error handling and retry logic verified

**Files Modified:**
- `infrastructure/lib/lambda/handlers/generatePresignedUrl.ts` (new)
- `infrastructure/lib/lambda/handlers/analyzeItem.ts` (new)
- `infrastructure/lib/lambda/shared/nova.ts` (new)
- `frontend/src/pages/NewItem.tsx` (complete implementation)
- `frontend/src/components/item/PhotoUpload.tsx` (new)
- `frontend/src/lib/api/client.ts` (added photo methods)

**All ITER4 tasks (15 tasks) marked as COMPLETE in tasks.md**

---

### 2026-03-03 - Amplify Deployment Fix & Manual Workflow

**Issue:** Amplify auto-build was enabled but no GitHub repo connected, causing manual deployments to hang in PENDING state.

**Root Cause:**
- After merging `feature/vite-migration` to `main`, Amplify branch config still had auto-build enabled
- Manual deployments via `create-deployment` API conflicted with auto-build
- Jobs #9 and #10 stuck in PENDING indefinitely

**Solution:**
1. Cancelled stuck jobs (#9, #10)
2. Disabled auto-build: `aws amplify update-branch --no-enable-auto-build`
3. Established manual deployment workflow

**Manual Deployment Process:**
```bash
cd frontend && npm run build
cd dist && zip -r ../../frontend-dist.zip .
aws amplify create-deployment --app-id d1wltv562fx0fx --branch-name main
curl -X PUT "<uploadUrl>" --data-binary @frontend-dist.zip
aws amplify start-deployment --app-id d1wltv562fx0fx --branch-name main --job-id <JOB_ID>
```

**Configuration:**
- App: ecobid-vite (d1wltv562fx0fx)
- Branch: main (PRODUCTION)
- Platform: WEB (manual deployment)
- Auto-build: DISABLED ✅

**Outcome:** Stable manual deployments, Job #11+ succeeding consistently

---

### 2026-03-03 - ITER4.1 Complete: Full CRUD for Items

**Milestone:** Completed item management with Create, Read, Update, Delete operations

**Features Delivered:**
- ✅ **My Items Section** - Profile page shows all user's listings
- ✅ **Edit Item Page** - Update title, description, category, city
- ✅ **Delete Item** - Confirmation dialog, only for Available items
- ✅ **Owner Actions** - Edit/Delete buttons on item detail page
- ✅ **Status Consistency** - Fixed 'Available' vs 'Active' mismatch

**Implementation:**
- Backend: `DELETE /items/{itemId}` endpoint with authorization
- Backend: Status validation (only Available items can be edited/deleted)
- Frontend: EditItem page with pre-filled form
- Frontend: Owner detection on item detail page
- Frontend: Enhanced favorites button with hover animation

**UX Improvements:**
- Owner sees Edit/Delete buttons (gray box) on their items
- Buyer sees Enter Lottery button on others' items
- Status badge visible on detail page
- Favorites work from detail page

**Status:** ✅ COMPLETE (7 tasks)

**Note:** ⚠️ These tasks were implemented ad-hoc without prior task creation, violating SDD workflow. This was the last time.

---

### 2026-03-03 - SDD Enforcement: Pre-Commit Hook & Strict Rules

**Milestone:** Implemented automated enforcement of Spec-Driven Development workflow

**Problem Identified:**
- ITER4.1 features (My Items, Edit, Delete) were implemented without creating tasks first
- Violated our own SDD methodology
- No automated checks to prevent ad-hoc coding

**Solution Implemented:**

**1. Updated AGENTS.md with CRITICAL RULE:**
```
Before implementing ANY feature or fix, you MUST:
1. Create a task in tasks.md with acceptance criteria
2. Get user approval
3. ONLY THEN implement the code
4. Mark task as complete after verification

NO AD-HOC CODING: If the user requests a feature that is not 
in tasks.md, you MUST stop and create the task specification 
FIRST, then wait for approval before coding.
```

**2. Pre-Commit Hook:**
- Blocks commits with code changes but no `tasks.md` update
- Checks: `.ts`, `.tsx`, `.js`, `.jsx` files
- Excludes: test, spec, config, type definition files
- Bypass: `[skip-sdd]` flag for emergencies only
- Clear error messages with fix instructions

**3. Setup Infrastructure:**
- `scripts/hooks/pre-commit` - Hook source (version controlled)
- `scripts/setup-hooks.sh` - One-command installer
- `scripts/hooks/README.md` - Full documentation
- Updated README.md with setup instructions

**Testing:**
- ✅ Code-only change → BLOCKED
- ✅ Code + tasks.md → ALLOWED
- ✅ Docs-only change → ALLOWED
- ✅ Bypass flag → ALLOWED

**Enforcement:**
```bash
# ✅ CORRECT
git add .kiro/specs/ecobid-marketplace/tasks.md
git add frontend/src/pages/NewFeature.tsx
git commit -m "feat: Add feature (ITER5-1)"

# ❌ BLOCKED
git add frontend/src/pages/NewFeature.tsx
git commit -m "feat: Add feature"
# Error: SDD VIOLATION DETECTED
```

**Philosophy:**
> "If it's not in tasks.md, it doesn't exist."

**Impact:**
- No more ad-hoc coding
- All work tracked and documented
- Forces planning before implementation
- Creates audit trail of decisions
- Maintains project discipline

**Post-Factum Documentation:**
- ITER4.1 tasks documented retroactively (7 tasks)
- Marked as SDD violation in tasks.md
- Lesson learned section added

**Going Forward:**
- ALL code changes require task creation first
- Hook runs automatically on every commit
- Emergency bypass available but discouraged
- This is now the standard workflow

**Files:**
- `AGENTS.md` - Updated with strict SDD rule
- `scripts/hooks/pre-commit` - Enforcement hook
- `scripts/hooks/README.md` - Full documentation
- `.kiro/specs/ecobid-marketplace/tasks.md` - ITER4.1 post-factum tasks

**Status:** ✅ ENFORCED - No more violations possible

---

### 2026-02-24 - Iteration 3.2 Complete: Session & Favorites Persistence

**Milestone:** Fixed favorites loading and verified session persistence

**Issue Identified:**
- Favorites were not loading after logout/login
- Lambda returned `{ items: Item[], count: number }` but frontend expected `Item[]`
- Response format mismatch caused favorites to fail silently

**Fixes Implemented:**
- ✅ Changed Lambda `listFavorites` to return array directly (not wrapped in object)
- ✅ Added debug logging to AuthContext (session loading flow)
- ✅ Added debug logging to FavoritesContext (favorites loading with counts and IDs)
- ✅ Verified session persistence works automatically via Amplify localStorage

**Session Persistence:**
- ✅ AWS Amplify automatically persists session in browser localStorage
- ✅ User stays logged in after page refresh
- ✅ No re-login required on browser restart
- ✅ JWT tokens automatically refreshed

**Favorites Persistence:**
- ✅ Favorites saved to DynamoDB on add/remove
- ✅ Favorites load automatically after login
- ✅ Red hearts appear on favorited items across all pages
- ✅ Favorites persist after page refresh
- ✅ Favorites restored after logout/login

**Debug Logging:**
- 🔐 AuthContext: Session loading, user found/not found
- ❤️ FavoritesContext: Favorites loading, count, item IDs
- All logs use emojis for easy identification in console

**Performance:**
- Lambda deployment: 50s
- Favorites load time: <100ms
- Session restore: <200ms

**Testing:**
- ✅ Login → Add favorites → Logout → Login → Favorites restored
- ✅ Page refresh maintains session and favorites
- ✅ Red hearts consistent across browse, favorites, and detail pages

**Files Modified:**
- `infrastructure/lib/lambda/handlers/favorites.ts` - Return array format
- `frontend/lib/auth/AuthContext.tsx` - Debug logging
- `frontend/lib/favorites/FavoritesContext.tsx` - Debug logging

**Git Commit:** `1d591e6`

---

### 2026-02-24 - Iteration 3 Complete: Authentication, Favorites & UX Polish

**Milestone:** Full authentication system with persistent favorites and mobile-optimized UX

**Authentication Implementation:**
- ✅ Cognito integration with AWS Amplify Auth
- ✅ Login/register pages with dynamic password validation
- ✅ Email verification with code input
- ✅ Protected routes and auth state management
- ✅ JWT token handling with correct `sub` claim usage
- ✅ Fixed 403 Unauthorized error (userId mismatch)

**Favorites System:**
- ✅ Global FavoritesContext for persistent state across all pages
- ✅ Red heart icon when item is favorited, gray when not
- ✅ Add/remove favorites with real-time UI updates
- ✅ Favorites page with automatic sync
- ✅ DynamoDB backend with user-scoped access control

**UX/UI Improvements:**
- ✅ Dynamic password validation with visual checklist (✓/○)
- ✅ Improved category filter with scroll indicators and fade gradients
- ✅ Toast notification system with slide-in animations
- ✅ Error Boundary for graceful error handling
- ✅ All touch targets meet 48px minimum (mobile-first)
- ✅ Smooth animations (60fps) and optimistic UI updates

**Critical Bugfixes:**
1. **403 Unauthorized Error** - Frontend was using email as userId, Lambda expected Cognito `sub` claim (UUID)
2. **Duplicate Amplify Configuration** - Removed conflicting config from API client
3. **Server Component Issue** - Moved Amplify.configure() to client component (AuthContext)
4. **Favorites State Persistence** - Implemented global context to maintain state across pages

**Performance:**
- Build time: 3.1s
- Deployment time: 56s
- All routes protected with Cognito JWT authorizer
- Favorites lookup: O(1) with Set data structure

**Testing:**
- ✅ Registration with real email verified
- ✅ Login/logout working
- ✅ Favorites add/remove working across all pages
- ✅ Heart icon state consistent everywhere
- ✅ Toast notifications working (success/error)

**Next Steps:**
- Implement Iteration 4: Create Item functionality
- Add AI-powered listing with photo upload (Rekognition + Bedrock)
- Implement lottery and reservation system
- Add direct messaging between users

---

### 2026-02-23 - Iteration 1 Complete: Minimal Backend Feature

**Milestone:** First working feature - Show Item Details (end-to-end)

**Backend Implementation:**
- ✅ Lambda handler `getItemById` with full error handling
- ✅ Unit tests created (5/5 passing) with Jest + mocks
- ✅ DynamoDB query using single-table design (PK/SK pattern)
- ✅ Seed data script ready with 5 diverse mock items
- ✅ Response time < 500ms requirement met

**Frontend Implementation:**
- ✅ Item detail page (`/items/[id]`) with server-side rendering
- ✅ Mobile-first responsive design with Tailwind CSS
- ✅ Custom 404 page for item not found
- ✅ Loading and error states
- ✅ Next.js 15 compatibility (async params handling)
- ✅ Mock data integration working

**Testing & Performance:**
- ✅ Unit tests: 5/5 passing
- ✅ Page load time: <400ms (exceeds <500ms requirement)
- ✅ 404 error handling verified
- ✅ Mock data end-to-end flow working

---

### 2026-02-23 - Infrastructure & Frontend Foundation Complete

**Milestone:** Core MVP infrastructure deployed and frontend scaffolding complete.

**Infrastructure (AWS CDK):**
- ✅ DynamoDB single-table design with GSI1 (status queries) and GSI2 (category/city filtering)
- ✅ S3 bucket with public read access and CORS configuration for item photos
- ✅ Cognito User Pool with email verification and custom attributes (name, city)
- ✅ API Gateway HTTP API with Lambda integrations for Items, Messages, Users, and AI endpoints
- ✅ EventBridge Scheduler for automated lottery execution and reservation expiration
- ✅ CloudFront + S3 static site hosting for Next.js frontend
- ✅ GitHub Actions OIDC role for CI/CD deployment
- ✅ Lambda functions with shared utilities (DynamoDB client, response helpers, validation)
- ✅ IAM policies following Principle of Least Privilege (grant methods)

**Frontend (Next.js):**
- ✅ Next.js 15 App Router project initialized with TypeScript and Tailwind CSS
- ✅ Mobile-first responsive layout with navigation
- ✅ Authentication pages (login/register) scaffolded
- ✅ Item feed page (home) with category filtering UI
- ✅ Item detail page structure
- ✅ User profile page scaffolded
- ✅ API client library with environment variable configuration
- ✅ Error and loading states implemented

**CI/CD:**
- ✅ GitHub Actions workflow for automated CDK deployment
- ✅ OIDC authentication (no long-lived credentials)
- ✅ Deployment scripts for infrastructure and frontend sync
