import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { putItem, getItem, query, updateItem } from '../shared/dynamodb';
import { uploadImage } from '../shared/s3';
import { successResponse, errorResponse } from '../shared/response';
import { Item, ItemStatus, ItemCategory, LotteryEntry } from '../shared/types';

/**
 * Items Lambda Handler
 * Handles all item-related operations for EcoBid marketplace.
 */
export async function handler(event: any): Promise<APIGatewayProxyResult> {
  try {
    console.log('Event:', JSON.stringify(event, null, 2));
    // HTTP API v2 uses different event structure
    const method = event.requestContext?.http?.method || event.httpMethod;
    const path = event.requestContext?.http?.path || event.path;
    const pathParams = event.pathParameters || {};
    console.log('Method:', method, 'Path:', path, 'PathParams:', pathParams);

    // Route to appropriate handler
    if (method === 'POST' && path === '/items') {
      return await createItem(event);
    } else if (method === 'PUT' && pathParams.itemId) {
      return await updateItemDetails(event, pathParams.itemId);
    } else if (method === 'GET' && pathParams.itemId) {
      return await getItemById(event, pathParams.itemId);
    } else if (method === 'GET' && path === '/items') {
      return await listItems(event);
    } else if (method === 'POST' && path.includes('/lottery')) {
      return await enterLottery(event, pathParams.itemId!);
    } else if (method === 'POST' && path.includes('/confirm-pickup')) {
      return await confirmPickup(event, pathParams.itemId!);
    } else if (method === 'POST' && path.includes('/mark-picked-up')) {
      return await markPickedUp(event, pathParams.itemId!);
    }

    return errorResponse('Route not found', 404);
  } catch (error: any) {
    console.error('Error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}

/**
 * POST /items - Create new item with photo upload and AI generation
 */
async function createItem(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body || '{}');
  const { photoBase64, lotteryWindowHours } = body;
  const userId = event.requestContext.authorizer?.claims?.sub;

  if (!photoBase64 || !lotteryWindowHours) {
    return errorResponse('Missing required fields: photoBase64, lotteryWindowHours', 400);
  }

  // Upload photo to S3
  const itemId = randomUUID();
  const photoKey = `items/${itemId}/${Date.now()}.jpg`;
  const photoBuffer = Buffer.from(photoBase64, 'base64');
  const photoUrl = await uploadImage(photoKey, photoBuffer, 'image/jpeg');

  // TODO: Invoke Rekognition for image analysis
  // TODO: Invoke Bedrock for AI-generated title and description
  
  // For now, return mock AI suggestions
  const aiSuggestions = {
    title: 'Item from photo',
    description: 'AI-generated description will appear here',
    category: 'Other' as ItemCategory,
  };

  // Create draft item
  const now = new Date().toISOString();
  const lotteryCloseTime = new Date(Date.now() + lotteryWindowHours * 60 * 60 * 1000).toISOString();

  const item: Item = {
    PK: `ITEM#${itemId}`,
    SK: 'METADATA',
    itemId,
    sellerId: userId,
    title: aiSuggestions.title,
    description: aiSuggestions.description,
    category: aiSuggestions.category,
    photoUrl,
    city: '', // Will be set on publish
    status: 'Draft',
    lotteryWindowHours,
    lotteryCloseTime,
    createdAt: now,
    updatedAt: now,
    GSI1PK: `STATUS#Draft`,
    GSI1SK: now,
    GSI2PK: `CATEGORY#Other#CITY#`,
    GSI2SK: now,
  };

  await putItem(item);

  return successResponse({ itemId, photoUrl, aiSuggestions }, 201);
}

/**
 * PUT /items/{itemId} - Update item details and publish
 */
async function updateItemDetails(event: APIGatewayProxyEvent, itemId: string): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body || '{}');
  const { title, description, category, city } = body;
  const userId = event.requestContext.authorizer?.claims?.sub;

  // Get existing item
  const existingItem = await getItem(`ITEM#${itemId}`, 'METADATA');
  if (!existingItem) {
    return errorResponse('Item not found', 404);
  }

  if (existingItem.sellerId !== userId) {
    return errorResponse('Unauthorized', 403);
  }

  // Update item and publish
  const now = new Date().toISOString();
  const updatedItem = await updateItem(
    `ITEM#${itemId}`,
    'METADATA',
    'SET title = :title, description = :description, category = :category, city = :city, #status = :status, updatedAt = :updatedAt, GSI1PK = :gsi1pk, GSI2PK = :gsi2pk',
    {
      ':title': title,
      ':description': description,
      ':category': category,
      ':city': city,
      ':status': 'Available',
      ':updatedAt': now,
      ':gsi1pk': `STATUS#Available`,
      ':gsi2pk': `CATEGORY#${category}#CITY#${city}`,
    },
    { '#status': 'status' }
  );

  return successResponse(updatedItem);
}

/**
 * GET /items - List items with filters
 */
async function listItems(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const queryParams = event.queryStringParameters || {};
  const { category, city, search, limit = '20' } = queryParams;

  let items: any[];

  if (category && city) {
    // Query by category and city using GSI2
    items = await query(
      'GSI2PK = :gsi2pk',
      { ':gsi2pk': `CATEGORY#${category}#CITY#${city}` },
      'GSI2',
      parseInt(limit)
    );
  } else {
    // Query all available items using GSI1
    items = await query(
      'GSI1PK = :gsi1pk',
      { ':gsi1pk': 'STATUS#Available' },
      'GSI1',
      parseInt(limit)
    );
  }

  // Filter by search keyword if provided
  if (search) {
    const searchLower = search.toLowerCase();
    items = items.filter(item => 
      item.title?.toLowerCase().includes(searchLower) || 
      item.description?.toLowerCase().includes(searchLower)
    );
  }

  return successResponse({ items, count: items.length });
}

/**
 * GET /items/{itemId} - Get item details
 */
async function getItemById(event: APIGatewayProxyEvent, itemId: string): Promise<APIGatewayProxyResult> {
  const item = await getItem(`ITEM#${itemId}`, 'METADATA');
  
  if (!item) {
    return errorResponse('Item not found', 404);
  }

  return successResponse(item);
}

/**
 * POST /items/{itemId}/lottery - Enter lottery
 */
async function enterLottery(event: APIGatewayProxyEvent, itemId: string): Promise<APIGatewayProxyResult> {
  const userId = event.requestContext.authorizer?.claims?.sub;

  // Check if item exists and is available
  const item = await getItem(`ITEM#${itemId}`, 'METADATA');
  if (!item) {
    return errorResponse('Item not found', 404);
  }

  if (item.status !== 'Available') {
    return errorResponse('Item is not available for lottery', 400);
  }

  // Check if lottery is still open
  if (new Date(item.lotteryCloseTime) < new Date()) {
    return errorResponse('Lottery has closed', 400);
  }

  // Check if user already entered
  const existingEntry = await getItem(`ITEM#${itemId}`, `LOTTERY#${userId}`);
  if (existingEntry) {
    return errorResponse('Already entered lottery', 400);
  }

  // Create lottery entry
  const entry: LotteryEntry = {
    PK: `ITEM#${itemId}`,
    SK: `LOTTERY#${userId}`,
    itemId,
    userId,
    enteredAt: new Date().toISOString(),
  };

  await putItem(entry);

  return successResponse({ message: 'Successfully entered lottery' });
}

/**
 * POST /items/{itemId}/confirm-pickup - Winner confirms pickup
 */
async function confirmPickup(event: APIGatewayProxyEvent, itemId: string): Promise<APIGatewayProxyResult> {
  const userId = event.requestContext.authorizer?.claims?.sub;

  const item = await getItem(`ITEM#${itemId}`, 'METADATA');
  if (!item) {
    return errorResponse('Item not found', 404);
  }

  if (item.winnerUserId !== userId) {
    return errorResponse('Unauthorized', 403);
  }

  if (item.status !== 'Reserved') {
    return errorResponse('Item is not reserved', 400);
  }

  // Update status to Pickup_Confirmed
  await updateItem(
    `ITEM#${itemId}`,
    'METADATA',
    'SET #status = :status, updatedAt = :updatedAt, GSI1PK = :gsi1pk',
    {
      ':status': 'Pickup_Confirmed',
      ':updatedAt': new Date().toISOString(),
      ':gsi1pk': 'STATUS#Pickup_Confirmed',
    },
    { '#status': 'status' }
  );

  return successResponse({ message: 'Pickup confirmed' });
}

/**
 * POST /items/{itemId}/mark-picked-up - Seller marks item as picked up
 */
async function markPickedUp(event: APIGatewayProxyEvent, itemId: string): Promise<APIGatewayProxyResult> {
  const userId = event.requestContext.authorizer?.claims?.sub;

  const item = await getItem(`ITEM#${itemId}`, 'METADATA');
  if (!item) {
    return errorResponse('Item not found', 404);
  }

  if (item.sellerId !== userId) {
    return errorResponse('Unauthorized', 403);
  }

  if (item.status !== 'Pickup_Confirmed') {
    return errorResponse('Pickup must be confirmed first', 400);
  }

  // Update item status
  await updateItem(
    `ITEM#${itemId}`,
    'METADATA',
    'SET #status = :status, updatedAt = :updatedAt, GSI1PK = :gsi1pk',
    {
      ':status': 'Picked_Up',
      ':updatedAt': new Date().toISOString(),
      ':gsi1pk': 'STATUS#Picked_Up',
    },
    { '#status': 'status' }
  );

  // Increment reputation for both seller and winner
  await updateItem(
    `USER#${item.sellerId}`,
    'PROFILE',
    'SET itemsGiven = itemsGiven + :inc, reputationScore = reputationScore + :inc',
    { ':inc': 1 }
  );

  await updateItem(
    `USER#${item.winnerUserId}`,
    'PROFILE',
    'SET itemsReceived = itemsReceived + :inc, reputationScore = reputationScore + :inc',
    { ':inc': 1 }
  );

  return successResponse({ message: 'Item marked as picked up' });
}
