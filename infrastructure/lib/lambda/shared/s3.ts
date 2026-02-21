import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({});
const BUCKET_NAME = process.env.BUCKET_NAME!;

/**
 * Upload an image to S3 bucket.
 * @param key - S3 object key (file path)
 * @param body - Image data (Buffer or base64 string)
 * @param contentType - MIME type (e.g., 'image/jpeg')
 * @returns S3 object URL
 */
export async function uploadImage(
  key: string,
  body: Buffer | string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  
  await s3Client.send(command);
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
}

/**
 * Get a pre-signed URL for an S3 object (for temporary access).
 * @param key - S3 object key
 * @param expiresIn - URL expiration time in seconds (default: 3600)
 * @returns Pre-signed URL
 */
export async function getSignedUrlForObject(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  
  return await getSignedUrl(s3Client, command, { expiresIn });
}
