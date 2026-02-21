import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

/**
 * Cognito User Pool construct for EcoBid marketplace authentication.
 * 
 * Configured with:
 * - Email as username (no separate username field)
 * - Strong password policy
 * - Email verification required
 * - Custom attributes: name and city
 * - User Pool Client with USER_PASSWORD_AUTH flow
 * - 24-hour token expiry
 * 
 * Stays within AWS Free Tier: 50,000 MAUs (Monthly Active Users).
 */
export class AuthConstruct extends Construct {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create Cognito User Pool
    this.userPool = new cognito.UserPool(this, 'EcoBidUserPool', {
      userPoolName: 'EcoBidUserPool',
      signInAliases: {
        email: true,
        username: false,
      },
      selfSignUpEnabled: true,
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      customAttributes: {
        name: new cognito.StringAttribute({ minLen: 1, maxLen: 100, mutable: true }),
        city: new cognito.StringAttribute({ minLen: 1, maxLen: 100, mutable: true }),
      },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Create User Pool Client
    this.userPoolClient = new cognito.UserPoolClient(this, 'EcoBidUserPoolClient', {
      userPool: this.userPool,
      userPoolClientName: 'EcoBidWebClient',
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      accessTokenValidity: cdk.Duration.hours(24),
      idTokenValidity: cdk.Duration.hours(24),
      refreshTokenValidity: cdk.Duration.days(30),
    });

    // Export User Pool ID, Client ID, and ARN as CloudFormation outputs
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
      description: 'Cognito User Pool ID',
      exportName: 'EcoBidUserPoolId',
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
      exportName: 'EcoBidUserPoolClientId',
    });

    new cdk.CfnOutput(this, 'UserPoolArn', {
      value: this.userPool.userPoolArn,
      description: 'Cognito User Pool ARN',
      exportName: 'EcoBidUserPoolArn',
    });
  }
}
