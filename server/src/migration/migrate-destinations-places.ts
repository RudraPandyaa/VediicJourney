import { NestFactory } from '@nestjs/core'

import { AppModule } from '../app.module'

import { MediaService } from '../modules/media/media.service'
import { RegionsService } from '../modules/regions/regions.service'
import { DestinationsService } from '../modules/destinations/destinations.service'
import { PlacesService } from '../modules/places/places.service'

import {
  migrationDestinations,
} from './data/destinations-places.data'

import {
  buildMediaMap,
  resolveMediaId,
} from './helpers/media-resolver.helper'

async function migrate() {
  const app =
    await NestFactory.createApplicationContext(
      AppModule,
    )

  try {
    const mediaService =
      app.get(MediaService)

    const regionsService =
      app.get(RegionsService)

    const destinationsService =
      app.get(DestinationsService)

    const placesService =
      app.get(PlacesService)

    console.log(
      'Loading media, regions, destinations and places...',
    )

    const mediaMap =
      await buildMediaMap(mediaService)

    const regionsResult =
      await regionsService.findAllAdmin()

    const destinationsResult =
      await destinationsService.findAllAdmin()

    const placesResult =
      await placesService.findAllAdmin()

    const regionBySlug =
      new Map<string, string>()

    for (const region of regionsResult.data) {
      regionBySlug.set(
        region.slug,
        region._id.toString(),
      )
    }

    const destinationBySlug =
      new Map<string, string>()

    for (
      const destination
      of destinationsResult.data
    ) {
      destinationBySlug.set(
        destination.slug,
        destination._id.toString(),
      )
    }

    const placeBySlug =
      new Map<string, string>()

    for (const place of placesResult.data) {
      placeBySlug.set(
        place.slug,
        place._id.toString(),
      )
    }

    let destinationsCreated = 0
    let destinationsSkipped = 0

    let placesCreated = 0
    let placesSkipped = 0

    for (
      const destination
      of migrationDestinations
    ) {
      const regionId =
        regionBySlug.get(
          destination.regionSlug,
        )

      if (!regionId) {
        throw new Error(
          `Region not found: ${destination.regionSlug}`,
        )
      }

      let destinationId =
        destinationBySlug.get(
          destination.slug,
        )

      if (destinationId) {
        console.log(
          `[SKIP DESTINATION] ${destination.name}`,
        )

        destinationsSkipped++
      } else {
        const heroImage =
          resolveMediaId(
            mediaMap,
            destination.heroImageFilename,
          )

        const result =
          await destinationsService.create({
            name: destination.name,
            slug: destination.slug,
            region: regionId,

            shortDescription:
              destination.shortDescription,

            overview:
              destination.overview,

            heroImage,

            gallery: [],

            isFeatured:
              destination.isFeatured ??
              false,

            sortOrder:
              destination.sortOrder,

            isPublished: true,

            seo: {
              title:
                `${destination.name} Luxury Travel | Vedic Journey`,

              description:
                destination.shortDescription,
            },
          })

        destinationId =
          result.data!._id.toString()

        destinationBySlug.set(
          destination.slug,
          destinationId,
        )

        destinationsCreated++

        console.log(
          `[CREATED DESTINATION] ${destination.name}`,
        )
      }

      for (
        let index = 0;
        index <
        destination.places.length;
        index++
      ) {
        const place =
          destination.places[index]

        const existingPlace =
          placeBySlug.get(
            place.slug,
          )

        if (existingPlace) {
          console.log(
            `  [SKIP PLACE] ${place.name}`,
          )

          placesSkipped++
          continue
        }

        const image =
          resolveMediaId(
            mediaMap,
            place.imageFilename,
          )

        const result =
          await placesService.create({
            name: place.name,
            slug: place.slug,

            destination:
              destinationId,

            shortDescription:
              place.shortDescription,

            image,

            sortOrder:
              index + 1,

            isPublished: true,
          })

        placeBySlug.set(
          place.slug,
          result.data!._id.toString(),
        )

        placesCreated++

        console.log(
          `  [CREATED PLACE] ${place.name}`,
        )
      }
    }

    console.log(
      '\n--------------------------------',
    )

    console.log(
      'Destinations + Places migration complete',
    )

    console.log({
      destinations: {
        total:
          migrationDestinations.length,

        created:
          destinationsCreated,

        skipped:
          destinationsSkipped,
      },

      places: {
        created:
          placesCreated,

        skipped:
          placesSkipped,
      },
    })
  } finally {
    await app.close()
  }
}

migrate().catch(
  (error) => {
    console.error(
      'Migration failed:',
      error,
    )

    process.exit(1)
  },
)