import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { getItem } from '../shared/dynamodb';
import { successResponse, errorResponse } from '../shared/response';

const cognitoClient = new CognitoIdentityProviderClient({});

/**
 * Users Lambda Handler
 * Handles user profile operations.
 */
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const method = event.httpMethod;
    const path = event.path;
    const pathParams = event.pathParameters || {};

    if (method === 'GET' && path.includes('/me')) {
      return await getCurrentUser(event);
    } else if (method === 'GET' && pathParams.userId) {
      return await getUserProfile(event, pathParams.userId);
    }

    return errorResponse('Route not found', 404);
  } catch (error: any) {
    console.error('Error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}

/**
 * GET /users/me - Get current user profile from Cognito token
 */
async function getCurrentUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const accessToken = event.headers.Authorization?.replace('Bearer ', '');
  
  if (!accessToken) {
    return errorResponse('Missing authorization token', 401);
  }

  // Get user from Cognito
  const command = new GetUserCommand({
    AccessToken: accessToken,
  });

  const cognitoUser = await cognitoClient.send(command);
  const userId = cognitoUser.UserAttributes?.find(attr => attr.Name === 'sub')?.Value;

  if (!userId) {
    return errorResponse('User not found', 404);
  }

  // Get user profile from DynamoDB
  const userProfile = await getItem(`USER#${userId}`, 'PROFILE');

  if (!userProfile) {
    // Return basic info from Cognito if profile doesn't exist yet
    const email = cognitoUser.UserAttributes?.find(attr => attr.Name === 'email')?.Value;
    const name = cognitoUser.UserAttributes?.find(attr => attr.Name === 'custom:name')?.Value;
    const city = cognitoUser.UserAttributes?.find(attr => attr.Name === 'custom:city')?.Value;

    return successResponse({
      userId,
      email,
      name,
      city,
      itemsGiven: 0,
      itemsReceived: 0,
      reputationScore: 0,
    });
  }

  return successResponse(userProfile);
}

/**
 * GET /users/{userId} - Get user profile by ID
 */
async function getUserProfile(event: APIGatewayProxyEvent, userId: string): Promise<APIGatewayProxyResult> {
  const userProfile = await getItem(`USER#${userId}`, 'PROFILE');

  if (!userProfile) {
    return errorResponse('User not found', 404);
  }

  // Return public profile info only
  return successResponse({
    userId: userProfile.userId,
    name: userProfile.name,
    city: userProfile.city,
    itemsGiven: userProfile.itemsGiven,
    itemsReceived: userProfile.itemsReceived,
    reputationScore: userProfile.reputationScore,
  });
}
