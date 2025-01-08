import { S3Client } from "@aws-sdk/client-s3"
import { S3Event, SQSEvent, SQSHandler } from "aws-lambda"
import path from 'path'
import { getImageFromS3, getValidMime, putImageToS3 } from '../common/index'
import { S3Message } from '../common/types'
import { SendMessageCommand, SendMessageCommandInput, SQSClient } from "@aws-sdk/client-sqs"

const QUEUE_URL = process.env.QUEUE_URL
const PROCESS = "blur"

export const handler: SQSHandler = async(event: SQSEvent) => {
    console.log(`SQS Event: ${JSON.stringify(event, null, 2)}`)

    const s3Client = new S3Client()
    for (const record of event.Records) {
        const message = record.body
        const s3Event: S3Event = JSON.parse(message)
        console.log(`S3 Event: ${JSON.stringify(s3Event, null, 2)}`)

        for (const s3Record of s3Event.Records) {
        // 1. download
        const key = s3Record.s3.object.key
        const bucketName = s3Record.s3.bucket.name
        const parsedKey = path.parse(key)

        // 2. edit
        const image = await getImageFromS3(s3Client, bucketName, key)
        const blur = 10
        console.log(`${PROCESS} the image for ${key}, degree: ${blur}`)
        image.blur(blur)

        // 3. upload
        const mime = getValidMime(image.mime!)
    
        const imageBuffer = await image.getBuffer(mime)
    
        const uplodKey = `${PROCESS}/${parsedKey.name}-${PROCESS}${parsedKey.ext}`
        await putImageToS3(s3Client, bucketName, uplodKey, imageBuffer)

        // 4. send message to sqs
        const s3Message: S3Message = {
            bucketName: bucketName,
            key: uplodKey
        }
        const sqsClient = new SQSClient()
        const input: SendMessageCommandInput = {
            QueueUrl: QUEUE_URL,
            MessageBody: JSON.stringify(s3Message)
        }
        const sqsCommand: SendMessageCommand = new SendMessageCommand(input)
        await sqsClient.send(sqsCommand)
        console.log(`sent the message to SQS, message: ${JSON.stringify(s3Message)}`)
        }
    }

    for (const record of event.Records) {

    }
}