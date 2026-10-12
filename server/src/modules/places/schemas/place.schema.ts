import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose'
import {
  HydratedDocument,
  Types,
} from 'mongoose'

export type PlaceDocument =
  HydratedDocument<Place>

@Schema({
  timestamps: true,
  collection: 'places',
})
export class Place {
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
    ref: 'Destination',
    required: true,
    index: true,
  })
  destination!: Types.ObjectId

  @Prop({
    default: '',
    trim: true,
  })
  shortDescription!: string

  @Prop({
    type: Types.ObjectId,
    ref: 'Media',
    default: null,
  })
  image?: Types.ObjectId

  @Prop({
    default: 0,
  })
  sortOrder!: number

  @Prop({
    default: false,
    index: true,
  })
  isPublished!: boolean
}

export const PlaceSchema =
  SchemaFactory.createForClass(Place)

PlaceSchema.index({
  destination: 1,
  isPublished: 1,
  sortOrder: 1,
})