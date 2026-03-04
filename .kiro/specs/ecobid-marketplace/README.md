# EcoBid Marketplace - Specification Directory

This directory contains all Spec-Driven Development (SDD) documentation for the EcoBid marketplace project.

## Core Specifications

### 📋 [requirements.md](./requirements.md)
Business requirements, user stories, and MVP scope definition.

### 🏗️ [design.md](./design.md)
System architecture, API contracts, database schema, and technical design decisions.

### ✅ [tasks.md](./tasks.md)
Master task index with links to iteration-specific task files.

### 📁 [tasks/](./tasks/)
Individual task files organized by iteration:
- `infrastructure.md` - AWS CDK infrastructure setup
- `frontend-foundation.md` - Vite + React foundation
- `iter1-backend.md` - Minimal backend (show item details)
- `iter2-auth-favorites.md` - Authentication + favorites
- `iter3-ux-fixes.md` - UX/UI improvements
- `iter4-ai-listing.md` - AI-powered item listing
- `iter5-lottery.md` - Lottery & reservation system
- `iter5.1-ux-polish.md` - Marketplace UX essentials (current)

## Documentation

### 🗺️ [product-roadmap.md](./product-roadmap.md)
Product vision, iteration plans, and V2 backlog.

### 🎬 [demo-scenarios.md](./demo-scenarios.md)
Competition demo script with realistic user flows.

## Test Plans

### 🧪 [test-plans/](./test-plans/)
Iteration-specific test plans:
- `iter4-ai-listing.md` - AI listing feature tests
- `iter5-lottery-system.md` - Lottery system unit/API tests
- `iter5-lottery-e2e.md` - End-to-end lottery flow tests

## File Organization Rules

**✅ KEEP:**
- Core SDD files (requirements, design, tasks)
- Product documentation (roadmap, demo scenarios)
- Test plans for completed iterations

**❌ DELETE:**
- Iteration-specific troubleshooting docs (move to README journal)
- Deployment logs (ephemeral, not specs)
- Planning artifacts (user action analysis, etc.)
- Duplicate content (already in tasks/)

**📝 UPDATE:**
- `tasks.md` status summary after each iteration
- `product-roadmap.md` when adding new iterations
- Test plans when features change

## Navigation

Start here:
1. Read [requirements.md](./requirements.md) for business context
2. Read [design.md](./design.md) for technical architecture
3. Check [tasks.md](./tasks.md) for current iteration status
4. Open relevant task file in [tasks/](./tasks/) directory
5. Implement → Test → Mark complete → Commit

---

**Last Updated:** 2026-03-04  
**Current Iteration:** ITER5.1 (Marketplace UX Polish)
