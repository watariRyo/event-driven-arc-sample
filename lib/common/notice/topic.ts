import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AbstractSqsStack } from '../queue/abstract-sqs-stack';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { AbstractSnsTopic } from './abstract-topic-stack';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';

export class SnsTopic extends AbstractSnsTopic {
  create(scope: Construct, prefix: string): Topic {
    return new Topic(scope, `${prefix}-topic`, {
      topicName: prefix,
      displayName: prefix,
    });
  }
}
