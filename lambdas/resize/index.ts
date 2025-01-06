import { S3Client } from "@aws-sdk/client-s3"
import { S3Handler } from "aws-lambda"
import path from 'path'
import { getImageFromS3, getValidMime, putImageToS3 } from '../common/index'
import { S3Message } from '../common/types'
import { SendMessageCommand, SendMessageCommandInput, SQSClient } from "@aws-sdk/client-sqs"

const QUEUE_URL = process.env.QUEUE_URL
const PROCESS = "resize"

export const handler: S3Handler = async(event) => {

    const s3Client = new S3Client()

    for (const record of event.Records) {
        // 1. download
        const bucketName = record.s3.bucket.name
        const key = record.s3.object.key
        const parsedKey = path.parse(key)

        // 2. edit
        const image = await getImageFromS3(s3Client, bucketName, key)
        const width = image.width
        const height = image.height
    
        console.log(`original size: (${width} ${height})`)
    
        const resizeWidth = Math.floor(width / 2)
        const resizeHeight = Math.floor(height / 2)
    
        console.log(`${PROCESS}: (${resizeWidth} ${resizeHeight})`)
    
        image.resize({
            w: resizeWidth,
            h: resizeHeight
        })

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