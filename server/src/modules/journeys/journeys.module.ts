import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  Journey,
  JourneySchema,
} from './schemas/journey.schema'

import {
  JourneysController,
} from './journeys.controller'

import {
  PublicJourneysController,
} from './public-journeys.controller'

import {
  JourneysService,
} from './journeys.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Journey.name,
        schema: JourneySchema,
      },
    ]),
  ],

  controllers: [
    JourneysController,
    PublicJourneysController,
  ],

  providers: [
    JourneysService,
  ],

  exports: [
    JourneysService,
  ],
})
export class JourneysModule {}