import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { successResponse, errorResponse } from '../shared/response';

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = process.env.BUCKET_NAME!;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface UploadUrlRequest {
  fileName: string;
  fileType: string;
  fileSize?: number;
}

/**
 * Generate presigned URL for S3 photo upload
 * POST /items/upload-url
 */
export async function handler(event: any): Promise<any> {
  try {
    // Get authenticated user ID from JWT claims
    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub ||
                   event.requestContext?.authorizer?.claims?.sub;
    
    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    // Parse request body
    const body: UploadUrlRequest = JSON.parse(event.body || '{}');
    const { fileName, fileType, fileSize } = body;

    // Validate required fields
    if (!fileName || !fileType) {
      return errorResponse('fileName and fileType are required', 400);
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(fileType.toLowerCase())) {
      return errorResponse(`File type must be one of: ${ALLOWED_TYPES.join(', ')}`, 400);
    }

    // Validate file size if provided
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return errorResponse(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`, 400);
    }

    // Generate unique S3 key
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const fileExtension = fileName.split('.').pop() || 'jpg';
    const s3Key = `items/${userId}/${timestamp}-${randomId}.${fileExtension}`;

    // Generate presigned URL (5 minute expiry)
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    return successResponse({
      uploadUrl,
      s3Key,
      expiresIn: 300,
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return errorResponse('Failed to generate upload URL', 500);
  }
}
