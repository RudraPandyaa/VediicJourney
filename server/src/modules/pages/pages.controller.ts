import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'

import {
  PagesService,
} from './pages.service'

import {
  UpdatePageDto,
} from './dto/update-page.dto'

import {
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard'

@Controller('admin/pages')
@UseGuards(JwtAuthGuard)
export class PagesController {
  constructor(
    private readonly pagesService:
      PagesService,
  ) {}

  @Get()
  findAll() {
    return this.pagesService.findAllAdmin()
  }

  @Get(':key')
  findOne(
    @Param('key')
    key: string,
  ) {
    return this.pagesService.findOneAdmin(
      key,
    )
  }

  @Patch(':key')
  update(
    @Param('key')
    key: string,

    @Body()
    dto: UpdatePageDto,
  ) {
    return this.pagesService.update(
      key,
      dto,
    )
  }
}