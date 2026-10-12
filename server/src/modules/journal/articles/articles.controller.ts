import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'

import { ArticlesService } from './articles.service'
import { CreateArticleDto } from '../dto/create-article.dto'
import { UpdateArticleDto } from '../dto/update-article.dto'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { ParseObjectIdPipe } from '../../../common/pipes/parse-object-id.pipe'

@Controller('admin/articles')
@UseGuards(JwtAuthGuard)
export class ArticlesController {
  constructor(
    private readonly service:
      ArticlesService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateArticleDto,
  ) {
    return this.service.create(dto)
  }

  @Get()
  findAll(
    @Query(
      'page',
      new DefaultValuePipe(1),
      ParseIntPipe,
    )
    page: number,

    @Query(
      'limit',
      new DefaultValuePipe(20),
      ParseIntPipe,
    )
    limit: number,
  ) {
    return this.service.findAllAdmin(
      page,
      limit,
    )
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
    dto: UpdateArticleDto,
  ) {
    return this.service.update(
      id,
      dto,
    )
  }

  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe)
    id: string,
  ) {
    return this.service.remove(id)
  }
}