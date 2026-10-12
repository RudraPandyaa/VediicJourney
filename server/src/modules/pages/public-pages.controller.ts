import {
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common'

import { PagesService } from './pages.service'

import {
  PublicCacheInterceptor,
} from '../../common/interceptors/public-cache.interceptor'

@Controller('pages')
@UseInterceptors(PublicCacheInterceptor)
export class PublicPagesController {
  constructor(
    private readonly pagesService: PagesService,
  ) {}

  @Get(':key')
  findOne(
    @Param('key') key: string,
  ) {
    return this.pagesService.findOnePublic(key)
  }
}