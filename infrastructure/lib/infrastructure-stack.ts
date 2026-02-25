import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { DatabaseConstruct } from './constructs/database';
import { StorageConstruct } from './constructs/storage';
import { AuthConstruct } from './constructs/auth';
import { ApiConstruct } from './constructs/api';
import { SchedulerConstruct } from './constructs/scheduler';
import { FrontendHosting } from './constructs/frontend';
import { GitHubActionsRole } from './constructs/github-actions-role';

/**
 * Main EcoBid CDK Stack
 * Assembles all constructs and wires up dependencies.
 */
export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const accountId = cdk.Stack.of(this).account;
    const region = cdk.Stack.of(this).region;

    // Create constructs
    const database = new DatabaseConstruct(this, 'Database');
    const storage = new StorageConstruct(this, 'Storage', accountId);
    const auth = new AuthConstruct(this, 'Auth');

    // SES configuration - using sandbox mode for MVP
    const sesFromEmail = 'noreply@ecobid.example.com'; // TODO: Replace with verified email

    // Create Lambda functions
    const lambdaEnvironment = {
      TABLE_NAME: database.table.tableName,
      BUCKET_NAME: storage.bucket.bucketName,
      SES_FROM_EMAIL: sesFromEmail,
    };

    const lambdaProps = {
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      environment: lambdaEnvironment,
    };

    // Items Lambda
    const itemsFunction = new lambda.Function(this, 'ItemsFunction', {
      ...lambdaProps,
      functionName: 'EcoBid-Items',
      code: lambda.Code.fromAsset('lib/lambda'),
      handler: 'handlers/items.handler',
    });

    // Messages Lambda
    const messagesFunction = new lambda.Function(this, 'MessagesFunction', {
      ...lambdaProps,
      functionName: 'EcoBid-Messages',
      code: lambda.Code.fromAsset('lib/lambda'),
      handler: 'handlers/messages.handler',
    });

    // Users Lambda
    const usersFunction = new lambda.Function(this, 'UsersFunction', {
      ...lambdaProps,
      functionName: 'EcoBid-Users',
      code: lambda.Code.fromAsset('lib/lambda'),
      handler: 'handlers/users.handler',
    });

    // Favorites Lambda
    const favoritesFunction = new lambda.Function(this, 'FavoritesFunction', {
      ...lambdaProps,
      functionName: 'EcoBid-Favorites',
      code: lambda.Code.fromAsset('lib/lambda'),
      handler: 'handlers/favorites.handler',
    });

    // Generate Presigned URL Lambda
    const generatePresignedUrlFunction = new lambda.Function(this, 'GeneratePresignedUrlFunction', {
      ...lambdaProps,
      functionName: 'EcoBid-GeneratePresignedUrl',
      code: lambda.Code.fromAsset('lib/lambda'),
      handler: 'handlers/generatePresignedUrl.handler',
    });

    // Analyze Item Lambda
    const analyzeItemFunction = new lambda.Function(this, 'AnalyzeItemFunction', {
      ...lambdaProps,
      functionName: 'EcoBid-AnalyzeItem',
      code: lambda.Code.fromAsset('lib/lambda'),
      handler: 'handlers/analyzeItem.handler',
      timeout: cdk.Duration.seconds(60), // Longer timeout for AI processing
    });

    // Lottery Lambda
    const lotteryFunction = new lambda.Function(this, 'LotteryFunction', {
      ...lambdaProps,
      functionName: 'EcoBid-Lottery',
      code: lambda.Code.fromAsset('lib/lambda'),
      handler: 'handlers/lottery.handler',
    });

    // Reservation Expiry Lambda
    const reservationExpiryFunction = new lambda.Function(this, 'ReservationExpiryFunction', {
      ...lambdaProps,
      functionName: 'EcoBid-ReservationExpiry',
      code: lambda.Code.fromAsset('lib/lambda'),
      handler: 'handlers/reservation-expiry.handler',
    });

    // Add environment variables for scheduler
    lotteryFunction.addEnvironment('RESERVATION_EXPIRY_LAMBDA_ARN', reservationExpiryFunction.functionArn);

    // Create scheduler construct
    const scheduler = new SchedulerConstruct(
      this,
      'Scheduler',
      lotteryFunction,
      reservationExpiryFunction
    );

    // Add scheduler role ARN to Lambda environment
    lotteryFunction.addEnvironment('SCHEDULER_ROLE_ARN', scheduler.schedulerRole.roleArn);

    // Grant DynamoDB permissions
    database.table.grantReadWriteData(itemsFunction);
    database.table.grantReadWriteData(messagesFunction);
    database.table.grantReadWriteData(usersFunction);
    database.table.grantReadWriteData(favoritesFunction);
    database.table.grantReadWriteData(lotteryFunction);
    database.table.grantReadWriteData(reservationExpiryFunction);

    // Grant S3 permissions
    storage.bucket.grantReadWrite(itemsFunction);
    storage.bucket.grantPut(generatePresignedUrlFunction); // Only needs PUT for presigned URLs
    storage.bucket.grantRead(analyzeItemFunction); // Only needs READ for Nova Lite

    // Grant AI service permissions to Items Lambda
    // Amazon Bedrock - for AI vision and text generation (Nova Lite)
    itemsFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['bedrock:InvokeModel'],
        resources: [
          `arn:aws:bedrock:${region}::foundation-model/eu.amazon.nova-lite-v1:0`,
        ],
      })
    );

    // Grant AI service permissions to Analyze Lambda
    analyzeItemFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['bedrock:InvokeModel'],
        resources: [
          `arn:aws:bedrock:${region}::foundation-model/eu.amazon.nova-lite-v1:0`,
        ],
      })
    );

    // Grant SES permissions (sandbox mode)
    const sesPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*'],
    });

    lotteryFunction.addToRolePolicy(sesPolicy);
    messagesFunction.addToRolePolicy(sesPolicy);
    reservationExpiryFunction.addToRolePolicy(sesPolicy);

    // Grant Cognito permissions to Users Lambda
    usersFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['cognito-idp:GetUser'],
        resources: [auth.userPool.userPoolArn],
      })
    );

    // Create API Gateway
    const api = new ApiConstruct(
      this,
      'Api',
      auth.userPool,
      auth.userPoolClient,
      itemsFunction,
      messagesFunction,
      usersFunction,
      favoritesFunction,
      generatePresignedUrlFunction,
      analyzeItemFunction
    );

    // Frontend hosting
    const frontend = new FrontendHosting(this, 'Frontend');

    // GitHub Actions OIDC Role
    const githubRepo = process.env.GITHUB_REPOSITORY || 'YOUR_GITHUB_USERNAME/ecobid-multi-agent';
    new GitHubActionsRole(this, 'GitHubActions', githubRepo);

    // Add stack tags
    cdk.Tags.of(this).add('Project', 'EcoBid');
    cdk.Tags.of(this).add('Environment', 'Prod');

    // Export critical outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.api.apiEndpoint,
      description: 'API Gateway endpoint URL',
    });

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: auth.userPool.userPoolId,
      description: 'Cognito User Pool ID',
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: auth.userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: storage.bucket.bucketName,
      description: 'S3 bucket name',
    });
  }
}

