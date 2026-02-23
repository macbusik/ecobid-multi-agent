import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  QueryCommand, 
  UpdateCommand,
  DeleteCommand,
  PutCommandInput,
  GetCommandInput,
  QueryCommandInput,
  UpdateCommandInput,
  DeleteCommandInput
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME!;

/**
 * Put an item into DynamoDB table.
 */
export async function putItem(item: Record<string, any>): Promise<void> {
  const params: PutCommandInput = {
    TableName: TABLE_NAME,
    Item: item,
  };
  await docClient.send(new PutCommand(params));
}

/**
 * Get an item from DynamoDB table by PK and SK.
 */
export async function getItem(pk: string, sk: string): Promise<Record<string, any> | null> {
  const params: GetCommandInput = {
    TableName: TABLE_NAME,
    Key: { PK: pk, SK: sk },
  };
  const result = await docClient.send(new GetCommand(params));
  return result.Item || null;
}

/**
 * Query items from DynamoDB table.
 */
export async function query(
  keyConditionExpression: string,
  expressionAttributeValues: Record<string, any>,
  indexName?: string,
  limit?: number
): Promise<Record<string, any>[]> {
  const params: QueryCommandInput = {
    TableName: TABLE_NAME,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    IndexName: indexName,
    Limit: limit,
  };
  const result = await docClient.send(new QueryCommand(params));
  return result.Items || [];
}

/**
 * Update an item in DynamoDB table.
 */
export async function updateItem(
  pk: string,
  sk: string,
  updateExpression: string,
  expressionAttributeValues: Record<string, any>,
  expressionAttributeNames?: Record<string, string>
): Promise<Record<string, any>> {
  const params: UpdateCommandInput = {
    TableName: TABLE_NAME,
    Key: { PK: pk, SK: sk },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    ReturnValues: 'ALL_NEW',
  };
  const result = await docClient.send(new UpdateCommand(params));
  return result.Attributes || {};
}

/**
 * Delete an item from DynamoDB table.
 */
export async function deleteItem(pk: string, sk: string): Promise<void> {
  const params: DeleteCommandInput = {
    TableName: TABLE_NAME,
    Key: { PK: pk, SK: sk },
  };
  await docClient.send(new DeleteCommand(params));
}
