import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../../lib/lambda/handlers/items';
import * as dynamodb from '../../../lib/lambda/shared/dynamodb';
import * as response from '../../../lib/lambda/shared/response';

// Mock dependencies
jest.mock('../../../lib/lambda/shared/dynamodb');
jest.mock('../../../lib/lambda/shared/response');

const mockGetItem = dynamodb.getItem as jest.MockedFunction<typeof dynamodb.getItem>;
const mockQuery = dynamodb.query as jest.MockedFunction<typeof dynamodb.query>;
const mockSuccessResponse = response.successResponse as jest.MockedFunction<typeof response.successResponse>;
const mockErrorResponse = response.errorResponse as jest.MockedFunction<typeof response.errorResponse>;

describe('Items Handler - getItemById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    mockSuccessResponse.mockImplementation((data, statusCode = 200) => ({
      statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }));
    
    mockErrorResponse.mockImplementation((message, statusCode = 500) => ({
      statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: message }),
    }));
  });

  const createMockEvent = (itemId: string): Partial<APIGatewayProxyEvent> => ({
    httpMethod: 'GET',
    path: `/items/${itemId}`,
    pathParameters: { itemId },
    requestContext: {} as any,
  });

  it('should return item when found in DynamoDB', async () => {
    const itemId = 'test-item-123';
    const mockItem = {
      PK: `ITEM#${itemId}`,
      SK: 'METADATA',
      itemId,
      title: 'Test Item',
      description: 'Test description',
      category: 'Kitchen',
      photoUrl: 'https://example.com/photo.jpg',
      city: 'New York',
      status: 'Available',
      sellerId: 'user-123',
      createdAt: '2026-02-23T10:00:00Z',
      updatedAt: '2026-02-23T10:00:00Z',
    };

    mockGetItem.mockResolvedValue(mockItem);

    const event = createMockEvent(itemId) as APIGatewayProxyEvent;
    const result = await handler(event);

    expect(mockGetItem).toHaveBeenCalledWith(`ITEM#${itemId}`, 'METADATA');
    expect(mockSuccessResponse).toHaveBeenCalledWith(mockItem);
    expect(result.statusCode).toBe(200);
  });

  it('should return 404 when item not found', async () => {
    const itemId = 'non-existent-item';
    mockGetItem.mockResolvedValue(null);

    const event = createMockEvent(itemId) as APIGatewayProxyEvent;
    const result = await handler(event);

    expect(mockGetItem).toHaveBeenCalledWith(`ITEM#${itemId}`, 'METADATA');
    expect(mockErrorResponse).toHaveBeenCalledWith('Item not found', 404);
    expect(result.statusCode).toBe(404);
  });

  it('should handle DynamoDB errors gracefully', async () => {
    const itemId = 'test-item-123';
    const dbError = new Error('DynamoDB connection failed');
    mockGetItem.mockRejectedValue(dbError);

    const event = createMockEvent(itemId) as APIGatewayProxyEvent;
    const result = await handler(event);

    expect(mockGetItem).toHaveBeenCalledWith(`ITEM#${itemId}`, 'METADATA');
    expect(mockErrorResponse).toHaveBeenCalledWith('DynamoDB connection failed', 500);
    expect(result.statusCode).toBe(500);
  });

  it('should handle invalid itemId format', async () => {
    const itemId = '';
    
    const event = createMockEvent(itemId) as APIGatewayProxyEvent;
    const result = await handler(event);

    // Empty itemId results in route not found (404)
    expect(mockErrorResponse).toHaveBeenCalledWith('Route not found', 404);
    expect(result.statusCode).toBe(404);
  });

  it('should return correct item structure with all required fields', async () => {
    const itemId = 'complete-item-456';
    const completeItem = {
      PK: `ITEM#${itemId}`,
      SK: 'METADATA',
      itemId,
      title: 'Complete Test Item',
      description: 'Full description with all fields',
      category: 'Electronics',
      photoUrl: 'https://s3.amazonaws.com/bucket/photo.jpg',
      city: 'San Francisco',
      status: 'Reserved',
      sellerId: 'seller-789',
      winnerUserId: 'winner-456',
      lotteryWindowHours: 6,
      lotteryCloseTime: '2026-02-23T16:00:00Z',
      reservationExpiryTime: '2026-02-24T16:00:00Z',
      createdAt: '2026-02-23T10:00:00Z',
      updatedAt: '2026-02-23T12:00:00Z',
      GSI1PK: 'STATUS#Reserved',
      GSI1SK: '2026-02-23T10:00:00Z',
      GSI2PK: 'CATEGORY#Electronics#CITY#San Francisco',
      GSI2SK: '2026-02-23T10:00:00Z',
    };

    mockGetItem.mockResolvedValue(completeItem);

    const event = createMockEvent(itemId) as APIGatewayProxyEvent;
    const result = await handler(event);

    expect(mockSuccessResponse).toHaveBeenCalledWith(completeItem);
    expect(result.statusCode).toBe(200);
    
    const responseBody = JSON.parse(result.body);
    expect(responseBody).toHaveProperty('itemId', itemId);
    expect(responseBody).toHaveProperty('title');
    expect(responseBody).toHaveProperty('description');
    expect(responseBody).toHaveProperty('category');
    expect(responseBody).toHaveProperty('status');
  });
});

describe('listItems', () => {
  it('should return all available items', async () => {
    const mockItems = [
      {
        PK: 'ITEM#item-001',
        SK: 'METADATA',
        itemId: 'item-001',
        title: 'Test Item 1',
        status: 'Available',
        GSI1PK: 'STATUS#Available',
      },
      {
        PK: 'ITEM#item-002',
        SK: 'METADATA',
        itemId: 'item-002',
        title: 'Test Item 2',
        status: 'Available',
        GSI1PK: 'STATUS#Available',
      },
    ];

    mockQuery.mockResolvedValue(mockItems);

    const event = {
      requestContext: { http: { method: 'GET', path: '/items' } },
      pathParameters: {},
      queryStringParameters: { limit: '10' },
    } as any;

    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body.items).toHaveLength(2);
    expect(body.count).toBe(2);
    expect(mockQuery).toHaveBeenCalledWith(
      'GSI1PK = :gsi1pk',
      { ':gsi1pk': 'STATUS#Available' },
      'GSI1',
      10
    );
  });

  it('should filter items by category and city', async () => {
    const mockItems = [
      {
        PK: 'ITEM#item-001',
        SK: 'METADATA',
        itemId: 'item-001',
        title: 'Furniture Item',
        category: 'Furniture',
        city: 'New York',
        GSI2PK: 'CATEGORY#Furniture#CITY#New York',
      },
    ];

    mockQuery.mockResolvedValue(mockItems);

    const event = {
      requestContext: { http: { method: 'GET', path: '/items' } },
      pathParameters: {},
      queryStringParameters: { category: 'Furniture', city: 'New York', limit: '10' },
    } as any;

    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body.items).toHaveLength(1);
    expect(mockQuery).toHaveBeenCalledWith(
      'GSI2PK = :gsi2pk',
      { ':gsi2pk': 'CATEGORY#Furniture#CITY#New York' },
      'GSI2',
      10
    );
  });

  it('should filter items by search keyword', async () => {
    const mockItems = [
      {
        PK: 'ITEM#item-001',
        SK: 'METADATA',
        itemId: 'item-001',
        title: 'Vintage Coffee Table',
        description: 'Beautiful oak table',
      },
      {
        PK: 'ITEM#item-002',
        SK: 'METADATA',
        itemId: 'item-002',
        title: 'Modern Chair',
        description: 'Comfortable seating',
      },
    ];

    mockQuery.mockResolvedValue(mockItems);

    const event = {
      requestContext: { http: { method: 'GET', path: '/items' } },
      pathParameters: {},
      queryStringParameters: { search: 'coffee', limit: '10' },
    } as any;

    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body.items).toHaveLength(1);
    expect(body.items[0].title).toBe('Vintage Coffee Table');
  });
});
