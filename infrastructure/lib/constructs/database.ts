import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

/**
 * DynamoDB single-table design construct for EcoBid marketplace.
 * 
 * Stores all entities (Users, Items, LotteryEntries, Messages) in a single table
 * with two Global Secondary Indexes for efficient querying:
 * - GSI1: Query items by status and timestamp
 * - GSI2: Query items by category and city
 * 
 * Uses On-Demand billing mode to stay within AWS Free Tier (25GB storage, 200M requests/month).
 */
export class DatabaseConstruct extends Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create DynamoDB table with single-table design
    this.table = new dynamodb.Table(this, 'EcoBidTable', {
      tableName: 'EcoBidTable',
      partitionKey: {
        name: 'PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // GSI1: Query items by status and timestamp
    // Pattern: GSI1PK = "STATUS#<status>", GSI1SK = "<createdAt>"
    // Use case: Get all items with status "Available" ordered by creation time
    this.table.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: {
        name: 'GSI1PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'GSI1SK',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI2: Query items by category and city
    // Pattern: GSI2PK = "CATEGORY#<category>#CITY#<city>", GSI2SK = "<createdAt>"
    // Use case: Get all "Furniture" items in "New York" ordered by creation time
    this.table.addGlobalSecondaryIndex({
      indexName: 'GSI2',
      partitionKey: {
        name: 'GSI2PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'GSI2SK',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Export table name and ARN as CloudFormation outputs
    new cdk.CfnOutput(this, 'TableName', {
      value: this.table.tableName,
      description: 'DynamoDB table name',
      exportName: 'EcoBidTableName',
    });

    new cdk.CfnOutput(this, 'TableArn', {
      value: this.table.tableArn,
      description: 'DynamoDB table ARN',
      exportName: 'EcoBidTableArn',
    });
  }
}
