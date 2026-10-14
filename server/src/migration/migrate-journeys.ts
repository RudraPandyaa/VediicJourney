import { NestFactory } from '@nestjs/core'

import { AppModule } from '../app.module'

import { MediaService } from '../modules/media/media.service'
import { DestinationsService } from '../modules/destinations/destinations.service'
import { PlacesService } from '../modules/places/places.service'
import { JourneysService } from '../modules/journeys/journeys.service'

import {
  migrationJourneys,
} from './data/journeys.data'

import {
  buildMediaMap,
  resolveMediaId,
} from './helpers/media-resolver.helper'

async function migrateJourneys() {
  const app =
    await NestFactory.createApplicationContext(
      AppModule,
    )

  try {
    const mediaService =
      app.get(MediaService)

    const destinationsService =
      app.get(DestinationsService)

    const placesService =
      app.get(PlacesService)

    const journeysService =
      app.get(JourneysService)

    console.log(
      'Loading media, destinations, places and journeys...',
    )

    const mediaMap =
      await buildMediaMap(mediaService)

    const destinationsResult =
      await destinationsService.findAllAdmin()

    const placesResult =
      await placesService.findAllAdmin()

    const journeysResult =
      await journeysService.findAllAdmin()

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

    const journeyBySlug =
      new Map<string, string>()

    for (
      const journey
      of journeysResult.data
    ) {
      journeyBySlug.set(
        journey.slug,
        journey._id.toString(),
      )
    }

    let created = 0
    let skipped = 0

    for (
      const journey
      of migrationJourneys
    ) {
      if (
        journeyBySlug.has(
          journey.slug,
        )
      ) {
        console.log(
          `[SKIP JOURNEY] ${journey.title}`,
        )

        skipped++
        continue
      }

      const destinationIds =
        journey.destinationSlugs.map(
          (slug) => {
            const id =
              destinationBySlug.get(slug)

            if (!id) {
              throw new Error(
                `Destination not found: ${slug}`,
              )
            }

            return id
          },
        )

      const placeIds =
        journey.placeSlugs.map(
          (slug) => {
            const id =
              placeBySlug.get(slug)

            if (!id) {
              throw new Error(
                `Place not found: ${slug}`,
              )
            }

            return id
          },
        )

      const itinerary =
        journey.itinerary.map(
          (day) => {
            let place:
              | string
              | undefined

            if (day.placeSlug) {
              place =
                placeBySlug.get(
                  day.placeSlug,
                )

              if (!place) {
                throw new Error(
                  `Itinerary place not found: ${day.placeSlug}`,
                )
              }
            }

            return {
              day: day.day,
              title: day.title,
              description:
                day.description,
              place,
            }
          },
        )

      const heroImage =
        resolveMediaId(
          mediaMap,
          journey.heroImageFilename,
        )

      const result =
        await journeysService.create({
          title: journey.title,
          slug: journey.slug,

          shortDescription:
            journey.shortDescription,

          overview:
            journey.overview,

          durationDays:
            journey.durationDays,

          destinations:
            destinationIds,

          places:
            placeIds,

          experiences: [],
          travelStyles: [],

          heroImage,

          gallery: [],

          highlights:
            journey.highlights,

          itinerary,

          isFeatured:
            journey.isFeatured,

          sortOrder:
            journey.sortOrder,

          isPublished: true,

          seo: {
            title:
              `${journey.title} | Vedic Journey`,

            description:
              journey.shortDescription,

            ogImage:
              heroImage,
          },
        })

      journeyBySlug.set(
        journey.slug,
        result.data!._id.toString(),
      )

      created++

      console.log(
        `[CREATED JOURNEY] ${journey.title}`,
      )
    }

    console.log(
      '\nJourney migration complete',
    )

    console.log({
      total:
        migrationJourneys.length,
      created,
      skipped,
    })
  } finally {
    await app.close()
  }
}

migrateJourneys().catch(
  (error) => {
    console.error(
      'Journey migration failed:',
      error,
    )

    process.exit(1)
  },
)