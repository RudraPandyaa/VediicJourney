import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common'

import { ArticlesService } from './articles/articles.service'
import { ArticleCategoriesService } from './article-categories/article-categories.service'

@Controller()
export class PublicJournalController {
  constructor(
    private readonly articlesService:
      ArticlesService,

    private readonly categoriesService:
      ArticleCategoriesService,
  ) {}

  @Get('article-categories')
  categories() {
    return this.categoriesService.findAllPublic()
  }

  @Get('articles')
  articles(
    @Query(
      'page',
      new DefaultValuePipe(1),
      ParseIntPipe,
    )
    page: number,

    @Query(
      'limit',
      new DefaultValuePipe(9),
      ParseIntPipe,
    )
    limit: number,

    @Query('category')
    category?: string,

    @Query(
      'featured',
      new ParseBoolPipe({
        optional: true,
      }),
    )
    featured?: boolean,
  ) {
    return this.articlesService.findAllPublic(
      page,
      limit,
      category,
      featured,
    )
  }

  @Get('articles/:slug')
  article(
    @Param('slug')
    slug: string,
  ) {
    return this.articlesService.findOnePublic(
      slug,
    )
  }
}