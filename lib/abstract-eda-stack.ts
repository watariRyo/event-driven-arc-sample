import * as cdk from 'aws-cdk-lib'
import * as path from 'path'
import { LambdaDeploy } from './common/compute/lambda-deploy'
import { SnsDeploy } from './common/notice/sns-deploy'
import { SqsDeploy } from './common/queue/sqs-deploy'
import { S3Deploy } from './common/strage/s3-deploy'

const REPOSITORY_TOP = path.join(__dirname, '../')
const PREFIX = 'cdk-funout-ts-watari'

export abstract class AbstractEdaStack extends cdk.Stack {
  abstract createExtraStack(): void

  createStack(): void {
    // declare
    const bucket = new S3Deploy(this, `${PREFIX}-s3`)
    const sqs = new SqsDeploy(this, `${PREFIX}-sqs`)
    const sns = new SnsDeploy(this, `${PREFIX}-sns`)

    // sns
    bucket.setSNSEventNotification(sns.getSnsTopic().getTopic())
    sns.getSnsTopic().setSqsSubscription([sqs.getSqsResize(), sqs.getSqsBlur()])

    // lambda
    const lambda = new LambdaDeploy(this, `${PREFIX}-lambda`, REPOSITORY_TOP)
    // lambda resize
    bucket.addGrant(lambda.getResizeLambda().getFn())
    lambda.getResizeLambda().setEnv(sqs.getSqsGrayscale())
    lambda.getResizeLambda().setSqsEventSource(sqs.getSqsResize())
    sqs.getSqsGrayscale().grantSendMessages(lambda.getResizeLambda().getFn())
    // lambda grayscale
    bucket.addGrant(lambda.getGrayscaleLambda().getFn())
    lambda.getGrayscaleLambda().setSqsEventSource(sqs.getSqsGrayscale())
    // lambda blur
    bucket.addGrant(lambda.getBlurLambda().getFn())
    lambda.getBlurLambda().setEnv(sqs.getSqsRotate())
    lambda.getBlurLambda().setSqsEventSource(sqs.getSqsBlur())
    sqs.getSqsRotate().grantSendMessages(lambda.getBlurLambda().getFn())
    // lambda rotate
    bucket.addGrant(lambda.getRotateLambda().getFn())
    lambda.getRotateLambda().setSqsEventSource(sqs.getSqsRotate())
  }
}
