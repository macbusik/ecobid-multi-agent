/**
 * API response formatters for Lambda functions.
 */

export interface ApiResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

/**
 * Format a successful API response.
 */
export function successResponse(data: any, statusCode: number = 200): ApiResponse {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
    body: JSON.stringify(data),
  };
}

/**
 * Format an error API response.
 */
export function errorResponse(message: string, statusCode: number = 500): ApiResponse {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
    body: JSON.stringify({ error: message }),
  };
}
