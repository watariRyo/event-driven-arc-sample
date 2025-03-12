import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SnsDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';
import { S3Bucket } from './s3-bucket';
import { IGrantable } from 'aws-cdk-lib/aws-iam';

export type AddEventNotificationType = {
  event: cdk.aws_s3.EventType;
  dest: cdk.aws_s3.IBucketNotificationDestination;
  filters: cdk.aws_s3.NotificationKeyFilter[];
};

export class S3Deploy extends Construct {
  private readonly s3Stack: S3Bucket;

  constructor(scope: Construct, prefix: string) {
    super(scope, `${prefix}-deploy`);
    this.s3Stack = new S3Bucket(scope, prefix);
  }

  addGrant(target: IGrantable) {
    const allS3Bucket = [this.s3Stack];

    allS3Bucket.map((s3) => {
      s3.getBucket().grantPut(target);
      s3.getBucket().grantReadWrite(target);
    });
  }

  setSNSEventNotification(topic: cdk.aws_sns.Topic) {
    this.s3Stack
      .getBucket()
      .addEventNotification(
        s3.EventType.OBJECT_CREATED,
        new SnsDestination(topic),
        { prefix: 'original/' }
      );
  }
}
