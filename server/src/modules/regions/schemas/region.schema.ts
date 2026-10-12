import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose'
import {
  HydratedDocument,
  Types,
} from 'mongoose'

export type RegionDocument =
  HydratedDocument<Region>

@Schema({
  timestamps: true,
  collection: 'regions',
})
export class Region {
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

export const RegionSchema =
  SchemaFactory.createForClass(Region)

RegionSchema.index({
  isPublished: 1,
  sortOrder: 1,
})