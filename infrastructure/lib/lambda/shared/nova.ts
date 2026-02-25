import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = process.env.BUCKET_NAME!;

// Amazon Nova Lite model ID
const NOVA_LITE_MODEL_ID = 'us.amazon.nova-lite-v1:0';

interface ItemListing {
  title: string;
  description: string;
  category: string;
}

/**
 * Analyze item photo using Amazon Nova Lite multimodal vision
 * and generate marketplace listing (title, description, category)
 */
export async function analyzeItemWithNovaLite(s3Key: string): Promise<ItemListing> {
  try {
    // Get image from S3
    const getObjectCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });
    
    const s3Response = await s3Client.send(getObjectCommand);
    const imageBytes = await s3Response.Body!.transformToByteArray();
    const base64Image = Buffer.from(imageBytes).toString('base64');

    // Prepare Nova Lite request with image
    const requestBody = {
      messages: [
        {
          role: 'user',
          content: [
            {
              image: {
                format: 'jpeg',
                source: {
                  bytes: base64Image,
                },
              },
            },
            {
              text: `You are an expert at writing marketplace listings for free household items.

Analyze this photo and generate a listing in JSON format:
{
  "title": "5-10 word catchy title",
  "description": "2-3 sentences describing the item, its condition, and potential uses",
  "category": "one of: Kitchen, Furniture, Electronics, Books, Clothing, Toys, Other"
}

Guidelines:
- Title should be specific and appealing (e.g., "Logitech MX Master Wireless Mouse" not "Mouse")
- Description should mention condition (e.g., "gently used", "like new", "shows wear")
- Description should suggest use cases (e.g., "perfect for home office", "great for students")
- Category should be the best fit from the list
- Keep tone friendly and casual

Return ONLY valid JSON, no other text.`,
            },
          ],
        },
      ],
      inferenceConfig: {
        maxTokens: 300,
        temperature: 0.7,
      },
    };

    // Invoke Nova Lite
    const command = new InvokeModelCommand({
      modelId: NOVA_LITE_MODEL_ID,
      body: JSON.stringify(requestBody),
      contentType: 'application/json',
      accept: 'application/json',
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    // Extract text from response
    const contentList = responseBody.output.message.content;
    const textBlock = contentList.find((item: any) => item.text);
    
    if (!textBlock) {
      throw new Error('No text response from Nova Lite');
    }

    // Parse JSON response
    const jsonText = textBlock.text.trim();
    const listing: ItemListing = JSON.parse(jsonText);

    // Validate required fields
    if (!listing.title || !listing.description || !listing.category) {
      throw new Error('Invalid listing format from Nova Lite');
    }

    return listing;
  } catch (error) {
    console.error('Error analyzing item with Nova Lite:', error);
    throw new Error('Failed to analyze item with AI');
  }
}
