import { NestFactory } from '@nestjs/core'

import { AppModule } from '../app.module'
import { MediaService } from '../modules/media/media.service'
import { RegionsService } from '../modules/regions/regions.service'

import {
  migrationRegions,
} from './data/content-migration.data'

import {
  buildMediaMap,
  resolveMediaId,
} from './helpers/media-resolver.helper'

async function migrateRegions() {
  const app =
    await NestFactory.createApplicationContext(
      AppModule,
    )

  try {
    const regionsService =
      app.get(RegionsService)

    const mediaService =
      app.get(MediaService)

    const mediaMap =
      await buildMediaMap(mediaService)

    const existingResult =
      await regionsService.findAllAdmin()

    const existingBySlug =
      new Map(
        existingResult.data.map(
          (region) => [
            region.slug,
            region,
          ],
        ),
      )

    let created = 0
    let skipped = 0

    for (
      const region of migrationRegions
    ) {
      const existing =
        existingBySlug.get(
          region.slug,
        )

      if (existing) {
        console.log(
          `[SKIP EXISTING] ${region.name}`,
        )

        skipped++
        continue
      }

      const image =
        resolveMediaId(
          mediaMap,
          region.imageFilename,
        )

      const result =
        await regionsService.create({
          name: region.name,
          slug: region.slug,
          shortDescription:
            region.shortDescription,
          image,
          sortOrder:
            region.sortOrder,
          isPublished: true,
        })

      console.log(
        `[CREATED] ${result.data.name}`,
      )

      created++
    }

    console.log(
      '\nRegion migration complete',
    )

    console.log({
      created,
      skipped,
      total:
        migrationRegions.length,
    })
  } finally {
    await app.close()
  }
}

migrateRegions().catch(
  (error) => {
    console.error(
      'Region migration failed:',
      error,
    )

    process.exit(1)
  },
)