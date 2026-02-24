import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { putItem, getItem, query, deleteItem } from '../shared/dynamodb';
import { successResponse, errorResponse } from '../shared/response';

/**
 * Favorites Lambda Handler
 * Handles user favorite items operations.
 */
export async function handler(event: any): Promise<APIGatewayProxyResult> {
  try {
    console.log('🔍 FULL EVENT:', JSON.stringify(event, null, 2));
    
    const method = event.requestContext?.http?.method || event.httpMethod;
    const path = event.requestContext?.http?.path || event.path;
    const pathParams = event.pathParameters || {};
    
    // HTTP API v2 stores JWT claims in event.requestContext.authorizer.jwt.claims
    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub || 
                   event.requestContext?.authorizer?.claims?.sub;

    console.log('🔍 Favorites Handler Debug:', {
      method,
      path,
      userId_from_jwt: userId,
      pathUserId: pathParams.userId,
      itemId: pathParams.itemId,
      match: pathParams.userId === userId,
      authorizerStructure: event.requestContext?.authorizer,
    });

    if (!userId) {
      console.error('❌ No userId in JWT claims');
      return errorResponse('Unauthorized', 403);
    }

    const { userId: pathUserId, itemId } = pathParams;

    // Verify user can only access their own favorites
    if (pathUserId !== userId) {
      console.error('❌ User ID mismatch:', { pathUserId, userId });
      return errorResponse('Unauthorized', 403);
    }

    if (method === 'POST' && itemId) {
      return await addFavorite(userId, itemId);
    } else if (method === 'DELETE' && itemId) {
      return await removeFavorite(userId, itemId);
    } else if (method === 'GET' && !itemId) {
      return await listFavorites(userId);
    }

    return errorResponse('Route not found', 404);
  } catch (error: any) {
    console.error('Error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}

/**
 * POST /users/{userId}/favorites/{itemId} - Add favorite
 */
async function addFavorite(userId: string, itemId: string): Promise<APIGatewayProxyResult> {
  // Check if item exists
  const item = await getItem(`ITEM#${itemId}`, 'METADATA');
  if (!item) {
    return errorResponse('Item not found', 404);
  }

  // Check if already favorited
  const existing = await getItem(`USER#${userId}`, `FAVORITE#${itemId}`);
  if (existing) {
    return successResponse({ message: 'Already favorited' });
  }

  // Add favorite
  await putItem({
    PK: `USER#${userId}`,
    SK: `FAVORITE#${itemId}`,
    userId,
    itemId,
    createdAt: new Date().toISOString(),
  });

  return successResponse({ message: 'Added to favorites' });
}

/**
 * DELETE /users/{userId}/favorites/{itemId} - Remove favorite
 */
async function removeFavorite(userId: string, itemId: string): Promise<APIGatewayProxyResult> {
  const existing = await getItem(`USER#${userId}`, `FAVORITE#${itemId}`);
  if (!existing) {
    return errorResponse('Favorite not found', 404);
  }

  await deleteItem(`USER#${userId}`, `FAVORITE#${itemId}`);
  return successResponse({ message: 'Removed from favorites' });
}

/**
 * GET /users/{userId}/favorites - List all favorites
 */
async function listFavorites(userId: string): Promise<APIGatewayProxyResult> {
  const favoriteRecords = await query(
    'PK = :pk AND begins_with(SK, :sk)',
    { ':pk': `USER#${userId}`, ':sk': 'FAVORITE#' }
  );

  // Fetch full item details for each favorite
  const items = await Promise.all(
    favoriteRecords.map(async (fav: any) => {
      const item = await getItem(`ITEM#${fav.itemId}`, 'METADATA');
      return item;
    })
  );

  // Filter out any null items (in case item was deleted)
  const validItems = items.filter(item => item !== null);

  return successResponse({ items: validItems, count: validItems.length });
}