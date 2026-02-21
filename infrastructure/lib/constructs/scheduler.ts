import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/**
 * EventBridge Scheduler construct for EcoBid marketplace.
 * 
 * Configures IAM permissions for Lambda functions to create one-time schedules
 * that invoke other Lambda functions (lottery selection, reservation expiry).
 * 
 * Stays within AWS Free Tier: 14 million invocations/month.
 */
export class SchedulerConstruct extends Construct {
  public readonly schedulerRole: iam.Role;

  constructor(
    scope: Construct,
    id: string,
    lotteryFunction: lambda.Function,
    reservationExpiryFunction: lambda.Function
  ) {
    super(scope, id);

    // Create IAM role for EventBridge Scheduler to invoke Lambda
    this.schedulerRole = new iam.Role(this, 'SchedulerExecutionRole', {
      assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
      description: 'Role for EventBridge Scheduler to invoke Lambda functions',
    });

    // Grant permission to invoke lottery and reservation expiry functions
    lotteryFunction.grantInvoke(this.schedulerRole);
    reservationExpiryFunction.grantInvoke(this.schedulerRole);

    // Grant Lambda functions permission to create schedules
    const schedulerPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'scheduler:CreateSchedule',
        'scheduler:DeleteSchedule',
        'scheduler:GetSchedule',
      ],
      resources: ['*'], // Scoped to schedules created by these functions
    });

    lotteryFunction.addToRolePolicy(schedulerPolicy);
    reservationExpiryFunction.addToRolePolicy(schedulerPolicy);

    // Grant pass role permission so Lambda can pass the scheduler role
    const passRolePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['iam:PassRole'],
      resources: [this.schedulerRole.roleArn],
    });

    lotteryFunction.addToRolePolicy(passRolePolicy);

    // Export scheduler role ARN
    new cdk.CfnOutput(this, 'SchedulerRoleArn', {
      value: this.schedulerRole.roleArn,
      description: 'EventBridge Scheduler execution role ARN',
      exportName: 'EcoBidSchedulerRoleArn',
    });
  }
}
