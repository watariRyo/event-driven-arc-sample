import { ITopic, Topic } from 'aws-cdk-lib/aws-sns'
import { Construct } from 'constructs'
import { AbstractSnsTopic } from './abstract-topic-stack'

export class SnsTopic extends AbstractSnsTopic {
  create(scope: Construct, prefix: string): ITopic {
    return new Topic(scope, `${prefix}-topic`, {
      topicName: prefix,
      displayName: prefix,
    })
  }
}
