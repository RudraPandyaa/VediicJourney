import {
  Controller,
  Get,
  Param,
} from '@nestjs/common'

import { TravelStylesService } from './travel-styles.service'

@Controller('travel-styles')
export class PublicTravelStylesController {
  constructor(
    private readonly travelStylesService: TravelStylesService,
  ) {}

  @Get()
  findAll() {
    return this.travelStylesService.findAllPublic()
  }

  @Get(':slug')
  findOne(
    @Param('slug') slug: string,
  ) {
    return this.travelStylesService.findOnePublic(
      slug,
    )
  }
}