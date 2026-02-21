#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';

/**
 * EcoBid CDK App Entry Point
 * Deploys the EcoBid marketplace infrastructure to AWS.
 */
const app = new cdk.App();

new InfrastructureStack(app, 'EcoBidStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  description: 'EcoBid Marketplace - Serverless infrastructure for free item exchange',
  tags: {
    Project: 'EcoBid',
    Environment: 'Production',
    ManagedBy: 'CDK',
  },
});

app.synth();

