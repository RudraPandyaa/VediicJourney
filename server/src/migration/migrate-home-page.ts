import {
  NestFactory,
} from '@nestjs/core'

import { AppModule } from '../app.module'

import {
  PagesService,
} from '../modules/pages/pages.service'

import {
  MediaService,
} from '../modules/media/media.service'

import {
  HOME_PAGE_CONTENT,
  HOME_PAGE_SEO,
} from './data/home-page.data'

type MediaItem = {
  _id: unknown
  filename?: string
}

async function bootstrap() {
  const app =
    await NestFactory.createApplicationContext(
      AppModule,
      {
        logger: [
          'error',
          'warn',
          'log',
        ],
      },
    )

  try {
    const pagesService =
      app.get(PagesService)

    const mediaService =
      app.get(MediaService)

    // ----------------------------------------------------------
    // BUILD MEDIA MAP
    // ----------------------------------------------------------

    const mediaMap =
      new Map<string, string>()

    let page = 1
    const limit = 100

    while (true) {
      const result =
        await mediaService.findAll(
          page,
          limit,
        )

      const items =
        (result.data ?? []) as MediaItem[]

      for (const media of items) {
        if (
          !media.filename ||
          !media._id
        ) {
          continue
        }

        const key =
          media.filename
            .trim()
            .toLowerCase()

        if (!mediaMap.has(key)) {
          mediaMap.set(
            key,
            String(media._id),
          )
        }
      }

      const pagination =
        result.pagination

      if (
        !pagination ||
        page >= pagination.pages
      ) {
        break
      }

      page += 1
    }

    const resolveMedia = (
      filename?: string,
    ) => {
      if (!filename) {
        return null
      }

      const id =
        mediaMap.get(
          filename.toLowerCase(),
        )

      if (!id) {
        console.warn(
          `[MEDIA NOT FOUND] ${filename}`,
        )

        return null
      }

      return id
    }

    // ----------------------------------------------------------
    // BUILD PAGE CONTENT
    // ----------------------------------------------------------

    const content = {
      ...HOME_PAGE_CONTENT,

      hero: {
        ...HOME_PAGE_CONTENT.hero,

        video:
          resolveMedia(
            HOME_PAGE_CONTENT
              .hero
              .videoFilename,
          ),
      },

      indiaSpotlight: {
        ...HOME_PAGE_CONTENT
          .indiaSpotlight,

        video:
          resolveMedia(
            HOME_PAGE_CONTENT
              .indiaSpotlight
              .videoFilename,
          ),
      },

      philosophy: {
        ...HOME_PAGE_CONTENT
          .philosophy,

        image:
          resolveMedia(
            HOME_PAGE_CONTENT
              .philosophy
              .imageFilename,
          ),
      },

      whyVedic: {
        ...HOME_PAGE_CONTENT
          .whyVedic,

        image:
          resolveMedia(
            HOME_PAGE_CONTENT
              .whyVedic
              .imageFilename,
          ),
      },

      travelSupport: {
        ...HOME_PAGE_CONTENT
          .travelSupport,

        services:
          HOME_PAGE_CONTENT
            .travelSupport
            .services
            .map((service) => ({
              ...service,

              image:
                resolveMedia(
                  service.imageFilename,
                ),
            })),
      },
    }

    // Remove migration-only filename helpers.
    delete (content.hero as any)
      .videoFilename

    delete (content.indiaSpotlight as any)
      .videoFilename

    delete (content.philosophy as any)
      .imageFilename

    delete (content.whyVedic as any)
      .imageFilename

    for (
      const service
      of content.travelSupport.services
    ) {
      delete (service as any)
        .imageFilename
    }

    // ----------------------------------------------------------
    // UPDATE HOME PAGE
    // ----------------------------------------------------------

    await pagesService.update(
      'home',
      {
        title: 'Home',

        content,

        seo: HOME_PAGE_SEO,

        isPublished: true,
      },
    )

    console.log(
      '[UPDATED PAGE] Home',
    )

    console.log(
      'Homepage CMS migration complete',
    )

    console.log({
      heroVideo:
        content.hero.video,
      indiaVideo:
        content.indiaSpotlight.video,
      philosophyImage:
        content.philosophy.image,
      whyVedicImage:
        content.whyVedic.image,
      supportServices:
        content.travelSupport
          .services.length,
    })
  } catch (error) {
    console.error(
      'Homepage CMS migration failed',
      error,
    )

    process.exitCode = 1
  } finally {
    await app.close()
  }
}

bootstrap()