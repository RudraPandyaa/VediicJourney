import { NestFactory } from '@nestjs/core'

import { AppModule } from '../app.module'

import { MediaService } from '../modules/media/media.service'
import { ExperiencesService } from '../modules/experiences/experiences.service'
import { TravelStylesService } from '../modules/travel-styles/travel-styles.service'

import {
  migrationExperiences,
  migrationTravelStyles,
  MigrationTaxonomy,
} from './data/taxonomies.data'

import {
  buildMediaMap,
  resolveMediaId,
} from './helpers/media-resolver.helper'

async function migrateTaxonomies() {
  const app =
    await NestFactory.createApplicationContext(
      AppModule,
    )

  try {
    const mediaService =
      app.get(MediaService)

    const experiencesService =
      app.get(ExperiencesService)

    const travelStylesService =
      app.get(TravelStylesService)

    const mediaMap =
      await buildMediaMap(mediaService)

    const experiencesResult =
      await experiencesService.findAllAdmin()

    const travelStylesResult =
      await travelStylesService.findAllAdmin()

    const existingExperiences =
      new Set(
        experiencesResult.data.map(
          (item) => item.slug,
        ),
      )

    const existingTravelStyles =
      new Set(
        travelStylesResult.data.map(
          (item) => item.slug,
        ),
      )

    let experiencesCreated = 0
    let experiencesSkipped = 0

    let travelStylesCreated = 0
    let travelStylesSkipped = 0

    async function createExperience(
      item: MigrationTaxonomy,
    ) {
      if (
        existingExperiences.has(
          item.slug,
        )
      ) {
        console.log(
          `[SKIP EXPERIENCE] ${item.name}`,
        )

        experiencesSkipped++
        return
      }

      const image =
        resolveMediaId(
          mediaMap,
          item.imageFilename,
        )

      await experiencesService.create({
        name: item.name,
        slug: item.slug,

        shortDescription:
          item.shortDescription,

        image,

        sortOrder:
          item.sortOrder,

        isPublished: true,
      })

      existingExperiences.add(
        item.slug,
      )

      experiencesCreated++

      console.log(
        `[CREATED EXPERIENCE] ${item.name}`,
      )
    }

    async function createTravelStyle(
      item: MigrationTaxonomy,
    ) {
      if (
        existingTravelStyles.has(
          item.slug,
        )
      ) {
        console.log(
          `[SKIP TRAVEL STYLE] ${item.name}`,
        )

        travelStylesSkipped++
        return
      }

      const image =
        resolveMediaId(
          mediaMap,
          item.imageFilename,
        )

      await travelStylesService.create({
        name: item.name,
        slug: item.slug,

        shortDescription:
          item.shortDescription,

        image,

        sortOrder:
          item.sortOrder,

        isPublished: true,
      })

      existingTravelStyles.add(
        item.slug,
      )

      travelStylesCreated++

      console.log(
        `[CREATED TRAVEL STYLE] ${item.name}`,
      )
    }

    console.log(
      'Migrating experiences...',
    )

    for (
      const experience
      of migrationExperiences
    ) {
      await createExperience(
        experience,
      )
    }

    console.log(
      '\nMigrating travel styles...',
    )

    for (
      const travelStyle
      of migrationTravelStyles
    ) {
      await createTravelStyle(
        travelStyle,
      )
    }

    console.log(
      '\nTaxonomy migration complete',
    )

    console.log({
      experiences: {
        total:
          migrationExperiences.length,

        created:
          experiencesCreated,

        skipped:
          experiencesSkipped,
      },

      travelStyles: {
        total:
          migrationTravelStyles.length,

        created:
          travelStylesCreated,

        skipped:
          travelStylesSkipped,
      },
    })
  } finally {
    await app.close()
  }
}

migrateTaxonomies().catch(
  (error) => {
    console.error(
      'Taxonomy migration failed:',
      error,
    )

    process.exit(1)
  },
)