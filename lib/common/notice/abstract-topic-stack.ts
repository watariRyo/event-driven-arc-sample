import { ITopic } from 'aws-cdk-lib/aws-sns'
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions'
import { Construct } from 'constructs'
import { AbstractSqsStack } from '../queue/abstract-sqs-stack'

export abstract class AbstractSnsTopic extends Construct {
  private readonly topic: ITopic
  constructor(scope: Construct, id: string) {
    super(scope, id)
    this.topic = this.create(scope, id)
  }

  abstract create(scope: Construct, prefix: string): ITopic

  getTopic(): ITopic {
    return this.topic
  }

  setSqsSubscription(sqsArray: AbstractSqsStack[]) {
    // property個別に設定するならTupleでも渡す
    sqsArray.forEach((sqs) => {
      this.getTopic().addSubscription(
        new SqsSubscription(sqs.getQueue(), {
          rawMessageDelivery: true, // SNSのObjectを伝播させない設定
        }),
      )
    })
  }
}
