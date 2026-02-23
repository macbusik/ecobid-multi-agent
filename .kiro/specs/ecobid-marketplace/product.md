---
inclusion: always
---

# Product: EcoBid Marketplace

EcoBid is a mobile-first AI-powered marketplace for free household item giveaways, built for the AWS 10,000 AIdeas competition. The platform enables users to effortlessly list items using multimodal AI (Amazon Rekognition for photo recognition and Amazon Bedrock Claude Haiku for text generation) and implements a fair lottery-based reservation system to distribute items equitably.

## Core Value Proposition

- Sellers can list items in under 30 seconds by uploading a photo and letting AI generate title and description
- Buyers enter a lottery system (3-12 hour window) for fair item distribution
- Winners have 24 hours to confirm pickup and coordinate via in-app messaging
- Promotes circular economy principles and waste reduction

## Competition Constraints

- Must stay within AWS Free Tier limits (zero cost during competition)
- Must use Kiro IDE for development
- Must be deployed and functional for judging by April 2026
- Judged on: Technical Innovation (34%), Implementation Quality (33%), Market Impact (33%)

## Target Users

- Individuals giving away household items (Kitchen, Furniture, Electronics, Books, Clothing, Toys, Other)
- Individuals seeking free household items in their local area
- Environmentally conscious users promoting reuse and waste reduction

---

## Feature Planning

### Iteration 1: Minimal Backend - Show Offer Details

**Goal:** Enable users to view detailed information about a listed item.

**Rationale:** This is the most basic read operation needed to validate the infrastructure works end-to-end. Before building complex features (AI listing, lottery system, messaging), we need to prove we can store and retrieve item data.

**Scope:**
- Backend: Lambda handler to fetch item by ID from DynamoDB
- Frontend: Item detail page that calls the API and displays data
- Data: Use mock/seed data initially (manually inserted into DynamoDB)

**Success Criteria:**
- User can navigate to `/items/{itemId}` and see item title, description, photo, category, city, status
- API returns proper error handling (404 for non-existent items)
- Response time < 500ms

**Out of Scope (for this iteration):**
- Creating items (AI listing)
- Lottery/reservation logic
- User authentication (can be added later)
- Messaging

**Next Steps After Completion:**
- Iteration 2: Create item (manual form, no AI yet)
- Iteration 3: List items (feed with filtering)
- Iteration 4: AI-powered listing
