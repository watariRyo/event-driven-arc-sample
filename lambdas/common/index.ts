import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import { Jimp } from 'jimp'

const validMimes = [
  'image/bmp',
  'image/tiff',
  'image/x-ms-bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
] as const

type ValidMime = (typeof validMimes)[number]

export async function getImageFromS3(
  s3Client: S3Client,
  bucketName: string,
  key: string,
) {
  const input: GetObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
  }
  console.log(`downloading from s3://${bucketName}/${key}`)

  const command = new GetObjectCommand(input)
  const result = await s3Client.send(command)
  if (!result.Body) {
    throw Error('result Body is undefined')
  }

  const body = await result.Body.transformToByteArray()
  const bodyBuffer = Buffer.from(body)
  const image = await Jimp.read(bodyBuffer)

  return image
}
export async function putImageToS3(
  s3Client: S3Client,
  bucketName: string,
  key: string,
  imageBuffer: Buffer,
) {
  const putInput: PutObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
    Body: imageBuffer,
  }
  console.log(`uploading to s3://${bucketName}/${key}`)
  const putCommand = new PutObjectCommand(putInput)
  const putResult = await s3Client.send(putCommand)
  console.log(putResult)
  return putResult
}

function isValidMime(mime: string): mime is ValidMime {
  return validMimes.includes(mime as ValidMime)
}

export function getValidMime(mime: string) {
  if (!isValidMime(mime)) {
    throw new Error(`Unsupported MIME type: ${mime}`)
  }
  const validMime:
    | 'image/bmp'
    | 'image/tiff'
    | 'image/x-ms-bmp'
    | 'image/gif'
    | 'image/jpeg'
    | 'image/png' = (
    [
      'image/bmp',
      'image/tiff',
      'image/x-ms-bmp',
      'image/gif',
      'image/jpeg',
      'image/png',
    ] as const
  ).includes(mime as ValidMime)
    ? mime
    : 'image/png'

  return validMime
}
