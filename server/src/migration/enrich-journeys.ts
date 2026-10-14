import { NestFactory } from '@nestjs/core'

import { AppModule } from '../app.module'

import { JourneysService } from '../modules/journeys/journeys.service'
import { ExperiencesService } from '../modules/experiences/experiences.service'
import { TravelStylesService } from '../modules/travel-styles/travel-styles.service'

type JourneyTaxonomyMapping = {
  journeySlug: string
  experienceSlugs: string[]
  travelStyleSlugs: string[]
}

const mappings: JourneyTaxonomyMapping[] = [
  {
    journeySlug: 'sacred-india',

    experienceSlugs: [
      'spiritual',
      'wellness',
      'cultural',
    ],

    travelStyleSlugs: [
      'solo',
      'couple',
    ],
  },

  {
    journeySlug: 'timeless-italy',

    experienceSlugs: [
      'culinary',
      'cultural',
      'romance',
      'luxury',
    ],

    travelStyleSlugs: [
      'couple',
      'honeymoon',
      'family',
    ],
  },

  {
    journeySlug: 'peru-heart-of-the-andes',

    experienceSlugs: [
      'adventure',
      'cultural',
      'culinary',
    ],

    travelStyleSlugs: [
      'solo',
      'couple',
    ],
  },

  {
    journeySlug: 'wild-south-africa',

    experienceSlugs: [
      'wildlife',
      'adventure',
      'luxury',
    ],

    travelStyleSlugs: [
      'couple',
      'family',
    ],
  },
]

async function enrichJourneys() {
  const app =
    await NestFactory.createApplicationContext(
      AppModule,
    )

  try {
    const journeysService =
      app.get(JourneysService)

    const experiencesService =
      app.get(ExperiencesService)

    const travelStylesService =
      app.get(TravelStylesService)

    console.log(
      'Loading journeys and taxonomies...',
    )

    const journeysResult =
      await journeysService.findAllAdmin()

    const experiencesResult =
      await experiencesService.findAllAdmin()

    const travelStylesResult =
      await travelStylesService.findAllAdmin()

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

    const experienceBySlug =
      new Map<string, string>()

    for (
      const experience
      of experiencesResult.data
    ) {
      experienceBySlug.set(
        experience.slug,
        experience._id.toString(),
      )
    }

    const travelStyleBySlug =
      new Map<string, string>()

    for (
      const travelStyle
      of travelStylesResult.data
    ) {
      travelStyleBySlug.set(
        travelStyle.slug,
        travelStyle._id.toString(),
      )
    }

    let updated = 0
    let missing = 0

    for (const mapping of mappings) {
      const journeyId =
        journeyBySlug.get(
          mapping.journeySlug,
        )

      if (!journeyId) {
        console.log(
          `[MISSING JOURNEY] ${mapping.journeySlug}`,
        )

        missing++
        continue
      }

      const experienceIds =
        mapping.experienceSlugs.map(
          (slug) => {
            const id =
              experienceBySlug.get(slug)

            if (!id) {
              throw new Error(
                `Experience not found: ${slug}`,
              )
            }

            return id
          },
        )

      const travelStyleIds =
        mapping.travelStyleSlugs.map(
          (slug) => {
            const id =
              travelStyleBySlug.get(slug)

            if (!id) {
              throw new Error(
                `Travel style not found: ${slug}`,
              )
            }

            return id
          },
        )

      await journeysService.update(
        journeyId,
        {
          experiences:
            experienceIds,

          travelStyles:
            travelStyleIds,
        },
      )

      updated++

      console.log(
        `[ENRICHED JOURNEY] ${mapping.journeySlug}`,
      )
    }

    console.log(
      '\nJourney enrichment complete',
    )

    console.log({
      total: mappings.length,
      updated,
      missing,
    })
  } finally {
    await app.close()
  }
}

enrichJourneys().catch(
  (error) => {
    console.error(
      'Journey enrichment failed:',
      error,
    )

    process.exit(1)
  },
)