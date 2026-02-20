# Design Document: EcoBid Marketplace

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile/Desktop Browser                   │
│                    (Next.js 14 App Router)                   │
│                  React + TypeScript + Tailwind               │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway HTTP API                       │
│              (Cognito Authorizer for auth)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┬──────────────┐
         ▼               ▼               ▼              ▼
    ┌────────┐     ┌─────────┐    ┌──────────┐   ┌─────────┐
    │ Items  │     │ Lottery │    │ Messages │   │  Users  │
    │ Lambda │     │ Lambda  │    │  Lambda  │   │ Lambda  │
    └────┬───┘     └────┬────┘    └────┬─────┘   └────┬────┘
         │              │              │              │
         └──────────────┴──────────────┴──────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  DynamoDB   │
                  │ Single Table│
                  └─────────────┘

┌──────────────┐        ┌────────────────┐       ┌──────────────┐
│  S3 Bucket   │        │ EventBridge    │       │   Cognito    │
│ (Item Photos)│        │   Scheduler    │       │  User Pool   │
└──────────────┘        └────────────────┘       └──────────────┘
                               │
                               ▼
                        ┌─────────────┐
                        │ Amazon SES  │
                        │(Email Notif)│
                        └─────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      AI Services                              │
│  ┌──────────────────┐         ┌──────────────────────┐      │
│  │ Amazon Rekognition│         │  Amazon Bedrock      │      │
│  │ (Object Detection)│         │  (Claude Haiku)      │      │
│  └──────────────────┘         └──────────────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript 5
- Tailwind CSS 3
- Mobile-First Responsive Design

**Backend:**
- AWS Lambda (Node.js 20.x, ARM64)
- API Gateway HTTP API
- DynamoDB (Single Table Design, On-Demand)
- S3 (Standard Storage)
- Cognito User Pool
- EventBridge Scheduler
- Amazon SES (Email Notifications)

**AI Services:**
- Amazon Rekognition (Object Detection)
- Amazon Bedrock (Claude Haiku for text generation)

**Infrastructure:**
- AWS CDK (TypeScript)
- All services within AWS Free Tier limits

## 2. Data Models

### 2.1 DynamoDB Single Table Design

**Table Name:** `EcoBidTable`

**Primary Key:**
- Partition Key: `PK` (String)
- Sort Key: `SK` (String)

**Global Secondary Indexes:**

**GSI1:** `GSI1PK` (Partition Key), `GSI1SK` (Sort Key)
- Purpose: Query items by status and timestamp

**GSI2:** `GSI2PK` (Partition Key), `GSI2SK` (Sort Key)
- Purpose: Query items by category and city

### 2.2 Entity Patterns

#### User Entity
```typescript
{
  PK: "USER#<userId>",
  SK: "PROFILE",
  entityType: "User",
  userId: string,
  email: string,
  name: string,
  city: string,
  itemsGivenCount: number,
  itemsReceivedCount: number,
  reputationScore: number,
  createdAt: string (ISO 8601),
  updatedAt: string (ISO 8601)
}
```

#### Item Entity
```typescript
{
  PK: "ITEM#<itemId>",
  SK: "METADATA",
  GSI1PK: "STATUS#<status>",
  GSI1SK: "<createdAt>",
  GSI2PK: "CATEGORY#<category>#CITY#<city>",
  GSI2SK: "<createdAt>",
  entityType: "Item",
  itemId: string,
  sellerId: string,
  title: string,
  description: string,
  category: "Kitchen" | "Furniture" | "Electronics" | "Books" | "Clothing" | "Toys" | "Other",
  photoUrl: string,
  city: string,
  status: "Available" | "Lottery_Closed" | "Reserved" | "Pickup_Confirmed" | "Picked_Up" | "Expired",
  lotteryWindowHours: number (3-12),
  lotteryEndTime: string (ISO 8601),
  winnerUserId?: string,
  reservationExpiryTime?: string (ISO 8601),
  createdAt: string (ISO 8601),
  updatedAt: string (ISO 8601)
}
```

#### Lottery Entry Entity
```typescript
{
  PK: "ITEM#<itemId>",
  SK: "LOTTERY#<userId>",
  entityType: "LotteryEntry",
  itemId: string,
  userId: string,
  enteredAt: string (ISO 8601)
}
```

#### Message Entity
```typescript
{
  PK: "ITEM#<itemId>",
  SK: "MESSAGE#<timestamp>#<messageId>",
  entityType: "Message",
  messageId: string,
  itemId: string,
  senderId: string,
  recipientId: string,
  messageText: string (max 500 chars),
  createdAt: string (ISO 8601)
}
```

## 3. API Contracts

**Base URL:** `https://<api-id>.execute-api.<region>.amazonaws.com`

**Authentication:** All endpoints (except auth endpoints) require `Authorization: Bearer <token>` header

### 3.1 Authentication Endpoints

#### POST /auth/register
**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "city": "New York"
}
```
**Response (201):**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "message": "User registered successfully. Please verify your email."
}
```

#### POST /auth/login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```
**Response (200):**
```json
{
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "expiresIn": 86400,
  "userId": "uuid"
}
```

### 3.2 Item Endpoints

#### POST /items
**Request:**
```json
{
  "photoBase64": "base64-encoded-image",
  "lotteryWindowHours": 6
}
```
**Response (201):**
```json
{
  "itemId": "uuid",
  "photoUrl": "https://s3.amazonaws.com/...",
  "aiSuggestions": {
    "title": "Vintage Wooden Chair",
    "description": "A beautiful vintage wooden chair in good condition...",
    "category": "Furniture"
  }
}
```

#### PUT /items/{itemId}
**Request:**
```json
{
  "title": "Vintage Wooden Chair",
  "description": "Custom description",
  "category": "Furniture"
}
```
**Response (200):**
```json
{
  "itemId": "uuid",
  "status": "Available",
  "lotteryEndTime": "2026-02-21T02:10:27Z"
}
```

#### GET /items
**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Keyword search in title/description
- `city` (optional): Filter by city
- `limit` (optional, default 20): Number of items per page
- `nextToken` (optional): Pagination token

**Response (200):**
```json
{
  "items": [
    {
      "itemId": "uuid",
      "title": "Vintage Wooden Chair",
      "category": "Furniture",
      "photoUrl": "https://...",
      "city": "New York",
      "status": "Available",
      "lotteryEndTime": "2026-02-21T02:10:27Z",
      "sellerName": "John Doe",
      "sellerReputation": 15
    }
  ],
  "nextToken": "pagination-token"
}
```

#### GET /items/{itemId}
**Response (200):**
```json
{
  "itemId": "uuid",
  "title": "Vintage Wooden Chair",
  "description": "A beautiful vintage wooden chair...",
  "category": "Furniture",
  "photoUrl": "https://...",
  "city": "New York",
  "status": "Available",
  "lotteryWindowHours": 6,
  "lotteryEndTime": "2026-02-21T02:10:27Z",
  "sellerId": "uuid",
  "sellerName": "John Doe",
  "sellerReputation": 15,
  "winnerUserId": null,
  "createdAt": "2026-02-20T20:10:27Z"
}
```

#### POST /items/{itemId}/lottery
**Request:** (empty body)
**Response (200):**
```json
{
  "message": "Successfully entered lottery",
  "itemId": "uuid",
  "lotteryEndTime": "2026-02-21T02:10:27Z"
}
```

#### POST /items/{itemId}/confirm-pickup
**Request:** (empty body)
**Response (200):**
```json
{
  "message": "Pickup confirmed",
  "itemId": "uuid",
  "status": "Pickup_Confirmed"
}
```

#### POST /items/{itemId}/mark-picked-up
**Request:** (empty body)
**Response (200):**
```json
{
  "message": "Item marked as picked up",
  "itemId": "uuid",
  "status": "Picked_Up"
}
```

### 3.3 Message Endpoints

#### POST /items/{itemId}/messages
**Request:**
```json
{
  "messageText": "Hi, when can I pick this up?"
}
```
**Response (201):**
```json
{
  "messageId": "uuid",
  "itemId": "uuid",
  "senderId": "uuid",
  "recipientId": "uuid",
  "messageText": "Hi, when can I pick this up?",
  "createdAt": "2026-02-20T20:10:27Z"
}
```

#### GET /items/{itemId}/messages
**Response (200):**
```json
{
  "messages": [
    {
      "messageId": "uuid",
      "senderId": "uuid",
      "senderName": "John Doe",
      "messageText": "Hi, when can I pick this up?",
      "createdAt": "2026-02-20T20:10:27Z"
    }
  ]
}
```

### 3.4 User Endpoints

#### GET /users/{userId}
**Response (200):**
```json
{
  "userId": "uuid",
  "name": "John Doe",
  "city": "New York",
  "itemsGivenCount": 8,
  "itemsReceivedCount": 7,
  "reputationScore": 15,
  "createdAt": "2026-01-15T10:00:00Z"
}
```

#### GET /users/me
**Response (200):**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "city": "New York",
  "itemsGivenCount": 8,
  "itemsReceivedCount": 7,
  "reputationScore": 15,
  "createdAt": "2026-01-15T10:00:00Z"
}
```

## 4. Lambda Functions

### 4.1 Items Handler (`items.ts`)

**Responsibilities:**
- Create item (upload photo to S3, invoke AI services)
- Update item details
- Get item by ID
- List items with filters
- Enter lottery
- Confirm pickup
- Mark as picked up

**Environment Variables:**
- `TABLE_NAME`: DynamoDB table name
- `BUCKET_NAME`: S3 bucket name
- `REKOGNITION_MIN_CONFIDENCE`: 70
- `BEDROCK_MODEL_ID`: anthropic.claude-3-haiku-20240307-v1:0

### 4.2 Lottery Handler (`lottery.ts`)

**Responsibilities:**
- Triggered by EventBridge Scheduler when lottery window expires
- Select random winner from lottery entries
- Update item status to "Reserved"
- Send email notifications to winner and seller
- Schedule reservation expiry check

**Environment Variables:**
- `TABLE_NAME`: DynamoDB table name
- `SES_FROM_EMAIL`: Verified sender email

### 4.3 Messages Handler (`messages.ts`)

**Responsibilities:**
- Send message between seller and winner
- Get messages for an item
- Send email notification for new messages

**Environment Variables:**
- `TABLE_NAME`: DynamoDB table name
- `SES_FROM_EMAIL`: Verified sender email

### 4.4 Users Handler (`users.ts`)

**Responsibilities:**
- Get user profile by ID
- Get current user profile
- Update reputation scores when items are picked up

**Environment Variables:**
- `TABLE_NAME`: DynamoDB table name

### 4.5 Reservation Expiry Handler (`reservation-expiry.ts`)

**Responsibilities:**
- Triggered by EventBridge Scheduler 24 hours after winner selection
- Check if pickup was confirmed
- If not confirmed, update item status to "Expired"
- Send notification to seller

**Environment Variables:**
- `TABLE_NAME`: DynamoDB table name
- `SES_FROM_EMAIL`: Verified sender email

## 5. Frontend Architecture

### 5.1 Page Structure (Next.js App Router)

```
app/
├── layout.tsx                 # Root layout with Tailwind
├── page.tsx                   # Home page (item feed)
├── auth/
│   ├── register/page.tsx     # Registration page
│   └── login/page.tsx        # Login page
├── items/
│   ├── new/page.tsx          # Create new item
│   └── [id]/page.tsx         # Item details page
├── profile/
│   └── page.tsx              # User profile page
└── messages/
    └── [itemId]/page.tsx     # Messages for specific item
```

### 5.2 Component Structure

```
components/
├── ui/
│   ├── Button.tsx            # Reusable button component
│   ├── Input.tsx             # Form input component
│   ├── Card.tsx              # Card container
│   └── Modal.tsx             # Modal dialog
├── item/
│   ├── ItemCard.tsx          # Item card for feed
│   ├── ItemDetails.tsx       # Full item details
│   ├── LotteryButton.tsx     # "I'm Interested" button
│   ├── PhotoUpload.tsx       # Photo upload interface
│   └── CategoryFilter.tsx    # Category filter chips
├── auth/
│   ├── LoginForm.tsx         # Login form
│   └── RegisterForm.tsx      # Registration form
├── profile/
│   └── UserStats.tsx         # User statistics display
└── messages/
    ├── MessageList.tsx       # List of messages
    └── MessageInput.tsx      # Message input field
```

### 5.3 State Management

**Approach:** React Server Components (RSC) + Client Components with useState/useEffect

**Client Components (use "use client"):**
- Forms (login, register, create item)
- Interactive buttons (lottery entry, confirm pickup)
- Real-time message interface
- Photo upload

**Server Components (default):**
- Item feed
- Item details page
- User profile display
- Static content

### 5.4 API Client (`lib/api/client.ts`)

```typescript
export const apiClient = {
  auth: {
    register: (data: RegisterRequest) => Promise<RegisterResponse>,
    login: (data: LoginRequest) => Promise<LoginResponse>
  },
  items: {
    create: (data: CreateItemRequest) => Promise<CreateItemResponse>,
    update: (itemId: string, data: UpdateItemRequest) => Promise<UpdateItemResponse>,
    getById: (itemId: string) => Promise<Item>,
    list: (params: ListItemsParams) => Promise<ListItemsResponse>,
    enterLottery: (itemId: string) => Promise<void>,
    confirmPickup: (itemId: string) => Promise<void>,
    markPickedUp: (itemId: string) => Promise<void>
  },
  messages: {
    send: (itemId: string, text: string) => Promise<Message>,
    list: (itemId: string) => Promise<Message[]>
  },
  users: {
    getProfile: (userId: string) => Promise<User>,
    getMe: () => Promise<User>
  }
};
```

## 6. EventBridge Scheduler Rules

### 6.1 Lottery End Scheduler

**Trigger:** Created dynamically when item is published
**Schedule:** One-time execution at `lotteryEndTime`
**Target:** Lottery Lambda function
**Payload:**
```json
{
  "itemId": "uuid",
  "action": "selectWinner"
}
```

### 6.2 Reservation Expiry Scheduler

**Trigger:** Created when winner is selected
**Schedule:** One-time execution 24 hours after winner selection
**Target:** Reservation Expiry Lambda function
**Payload:**
```json
{
  "itemId": "uuid",
  "action": "checkReservationExpiry"
}
```

## 7. AI Service Integration

### 7.1 Photo Upload Flow

1. User uploads photo in frontend
2. Frontend converts to base64 and sends to `/items` POST endpoint
3. Lambda uploads to S3 with unique key: `items/<itemId>/<uuid>.jpg`
4. Lambda invokes Rekognition `DetectLabels` API
5. Lambda extracts top label with confidence > 70%
6. Lambda invokes Bedrock with prompt:
```
Generate a marketplace listing for this item: {detectedLabel}
Provide:
- Title (max 60 characters)
- Description (max 300 characters, focus on condition and features)
- Category (one of: Kitchen, Furniture, Electronics, Books, Clothing, Toys, Other)

Format as JSON:
{
  "title": "...",
  "description": "...",
  "category": "..."
}
```
7. Lambda returns AI suggestions to frontend
8. User edits and confirms
9. Frontend sends PUT request to publish item

### 7.2 Error Handling

- If Rekognition fails: Allow manual title/description entry
- If Bedrock fails: Provide default template based on detected label
- If both fail: Full manual entry mode

## 8. Security & IAM

### 8.1 Cognito User Pool Configuration

- Email as username
- Password policy: Min 8 chars, uppercase, lowercase, number, special char
- Email verification required
- MFA: Optional (disabled for MVP)
- Token expiry: 24 hours

### 8.2 Lambda IAM Policies

**Items Lambda:**
- DynamoDB: PutItem, GetItem, Query, UpdateItem
- S3: PutObject, GetObject
- Rekognition: DetectLabels
- Bedrock: InvokeModel
- EventBridge Scheduler: CreateSchedule

**Lottery Lambda:**
- DynamoDB: Query, UpdateItem
- SES: SendEmail
- EventBridge Scheduler: CreateSchedule

**Messages Lambda:**
- DynamoDB: PutItem, Query
- SES: SendEmail

**Users Lambda:**
- DynamoDB: GetItem, UpdateItem

## 9. AWS Free Tier Compliance

### 9.1 Service Limits

| Service | Free Tier Limit | Expected Usage | Status |
|---------|----------------|----------------|--------|
| Lambda | 1M requests/month | ~50K requests | ✅ Safe |
| DynamoDB | 25GB storage, 25 RCU/WCU | <1GB, <10 RCU/WCU | ✅ Safe |
| S3 | 5GB storage, 20K GET, 2K PUT | <2GB, <5K requests | ✅ Safe |
| API Gateway | 1M requests/month | ~50K requests | ✅ Safe |
| Cognito | 50K MAU | <1K MAU | ✅ Safe |
| Rekognition | 5K images/month | <1K images | ✅ Safe |
| Bedrock | Pay per token (no free tier) | ~$5-10/month | ⚠️ Minimal cost |
| SES | 62K emails/month | <5K emails | ✅ Safe |
| EventBridge | 14M events/month | <10K events | ✅ Safe |

### 9.2 Cost Optimization Strategies

- Use Lambda ARM64 architecture (20% cheaper)
- Use DynamoDB On-Demand billing (no idle cost)
- Use API Gateway HTTP API (cheaper than REST API)
- Compress images before S3 upload
- Use Bedrock Claude Haiku (cheapest model)
- Batch EventBridge schedules where possible

## 10. Deployment Strategy

### 10.1 CDK Stack Structure

```
lib/
├── ecobid-stack.ts           # Main stack
├── constructs/
│   ├── api.ts                # API Gateway + Lambda integration
│   ├── database.ts           # DynamoDB table + GSIs
│   ├── storage.ts            # S3 bucket + policies
│   ├── auth.ts               # Cognito User Pool
│   └── scheduler.ts          # EventBridge Scheduler setup
└── lambda/
    ├── handlers/
    │   ├── items.ts
    │   ├── lottery.ts
    │   ├── messages.ts
    │   ├── users.ts
    │   └── reservation-expiry.ts
    └── shared/
        ├── dynamodb.ts       # DynamoDB helper functions
        ├── s3.ts             # S3 helper functions
        └── types.ts          # Shared TypeScript types
```

### 10.2 Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=https://<api-id>.execute-api.<region>.amazonaws.com
NEXT_PUBLIC_COGNITO_USER_POOL_ID=<pool-id>
NEXT_PUBLIC_COGNITO_CLIENT_ID=<client-id>
NEXT_PUBLIC_AWS_REGION=<region>
```

**CDK (cdk.json):**
```json
{
  "context": {
    "projectName": "ecobid",
    "environment": "prod",
    "sesVerifiedEmail": "noreply@ecobid.example.com"
  }
}
```

## 11. Testing Strategy

### 11.1 Frontend Testing

- Manual testing in mobile browser (primary)
- Desktop browser testing (secondary)
- Mock API responses for isolated UI testing

### 11.2 Backend Testing

- Unit tests for Lambda handlers (Jest)
- Integration tests for DynamoDB operations
- Manual API testing with Postman/curl

### 11.3 End-to-End Testing

- Manual user flow testing:
  1. Register → Login
  2. Upload photo → AI generation → Publish item
  3. Browse items → Enter lottery
  4. Wait for lottery end → Winner notification
  5. Confirm pickup → Send message
  6. Mark as picked up → Verify reputation update

