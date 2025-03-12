import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AbstractEdaStack } from './abstract-eda-stack';

export class EdaStack extends AbstractEdaStack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    // 環境が異なったらアーリーリターン、など

    super(scope, id, props);

    this.createStack();
    this.createExtraStack();
  }

  // 何もしない（各環境差分をセット）
  createExtraStack() {}
}
