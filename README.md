## 元ネタ

[AWS CDKとLambdaによるイベント・ドリブン・アーキテクチャ[SNS, SQS]](https://www.udemy.com/course/aws-cdk-lambda-sns-sqs/?couponCode=KEEPLEARNING)  
だが、lib直下に1ファイルなので、あえて抽象クラス作った  
AppRunnerだけ、とかLambdaだけ、とか限定的なら直下数ファイルでも良いだろう


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
- Lambdaにもpackage-lock.jsonが発生してしまうこと（Workspace使わなかったこと）
