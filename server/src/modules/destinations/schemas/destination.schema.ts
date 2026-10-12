import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose'
import {
  HydratedDocument,
  Types,
} from 'mongoose'

export type DestinationDocument =
  HydratedDocument<Destination>

@Schema({
  _id: false,
})
export class DestinationSeo {
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

const DestinationSeoSchema =
  SchemaFactory.createForClass(
    DestinationSeo,
  )

@Schema({
  timestamps: true,
  collection: 'destinations',
})
export class Destination {
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
    type: Types.ObjectId,
    ref: 'Region',
    required: true,
    index: true,
  })
  region!: Types.ObjectId

  @Prop({
    default: '',
    trim: true,
  })
  shortDescription!: string

  @Prop({
    default: '',
    trim: true,
  })
  overview!: string

  @Prop({
    type: Types.ObjectId,
    ref: 'Media',
    default: null,
  })
  heroImage?: Types.ObjectId

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Media',
      },
    ],
    default: [],
  })
  gallery!: Types.ObjectId[]

  @Prop({
    default: false,
    index: true,
  })
  isFeatured!: boolean

  @Prop({
    default: 0,
  })
  sortOrder!: number

  @Prop({
    default: false,
    index: true,
  })
  isPublished!: boolean

  @Prop({
    type: DestinationSeoSchema,
    default: {},
  })
  seo!: DestinationSeo
}

export const DestinationSchema =
  SchemaFactory.createForClass(
    Destination,
  )

DestinationSchema.index({
  region: 1,
  isPublished: 1,
  sortOrder: 1,
})

DestinationSchema.index({
  isFeatured: 1,
  isPublished: 1,
})