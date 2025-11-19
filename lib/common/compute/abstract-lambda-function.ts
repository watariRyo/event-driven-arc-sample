import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import { AbstractSqsStack } from '../queue/abstract-sqs-stack'

export abstract class AbstractLambdaStack extends Construct {
  private readonly fn: NodejsFunction

  constructor(scope: Construct, prefix: string, entry: string) {
    super(scope, prefix)
    this.fn = this.create(scope, prefix, entry)
  }

  abstract create(
    scope: Construct,
    prefix: string,
    entry: string,
  ): NodejsFunction

  getFn(): NodejsFunction {
    return this.fn
  }

  // QUEUE_URLの設定が不要ならば空メソッド
  setEnv(sqs: AbstractSqsStack) {
    this.fn.addEnvironment('QUEUE_URL', sqs.getQueue().queueUrl)
  }

  setSqsEventSource(sqs: AbstractSqsStack) {
    this.fn.addEventSource(new SqsEventSource(sqs.getQueue()))
  }
}
