import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  Place,
  PlaceSchema,
} from './schemas/place.schema'

import { PlacesService } from './places.service'
import { PlacesController } from './places.controller'
import { PublicPlacesController } from './public-places.controller'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Place.name,
        schema: PlaceSchema,
      },
    ]),
  ],

  controllers: [
    PlacesController,
    PublicPlacesController,
  ],

  providers: [
    PlacesService,
  ],

  exports: [
    PlacesService,
  ],
})
export class PlacesModule {}