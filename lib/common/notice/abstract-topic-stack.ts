import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import { AbstractSqsStack } from '../queue/abstract-sqs-stack';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';

export abstract class AbstractSnsTopic extends Construct {
  private readonly topic: Topic;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.topic = this.create(scope, id);
  }

  abstract create(scope: Construct, prefix: string): Topic;

  getTopic(): Topic {
    return this.topic;
  }

  setSqsSubscription(sqsArray: AbstractSqsStack[]) {
    // property個別に設定するならTupleでも渡す
    sqsArray.map((sqs) => {
      this.getTopic().addSubscription(
        new SqsSubscription(sqs.getQueue(), {
          rawMessageDelivery: true, // SNSのObjectを伝播させない設定
        })
      );
    });
  }
}
