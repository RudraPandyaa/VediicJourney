import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'

import { ArticleCategoriesService } from './article-categories.service'
import { CreateArticleCategoryDto } from '../dto/create-article-category.dto'
import { UpdateArticleCategoryDto } from '../dto/update-article-category.dto'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { ParseObjectIdPipe } from '../../../common/pipes/parse-object-id.pipe'

@Controller('admin/article-categories')
@UseGuards(JwtAuthGuard)
export class ArticleCategoriesController {
  constructor(
    private readonly service:
      ArticleCategoriesService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateArticleCategoryDto,
  ) {
    return this.service.create(dto)
  }

  @Get()
  findAll() {
    return this.service.findAllAdmin()
  }

  @Get(':id')
  findOne(
    @Param('id', ParseObjectIdPipe)
    id: string,
  ) {
    return this.service.findOneAdmin(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe)
    id: string,

    @Body()
    dto: UpdateArticleCategoryDto,
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe)
    id: string,
  ) {
    return this.service.remove(id)
  }
}