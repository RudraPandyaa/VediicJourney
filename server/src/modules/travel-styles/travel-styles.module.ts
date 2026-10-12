import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  TravelStyle,
  TravelStyleSchema,
} from './schemas/travel-style.schema'
import { TravelStylesService } from './travel-styles.service'
import { TravelStylesController } from './travel-styles.controller'
import { PublicTravelStylesController } from './public-travel-styles.controller'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TravelStyle.name,
        schema: TravelStyleSchema,
      },
    ]),
  ],

  controllers: [
    TravelStylesController,
    PublicTravelStylesController,
  ],

  providers: [
    TravelStylesService,
  ],

  exports: [
    TravelStylesService,
  ],
})
export class TravelStylesModule {}