import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import { Jimp } from 'jimp'
import 'dotenv/config'
import path from 'path'

const REPOSITORY_TOP = path.resolve(__dirname, '../../../')
const BUCKET_NAME = process.env.BUCKET_NAME

const validMimes = [
  'image/bmp',
  'image/tiff',
  'image/x-ms-bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
] as const

type ValidMime = (typeof validMimes)[number]

function isValidMime(mime: string): mime is ValidMime {
  return validMimes.includes(mime as ValidMime)
}

async function main() {
  const s3Client = new S3Client()
  const imagePath = path.join(REPOSITORY_TOP, 'images/test.png')
  console.log(`reading an image from: ${imagePath}`)

  const image = await Jimp.read(imagePath)

  if (!image.mime || !isValidMime(image.mime)) {
    throw new Error(`Unsupported MIME type: ${image.mime}`)
  }
  const mime:
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
  ).includes(image.mime)
    ? image.mime
    : 'image/png'

  const imageBuffer = await image.getBuffer(mime)

  const putInput: PutObjectCommandInput = {
    Bucket: BUCKET_NAME,
    Key: 'tmp/cdk.png',
    Body: imageBuffer,
  }
  const putCommand = new PutObjectCommand(putInput)
  const putResult = await s3Client.send(putCommand)
  console.log(putResult)
}

main()
