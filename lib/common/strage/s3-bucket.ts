import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AbstractS3Stack } from './abstract-s3-stack';
import { Bucket, IBucket } from 'aws-cdk-lib/aws-s3';

export class S3Bucket extends AbstractS3Stack {
  create(scope: Construct, prefix: string): IBucket {
    return new Bucket(scope, `${prefix}-bucket`, {
      bucketName: prefix,
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
