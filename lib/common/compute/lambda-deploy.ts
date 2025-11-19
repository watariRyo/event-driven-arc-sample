import { Construct } from 'constructs'
import { BlurLambda } from './blur-lambda'
import { GrayscaleLambda } from './grayscale-lambda'
import { ResizeLambda } from './resize-lambda'
import { RotateLambda } from './rotate-lambda'

export class LambdaDeploy extends Construct {
  private readonly resizeLambda: ResizeLambda
  private readonly grayscaleLambda: GrayscaleLambda
  private readonly blurLambda: BlurLambda
  private readonly rotateLambda: RotateLambda

  constructor(scope: Construct, prefix: string, entry: string) {
    super(scope, `${prefix}-deploy`)
    this.resizeLambda = new ResizeLambda(scope, `${prefix}-resize`, entry)
    this.grayscaleLambda = new GrayscaleLambda(
      scope,
      `${prefix}-grayscale`,
      entry,
    )
    this.blurLambda = new BlurLambda(scope, `${prefix}-blur`, entry)
    this.rotateLambda = new RotateLambda(scope, `${prefix}-rotate`, entry)
  }

  getResizeLambda(): ResizeLambda {
    return this.resizeLambda
  }

  getGrayscaleLambda(): GrayscaleLambda {
    return this.grayscaleLambda
  }

  getBlurLambda(): BlurLambda {
    return this.blurLambda
  }

  getRotateLambda(): BlurLambda {
    return this.rotateLambda
  }
}
