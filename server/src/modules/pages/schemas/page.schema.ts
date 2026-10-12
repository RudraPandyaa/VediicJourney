import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose'
import {
  HydratedDocument,
  Types,
} from 'mongoose'

export type PageDocument =
  HydratedDocument<Page>

@Schema({
  _id: false,
})
export class PageSeo {
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

const PageSeoSchema =
  SchemaFactory.createForClass(PageSeo)

@Schema({
  timestamps: true,
  collection: 'pages',
})
export class Page {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  key!: string

  @Prop({
    required: true,
    trim: true,
  })
  title!: string

  @Prop({
    type: Object,
    default: {},
  })
  content!: Record<string, unknown>

  @Prop({
    type: PageSeoSchema,
    default: {},
  })
  seo!: PageSeo

  @Prop({
    default: true,
    index: true,
  })
  isPublished!: boolean
}

export const PageSchema =
  SchemaFactory.createForClass(Page)

PageSchema.index({
  key: 1,
  isPublished: 1,
})