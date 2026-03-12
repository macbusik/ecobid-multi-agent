# EcoBid Product Requirements Document (PRD)
## AI-Powered Free Item Giveaway Platform

**Document Version:** 1.0  
**Date:** March 2026  
**Product Manager:** [PM Name]  
**Engineering Lead:** [Tech Lead Name]  
**Designer:** [Design Lead Name]  

---

## 1. Executive Summary

### 1.1 Product Overview

EcoBid is a mobile-first AI-powered platform that revolutionizes how people give away household items in their local communities. By combining Amazon Nova Lite multimodal AI for instant listing creation with a fair lottery-based distribution system, EcoBid eliminates the primary pain points of existing free-item marketplaces: time-consuming manual listing and unfair "fastest clicker wins" distribution.

### 1.2 Problem Statement

**Current State Problems:**
- **Manual Listing Friction:** Creating item listings takes 5-10 minutes of manual effort
- **Unfair Distribution:** "First-come, first-served" favors users with more time/faster internet
- **High No-Show Rates:** 30-50% of claimed items never get picked up
- **Poor Mobile Experience:** Existing platforms designed for desktop, not mobile-first
- **Time Wasters:** "Is this still available?" messages followed by silence

**Market Impact:**
- **$520B** worth of unused household goods in US alone
- **2.3B tonnes** of municipal solid waste generated globally
- **Only 7.2%** of materials currently reused/recycled
- **40%** of discarded items are still functional

### 1.3 Solution Overview

**Core Innovation:**
1. **AI-Powered Listing:** Upload photo → AI generates title, description, category in <30 seconds
2. **Fair Lottery System:** Equal opportunity for all interested users through time-windowed random selection
3. **Mobile-First Design:** Touch-optimized interface built for smartphone usage
4. **Event-Driven Automation:** Serverless architecture handles complex workflows automatically

**Key Metrics:**
- **Target Listing Time:** <30 seconds (vs 5-10 minutes traditional)
- **AI Accuracy Goal:** >85% for common household items
- **Pickup Success Rate:** >80% (vs 50-70% traditional)
- **User Retention:** >60% monthly active users

---

## 2. Product Goals & Success Metrics

### 2.1 Primary Goals

**User Experience Goals:**
- Reduce item listing time from 5-10 minutes to <30 seconds
- Achieve >80% pickup success rate through lottery system
- Maintain >4.5/5 user satisfaction rating
- Enable one-handed mobile operation for all core flows

**Environmental Impact Goals:**
- Divert 10,000+ items from landfills in Year 1
- Prevent 100+ tonnes of waste annually by Year 2
- Build circular economy communities in 10+ cities
- Track and report measurable CO2 reduction

**Business Goals:**
- Achieve 100,000 MAU by end of Year 2
- Maintain 100% AWS Free Tier operation through Year 1
- Build sustainable unit economics for post-Free Tier scaling
- Establish market leadership in AI-powered circular economy

### 2.2 Success Metrics

**Engagement Metrics:**
- **Monthly Active Users (MAU):** Target 10K by Q4 2026, 100K by Q4 2027
- **Items Listed per Month:** Target 5K by Q4 2026, 50K by Q4 2027
- **Successful Pickups:** Target 80% confirmation rate
- **User Retention:** 60% Day-7, 40% Day-30, 20% Day-90

**Performance Metrics:**
- **Listing Creation Time:** <30 seconds average
- **AI Processing Time:** <10 seconds for analysis
- **API Response Time:** <500ms for all endpoints
- **Mobile App Performance:** >90 Lighthouse score

**Environmental Metrics:**
- **Items Diverted:** 10K+ items in Year 1
- **Waste Prevented:** 100+ tonnes annually
- **Community Growth:** 10+ active cities
- **User Environmental Awareness:** Measured through surveys

---

## 3. Target Users & Personas

### 3.1 Primary Persona: The Conscious Declutterer

**Demographics:**
- **Age:** 25-45 years old
- **Income:** $50K-$150K household income
- **Location:** Urban/suburban areas with high smartphone adoption
- **Lifestyle:** Environmentally conscious, busy professionals, apartment/small home living

**Motivations:**
- **Environmental Impact:** Reduce waste, support circular economy
- **Convenience:** Quick, guilt-free decluttering
- **Community Connection:** Help neighbors and build local relationships
- **Space Optimization:** Maximize living space efficiency

**Pain Points:**
- **Time Constraints:** Too busy for lengthy listing processes
- **Pickup Coordination:** Frustrated by no-shows and time wasters
- **Safety Concerns:** Uncomfortable meeting strangers
- **Guilt:** Feel bad throwing away functional items

**User Journey:**
1. **Trigger:** Moving, spring cleaning, or acquiring new items
2. **Discovery:** Find EcoBid through environmental organization or social media
3. **First Use:** List 1-3 items to test the platform
4. **Adoption:** Regular use for ongoing decluttering needs
5. **Advocacy:** Recommend to friends and community members

### 3.2 Secondary Persona: The Budget-Conscious Seeker

**Demographics:**
- **Age:** 18-35 years old
- **Income:** <$50K household income, students, young professionals
- **Location:** Urban areas, college towns, high-density housing
- **Lifestyle:** Frequent moves, sustainability-minded, tech-savvy

**Motivations:**
- **Cost Savings:** Free items reduce living expenses
- **Sustainability Values:** Environmental consciousness
- **Unique Finds:** Interest in vintage, unusual, or quality items
- **Community Participation:** Local engagement and networking

**Pain Points:**
- **Unfair Competition:** Can't compete with "fastest clicker" systems
- **Limited Availability:** Miss opportunities due to work/school schedules
- **Transportation:** Limited ability to pick up large items quickly
- **Quality Uncertainty:** Difficulty assessing item condition remotely

**User Journey:**
1. **Trigger:** Need for specific items (furniture, electronics, books)
2. **Discovery:** Word-of-mouth from friends or community groups
3. **Exploration:** Browse available items and enter lotteries
4. **First Win:** Successful pickup builds trust and engagement
5. **Regular Use:** Check app regularly for new opportunities

---

## 4. Core Features & User Stories

### 4.1 Feature Priority Matrix

**P0 (Must Have - MVP):**
- AI-powered item listing
- Lottery-based distribution system
- User authentication and profiles
- Photo upload and storage
- Mobile-responsive web app
- Basic messaging between users

**P1 (Should Have - V1.1):**
- Native mobile apps (iOS/Android)
- Push notifications for lottery results
- Advanced search and filtering
- User reputation system
- Favorites and watchlist

**P2 (Could Have - V2.0):**
- Voice-powered listing
- AR item visualization
- Corporate partnership features
- Analytics dashboard
- Multi-language support

### 4.2 Epic 1: AI-Powered Item Listing

**Epic Description:** Enable users to create complete item listings in under 30 seconds by uploading a photo and leveraging AI for automatic title, description, and category generation.

#### User Story 4.2.1: Photo Upload and AI Analysis

**As a** user giving away an item  
**I want to** upload a photo and have AI automatically generate listing details  
**So that** I can create a complete listing in under 30 seconds  

**Acceptance Criteria:**
- [ ] User can upload photo from camera or gallery
- [ ] Photo size limited to 5MB with compression if needed
- [ ] AI analysis completes in <10 seconds
- [ ] AI generates title (max 60 characters)
- [ ] AI generates description (max 300 characters)
- [ ] AI suggests appropriate category from predefined list
- [ ] User can edit all AI-generated content before publishing
- [ ] Fallback to manual entry if AI fails
- [ ] Progress indicator shows AI processing status

**Technical Requirements:**
- Integration with Amazon Nova Lite multimodal AI
- S3 presigned URL for secure photo upload
- Image compression and optimization
- Error handling for AI service failures
- Retry logic for transient failures

#### User Story 4.2.2: Listing Customization and Publishing

**As a** user creating a listing  
**I want to** review and edit AI suggestions before publishing  
**So that** the listing accurately represents my item  

**Acceptance Criteria:**
- [ ] Display AI suggestions in editable form fields
- [ ] Allow editing of title, description, and category
- [ ] Provide category dropdown with all available options
- [ ] Enable lottery window selection (3-24 hours, default 6)
- [ ] Show estimated lottery end time
- [ ] Validate all required fields before publishing
- [ ] Confirm successful listing creation
- [ ] Display listing in user's "My Items" section

**Technical Requirements:**
- Form validation and error handling
- Real-time character count for title/description
- Lottery end time calculation
- Database storage of listing data
- EventBridge Scheduler creation for lottery

#### User Story 4.2.3: AI Accuracy Feedback Loop

**As a** user who has published a listing  
**I want to** provide feedback on AI accuracy  
**So that** the system improves over time  

**Acceptance Criteria:**
- [ ] Optional feedback prompt after successful listing
- [ ] Simple thumbs up/down for AI accuracy
- [ ] Option to report specific inaccuracies
- [ ] Feedback stored for model improvement
- [ ] No impact on user experience if feedback skipped

**Technical Requirements:**
- Feedback data collection and storage
- Analytics tracking for AI accuracy metrics
- Integration with model improvement pipeline

### 4.3 Epic 2: Lottery-Based Distribution System

**Epic Description:** Implement fair lottery-based item distribution that gives all interested users equal opportunity to claim items, with automated winner selection and pickup coordination.

#### User Story 4.3.1: Enter Item Lottery

**As a** user interested in an item  
**I want to** enter a lottery for fair distribution  
**So that** I have an equal chance regardless of when I see the listing  

**Acceptance Criteria:**
- [ ] "Enter Lottery" button visible on available items
- [ ] Button shows countdown timer until lottery closes
- [ ] One-click entry with user authentication
- [ ] Confirmation message after successful entry
- [ ] Button changes to "You're in lottery ✓" after entry
- [ ] Cannot enter same lottery multiple times
- [ ] Lottery entry stored in database
- [ ] Email confirmation sent to user

**Technical Requirements:**
- DynamoDB lottery entry storage
- Real-time countdown timer implementation
- Duplicate entry prevention
- Email notification system
- User authentication verification

#### User Story 4.3.2: Automated Lottery Execution

**As a** system administrator  
**I want** lotteries to execute automatically at scheduled times  
**So that** winners are selected fairly without manual intervention  

**Acceptance Criteria:**
- [ ] EventBridge Scheduler triggers lottery at exact end time
- [ ] Random winner selection from all valid entries
- [ ] Item status updated to "Reserved"
- [ ] Winner notification sent via email and in-app
- [ ] Seller notification sent with winner contact info
- [ ] 24-hour reservation timer starts
- [ ] Backup lottery if no entries (re-list item)

**Technical Requirements:**
- EventBridge Scheduler integration
- Lambda function for lottery execution
- Cryptographically secure random selection
- SES email notification system
- Database transaction handling
- Error handling and retry logic

#### User Story 4.3.3: Winner Pickup Confirmation

**As a** lottery winner  
**I want to** confirm my pickup within 24 hours  
**So that** the seller knows I'm committed to collecting the item  

**Acceptance Criteria:**
- [ ] Winner sees "Confirm Pickup" button on reserved item
- [ ] 24-hour countdown timer displayed
- [ ] One-click confirmation process
- [ ] Confirmation enables messaging with seller
- [ ] Item status updated to "Pickup Confirmed"
- [ ] Seller receives confirmation notification
- [ ] Pickup coordination tools available

**Technical Requirements:**
- Reservation expiry tracking
- Status update workflow
- Messaging system activation
- Notification system integration
- Database consistency handling

#### User Story 4.3.4: Reservation Expiry and Re-listing

**As a** seller  
**I want** items to automatically re-list if winners don't confirm  
**So that** I don't lose the opportunity to give away my item  

**Acceptance Criteria:**
- [ ] Automatic re-listing if no confirmation within 24 hours
- [ ] Seller notification of expiry and re-listing
- [ ] New lottery window starts (default 6 hours)
- [ ] Previous lottery entries cleared
- [ ] Item returns to "Available" status
- [ ] New EventBridge schedule created

**Technical Requirements:**
- EventBridge Scheduler for expiry checking
- Lambda function for expiry handling
- Database cleanup of old lottery entries
- New lottery schedule creation
- Email notification system

---

## 5. Detailed Technical Specifications

### 5.1 AI-Powered Listing Flow Architecture

```
User Photo Upload Flow:
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   API Gateway    │    │ Upload Lambda   │
│                 │    │                  │    │                 │
│ 1. Take Photo   │───▶│ POST /upload-url │───▶│ Generate        │
│ 2. Compress     │    │                  │    │ Presigned URL   │
│ 3. Request URL  │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐             │
         │              │   S3 Bucket     │◀────────────┘
         │              │                 │
         └─────────────▶│ Direct Upload   │
                        │ (Presigned URL) │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │ Analyze Lambda  │
                        │                 │
                        │ 1. Get Photo    │◀───── API Gateway
                        │ 2. Call Nova    │       POST /analyze
                        │ 3. Generate     │
                        │    Response     │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │ Amazon Nova     │
                        │ Lite            │
                        │                 │
                        │ Multimodal AI   │
                        │ Analysis        │
                        └─────────────────┘
```

#### 5.1.1 Photo Upload Process

**Step 1: Presigned URL Generation**
```typescript
// Lambda: generatePresignedUrl.ts
export const handler = async (event: APIGatewayProxyEvent) => {
  const userId = getUserIdFromToken(event.headers.Authorization);
  const itemId = generateUUID();
  const key = `items/${itemId}/${generateUUID()}.jpg`;
  
  const presignedUrl = await s3Client.send(new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    ContentType: 'image/jpeg',
    Expires: 300, // 5 minutes
    Metadata: {
      userId,
      itemId
    }
  }));
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl: presignedUrl,
      photoKey: key,
      itemId
    })
  };
};
```

**Step 2: Direct S3 Upload**
```typescript
// Frontend: PhotoUpload.tsx
const uploadPhoto = async (file: File) => {
  // Get presigned URL
  const { uploadUrl, photoKey, itemId } = await apiClient.getUploadUrl();
  
  // Compress image if needed
  const compressedFile = await compressImage(file, { maxSizeMB: 5 });
  
  // Direct upload to S3
  await fetch(uploadUrl, {
    method: 'PUT',
    body: compressedFile,
    headers: { 'Content-Type': 'image/jpeg' }
  });
  
  return { photoKey, itemId };
};
```

#### 5.1.2 AI Analysis Process

**Nova Lite Integration**
```typescript
// Lambda: analyzeItem.ts
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export const handler = async (event: APIGatewayProxyEvent) => {
  const { photoKey } = JSON.parse(event.body);
  
  // Get photo from S3
  const photoBuffer = await getPhotoFromS3(photoKey);
  const base64Image = photoBuffer.toString('base64');
  
  // Prepare Nova Lite request
  const prompt = {
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64Image
            }
          },
          {
            type: 'text',
            text: `Analyze this household item photo and generate:
            1. Title (max 60 characters, descriptive)
            2. Description (max 300 characters, condition and features)
            3. Category (Kitchen, Furniture, Electronics, Books, Clothing, Toys, Other)
            
            Format as JSON:
            {
              "title": "...",
              "description": "...",
              "category": "..."
            }`
          }
        ]
      }
    ],
    max_tokens: 200,
    temperature: 0.3
  };
  
  // Call Nova Lite
  const response = await bedrockClient.send(new InvokeModelCommand({
    modelId: 'eu.amazon.nova-lite-v1:0',
    body: JSON.stringify(prompt),
    contentType: 'application/json'
  }));
  
  const result = JSON.parse(response.body.toString());
  const aiSuggestions = JSON.parse(result.content[0].text);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      photoUrl: `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${photoKey}`,
      aiSuggestions: {
        title: aiSuggestions.title.substring(0, 60),
        description: aiSuggestions.description.substring(0, 300),
        category: validateCategory(aiSuggestions.category)
      }
    })
  };
};
```

#### 5.1.3 Listing Creation Process

**Item Publishing**
```typescript
// Lambda: items.ts - createItem function
const createItem = async (event: APIGatewayProxyEvent) => {
  const userId = getUserIdFromToken(event.headers.Authorization);
  const { title, description, category, photoUrl, lotteryWindowHours } = JSON.parse(event.body);
  
  const itemId = generateUUID();
  const now = new Date().toISOString();
  const lotteryEndTime = new Date(Date.now() + (lotteryWindowHours * 60 * 60 * 1000)).toISOString();
  
  // Create item in DynamoDB
  const item = {
    PK: `ITEM#${itemId}`,
    SK: 'METADATA',
    GSI1PK: 'STATUS#Available',
    GSI1SK: now,
    GSI2PK: `CATEGORY#${category}#CITY#${userCity}`,
    GSI2SK: now,
    entityType: 'Item',
    itemId,
    sellerId: userId,
    title,
    description,
    category,
    photoUrl,
    status: 'Available',
    lotteryWindowHours,
    lotteryEndTime,
    createdAt: now,
    updatedAt: now
  };
  
  await dynamoClient.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: marshall(item)
  }));
  
  // Schedule lottery execution
  await scheduleClient.send(new CreateScheduleCommand({
    Name: `lottery-${itemId}`,
    ScheduleExpression: `at(${lotteryEndTime})`,
    Target: {
      Arn: process.env.LOTTERY_LAMBDA_ARN,
      Input: JSON.stringify({ itemId, action: 'executeLottery' })
    },
    FlexibleTimeWindow: { Mode: 'OFF' }
  }));
  
  return {
    statusCode: 201,
    body: JSON.stringify({
      itemId,
      status: 'Available',
      lotteryEndTime
    })
  };
};
```

### 5.2 Lottery System Architecture

```
Lottery Execution Flow:
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ EventBridge     │    │ Lottery Lambda   │    │   DynamoDB      │
│ Scheduler       │    │                  │    │                 │
│                 │    │ 1. Get Entries   │───▶│ Query Lottery   │
│ Triggers at     │───▶│ 2. Select Winner │    │ Entries         │
│ Lottery End     │    │ 3. Update Status │    │                 │
│                 │    │ 4. Send Emails   │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                       │
                       ┌─────────────────┐             │
                       │ Amazon SES      │             │
                       │                 │             │
                       │ Winner Email    │◀────────────┘
                       │ Seller Email    │
                       └─────────────────┘
                                │
                       ┌─────────────────┐
                       │ EventBridge     │
                       │ Scheduler       │
                       │                 │
                       │ Schedule        │
                       │ Expiry Check    │
                       │ (24 hours)      │
                       └─────────────────┘
```

#### 5.2.1 Lottery Entry Process

**Enter Lottery API**
```typescript
// Lambda: items.ts - enterLottery function
const enterLottery = async (event: APIGatewayProxyEvent) => {
  const userId = getUserIdFromToken(event.headers.Authorization);
  const { itemId } = event.pathParameters;
  
  // Check if item is available and lottery is open
  const item = await getItemById(itemId);
  if (item.status !== 'Available' || new Date() > new Date(item.lotteryEndTime)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Lottery is closed' })
    };
  }
  
  // Check if user already entered
  const existingEntry = await dynamoClient.send(new GetItemCommand({
    TableName: process.env.TABLE_NAME,
    Key: marshall({
      PK: `ITEM#${itemId}`,
      SK: `LOTTERY#${userId}`
    })
  }));
  
  if (existingEntry.Item) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Already entered lottery' })
    };
  }
  
  // Create lottery entry
  const lotteryEntry = {
    PK: `ITEM#${itemId}`,
    SK: `LOTTERY#${userId}`,
    entityType: 'LotteryEntry',
    itemId,
    userId,
    enteredAt: new Date().toISOString()
  };
  
  await dynamoClient.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: marshall(lotteryEntry)
  }));
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Successfully entered lottery',
      lotteryEndTime: item.lotteryEndTime
    })
  };
};
```

#### 5.2.2 Automated Lottery Execution

**Lottery Lambda Function**
```typescript
// Lambda: lottery.ts
export const handler = async (event: ScheduledEvent) => {
  const { itemId } = JSON.parse(event.detail.input);
  
  try {
    // Get all lottery entries
    const entries = await dynamoClient.send(new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: marshall({
        ':pk': `ITEM#${itemId}`,
        ':sk': 'LOTTERY#'
      })
    }));
    
    if (!entries.Items || entries.Items.length === 0) {
      // No entries - re-list item
      await relistItem(itemId);
      return;
    }
    
    // Select random winner
    const randomIndex = Math.floor(Math.random() * entries.Items.length);
    const winnerEntry = unmarshall(entries.Items[randomIndex]);
    const winnerId = winnerEntry.userId;
    
    // Update item status to Reserved
    const reservationExpiryTime = new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString();
    
    await dynamoClient.send(new UpdateItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: marshall({
        PK: `ITEM#${itemId}`,
        SK: 'METADATA'
      }),
      UpdateExpression: 'SET #status = :status, winnerUserId = :winnerId, reservationExpiryTime = :expiry, updatedAt = :now',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: marshall({
        ':status': 'Reserved',
        ':winnerId': winnerId,
        ':expiry': reservationExpiryTime,
        ':now': new Date().toISOString()
      })
    }));
    
    // Send notifications
    await sendWinnerNotification(itemId, winnerId);
    await sendSellerNotification(itemId, winnerId);
    
    // Schedule reservation expiry check
    await scheduleClient.send(new CreateScheduleCommand({
      Name: `expiry-${itemId}`,
      ScheduleExpression: `at(${reservationExpiryTime})`,
      Target: {
        Arn: process.env.EXPIRY_LAMBDA_ARN,
        Input: JSON.stringify({ itemId, action: 'checkExpiry' })
      },
      FlexibleTimeWindow: { Mode: 'OFF' }
    }));
    
  } catch (error) {
    console.error('Lottery execution failed:', error);
    // Could implement retry logic or alert system
  }
};
```

#### 5.2.3 Reservation Management

**Pickup Confirmation**
```typescript
// Lambda: items.ts - confirmPickup function
const confirmPickup = async (event: APIGatewayProxyEvent) => {
  const userId = getUserIdFromToken(event.headers.Authorization);
  const { itemId } = event.pathParameters;
  
  // Verify user is the winner
  const item = await getItemById(itemId);
  if (item.winnerUserId !== userId || item.status !== 'Reserved') {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Not authorized or item not reserved' })
    };
  }
  
  // Update status to Pickup Confirmed
  await dynamoClient.send(new UpdateItemCommand({
    TableName: process.env.TABLE_NAME,
    Key: marshall({
      PK: `ITEM#${itemId}`,
      SK: 'METADATA'
    }),
    UpdateExpression: 'SET #status = :status, updatedAt = :now',
    ExpressionAttributeNames: {
      '#status': 'status'
    },
    ExpressionAttributeValues: marshall({
      ':status': 'Pickup_Confirmed',
      ':now': new Date().toISOString()
    })
  }));
  
  // Enable messaging between seller and winner
  // Send confirmation notification to seller
  await sendPickupConfirmationNotification(itemId, item.sellerId);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Pickup confirmed',
      status: 'Pickup_Confirmed'
    })
  };
};
```

**Reservation Expiry Handler**
```typescript
// Lambda: reservation-expiry.ts
export const handler = async (event: ScheduledEvent) => {
  const { itemId } = JSON.parse(event.detail.input);
  
  try {
    // Check current item status
    const item = await getItemById(itemId);
    
    if (item.status === 'Pickup_Confirmed' || item.status === 'Picked_Up') {
      // Winner confirmed - no action needed
      return;
    }
    
    if (item.status === 'Reserved') {
      // Winner didn't confirm - re-list item
      await dynamoClient.send(new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: marshall({
          PK: `ITEM#${itemId}`,
          SK: 'METADATA'
        }),
        UpdateExpression: 'SET #status = :status, winnerUserId = :null, reservationExpiryTime = :null, lotteryEndTime = :newLotteryEnd, updatedAt = :now',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: marshall({
          ':status': 'Available',
          ':null': null,
          ':newLotteryEnd': new Date(Date.now() + (6 * 60 * 60 * 1000)).toISOString(), // 6 hours
          ':now': new Date().toISOString()
        })
      }));
      
      // Clean up old lottery entries
      await cleanupLotteryEntries(itemId);
      
      // Schedule new lottery
      const newLotteryEnd = new Date(Date.now() + (6 * 60 * 60 * 1000)).toISOString();
      await scheduleClient.send(new CreateScheduleCommand({
        Name: `lottery-${itemId}-${Date.now()}`,
        ScheduleExpression: `at(${newLotteryEnd})`,
        Target: {
          Arn: process.env.LOTTERY_LAMBDA_ARN,
          Input: JSON.stringify({ itemId, action: 'executeLottery' })
        },
        FlexibleTimeWindow: { Mode: 'OFF' }
      }));
      
      // Notify seller of re-listing
      await sendRelistingNotification(itemId, item.sellerId);
    }
    
  } catch (error) {
    console.error('Expiry check failed:', error);
  }
};
```
