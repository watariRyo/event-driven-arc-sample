import { Construct } from 'constructs';
import { SqsResize } from './sqs-resize';
import { SqsRotate } from './sqs-rotate';
import { SqsBlur } from './sqs-blur';
import { SqsGrayscale } from './sqs-grayscale';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';

export class SqsDeploy extends Construct {
  private readonly sqsResize: SqsResize;
  private readonly sqsBlur: SqsBlur;
  private readonly sqsGrayscale: SqsGrayscale;
  private readonly sqsRotate: SqsRotate;

  constructor(scope: Construct, prefix: string) {
    super(scope, `${prefix}-deploy`);
    this.sqsResize = new SqsResize(scope, `${prefix}-resize`);
    this.sqsBlur = new SqsBlur(scope, `${prefix}-blur`);
    this.sqsGrayscale = new SqsGrayscale(scope, `${prefix}-grayscale`);
    this.sqsRotate = new SqsBlur(scope, `${prefix}-rotate`);
  }

  getSqsResize(): SqsResize {
    return this.sqsResize;
  }
  getSqsBlur(): SqsBlur {
    return this.sqsBlur;
  }
  getSqsGrayscale(): SqsGrayscale {
    return this.sqsGrayscale;
  }
  getSqsRotate(): SqsRotate {
    return this.sqsRotate;
  }

  setSqsSubscription() {
    const sqsArray = [
      this.sqsResize,
      this.sqsBlur,
      this.sqsGrayscale,
      this.sqsRotate,
    ];
    // property個別に設定するならTupleでも渡す
    sqsArray.map((sqs) => {
      new SqsSubscription(sqs.getQueue(), {
        rawMessageDelivery: true, // SNSのObjectを伝播させない設定
      });
    });
  }

  //   addGrantSendMessagesResize(fn: cdk.aws_lambda_nodejs.NodejsFunction) {
  //     this.sqsBlur.grantSendMessages(fn);
  //   }
}
