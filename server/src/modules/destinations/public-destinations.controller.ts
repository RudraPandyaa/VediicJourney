import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  Query,
} from '@nestjs/common'

import {
  DestinationsService,
} from './destinations.service'

@Controller('destinations')
export class PublicDestinationsController {
  constructor(
    private readonly destinationsService:
      DestinationsService,
  ) {}

  @Get()
  findAll(
    @Query('region')
    region?: string,

    @Query(
      'featured',
      new ParseBoolPipe({
        optional: true,
      }),
    )
    featured?: boolean,
  ) {
    return this.destinationsService.findAllPublic(
      region,
      featured,
    )
  }

  @Get(':slug')
  findOne(
    @Param('slug')
    slug: string,
  ) {
    return this.destinationsService.findOnePublic(
      slug,
    )
  }
}