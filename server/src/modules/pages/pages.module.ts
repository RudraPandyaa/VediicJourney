import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

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
    ]),
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