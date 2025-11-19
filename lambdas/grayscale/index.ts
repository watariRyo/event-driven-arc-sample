import { S3Client } from '@aws-sdk/client-s3'
import { SQSEvent, SQSHandler } from 'aws-lambda'
import path from 'path'
import { getImageFromS3, getValidMime, putImageToS3 } from '../common/index'
import { S3Message } from '../common/types'

const PROCESS = 'grayscale'

export const handler: SQSHandler = async (event: SQSEvent) => {
  const s3Client = new S3Client()

  for (const record of event.Records) {
    // 1. download
    const message = record.body
    const s3Message: S3Message = JSON.parse(message)

    const bucketName = s3Message.bucketName
    const key = s3Message.key
    const parsedKey = path.parse(key)

    const image = await getImageFromS3(s3Client, bucketName, key)
    // 2. process
    image.greyscale()

    // 3. upload
    if (!image.mime) {
      console.error(`Invalid mime type for ${key}, skipping...`)
      continue
    }
    const mime = getValidMime(image.mime)

    const imageBuffer = await image.getBuffer(mime)

    const uplodKey = `${PROCESS}/${parsedKey.name}-${PROCESS}${parsedKey.ext}`
    await putImageToS3(s3Client, bucketName, uplodKey, imageBuffer)
  }
}
