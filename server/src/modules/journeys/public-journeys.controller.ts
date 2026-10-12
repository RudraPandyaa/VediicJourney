import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  Query,
} from '@nestjs/common'

import {
  JourneysService,
} from './journeys.service'

@Controller('journeys')
export class PublicJourneysController {
  constructor(
    private readonly journeysService:
      JourneysService,
  ) {}

  @Get()
  findAll(
    @Query('destination')
    destination?: string,

    @Query('experience')
    experience?: string,

    @Query('travelStyle')
    travelStyle?: string,

    @Query(
      'featured',
      new ParseBoolPipe({
        optional: true,
      }),
    )
    featured?: boolean,
  ) {
    return this.journeysService.findAllPublic(
      destination,
      experience,
      travelStyle,
      featured,
    )
  }

  @Get(':slug')
  findOne(
    @Param('slug')
    slug: string,
  ) {
    return this.journeysService.findOnePublic(
      slug,
    )
  }
}