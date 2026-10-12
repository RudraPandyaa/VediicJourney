import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'

import { PlacesService } from './places.service'

@Controller('places')
export class PublicPlacesController {
  constructor(
    private readonly placesService:
      PlacesService,
  ) {}

  @Get()
  findAll(
    @Query('destination')
    destination?: string,
  ) {
    return this.placesService.findAllPublic(
      destination,
    )
  }

  @Get(':slug')
  findOne(
    @Param('slug')
    slug: string,
  ) {
    return this.placesService.findOnePublic(
      slug,
    )
  }
}