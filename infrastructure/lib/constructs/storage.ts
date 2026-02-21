import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

/**
 * S3 bucket construct for storing item photos in EcoBid marketplace.
 * 
 * Configured with:
 * - Public read access for objects (users can view photos without auth)
 * - CORS enabled for frontend uploads
 * - Lifecycle policy to delete objects after 365 days (cost optimization)
 * - Blocks public ACLs but allows public bucket policies
 * 
 * Stays within AWS Free Tier: 5GB storage, 20K GET requests, 2K PUT requests/month.
 */
export class StorageConstruct extends Construct {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, accountId: string) {
    super(scope, id);

    // Create S3 bucket with unique name
    this.bucket = new s3.Bucket(this, 'EcoBidItemsBucket', {
      bucketName: `ecobid-items-${accountId}`,
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        blockPublicPolicy: false,
        ignorePublicAcls: true,
        restrictPublicBuckets: false,
      }),
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
          ],
          allowedOrigins: ['*'], // TODO: Restrict to frontend domain in production
          allowedHeaders: ['*'],
          maxAge: 3000,
        },
      ],
      lifecycleRules: [
        {
          id: 'DeleteOldObjects',
          enabled: true,
          expiration: cdk.Duration.days(365),
        },
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Export bucket name and ARN as CloudFormation outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      description: 'S3 bucket name for item photos',
      exportName: 'EcoBidBucketName',
    });

    new cdk.CfnOutput(this, 'BucketArn', {
      value: this.bucket.bucketArn,
      description: 'S3 bucket ARN',
      exportName: 'EcoBidBucketArn',
    });
  }
}
