import { Jimp } from 'jimp'
import path from 'path'

const REPOSITORY_TOP = path.resolve(__dirname, '../../../')

async function main() {
  const imagePath = path.join(REPOSITORY_TOP, 'images/test.png')
  console.log(`reading an image from: ${imagePath}`)

  const image = await Jimp.read(imagePath)
  const width = image.width
  const height = image.height

  console.log(`original size: (${width} ${height})`)

  const resizeWidth = Math.floor(width / 2)
  const resizeHeight = Math.floor(height / 2)

  console.log(`resize: (${resizeWidth} ${resizeHeight})`)

  image.resize({
    w: resizeWidth,
    h: resizeHeight,
  })
  image.write('resize.png')
}

main()
