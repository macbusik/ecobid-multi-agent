import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

/**
 * GitHub Actions OIDC Role
 * Allows GitHub Actions to assume role without access keys
 * Uses OpenID Connect for secure, temporary credentials
 */
export class GitHubActionsRole extends Construct {
  public readonly role: iam.Role;

  constructor(scope: Construct, id: string, githubRepo: string) {
    super(scope, id);

    // GitHub OIDC Provider (create once per account)
    const provider = new iam.OpenIdConnectProvider(this, 'GitHubProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
      thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
    });

    // IAM Role for GitHub Actions
    this.role = new iam.Role(this, 'GitHubActionsRole', {
      roleName: 'GitHubActionsDeploymentRole',
      assumedBy: new iam.FederatedPrincipal(
        provider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': `repo:${githubRepo}:*`,
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
      ],
      description: 'Role for GitHub Actions to deploy EcoBid frontend',
      maxSessionDuration: cdk.Duration.hours(1),
    });

    // Output role ARN
    new cdk.CfnOutput(this, 'GitHubActionsRoleArn', {
      value: this.role.roleArn,
      description: 'GitHub Actions Role ARN',
    });
  }
}
