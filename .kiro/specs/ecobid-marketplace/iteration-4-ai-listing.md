# Iteration 4: AI-Powered Item Listing

**Status:** Planning  
**Priority:** P0 (Core MVP Feature)  
**Estimated Time:** 5-7 days  
**Last Updated:** 2026-02-24

---

## Executive Summary

This iteration implements the **core differentiator** of EcoBid: AI-powered item listing that allows sellers to create a complete listing in under 30 seconds by simply uploading a photo. The system uses Amazon Rekognition for object detection and Amazon Bedrock (Claude Haiku) for generating human-quality titles and descriptions.

**User Flow:**
1. Seller uploads photo → 2. AI analyzes image → 3. AI generates title/description/category → 4. Seller reviews/edits → 5. Publish

**Target Performance:**
- Photo upload: <3 seconds
- AI processing: <10 seconds (Rekognition + Bedrock combined)
- Total time to publish: <30 seconds

---

## Business Goals

### Primary Goals
1. **Reduce listing friction:** Enable item creation in <30 seconds (vs 3-5 minutes manual)
2. **Improve listing quality:** AI-generated descriptions are consistent and detailed
3. **Showcase AWS AI:** Demonstrate Rekognition + Bedrock integration for competition
4. **Stay Free Tier compliant:** Use Claude Haiku (cheapest model) and optimize API calls

### Success Metrics
- 90%+ of sellers use AI-generated content without major edits
- Average listing time <30 seconds
- AI accuracy: 80%+ correct category suggestions
- Cost: <$0.10 per listing (Bedrock tokens)

---

## User Stories

### US-4.1: Photo Upload with Preview
**As a seller**, I want to upload a photo from my device and see a preview, so that I can verify the image before AI processing.

**Acceptance Criteria:**
- [ ] Upload button accepts JPEG/PNG files up to 5MB
- [ ] Image preview displays immediately after selection
- [ ] User can replace photo before submitting
- [ ] Mobile camera integration works (capture or select from gallery)
- [ ] Error message if file is too large or wrong format

---

### US-4.2: AI Object Detection
**As a seller**, I want the system to automatically detect what's in my photo, so that I don't have to manually describe it.

**Acceptance Criteria:**
- [ ] System uploads photo to S3 with unique key: `items/{userId}/{timestamp}-{uuid}.jpg`
- [ ] System calls Amazon Rekognition `DetectLabels` API
- [ ] System extracts top 5 labels with confidence >70%
- [ ] System handles Rekognition errors gracefully (fallback to manual entry)
- [ ] System logs Rekognition response for debugging

**Technical Details:**
```typescript
// Rekognition API Call
const rekognitionClient = new RekognitionClient({ region: 'us-east-1' });
const command = new DetectLabelsCommand({
  Image: { S3Object: { Bucket: bucketName, Name: s3Key } },
  MaxLabels: 10,
  MinConfidence: 70
});
const response = await rekognitionClient.send(command);
// Extract labels: response.Labels[].Name
```

---

### US-4.3: AI Title & Description Generation
**As a seller**, I want the system to generate a compelling title and description from my photo, so that I don't have to write marketing copy.

**Acceptance Criteria:**
- [ ] System sends Rekognition labels to Amazon Bedrock (Claude Haiku)
- [ ] System uses structured prompt to generate JSON output
- [ ] Generated title is 5-10 words, catchy and descriptive
- [ ] Generated description is 2-3 sentences, highlights condition and use cases
- [ ] System suggests category from: Kitchen, Furniture, Electronics, Books, Clothing, Toys, Other
- [ ] System handles Bedrock errors gracefully (fallback to manual entry)
- [ ] Response time <10 seconds for Rekognition + Bedrock combined

**Bedrock Prompt Template:**
```
You are an expert at writing marketplace listings for free household items.

Based on these detected objects in a photo: {labels}

Generate a listing in JSON format:
{
  "title": "5-10 word catchy title",
  "description": "2-3 sentences describing the item, its condition, and potential uses",
  "category": "one of: Kitchen, Furniture, Electronics, Books, Clothing, Toys, Other"
}

Guidelines:
- Title should be specific and appealing (e.g., "Vintage Wooden Coffee Table" not "Table")
- Description should mention condition (e.g., "gently used", "like new")
- Description should suggest use cases (e.g., "perfect for small apartments")
- Category should be the best fit from the list
- Keep tone friendly and casual

Return ONLY valid JSON, no other text.
```

**Technical Details:**
```typescript
// Bedrock API Call
const bedrockClient = new BedrockRuntimeClient({ region: 'us-east-1' });
const command = new InvokeModelCommand({
  modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
  contentType: 'application/json',
  accept: 'application/json',
  body: JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: prompt
    }]
  })
});
const response = await bedrockClient.send(command);
// Parse JSON from response.body
```

---

### US-4.4: Review & Edit AI Suggestions
**As a seller**, I want to review and edit the AI-generated content before publishing, so that I can correct any mistakes or add personal details.

**Acceptance Criteria:**
- [ ] Form displays AI-generated title, description, and category
- [ ] All fields are editable text inputs
- [ ] User can change category via dropdown
- [ ] User can add/edit city location (pre-filled from profile)
- [ ] User can set lottery window (3-12 hours, default 6)
- [ ] Form validation: title required (5-100 chars), description required (10-500 chars)
- [ ] "Publish" button disabled until validation passes

---

### US-4.5: Publish Item Listing
**As a seller**, I want to publish my listing so that buyers can see it and enter the lottery.

**Acceptance Criteria:**
- [ ] System creates item record in DynamoDB with status "Available"
- [ ] System calculates lottery_end_time = now + lottery_window_hours
- [ ] System stores S3 photo URL in item record
- [ ] System increments user's active_listings_count
- [ ] System redirects to item detail page after publish
- [ ] Success toast: "Item published! Lottery closes in X hours"

**DynamoDB Item Record:**
```typescript
{
  PK: 'ITEM#item-{uuid}',
  SK: 'METADATA',
  GSI1PK: 'STATUS#Available',
  GSI1SK: 'TIMESTAMP#{iso-timestamp}',
  GSI2PK: 'CATEGORY#{category}',
  GSI2SK: 'CITY#{city}#TIMESTAMP#{iso-timestamp}',
  itemId: 'item-{uuid}',
  sellerId: 'user-{uuid}',
  title: 'AI-generated or edited title',
  description: 'AI-generated or edited description',
  category: 'Kitchen|Furniture|Electronics|Books|Clothing|Toys|Other',
  city: 'New York',
  photoUrl: 'https://s3.amazonaws.com/bucket/items/...',
  status: 'Available',
  lotteryEndTime: '2026-02-25T12:00:00Z',
  createdAt: '2026-02-24T18:00:00Z',
  updatedAt: '2026-02-24T18:00:00Z',
  aiGenerated: true,
  rekognitionLabels: ['Chair', 'Furniture', 'Wood'],
}
```

---

### US-4.6: Fallback to Manual Entry
**As a seller**, if AI processing fails, I want to manually enter item details, so that I can still list my item.

**Acceptance Criteria:**
- [ ] If Rekognition fails, show error toast: "AI processing failed. Please enter details manually."
- [ ] If Bedrock fails, show error toast: "AI generation failed. Please enter details manually."
- [ ] Form switches to manual mode with empty fields
- [ ] User can still upload photo and fill in title/description/category manually
- [ ] System logs AI failures to CloudWatch for monitoring

---

## Technical Architecture

### Frontend Components

```
app/items/create/
├── page.tsx                    # Main create item page (Server Component)
└── components/
    ├── PhotoUpload.tsx         # Photo selection + preview (Client Component)
    ├── AIProcessing.tsx        # Loading state during AI processing
    ├── ItemForm.tsx            # Editable form with AI suggestions (Client Component)
    └── PublishButton.tsx       # Submit button with validation
```

### Backend Lambda Functions

```
lib/lambda/handlers/
├── createItem.ts               # Main handler (orchestrates AI + DB)
├── generatePresignedUrl.ts     # S3 presigned URL for photo upload
└── shared/
    ├── rekognition.ts          # Rekognition API wrapper
    ├── bedrock.ts              # Bedrock API wrapper
    └── s3.ts                   # S3 upload helpers
```

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/items/upload-url` | Required | Generate S3 presigned URL for photo upload |
| POST | `/items/analyze` | Required | Trigger AI analysis (Rekognition + Bedrock) |
| POST | `/items` | Required | Create item record in DynamoDB |
| GET | `/items/{itemId}` | Optional | Get item details |
| PUT | `/items/{itemId}` | Required | Update item (seller only) |
| DELETE | `/items/{itemId}` | Required | Delete item (seller only) |

---

## API Contracts

### POST /items/upload-url
**Request:**
```json
{
  "fileName": "photo.jpg",
  "fileType": "image/jpeg"
}
```

**Response (200):**
```json
{
  "uploadUrl": "https://s3.amazonaws.com/bucket/items/user-123/1234567890-abc.jpg?X-Amz-...",
  "s3Key": "items/user-123/1234567890-abc.jpg",
  "expiresIn": 300
}
```

---

### POST /items/analyze
**Request:**
```json
{
  "s3Key": "items/user-123/1234567890-abc.jpg"
}
```

**Response (200):**
```json
{
  "title": "Vintage Wooden Coffee Table",
  "description": "Beautiful solid wood coffee table in excellent condition. Perfect for living rooms or as a statement piece in small apartments. Minor wear adds character.",
  "category": "Furniture",
  "rekognitionLabels": ["Table", "Furniture", "Wood", "Indoors", "Room"],
  "confidence": 0.92
}
```

**Response (500 - AI Failure):**
```json
{
  "error": "AI_PROCESSING_FAILED",
  "message": "Unable to analyze image. Please enter details manually.",
  "fallbackMode": true
}
```

---

### POST /items
**Request:**
```json
{
  "title": "Vintage Wooden Coffee Table",
  "description": "Beautiful solid wood coffee table...",
  "category": "Furniture",
  "city": "New York",
  "photoUrl": "https://s3.amazonaws.com/bucket/items/user-123/1234567890-abc.jpg",
  "lotteryWindowHours": 6,
  "aiGenerated": true,
  "rekognitionLabels": ["Table", "Furniture", "Wood"]
}
```

**Response (201):**
```json
{
  "itemId": "item-abc123",
  "status": "Available",
  "lotteryEndTime": "2026-02-25T00:00:00Z",
  "createdAt": "2026-02-24T18:00:00Z"
}
```

---

## AWS Service Integration

### Amazon Rekognition
**Service:** `rekognition.DetectLabels`  
**Free Tier:** 5,000 images/month  
**Cost After Free Tier:** $1.00 per 1,000 images  
**Expected Usage:** ~100 images/month (well within free tier)

**Configuration:**
- MaxLabels: 10
- MinConfidence: 70%
- Features: Labels only (no faces, text, or moderation)

---

### Amazon Bedrock (Claude Haiku)
**Model ID:** `anthropic.claude-3-haiku-20240307-v1:0`  
**Pricing:** $0.25 per 1M input tokens, $1.25 per 1M output tokens  
**Expected Cost:** ~$0.05 per listing (200 input tokens + 100 output tokens)  
**Monthly Cost (100 listings):** ~$5.00

**Why Claude Haiku:**
- Cheapest Bedrock model
- Fast response time (<3 seconds)
- Good at structured JSON output
- Sufficient quality for marketplace listings

**Token Optimization:**
- Keep prompt concise (<200 tokens)
- Limit output to 300 tokens max
- Use structured JSON format (no markdown)

---

### S3 Photo Storage
**Bucket Structure:**
```
ecobid-items-{accountId}/
├── items/
│   ├── user-123/
│   │   ├── 1234567890-abc.jpg
│   │   └── 1234567891-def.jpg
│   └── user-456/
│       └── 1234567892-ghi.jpg
```

**Lifecycle Policy:**
- Delete photos after 90 days if item status is "Picked_Up" or "Expired"
- Keep photos indefinitely for active items

**Access Control:**
- Public read access for all photos (CloudFront CDN)
- Presigned URLs for uploads (5-minute expiry)

---

## Error Handling & Fallbacks

### Scenario 1: Rekognition Fails
**Cause:** Invalid image format, corrupted file, service outage  
**Fallback:** Show manual entry form with error message  
**User Impact:** Minimal - user can still create listing manually

### Scenario 2: Bedrock Fails
**Cause:** Rate limit, service outage, invalid response  
**Fallback:** Show manual entry form with Rekognition labels as hints  
**User Impact:** Minimal - user can still create listing manually

### Scenario 3: S3 Upload Fails
**Cause:** Network error, presigned URL expired  
**Fallback:** Retry upload with new presigned URL  
**User Impact:** 5-10 second delay, automatic retry

### Scenario 4: DynamoDB Write Fails
**Cause:** Service outage, validation error  
**Fallback:** Show error toast, keep form data, allow retry  
**User Impact:** User must retry publish

---

## Performance Requirements

| Operation | Target | Max Acceptable |
|-----------|--------|----------------|
| Photo upload to S3 | <3s | <5s |
| Rekognition analysis | <2s | <5s |
| Bedrock generation | <5s | <10s |
| DynamoDB write | <200ms | <500ms |
| **Total listing time** | **<15s** | **<30s** |

---

## Security Considerations

### Photo Upload Security
- [ ] Validate file type (JPEG/PNG only) on frontend and backend
- [ ] Limit file size to 5MB
- [ ] Generate unique S3 keys to prevent overwrites
- [ ] Use presigned URLs with 5-minute expiry
- [ ] Scan for malicious content (future: use Rekognition Moderation)

### API Authorization
- [ ] All endpoints require valid Cognito JWT token
- [ ] Verify userId from JWT matches request userId
- [ ] Sellers can only edit/delete their own items
- [ ] Rate limiting: 10 listings per user per day

### Data Privacy
- [ ] Do not send user PII to Bedrock (only image labels)
- [ ] Log AI requests without sensitive data
- [ ] Store Rekognition labels for debugging only

---

## Testing Strategy

### Unit Tests
- [ ] Rekognition API wrapper (mock AWS SDK)
- [ ] Bedrock API wrapper (mock AWS SDK)
- [ ] S3 presigned URL generation
- [ ] DynamoDB item creation
- [ ] Input validation (file type, size, title length)

### Integration Tests
- [ ] End-to-end flow: upload → analyze → publish
- [ ] Fallback to manual entry on AI failure
- [ ] Photo upload with real S3 bucket
- [ ] Rekognition with sample images
- [ ] Bedrock with sample prompts

### Manual Testing Checklist
- [ ] Upload photo from mobile camera
- [ ] Upload photo from desktop file picker
- [ ] Verify AI-generated title is accurate
- [ ] Verify AI-generated description is coherent
- [ ] Verify category suggestion is correct
- [ ] Edit AI suggestions and publish
- [ ] Test fallback when AI fails
- [ ] Test with various item types (furniture, electronics, clothing)
- [ ] Test with edge cases (blurry photos, multiple objects)

---

## Deployment Plan

### Phase 1: Backend Infrastructure (Day 1-2)
1. Add Rekognition and Bedrock permissions to Lambda IAM role
2. Create S3 bucket with public read access
3. Implement `generatePresignedUrl` Lambda
4. Implement `analyzeItem` Lambda (Rekognition + Bedrock)
5. Implement `createItem` Lambda (DynamoDB write)
6. Deploy and test with Postman/curl

### Phase 2: Frontend UI (Day 3-4)
1. Create `/items/create` page
2. Implement PhotoUpload component
3. Implement AIProcessing loading state
4. Implement ItemForm with editable fields
5. Integrate with backend APIs
6. Add error handling and fallbacks

### Phase 3: Testing & Polish (Day 5)
1. End-to-end testing on mobile and desktop
2. Test with 10+ different item photos
3. Verify AI accuracy and performance
4. Fix bugs and edge cases
5. Add analytics logging

### Phase 4: Production Deployment (Day 6)
1. Deploy backend to production
2. Build and deploy frontend to S3/CloudFront
3. Monitor CloudWatch logs for errors
4. Test on production with real users

---

## Rollback Plan

If critical issues are found in production:

```bash
# Rollback backend
cd infrastructure
git revert HEAD~1
cdk deploy

# Rollback frontend
cd frontend
git revert HEAD~1
npm run build
aws s3 sync out/ s3://ecobid-frontend-{accountId}/ --delete
aws cloudfront create-invalidation --distribution-id {distId} --paths "/*"
```

**Rollback Triggers:**
- AI processing fails >50% of the time
- Photo uploads fail >20% of the time
- Page crashes or becomes unusable
- Cost exceeds $10/day (Bedrock runaway)

---

## Monitoring & Alerts

### CloudWatch Metrics
- [ ] Rekognition API call count (daily)
- [ ] Bedrock API call count (daily)
- [ ] Bedrock token usage (daily)
- [ ] S3 upload success rate
- [ ] AI processing duration (p50, p95, p99)
- [ ] Fallback to manual entry rate

### CloudWatch Alarms
- [ ] Rekognition errors >10% in 5 minutes
- [ ] Bedrock errors >10% in 5 minutes
- [ ] S3 upload errors >20% in 5 minutes
- [ ] Bedrock cost >$1/hour

### Cost Monitoring
- [ ] Daily Bedrock cost report
- [ ] Weekly Free Tier usage report
- [ ] Alert if approaching Free Tier limits

---

## Future Enhancements (Out of Scope for Iteration 4)

### V2 Features
- [ ] Multi-photo upload (up to 5 photos per item)
- [ ] AI-powered photo quality check (blur detection, lighting)
- [ ] AI-generated tags for better search
- [ ] AI-powered category auto-tagging (no manual selection)
- [ ] AI moderation (detect inappropriate content)
- [ ] Batch listing (upload multiple items at once)

### Cost Optimization
- [ ] Cache common Rekognition labels (e.g., "Chair" → "Furniture")
- [ ] Use Bedrock batch inference for multiple items
- [ ] Compress photos before upload (reduce S3 storage)

---

## Success Criteria

This iteration is considered successful when:

- [x] Seller can upload photo and get AI suggestions in <30 seconds
- [x] AI-generated titles are accurate 80%+ of the time
- [x] AI-generated descriptions are coherent and helpful
- [x] Category suggestions are correct 80%+ of the time
- [x] Fallback to manual entry works seamlessly
- [x] All endpoints respond in <500ms (excluding AI processing)
- [x] Cost per listing is <$0.10
- [x] Zero production errors for 24 hours after launch

---

## Related Documents
- [Requirements](./requirements.md) - See Requirement 2 (AI-Powered Item Listing)
- [Design](./design.md) - See Section 1.1 (AI Services Architecture)
- [Tasks](./tasks.md) - See ITER4-* tasks for detailed implementation steps
- [Product Roadmap](./product-roadmap.md) - See Iteration 4 overview
