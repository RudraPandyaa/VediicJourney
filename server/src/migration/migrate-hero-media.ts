import { NestFactory } from '@nestjs/core'
import { join } from 'node:path'

import { AppModule } from '../app.module'
import { MediaService } from '../modules/media/media.service'
import { localFileToMulter } from './helpers/local-file.helper'

async function migrateHeroMedia() {
  const app = await NestFactory.createApplicationContext(
    AppModule,
  )

  try {
    const mediaService = app.get(MediaService)

    const heroPath = join(
      process.cwd(),
      '..',
      'client',
      'public',
      'videos',
      'hero.mp4',
    )

    console.log('Migrating:', heroPath)

    const file = await localFileToMulter(heroPath)

    const result = await mediaService.upload(
    file,
    'Vedic Journey homepage hero video',
    )

    const media = result.data

    console.log('\nHero video migrated successfully')
    console.log({
    id: media._id.toString(),
    filename: media.filename,
    type: media.type,
    url: media.url,
    })
  } finally {
    await app.close()
  }
}

migrateHeroMedia().catch((error) => {
  console.error('Hero migration failed:', error)
  process.exit(1)
})