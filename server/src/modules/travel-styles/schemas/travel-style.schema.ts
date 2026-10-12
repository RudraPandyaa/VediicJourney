import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose'
import {
  HydratedDocument,
  Types,
} from 'mongoose'

export type TravelStyleDocument =
  HydratedDocument<TravelStyle>

@Schema({
  timestamps: true,
  collection: 'travelStyles',
})
export class TravelStyle {
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
    default: true,
    index: true,
  })
  isPublished!: boolean
}

export const TravelStyleSchema =
  SchemaFactory.createForClass(TravelStyle)

TravelStyleSchema.index({
  isPublished: 1,
  sortOrder: 1,
})