import { Jimp } from 'jimp'
import path from 'path'

const REPOSITORY_TOP = path.resolve(__dirname, '../../../')

async function main() {
  const imagePath = path.join(REPOSITORY_TOP, 'images/test.png')
  console.log(`reading an image from: ${imagePath}`)

  const image = await Jimp.read(imagePath)

  image.greyscale()

  image.write('grayscale.png')
}

main()
