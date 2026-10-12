import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  Experience,
  ExperienceSchema,
} from './schemas/experience.schema'

import { ExperiencesService } from './experiences.service'
import { ExperiencesController } from './experiences.controller'
import { PublicExperiencesController } from './public-experiences.controller'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Experience.name,
        schema: ExperienceSchema,
      },
    ]),
  ],

  controllers: [
    ExperiencesController,
    PublicExperiencesController,
  ],

  providers: [
    ExperiencesService,
  ],

  exports: [
    ExperiencesService,
  ],
})
export class ExperiencesModule {}