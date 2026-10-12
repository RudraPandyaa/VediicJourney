import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  ArticleCategory,
  ArticleCategorySchema,
} from './schemas/article-category.schema'

import {
  Article,
  ArticleSchema,
} from './schemas/article.schema'

import {
  ArticleCategoriesController,
} from './article-categories/article-categories.controller'

import {
  ArticleCategoriesService,
} from './article-categories/article-categories.service'

import {
  ArticlesController,
} from './articles/articles.controller'

import {
  ArticlesService,
} from './articles/articles.service'

import {
  PublicJournalController,
} from './public-journal.controller'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ArticleCategory.name,
        schema: ArticleCategorySchema,
      },
      {
        name: Article.name,
        schema: ArticleSchema,
      },
    ]),
  ],

  controllers: [
    ArticleCategoriesController,
    ArticlesController,
    PublicJournalController,
  ],

  providers: [
    ArticleCategoriesService,
    ArticlesService,
  ],

  exports: [
    ArticleCategoriesService,
    ArticlesService,
  ],
})
export class JournalModule {}