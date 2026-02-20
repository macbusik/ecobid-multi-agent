# Requirements Document: EcoBid Marketplace

## Introduction

EcoBid is a mobile-first AI-powered marketplace for free household item giveaways, designed for the AWS 10,000 AIdeas competition. The system enables users to effortlessly list items using multimodal AI (photo recognition and text generation) and implements a fair lottery-based reservation system to distribute items equitably. The platform promotes circular economy principles and waste reduction while staying within AWS Free Tier limits.

## Glossary

- **System**: The EcoBid marketplace application (frontend + backend + AI services)
- **Seller**: A user who posts an item to give away for free
- **Buyer**: A user who expresses interest in claiming a free item
- **Item**: A household object being given away (Kitchen, Furniture, Electronics, Books, Clothing, Toys, Other)
- **Lottery_Window**: The time period during which buyers can enter to claim an item (3-12 hours, default 6 hours)
- **Reservation**: The state when a buyer has won the lottery and has 24 hours to confirm pickup
- **AI_Service**: Amazon Rekognition for object detection and Amazon Bedrock (Claude Haiku) for text generation
- **EventBridge_Scheduler**: AWS service that triggers Lambda functions at scheduled times
- **DynamoDB_Table**: Single-table design database storing all application data
- **S3_Bucket**: Storage for item photos
- **Cognito_User_Pool**: Authentication service for user management
- **API_Gateway**: HTTP API endpoint for frontend-backend communication

## Requirements

### Requirement 1: User Authentication

**User Story:** As a user, I want to create an account and log in securely, so that I can list items and claim items with a verified identity.

#### Acceptance Criteria

1. THE System SHALL provide email and password registration using Cognito_User_Pool
2. WHEN a user registers, THE System SHALL require email, password, name, and city location
3. WHEN a user logs in with valid credentials, THE System SHALL return an authentication token valid for 24 hours
4. WHEN a user logs in with invalid credentials, THE System SHALL return an authentication error
5. THE System SHALL store user profile data in DynamoDB_Table including name, city, items_given_count, items_received_count, and reputation_score

### Requirement 2: AI-Powered Item Listing Creation

**User Story:** As a seller, I want to upload a photo and have the system automatically generate a title and description, so that I can list items in under 30 seconds.

#### Acceptance Criteria

1. WHEN a seller uploads a photo, THE System SHALL store the image in S3_Bucket with a unique identifier
2. WHEN a photo is uploaded, THE System SHALL invoke AI_Service to detect the primary object using Amazon Rekognition
3. WHEN object detection completes, THE System SHALL invoke AI_Service to generate a title and description using Amazon Bedrock Claude Haiku
4. WHEN AI generation completes, THE System SHALL suggest a category from the list: Kitchen, Furniture, Electronics, Books, Clothing, Toys, Other
5. THE System SHALL allow the seller to edit the AI-generated title, description, and category before publishing
6. WHEN a seller publishes an item, THE System SHALL create an item record in DynamoDB_Table with status "Available"
7. WHEN a seller publishes an item, THE System SHALL set the default Lottery_Window to 6 hours
8. THE System SHALL allow the seller to customize the Lottery_Window between 3 and 12 hours before publishing

### Requirement 3: Browse and Search Items

**User Story:** As a buyer, I want to browse available items and search by keyword or category, so that I can find items I need.

#### Acceptance Criteria

1. THE System SHALL display a mobile-first feed of items with status "Available"
2. WHEN displaying items, THE System SHALL show the photo, title, category, city location, and remaining Lottery_Window time
3. THE System SHALL provide category filter options: All, Kitchen, Furniture, Electronics, Books, Clothing, Toys, Other
4. WHEN a buyer selects a category filter, THE System SHALL display only items matching that category
5. THE System SHALL provide a keyword search input field
6. WHEN a buyer enters a search keyword, THE System SHALL return items where the keyword matches the title or description
7. WHEN a buyer taps an item, THE System SHALL display the full item details page with photo, title, description, category, seller city, and Lottery_Window status

### Requirement 4: Lottery-Based Reservation System

**User Story:** As a buyer, I want to enter a lottery for an item I'm interested in, so that I have a fair chance to claim it even if many people want it.

#### Acceptance Criteria

1. WHEN a buyer views an item with status "Available", THE System SHALL display an "I'm Interested" button
2. WHEN a buyer taps "I'm Interested", THE System SHALL add the buyer to the lottery entries list in DynamoDB_Table
3. WHEN a buyer has already entered the lottery for an item, THE System SHALL display "You're in the lottery" instead of the button
4. WHEN the Lottery_Window expires, THE EventBridge_Scheduler SHALL trigger a Lambda function to select a winner
5. WHEN selecting a winner, THE System SHALL randomly choose one buyer from all lottery entries with equal probability
6. WHEN a winner is selected, THE System SHALL update the item status to "Reserved" in DynamoDB_Table
7. WHEN a winner is selected, THE System SHALL store the winner_user_id and reservation_expiry_time (24 hours from selection) in DynamoDB_Table
8. WHEN a winner is selected, THE System SHALL send an email notification to the winner with item details and pickup instructions
9. WHEN a winner is selected, THE System SHALL send an email notification to the seller with winner contact information

### Requirement 5: Reservation Confirmation and Expiry

**User Story:** As a winner, I want to confirm that I will pick up the item within 24 hours, so that the seller knows I'm committed.

#### Acceptance Criteria

1. WHEN a winner views a reserved item, THE System SHALL display a "Confirm Pickup" button
2. WHEN a winner taps "Confirm Pickup", THE System SHALL update the item status to "Pickup_Confirmed" in DynamoDB_Table
3. WHEN a winner confirms pickup, THE System SHALL enable in-app messaging between the winner and seller
4. WHEN the reservation_expiry_time is reached and the winner has not confirmed, THE EventBridge_Scheduler SHALL trigger a Lambda function
5. WHEN the reservation expires without confirmation, THE System SHALL update the item status to "Expired" in DynamoDB_Table
6. WHEN an item expires, THE System SHALL send an email notification to the seller that the item is back to available status
7. THE System SHALL allow the seller to manually mark an item as "Picked_Up" after successful handoff

### Requirement 6: In-App Messaging for Pickup Coordination

**User Story:** As a seller and winner, I want to exchange messages to coordinate pickup details, so that we can arrange a convenient time and location.

#### Acceptance Criteria

1. WHEN an item status is "Pickup_Confirmed", THE System SHALL enable a messaging interface between seller and winner
2. WHEN a user sends a message, THE System SHALL store the message in DynamoDB_Table with sender_id, recipient_id, item_id, message_text, and timestamp
3. WHEN a user opens the messaging interface, THE System SHALL display all messages for that item ordered by timestamp
4. THE System SHALL limit message_text to 500 characters maximum
5. THE System SHALL send an email notification when a new message is received

### Requirement 7: Item Status Lifecycle Management

**User Story:** As the system, I want to manage item status transitions automatically, so that items move through the correct workflow states.

#### Acceptance Criteria

1. WHEN an item is created, THE System SHALL set status to "Available"
2. WHEN the Lottery_Window expires, THE System SHALL set status to "Lottery_Closed"
3. WHEN a winner is selected, THE System SHALL set status to "Reserved"
4. WHEN a winner confirms pickup, THE System SHALL set status to "Pickup_Confirmed"
5. WHEN a seller marks handoff complete, THE System SHALL set status to "Picked_Up"
6. WHEN a reservation expires without confirmation, THE System SHALL set status to "Expired"
7. WHEN an item status is "Expired", THE System SHALL allow the seller to re-list the item, which creates a new item record with status "Available"

### Requirement 8: User Profile and Reputation

**User Story:** As a user, I want to see my giving and receiving history, so that I can track my participation in the circular economy.

#### Acceptance Criteria

1. THE System SHALL display a user profile page showing name, city, items_given_count, items_received_count, and reputation_score
2. WHEN a seller's item reaches status "Picked_Up", THE System SHALL increment the seller's items_given_count by 1
3. WHEN a buyer's claimed item reaches status "Picked_Up", THE System SHALL increment the buyer's items_received_count by 1
4. THE System SHALL calculate reputation_score as items_given_count plus items_received_count
5. THE System SHALL display the user's reputation_score on their profile and next to their name in item listings

### Requirement 9: AWS Free Tier Compliance

**User Story:** As the system operator, I want to ensure all AWS services stay within Free Tier limits, so that the application incurs zero cost during the competition period.

#### Acceptance Criteria

1. THE System SHALL use Lambda functions with ARM64 architecture for cost efficiency
2. THE System SHALL use DynamoDB with On-Demand billing mode
3. THE System SHALL limit DynamoDB storage to 25GB maximum
4. THE System SHALL use S3 Standard storage class for photos
5. THE System SHALL limit Amazon Rekognition usage to 5000 images per month
6. THE System SHALL use Amazon Bedrock Claude Haiku model for text generation
7. THE System SHALL use API Gateway HTTP API instead of REST API
8. THE System SHALL use Cognito User Pool within Free Tier limits (50000 monthly active users)
9. THE System SHALL use EventBridge Scheduler within Free Tier limits

### Requirement 10: Mobile-First Responsive Design

**User Story:** As a user, I want the application to work seamlessly on my mobile phone, so that I can list and claim items on the go.

#### Acceptance Criteria

1. THE System SHALL render all pages with mobile-first layout as the default
2. THE System SHALL use Tailwind CSS responsive prefixes to scale up for tablet and desktop views
3. WHEN displaying images, THE System SHALL optimize photo dimensions for mobile screens
4. THE System SHALL ensure all interactive elements have touch-friendly tap targets (minimum 44x44 pixels)
5. THE System SHALL load pages within 3 seconds on a 4G mobile connection

### Requirement 11: Photo Upload and Storage

**User Story:** As a seller, I want to upload a photo from my phone camera or gallery, so that buyers can see what I'm giving away.

#### Acceptance Criteria

1. THE System SHALL provide a photo upload interface that accepts JPEG and PNG formats
2. THE System SHALL limit photo file size to 5MB maximum
3. WHEN a photo exceeds 5MB, THE System SHALL display an error message and prevent upload
4. WHEN a photo is uploaded, THE System SHALL generate a unique filename using UUID
5. THE System SHALL store photos in S3_Bucket with public read access
6. THE System SHALL return a public URL for the uploaded photo
7. WHEN displaying photos, THE System SHALL use the S3 public URL as the image source

### Requirement 12: Error Handling and User Feedback

**User Story:** As a user, I want clear error messages when something goes wrong, so that I understand what happened and what to do next.

#### Acceptance Criteria

1. WHEN an API request fails, THE System SHALL return a structured error response with error_code and error_message
2. WHEN AI_Service fails to detect an object, THE System SHALL allow the seller to manually enter title and description
3. WHEN AI_Service fails to generate text, THE System SHALL display an error message and allow manual entry
4. WHEN a photo upload fails, THE System SHALL display an error message with retry option
5. WHEN a user attempts an unauthorized action, THE System SHALL return a 403 error with clear explanation
6. WHEN a database operation fails, THE System SHALL log the error and display a generic user-friendly message
