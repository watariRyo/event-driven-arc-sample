import { Construct } from 'constructs';
import { AbstractSqsStack } from './abstract-sqs-stack';
import { IQueue, Queue } from 'aws-cdk-lib/aws-sqs';

export class SqsRotate extends AbstractSqsStack {
  create(scope: Construct, prefix: string): IQueue {
    const dlq = new Queue(scope, `${prefix}-dlq`, {
      queueName: `${prefix}-dlq`,
    });

    return new Queue(scope, `${prefix}-queue`, {
      queueName: `${prefix}-queue`,
      deadLetterQueue: {
        queue: dlq,
        maxReceiveCount: 1,
      },
    });
  }
}
