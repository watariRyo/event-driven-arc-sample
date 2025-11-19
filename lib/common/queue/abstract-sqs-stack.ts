import { IGrantable } from 'aws-cdk-lib/aws-iam'
import { IQueue } from 'aws-cdk-lib/aws-sqs'
import { Construct } from 'constructs'

export abstract class AbstractSqsStack extends Construct {
  private readonly queue: IQueue
  constructor(scope: Construct, prefix: string) {
    super(scope, prefix)
    this.queue = this.create(scope, prefix)
  }

  abstract create(scope: Construct, prefix: string): IQueue

  getQueue(): IQueue {
    return this.queue
  }

  grantSendMessages(target: IGrantable) {
    this.queue.grantSendMessages(target)
  }
}
