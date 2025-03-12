import { Construct } from 'constructs';
import { SnsTopic } from './topic';

export class SnsDeploy extends Construct {
  private readonly topic: SnsTopic;

  constructor(scope: Construct, prefix: string) {
    super(scope, `${prefix}-deploy`);
    this.topic = new SnsTopic(scope, prefix);
  }

  getSnsTopic(): SnsTopic {
    return this.topic;
  }
}
