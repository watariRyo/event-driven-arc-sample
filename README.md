# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## arc

イベント駆動サンプル

S3へのアップロードを契機に以下イベントを実行する  
- resize -> grayscale
- blur -> rotate

経路は以下の通り

```
S3 -> SNS -> SQS -> Lambda(resize) -> SQS -> Lambda(grayscale)
   -> SNS -> SQS -> Lambda(blur) -> SQS -> Lambda(rotate)
```

S3のイベントをSNSでfunout（S3からは1トリガーしか指定できない）させ、Lambda呼び出しはすべてSQSで受ける  
LambdaHandlerがすべてSQSになると同時に、SQSの色々機能の恩恵を享受する  

### Todo？

冗長な記載。以下のようにすると良いかも
- cdk.Stackを継承した抽象クラス作成
- cdk.Appはbinなどで定義しlibを呼び出す
　- 環境変数の読み込みはこれの前で行う
　- 呼び出しインスタンス先は、環境のターゲットと一致しなければ何もしない
- 抽象クラスを継承する形で環境ごとに定義
- 上記から、各Lambdaなどサービスを定義ごとに呼び出し。ここではcdkではなく、個別のインスタンスごとの定義
- インスタンス定義とデプロイメントはそれぞれ分ける
  - インスタンス抽象クラス（Construct継承）。factory関数でcdkのスタックを受ける
  - インスタンス具象クラス。factoryはcdkのスタックをNewする（New Bucketなど）
  - デプロイメントクラス（Construct継承し、メンバーにインスタンス具象を持つ）
    - 権限付与など。付与対象にはメンバーを配列に入れて設定する
- さらに上記から、cdkそのものの定義を呼び出す。その都合、ここでもそれぞれ個別に呼び出すので抽象クラスを継承させる
