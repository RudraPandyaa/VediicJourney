import {
  Controller,
  Get,
  Param,
} from '@nestjs/common'

import { RegionsService } from '../regions.service'

@Controller('regions')
export class PublicRegionsController {
  constructor(
    private readonly regionsService: RegionsService,
  ) {}

  @Get()
  findAll() {
    return this.regionsService.findAllPublic()
  }

  @Get(':slug')
  findOne(
    @Param('slug')
    slug: string,
  ) {
    return this.regionsService.findOnePublic(
      slug,
    )
  }
}