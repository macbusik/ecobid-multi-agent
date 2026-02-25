import * as cdk from 'aws-cdk-lib';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayv2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as apigatewayv2Authorizers from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

/**
 * API Gateway HTTP API construct for EcoBid marketplace.
 * 
 * Uses HTTP API (not REST API) for cost savings within AWS Free Tier.
 * Configured with Cognito JWT authorizer for protected routes.
 */
export class ApiConstruct extends Construct {
  public readonly api: apigatewayv2.HttpApi;

  constructor(
    scope: Construct,
    id: string,
    userPool: cognito.UserPool,
    userPoolClient: cognito.UserPoolClient,
    itemsFunction: lambda.Function,
    messagesFunction: lambda.Function,
    usersFunction: lambda.Function,
    favoritesFunction: lambda.Function,
    generatePresignedUrlFunction: lambda.Function,
    analyzeItemFunction: lambda.Function
  ) {
    super(scope, id);

    // Create HTTP API
    this.api = new apigatewayv2.HttpApi(this, 'EcoBidApi', {
      apiName: 'EcoBidApi',
      description: 'EcoBid Marketplace API',
      corsPreflight: {
        allowOrigins: ['*'], // TODO: Restrict to frontend domain in production
        allowMethods: [
          apigatewayv2.CorsHttpMethod.GET,
          apigatewayv2.CorsHttpMethod.POST,
          apigatewayv2.CorsHttpMethod.PUT,
          apigatewayv2.CorsHttpMethod.DELETE,
          apigatewayv2.CorsHttpMethod.OPTIONS,
        ],
        allowHeaders: ['Content-Type', 'Authorization'],
        maxAge: cdk.Duration.days(1),
      },
    });

    // Create Cognito JWT authorizer
    const authorizer = new apigatewayv2Authorizers.HttpUserPoolAuthorizer(
      'CognitoAuthorizer',
      userPool,
      {
        userPoolClients: [userPoolClient],
        identitySource: ['$request.header.Authorization'],
      }
    );

    // Create Lambda integrations
    const itemsIntegration = new apigatewayv2Integrations.HttpLambdaIntegration(
      'ItemsIntegration',
      itemsFunction
    );

    const messagesIntegration = new apigatewayv2Integrations.HttpLambdaIntegration(
      'MessagesIntegration',
      messagesFunction
    );

    const usersIntegration = new apigatewayv2Integrations.HttpLambdaIntegration(
      'UsersIntegration',
      usersFunction
    );

    const favoritesIntegration = new apigatewayv2Integrations.HttpLambdaIntegration(
      'FavoritesIntegration',
      favoritesFunction
    );

    const generatePresignedUrlIntegration = new apigatewayv2Integrations.HttpLambdaIntegration(
      'GeneratePresignedUrlIntegration',
      generatePresignedUrlFunction
    );

    const analyzeItemIntegration = new apigatewayv2Integrations.HttpLambdaIntegration(
      'AnalyzeItemIntegration',
      analyzeItemFunction
    );

    // Items routes
    this.api.addRoutes({
      path: '/items',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: itemsIntegration,
      authorizer,
    });

    this.api.addRoutes({
      path: '/items',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: itemsIntegration,
    });

    this.api.addRoutes({
      path: '/items/{itemId}',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: itemsIntegration,
    });

    this.api.addRoutes({
      path: '/items/{itemId}',
      methods: [apigatewayv2.HttpMethod.PUT],
      integration: itemsIntegration,
      authorizer,
    });

    this.api.addRoutes({
      path: '/items/{itemId}/lottery',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: itemsIntegration,
      authorizer,
    });

    this.api.addRoutes({
      path: '/items/{itemId}/confirm-pickup',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: itemsIntegration,
      authorizer,
    });

    this.api.addRoutes({
      path: '/items/{itemId}/mark-picked-up',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: itemsIntegration,
      authorizer,
    });

    // Photo upload route
    this.api.addRoutes({
      path: '/items/upload-url',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: generatePresignedUrlIntegration,
      authorizer,
    });

    // AI analyze route
    this.api.addRoutes({
      path: '/items/analyze',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: analyzeItemIntegration,
      authorizer,
    });

    // Messages routes
    this.api.addRoutes({
      path: '/items/{itemId}/messages',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: messagesIntegration,
      authorizer,
    });

    this.api.addRoutes({
      path: '/items/{itemId}/messages',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: messagesIntegration,
      authorizer,
    });

    // Users routes
    this.api.addRoutes({
      path: '/users/me',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: usersIntegration,
      authorizer,
    });

    this.api.addRoutes({
      path: '/users/{userId}',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: usersIntegration,
    });

    // Favorites routes
    this.api.addRoutes({
      path: '/users/{userId}/favorites',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: favoritesIntegration,
      authorizer,
    });

    this.api.addRoutes({
      path: '/users/{userId}/favorites/{itemId}',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: favoritesIntegration,
      authorizer,
    });

    this.api.addRoutes({
      path: '/users/{userId}/favorites/{itemId}',
      methods: [apigatewayv2.HttpMethod.DELETE],
      integration: favoritesIntegration,
      authorizer,
    });

    // Export API endpoint URL
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: this.api.apiEndpoint,
      description: 'API Gateway endpoint URL',
      exportName: 'EcoBidApiEndpoint',
    });
  }
}
