import { Module } from '@nestjs/common'
import {
  MongooseModule,
} from '@nestjs/mongoose'

import {
  Region,
  RegionSchema,
} from './schemas/region.schema'
import { RegionsController } from './regions.controller'
import { RegionsService } from './regions.service'
import { PublicRegionsController } from './public-regions/public-regions.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Region.name,
        schema: RegionSchema,
      },
    ]),
  ],

  controllers: [
    RegionsController,
    PublicRegionsController,
  ],

  providers: [
    RegionsService,
  ],

  exports: [
    RegionsService,
  ],
})
export class RegionsModule {}