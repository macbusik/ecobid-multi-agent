import { successResponse, errorResponse } from '../shared/response';
import { analyzeItemWithNovaLite } from '../shared/nova';

/**
 * Analyze item photo using Amazon Nova Lite
 * POST /items/analyze
 */
export async function handler(event: any): Promise<any> {
  try {
    // Get authenticated user ID
    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub ||
                   event.requestContext?.authorizer?.claims?.sub;
    
    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { s3Key } = body;

    if (!s3Key) {
      return errorResponse('s3Key is required', 400);
    }

    // Verify s3Key belongs to user (security check)
    if (!s3Key.startsWith(`items/${userId}/`)) {
      return errorResponse('Invalid s3Key', 403);
    }

    // Analyze with Nova Lite
    const listing = await analyzeItemWithNovaLite(s3Key);

    return successResponse({
      title: listing.title,
      description: listing.description,
      category: listing.category,
      aiGenerated: true,
    });
  } catch (error) {
    console.error('Error analyzing item:', error);
    return errorResponse('Failed to analyze item', 500);
  }
}
