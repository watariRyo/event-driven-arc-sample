import { IGrantable } from 'aws-cdk-lib/aws-iam'
import {
  EventType,
  IBucketNotificationDestination,
  NotificationKeyFilter,
} from 'aws-cdk-lib/aws-s3'
import { SnsDestination } from 'aws-cdk-lib/aws-s3-notifications'
import { ITopic } from 'aws-cdk-lib/aws-sns'
import { Construct } from 'constructs'
import { S3Bucket } from './s3-bucket'

export type AddEventNotificationType = {
  event: EventType
  dest: IBucketNotificationDestination
  filters: NotificationKeyFilter[]
}

export class S3Deploy extends Construct {
  private readonly s3Stack: S3Bucket

  constructor(scope: Construct, prefix: string) {
    super(scope, `${prefix}-deploy`)
    this.s3Stack = new S3Bucket(scope, prefix)
  }

  addGrant(target: IGrantable) {
    const allS3Bucket = [this.s3Stack]

    allS3Bucket.forEach((s3) => {
      s3.getBucket().grantPut(target)
      s3.getBucket().grantReadWrite(target)
    })
  }

  setSNSEventNotification(topic: ITopic) {
    this.s3Stack
      .getBucket()
      .addEventNotification(
        EventType.OBJECT_CREATED,
        new SnsDestination(topic),
        { prefix: 'original/' },
      )
  }
}
