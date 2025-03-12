import { Construct } from 'constructs';
import { AbstractLambdaStack } from './abstract-lambda-function';
import path = require('path');
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Duration } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export class BlurLambda extends AbstractLambdaStack {
  create(scope: Construct, prefix: string, entry: string): NodejsFunction {
    return new NodejsFunction(scope, `${prefix}-fn`, {
      functionName: prefix,
      entry: path.join(entry, 'lambdas/blur/index.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_22_X,
      memorySize: 128,
      timeout: Duration.seconds(30),
    });
  }
}
