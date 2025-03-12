# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

## arc

イベント駆動サンプル

S3 へのアップロードを契機に以下イベントを実行する

- resize -> grayscale
- blur -> rotate

経路は以下の通り

```
S3 -> SNS -> SQS -> Lambda(resize) -> SQS -> Lambda(grayscale)
   -> SNS -> SQS -> Lambda(blur) -> SQS -> Lambda(rotate)
```

S3 のイベントを SNS で funout（S3 からは 1 トリガーしか指定できない）させ、Lambda 呼び出しはすべて SQS で受ける  
LambdaHandler がすべて SQS になると同時に、SQS の色々機能の恩恵を享受する

### Todo？

- id やクラス名など命名や設定が適当すぎること
