import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { putItem, getItem, query } from '../shared/dynamodb';
import { successResponse, errorResponse } from '../shared/response';
import { Message } from '../shared/types';

const sesClient = new SESClient({});
const SES_FROM_EMAIL = process.env.SES_FROM_EMAIL!;

/**
 * Messages Lambda Handler
 * Handles in-app messaging between seller and winner.
 */
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const method = event.httpMethod;
    const pathParams = event.pathParameters || {};
    const itemId = pathParams.itemId;

    if (!itemId) {
      return errorResponse('Missing itemId', 400);
    }

    if (method === 'POST') {
      return await sendMessage(event, itemId);
    } else if (method === 'GET') {
      return await getMessages(event, itemId);
    }

    return errorResponse('Method not allowed', 405);
  } catch (error: any) {
    console.error('Error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}

/**
 * POST /items/{itemId}/messages - Send a message
 */
async function sendMessage(event: APIGatewayProxyEvent, itemId: string): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body || '{}');
  const { content } = body;
  const senderId = event.requestContext.authorizer?.claims?.sub;

  if (!content || content.length > 500) {
    return errorResponse('Message content required and must be max 500 characters', 400);
  }

  // Get item to verify sender is seller or winner
  const item = await getItem(`ITEM#${itemId}`, 'METADATA');
  if (!item) {
    return errorResponse('Item not found', 404);
  }

  const isSeller = item.sellerId === senderId;
  const isWinner = item.winnerUserId === senderId;

  if (!isSeller && !isWinner) {
    return errorResponse('Unauthorized: Only seller and winner can message', 403);
  }

  // Determine recipient
  const recipientId = isSeller ? item.winnerUserId : item.sellerId;

  // Create message
  const messageId = uuidv4();
  const timestamp = new Date().toISOString();
  
  const message: Message = {
    PK: `ITEM#${itemId}`,
    SK: `MESSAGE#${timestamp}#${messageId}`,
    messageId,
    itemId,
    senderId,
    recipientId,
    content,
    timestamp,
  };

  await putItem(message);

  // Get recipient details and send email notification
  const recipient = await getItem(`USER#${recipientId}`, 'PROFILE');
  if (recipient?.email) {
    await sendEmailNotification(
      recipient.email,
      'New message on EcoBid',
      `You have a new message about "${item.title}": ${content}`
    );
  }

  return successResponse({ message: 'Message sent', messageId }, 201);
}

/**
 * GET /items/{itemId}/messages - Get all messages for an item
 */
async function getMessages(event: APIGatewayProxyEvent, itemId: string): Promise<APIGatewayProxyResult> {
  const userId = event.requestContext.authorizer?.claims?.sub;

  // Verify user is seller or winner
  const item = await getItem(`ITEM#${itemId}`, 'METADATA');
  if (!item) {
    return errorResponse('Item not found', 404);
  }

  if (item.sellerId !== userId && item.winnerUserId !== userId) {
    return errorResponse('Unauthorized', 403);
  }

  // Query messages ordered by timestamp
  const messages = await query(
    'PK = :pk AND begins_with(SK, :sk)',
    { ':pk': `ITEM#${itemId}`, ':sk': 'MESSAGE#' }
  );

  return successResponse({ messages, count: messages.length });
}

/**
 * Send email notification using SES
 */
async function sendEmailNotification(to: string, subject: string, body: string): Promise<void> {
  const command = new SendEmailCommand({
    Source: SES_FROM_EMAIL,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: body } },
    },
  });

  await sesClient.send(command);
}
