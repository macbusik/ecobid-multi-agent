## 6. User Interface Specifications

### 6.1 Mobile-First Design Principles

**Core Design Requirements:**
- **Touch Targets:** Minimum 48x48px for all interactive elements
- **One-Handed Operation:** Primary actions accessible with thumb
- **Progressive Loading:** Content loads incrementally for fast perceived performance
- **Offline Capability:** Core browsing works without internet connection
- **Accessibility:** WCAG 2.1 AA compliance for screen readers and keyboard navigation

### 6.2 AI-Powered Listing Flow UI

#### Screen 6.2.1: Photo Upload Interface

**Layout:**
```
┌─────────────────────────────────────┐
│ ← Back          New Item      Skip │
├─────────────────────────────────────┤
│                                     │
│        📷 Take Photo                │
│                                     │
│        📁 Choose from Gallery       │
│                                     │
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   │     Photo Preview Area      │   │
│   │        (if selected)        │   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
│   Photo Requirements:               │
│   • Max 5MB size                    │
│   • JPEG or PNG format              │
│   • Clear, well-lit image           │
│                                     │
│              [Continue]             │
└─────────────────────────────────────┘
```

**Interaction Flow:**
1. User taps "Take Photo" → Opens camera with overlay guidelines
2. User taps "Choose from Gallery" → Opens photo picker
3. Photo selected → Shows compressed preview with edit options
4. "Continue" → Uploads to S3 and triggers AI analysis

**Error States:**
- File too large: "Photo must be under 5MB. Try taking a new photo."
- Upload failed: "Upload failed. Check your connection and try again."
- Invalid format: "Please select a JPEG or PNG image."

#### Screen 6.2.2: AI Analysis Progress

**Layout:**
```
┌─────────────────────────────────────┐
│ ← Back          New Item            │
├─────────────────────────────────────┤
│                                     │
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   │      [Photo Preview]        │   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
│        🤖 AI is analyzing...        │
│                                     │
│    ████████████░░░░░░░░░░░░ 60%     │
│                                     │
│   Generating title and description  │
│                                     │
│        This usually takes           │
│        5-10 seconds                 │
│                                     │
└─────────────────────────────────────┘
```

**States:**
- **Loading (0-3s):** "Uploading photo..."
- **Processing (3-8s):** "AI is analyzing..." with progress bar
- **Generating (8-10s):** "Generating description..."
- **Complete:** Transition to editing screen

#### Screen 6.2.3: AI Suggestions Review & Edit

**Layout:**
```
┌─────────────────────────────────────┐
│ ← Back          New Item    Publish │
├─────────────────────────────────────┤
│   ┌─────────────────────────────┐   │
│   │      [Photo Preview]        │   │
│   └─────────────────────────────┘   │
│                                     │
│ Title (60 chars max)                │
│ ┌─────────────────────────────────┐ │
│ │ Vintage Wooden Chair        45/60│ │
│ └─────────────────────────────────┘ │
│                                     │
│ Description (300 chars max)         │
│ ┌─────────────────────────────────┐ │
│ │ Beautiful vintage wooden chair  │ │
│ │ in good condition. Minor wear   │ │
│ │ on armrests but structurally... │ │
│ │                          156/300│ │
│ └─────────────────────────────────┘ │
│                                     │
│ Category                            │
│ ┌─────────────────────────────────┐ │
│ │ Furniture               ▼       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Lottery Window                      │
│ ┌─────────────────────────────────┐ │
│ │ 6 hours                 ▼       │ │
│ └─────────────────────────────────┘ │
│                                     │
│              [Publish Item]         │
└─────────────────────────────────────┘
```

**Features:**
- **Real-time character count** for title and description
- **Editable fields** with AI suggestions as placeholders
- **Category dropdown** with all available options
- **Lottery window selector** (3, 6, 12, 24 hours)
- **Publish button** validates all fields

### 6.3 Lottery System UI

#### Screen 6.3.1: Item Detail with Lottery Entry

**Layout:**
```
┌─────────────────────────────────────┐
│ ← Back          Item Details    ♡   │
├─────────────────────────────────────┤
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   │      [Item Photo]           │   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
│ Vintage Wooden Chair                │
│ Furniture • Posted 2 hours ago      │
│                                     │
│ Beautiful vintage wooden chair in   │
│ good condition. Minor wear on       │
│ armrests but structurally sound...  │
│                                     │
│ 📍 San Francisco, CA                │
│ 👤 Sarah Chen (⭐⭐⭐⭐⭐ 15 items)    │
│                                     │
│ ⏰ Lottery closes in 3h 45m         │
│                                     │
│        [🎲 Enter Lottery]           │
│                                     │
│ 12 people have entered so far       │
└─────────────────────────────────────┘
```

**States:**
- **Available:** Shows "Enter Lottery" button with countdown
- **Entered:** Shows "You're in lottery ✓" (disabled, green)
- **Closed:** Shows "Lottery Closed" badge
- **Reserved:** Shows "Reserved for [Winner]" or "Reserved for You"

#### Screen 6.3.2: Lottery Entry Confirmation

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│              🎉 Success!            │
│                                     │
│        You're in the lottery!       │
│                                     │
│   Winner will be announced in       │
│            3 hours 45 minutes       │
│                                     │
│   We'll send you an email if you    │
│   win. Good luck! 🍀                │
│                                     │
│              [Got it]               │
│                                     │
└─────────────────────────────────────┘
```

#### Screen 6.3.3: Winner Notification

**Layout:**
```
┌─────────────────────────────────────┐
│ ← Back          Congratulations!    │
├─────────────────────────────────────┤
│                                     │
│              🎉 You Won!            │
│                                     │
│        Vintage Wooden Chair         │
│                                     │
│   ┌─────────────────────────────┐   │
│   │      [Item Photo]           │   │
│   └─────────────────────────────┘   │
│                                     │
│   You have 24 hours to confirm     │
│   pickup or the item will be        │
│   offered to someone else.          │
│                                     │
│   ⏰ 23h 45m remaining              │
│                                     │
│        [Confirm Pickup]             │
│                                     │
│   Seller: Sarah Chen                │
│   📍 San Francisco, CA              │
│                                     │
└─────────────────────────────────────┘
```

#### Screen 6.3.4: Pickup Coordination

**Layout:**
```
┌─────────────────────────────────────┐
│ ← Back          Pickup Details      │
├─────────────────────────────────────┤
│                                     │
│        ✅ Pickup Confirmed          │
│                                     │
│        Vintage Wooden Chair         │
│                                     │
│   Contact Sarah to arrange pickup:  │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ 💬 Send Message             │   │
│   └─────────────────────────────┘   │
│                                     │
│   Pickup Guidelines:                │
│   • Meet in a public place          │
│   • Bring help for heavy items      │
│   • Confirm item condition          │
│   • Be respectful of seller's time  │
│                                     │
│   Having issues?                    │
│   [Report Problem]                  │
│                                     │
└─────────────────────────────────────┘
```

### 6.4 Messaging Interface

#### Screen 6.4.1: Conversation View

**Layout:**
```
┌─────────────────────────────────────┐
│ ← Back      Sarah Chen         •    │
├─────────────────────────────────────┤
│                                     │
│ Re: Vintage Wooden Chair            │
│                                     │
│           Hi! When would be    10:30│
│           good for pickup?          │
│                              Sarah  │
│                                     │
│ How about tomorrow                  │
│ afternoon? I'm free after 2pm  10:45│
│                                You  │
│                                     │
│           Perfect! My address  10:47│
│           is 123 Oak St. I'll       │
│           leave it on the porch     │
│                              Sarah  │
│                                     │
│ Great, I'll be there around    10:50│
│ 3pm. Thanks so much!                │
│                                You  │
│                                     │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Type a message...               │ │
│ └─────────────────────────────────┘ │
│                              [Send] │
└─────────────────────────────────────┘
```

**Features:**
- **Item context** shown at top
- **Real-time messaging** with delivery status
- **Character limit** (500 chars per message)
- **Safety guidelines** accessible via menu
- **Report functionality** for inappropriate messages

---

## 7. Data Models & Database Schema

### 7.1 DynamoDB Single Table Design

**Table Name:** `EcoBidTable`

**Primary Key Structure:**
- **Partition Key (PK):** Entity identifier
- **Sort Key (SK):** Entity type or relationship identifier

**Global Secondary Indexes:**
- **GSI1:** Status-based queries (PK: `STATUS#<status>`, SK: `<timestamp>`)
- **GSI2:** Category/location queries (PK: `CATEGORY#<cat>#CITY#<city>`, SK: `<timestamp>`)

### 7.2 Entity Definitions

#### 7.2.1 User Entity

```typescript
interface User {
  PK: `USER#${string}`;           // USER#userId
  SK: 'PROFILE';
  entityType: 'User';
  userId: string;                 // Cognito sub claim
  email: string;
  name: string;
  city: string;
  itemsGivenCount: number;
  itemsReceivedCount: number;
  reputationScore: number;        // itemsGiven + itemsReceived
  createdAt: string;              // ISO 8601
  updatedAt: string;              // ISO 8601
}
```

**Access Patterns:**
- Get user profile: `PK = USER#userId AND SK = PROFILE`
- Update reputation: Atomic increment operations

#### 7.2.2 Item Entity

```typescript
interface Item {
  PK: `ITEM#${string}`;           // ITEM#itemId
  SK: 'METADATA';
  GSI1PK: `STATUS#${ItemStatus}`;  // For status-based queries
  GSI1SK: string;                 // createdAt timestamp
  GSI2PK: `CATEGORY#${Category}#CITY#${string}`; // For filtered search
  GSI2SK: string;                 // createdAt timestamp
  entityType: 'Item';
  itemId: string;
  sellerId: string;
  title: string;                  // Max 60 characters
  description: string;            // Max 300 characters
  category: Category;
  photoUrl: string;               // S3 URL
  city: string;
  status: ItemStatus;
  lotteryWindowHours: number;     // 3-24 hours
  lotteryEndTime: string;         // ISO 8601
  winnerUserId?: string;          // Set when lottery completes
  reservationExpiryTime?: string; // ISO 8601, 24h after winner selection
  createdAt: string;              // ISO 8601
  updatedAt: string;              // ISO 8601
}

type ItemStatus = 'Available' | 'Lottery_Closed' | 'Reserved' | 'Pickup_Confirmed' | 'Picked_Up' | 'Expired';
type Category = 'Kitchen' | 'Furniture' | 'Electronics' | 'Books' | 'Clothing' | 'Toys' | 'Other';
```

**Access Patterns:**
- Get item by ID: `PK = ITEM#itemId AND SK = METADATA`
- List available items: `GSI1PK = STATUS#Available` (sorted by GSI1SK)
- Filter by category/city: `GSI2PK = CATEGORY#Kitchen#CITY#SF` (sorted by GSI2SK)

#### 7.2.3 Lottery Entry Entity

```typescript
interface LotteryEntry {
  PK: `ITEM#${string}`;           // ITEM#itemId
  SK: `LOTTERY#${string}`;        // LOTTERY#userId
  entityType: 'LotteryEntry';
  itemId: string;
  userId: string;
  enteredAt: string;              // ISO 8601
}
```

**Access Patterns:**
- Get all entries for item: `PK = ITEM#itemId AND begins_with(SK, 'LOTTERY#')`
- Check if user entered: `PK = ITEM#itemId AND SK = LOTTERY#userId`

#### 7.2.4 Message Entity

```typescript
interface Message {
  PK: `ITEM#${string}`;           // ITEM#itemId
  SK: `MESSAGE#${string}#${string}`; // MESSAGE#timestamp#messageId
  entityType: 'Message';
  messageId: string;
  itemId: string;
  senderId: string;
  recipientId: string;
  messageText: string;            // Max 500 characters
  createdAt: string;              // ISO 8601
}
```

**Access Patterns:**
- Get messages for item: `PK = ITEM#itemId AND begins_with(SK, 'MESSAGE#')`
- Messages sorted chronologically by SK

#### 7.2.5 Favorites Entity

```typescript
interface Favorite {
  PK: `USER#${string}`;           // USER#userId
  SK: `FAVORITE#${string}`;       // FAVORITE#itemId
  entityType: 'Favorite';
  userId: string;
  itemId: string;
  createdAt: string;              // ISO 8601
}
```

**Access Patterns:**
- Get user favorites: `PK = USER#userId AND begins_with(SK, 'FAVORITE#')`
- Check if item favorited: `PK = USER#userId AND SK = FAVORITE#itemId`

### 7.3 Query Patterns & Performance

#### 7.3.1 Common Query Operations

**Item Feed (Homepage)**
```typescript
const getAvailableItems = async (limit = 20, nextToken?: string) => {
  return await dynamoClient.send(new QueryCommand({
    TableName: process.env.TABLE_NAME,
    IndexName: 'GSI1',
    KeyConditionExpression: 'GSI1PK = :status',
    ExpressionAttributeValues: marshall({
      ':status': 'STATUS#Available'
    }),
    ScanIndexForward: false, // Most recent first
    Limit: limit,
    ExclusiveStartKey: nextToken ? JSON.parse(Buffer.from(nextToken, 'base64').toString()) : undefined
  }));
};
```

**Category Filtering**
```typescript
const getItemsByCategory = async (category: string, city: string, limit = 20) => {
  return await dynamoClient.send(new QueryCommand({
    TableName: process.env.TABLE_NAME,
    IndexName: 'GSI2',
    KeyConditionExpression: 'GSI2PK = :categoryCity',
    ExpressionAttributeValues: marshall({
      ':categoryCity': `CATEGORY#${category}#CITY#${city}`
    }),
    ScanIndexForward: false,
    Limit: limit
  }));
};
```

**User's Items**
```typescript
const getUserItems = async (userId: string) => {
  return await dynamoClient.send(new QueryCommand({
    TableName: process.env.TABLE_NAME,
    IndexName: 'GSI1',
    KeyConditionExpression: 'GSI1PK = :status',
    FilterExpression: 'sellerId = :userId',
    ExpressionAttributeValues: marshall({
      ':status': 'STATUS#Available',
      ':userId': userId
    })
  }));
};
```

#### 7.3.2 Performance Considerations

**Read Capacity Units (RCU) Estimation:**
- Item detail page: 1 RCU (single item lookup)
- Homepage feed: 5 RCU (20 items × 0.25 RCU each)
- Category filter: 3 RCU (filtered query)
- User favorites: 2 RCU (user's favorite items)

**Write Capacity Units (WCU) Estimation:**
- Create item: 2 WCU (item + GSI updates)
- Enter lottery: 1 WCU (lottery entry)
- Update item status: 1 WCU (status change)
- Send message: 1 WCU (message creation)

**Projected Usage (10K MAU):**
- **Daily reads:** ~50K operations = ~150K RCU/day = ~2 RCU/second
- **Daily writes:** ~5K operations = ~10K WCU/day = ~0.1 WCU/second
- **Well within Free Tier:** 25 RCU/WCU sustained

---

## 8. API Specifications

### 8.1 Authentication & Authorization

**Authentication Method:** AWS Cognito JWT tokens
**Authorization Header:** `Authorization: Bearer <jwt-token>`
**Token Expiry:** 24 hours
**Refresh Token:** 30 days

### 8.2 Core API Endpoints

#### 8.2.1 Item Management APIs

**POST /items/upload-url**
```typescript
// Generate presigned URL for photo upload
Request: {}
Response: {
  uploadUrl: string;
  photoKey: string;
  itemId: string;
}
```

**POST /items/analyze**
```typescript
// Analyze uploaded photo with AI
Request: {
  photoKey: string;
}
Response: {
  photoUrl: string;
  aiSuggestions: {
    title: string;
    description: string;
    category: Category;
  };
}
```

**POST /items**
```typescript
// Create new item listing
Request: {
  title: string;
  description: string;
  category: Category;
  photoUrl: string;
  lotteryWindowHours: number; // 3-24
}
Response: {
  itemId: string;
  status: 'Available';
  lotteryEndTime: string;
}
```

**GET /items**
```typescript
// List items with filtering
Query Parameters:
  category?: Category;
  city?: string;
  search?: string;
  limit?: number; // default 20, max 100
  nextToken?: string;

Response: {
  items: Item[];
  nextToken?: string;
  count: number;
}
```

**GET /items/{itemId}**
```typescript
// Get item details
Response: Item & {
  sellerName: string;
  sellerReputation: number;
  userHasEntered?: boolean; // if authenticated
}
```

#### 8.2.2 Lottery System APIs

**POST /items/{itemId}/lottery**
```typescript
// Enter item lottery
Request: {} // Empty body
Response: {
  message: 'Successfully entered lottery';
  lotteryEndTime: string;
}
```

**POST /items/{itemId}/confirm-pickup**
```typescript
// Confirm pickup (winner only)
Request: {} // Empty body
Response: {
  message: 'Pickup confirmed';
  status: 'Pickup_Confirmed';
}
```

**POST /items/{itemId}/mark-picked-up**
```typescript
// Mark item as picked up (seller only)
Request: {} // Empty body
Response: {
  message: 'Item marked as picked up';
  status: 'Picked_Up';
}
```

#### 8.2.3 User Management APIs

**GET /users/me**
```typescript
// Get current user profile
Response: {
  userId: string;
  email: string;
  name: string;
  city: string;
  itemsGivenCount: number;
  itemsReceivedCount: number;
  reputationScore: number;
  createdAt: string;
}
```

**PUT /users/me**
```typescript
// Update user profile
Request: {
  name?: string;
  city?: string;
}
Response: User;
```

#### 8.2.4 Favorites APIs

**POST /users/me/favorites**
```typescript
// Add item to favorites
Request: {
  itemId: string;
}
Response: {
  message: 'Item added to favorites';
}
```

**DELETE /users/me/favorites/{itemId}**
```typescript
// Remove from favorites
Response: {
  message: 'Item removed from favorites';
}
```

**GET /users/me/favorites**
```typescript
// Get user's favorite items
Response: {
  items: Item[];
  count: number;
}
```

### 8.3 Error Handling

**Standard Error Response:**
```typescript
{
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}
```

**Common Error Codes:**
- **400 Bad Request:** Invalid input data
- **401 Unauthorized:** Missing or invalid JWT token
- **403 Forbidden:** User not authorized for action
- **404 Not Found:** Resource doesn't exist
- **409 Conflict:** Resource state conflict (e.g., already entered lottery)
- **429 Too Many Requests:** Rate limiting
- **500 Internal Server Error:** Server-side error

---

## 9. Non-Functional Requirements

### 9.1 Performance Requirements

**Response Time Targets:**
- **API Endpoints:** <500ms for 95th percentile
- **Photo Upload:** <5 seconds for 5MB image
- **AI Analysis:** <10 seconds for processing
- **Page Load:** <3 seconds on 4G connection
- **Database Queries:** <100ms for single-item lookups

**Throughput Requirements:**
- **Concurrent Users:** Support 1,000+ simultaneous users
- **API Requests:** Handle 100 requests/second sustained
- **Photo Uploads:** Process 50 uploads/minute
- **Lottery Executions:** Process 100 lotteries/hour

### 9.2 Scalability Requirements

**User Growth Targets:**
- **Year 1:** 10,000 Monthly Active Users
- **Year 2:** 100,000 Monthly Active Users
- **Year 3:** 1,000,000 Monthly Active Users

**Data Growth Projections:**
- **Items per month:** 10% of MAU (1K → 10K → 100K)
- **Photos stored:** 50MB → 500MB → 5GB annually
- **Database size:** <1GB → <10GB → <100GB
- **API requests:** 100K → 1M → 10M monthly

**AWS Free Tier Compliance:**
- **Lambda:** Stay under 1M requests/month in Year 1
- **DynamoDB:** Maintain <25GB storage, <25 RCU/WCU
- **S3:** Keep under 5GB storage, 20K GET requests
- **API Gateway:** Under 1M requests/month

### 9.3 Security Requirements

**Data Protection:**
- **Encryption in Transit:** TLS 1.2+ for all API communications
- **Encryption at Rest:** AWS default encryption for DynamoDB and S3
- **JWT Security:** RS256 signing, 24-hour expiry
- **Photo Access:** Presigned URLs with 5-minute expiry

**Privacy Compliance:**
- **GDPR Compliance:** EU user data protection
- **CCPA Compliance:** California user privacy rights
- **Data Minimization:** Collect only necessary user data
- **Right to Deletion:** User data export and deletion capabilities

**Application Security:**
- **Input Validation:** Sanitize all user inputs
- **SQL Injection Prevention:** Use parameterized queries
- **XSS Prevention:** Content Security Policy headers
- **Rate Limiting:** Prevent abuse and DoS attacks

### 9.4 Reliability Requirements

**Availability Targets:**
- **Uptime:** 99.9% availability (8.76 hours downtime/year)
- **Error Rate:** <0.1% of requests result in 5xx errors
- **Data Durability:** 99.999999999% (11 9's) via AWS S3/DynamoDB

**Disaster Recovery:**
- **RTO (Recovery Time Objective):** <1 hour
- **RPO (Recovery Point Objective):** <15 minutes
- **Backup Strategy:** Automated daily backups
- **Multi-AZ Deployment:** Automatic failover capabilities

### 9.5 Monitoring & Observability

**Application Metrics:**
- **User Engagement:** MAU, DAU, session duration
- **Feature Usage:** Listing creation rate, lottery participation
- **Performance:** API response times, error rates
- **Business:** Items listed, successful pickups, user retention

**Technical Metrics:**
- **AWS Service Health:** Lambda duration, DynamoDB throttling
- **Cost Monitoring:** Service usage vs Free Tier limits
- **Security:** Failed authentication attempts, suspicious activity
- **AI Performance:** Nova Lite accuracy, processing time

**Alerting Thresholds:**
- **Error Rate:** >1% of requests failing
- **Response Time:** >1 second 95th percentile
- **Free Tier Usage:** >80% of any service limit
- **Security:** >10 failed logins from same IP

---

*This PRD provides comprehensive specifications for EcoBid's core functionality, with detailed technical requirements for the AI-powered listing flow and lottery-based distribution system. The document serves as the definitive guide for development, testing, and product validation.*
