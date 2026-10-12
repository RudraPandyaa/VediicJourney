import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ArticleCategoryDocument =
  HydratedDocument<ArticleCategory>

@Schema({
  timestamps: true,
  collection: 'articleCategories',
})
export class ArticleCategory {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  slug!: string

  @Prop({
    default: '',
    trim: true,
  })
  description!: string

  @Prop({
    default: 0,
  })
  sortOrder!: number

  @Prop({
    default: true,
    index: true,
  })
  isPublished!: boolean
}

export const ArticleCategorySchema =
  SchemaFactory.createForClass(
    ArticleCategory,
  )

ArticleCategorySchema.index({
  isPublished: 1,
  sortOrder: 1,
})