import {
  Controller,
  Get,
  Param,
} from '@nestjs/common'

import { ExperiencesService } from './experiences.service'

@Controller('experiences')
export class PublicExperiencesController {
  constructor(
    private readonly experiencesService: ExperiencesService,
  ) {}

  @Get()
  findAll() {
    return this.experiencesService.findAllPublic()
  }

  @Get(':slug')
  findOne(
    @Param('slug') slug: string,
  ) {
    return this.experiencesService.findOnePublic(
      slug,
    )
  }
}