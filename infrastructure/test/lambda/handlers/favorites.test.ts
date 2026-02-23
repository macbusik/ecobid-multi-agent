import { handler } from '../../../lib/lambda/handlers/favorites';

// Mock DynamoDB operations
jest.mock('../../../lib/lambda/shared/dynamodb', () => ({
  putItem: jest.fn(),
  getItem: jest.fn(),
  query: jest.fn(),
  deleteItem: jest.fn(),
}));

const mockPutItem = require('../../../lib/lambda/shared/dynamodb').putItem;
const mockGetItem = require('../../../lib/lambda/shared/dynamodb').getItem;
const mockQuery = require('../../../lib/lambda/shared/dynamodb').query;
const mockDeleteItem = require('../../../lib/lambda/shared/dynamodb').deleteItem;

describe('Favorites Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addFavorite', () => {
    it('should add favorite successfully', async () => {
      mockGetItem.mockResolvedValueOnce({ id: 'item-123' }); // Item exists
      mockGetItem.mockResolvedValueOnce(null); // Not already favorited
      mockPutItem.mockResolvedValueOnce({});

      const event = {
        requestContext: {
          http: { method: 'POST' },
          authorizer: { claims: { sub: 'user-123' } }
        },
        pathParameters: { userId: 'user-123', itemId: 'item-123' }
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({ message: 'Added to favorites' });
    });

    it('should return 403 for unauthorized access', async () => {
      const event = {
        requestContext: {
          http: { method: 'POST' }
        },
        pathParameters: { userId: 'user-123', itemId: 'item-123' }
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(403);
      expect(JSON.parse(result.body)).toEqual({ error: 'Unauthorized' });
    });

    it('should return 404 for invalid itemId', async () => {
      mockGetItem.mockResolvedValueOnce(null); // Item doesn't exist

      const event = {
        requestContext: {
          http: { method: 'POST' },
          authorizer: { claims: { sub: 'user-123' } }
        },
        pathParameters: { userId: 'user-123', itemId: 'invalid-item' }
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(404);
      expect(JSON.parse(result.body)).toEqual({ error: 'Item not found' });
    });

    it('should handle DynamoDB errors', async () => {
      mockGetItem.mockRejectedValueOnce(new Error('DynamoDB error'));

      const event = {
        requestContext: {
          http: { method: 'POST' },
          authorizer: { claims: { sub: 'user-123' } }
        },
        pathParameters: { userId: 'user-123', itemId: 'item-123' }
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body)).toEqual({ error: 'DynamoDB error' });
    });
  });

  describe('removeFavorite', () => {
    it('should remove favorite successfully', async () => {
      mockGetItem.mockResolvedValueOnce({ userId: 'user-123', itemId: 'item-123' });
      mockDeleteItem.mockResolvedValueOnce({});

      const event = {
        requestContext: {
          http: { method: 'DELETE' },
          authorizer: { claims: { sub: 'user-123' } }
        },
        pathParameters: { userId: 'user-123', itemId: 'item-123' }
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({ message: 'Removed from favorites' });
    });

    it('should return 403 for unauthorized access', async () => {
      const event = {
        requestContext: {
          http: { method: 'DELETE' }
        },
        pathParameters: { userId: 'user-123', itemId: 'item-123' }
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(403);
      expect(JSON.parse(result.body)).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('listFavorites', () => {
    it('should list favorites successfully', async () => {
      const mockFavorites = [
        { userId: 'user-123', itemId: 'item-123', createdAt: '2024-01-01T00:00:00Z' }
      ];
      mockQuery.mockResolvedValueOnce(mockFavorites);

      const event = {
        requestContext: {
          http: { method: 'GET' },
          authorizer: { claims: { sub: 'user-123' } }
        },
        pathParameters: { userId: 'user-123' }
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body.favorites).toHaveLength(1);
      expect(body.count).toBe(1);
    });

    it('should return 403 for unauthorized access', async () => {
      const event = {
        requestContext: {
          http: { method: 'GET' }
        },
        pathParameters: { userId: 'user-123' }
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(403);
      expect(JSON.parse(result.body)).toEqual({ error: 'Unauthorized' });
    });

    it('should handle DynamoDB errors', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DynamoDB error'));

      const event = {
        requestContext: {
          http: { method: 'GET' },
          authorizer: { claims: { sub: 'user-123' } }
        },
        pathParameters: { userId: 'user-123' }
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body)).toEqual({ error: 'DynamoDB error' });
    });
  });
});