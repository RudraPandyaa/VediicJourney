import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
  Media,
  MediaSchema,
} from '../media/schemas/media.schema'
import {
  Page,
  PageSchema,
} from './schemas/page.schema'

import {
  PagesController,
} from './pages.controller'

import {
  PublicPagesController,
} from './public-pages.controller'

import {
  PagesService,
} from './pages.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Page.name,
        schema: PageSchema,
      },
      {
        name: Media.name,
        schema: MediaSchema,
      },
    ])
  ],

  controllers: [
    PagesController,
    PublicPagesController,
  ],

  providers: [
    PagesService,
  ],

  exports: [
    PagesService,
  ],
})
export class PagesModule {}