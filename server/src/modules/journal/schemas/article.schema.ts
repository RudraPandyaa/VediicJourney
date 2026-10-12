import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose'
import {
  HydratedDocument,
  Types,
} from 'mongoose'

export type ArticleDocument =
  HydratedDocument<Article>

@Schema({
  _id: false,
})
export class ArticleSeo {
  @Prop({
    default: '',
    trim: true,
  })
  title!: string

  @Prop({
    default: '',
    trim: true,
  })
  description!: string

  @Prop({
    type: Types.ObjectId,
    ref: 'Media',
    default: null,
  })
  ogImage?: Types.ObjectId
}

const ArticleSeoSchema =
  SchemaFactory.createForClass(
    ArticleSeo,
  )

@Schema({
  timestamps: true,
  collection: 'articles',
})
export class Article {
  @Prop({
    required: true,
    trim: true,
  })
  title!: string

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  slug!: string

  @Prop({
    type: Types.ObjectId,
    ref: 'ArticleCategory',
    required: true,
    index: true,
  })
  category!: Types.ObjectId

  @Prop({
    default: '',
    trim: true,
  })
  excerpt!: string

  @Prop({
    default: '',
  })
  content!: string

  @Prop({
    type: Types.ObjectId,
    ref: 'Media',
    default: null,
  })
  coverImage?: Types.ObjectId

  @Prop({
    default: 'Vedic Journey',
    trim: true,
  })
  author!: string

  @Prop({
    default: false,
    index: true,
  })
  isFeatured!: boolean

  @Prop({
    default: false,
    index: true,
  })
  isPublished!: boolean

  @Prop({
    default: null,
    index: true,
  })
  publishedAt?: Date

  @Prop({
    type: ArticleSeoSchema,
    default: {},
  })
  seo!: ArticleSeo
}

export const ArticleSchema =
  SchemaFactory.createForClass(Article)

ArticleSchema.index({
  isPublished: 1,
  publishedAt: -1,
})

ArticleSchema.index({
  category: 1,
  isPublished: 1,
  publishedAt: -1,
})

ArticleSchema.index({
  isFeatured: 1,
  isPublished: 1,
})