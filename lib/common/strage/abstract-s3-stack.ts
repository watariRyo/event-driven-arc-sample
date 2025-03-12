import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export abstract class AbstractS3Stack extends Construct {
  private readonly bucket: IBucket;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.bucket = this.create(scope, id);
  }

  abstract create(scope: Construct, prefix: string): IBucket;

  getBucket(): IBucket {
    return this.bucket;
  }
}
