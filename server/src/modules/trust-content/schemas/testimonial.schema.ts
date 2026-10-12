import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose'
import {
  HydratedDocument,
  Types,
} from 'mongoose'

export type TestimonialDocument =
  HydratedDocument<Testimonial>

@Schema({
  timestamps: true,
  collection: 'testimonials',
})
export class Testimonial {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string

  @Prop({
    default: '',
    trim: true,
  })
  country!: string

  @Prop({
    default: '',
    trim: true,
  })
  journey!: string

  @Prop({
    required: true,
    trim: true,
  })
  quote!: string

  @Prop({
    min: 1,
    max: 5,
    default: 5,
  })
  rating!: number

  @Prop({
    type: Types.ObjectId,
    ref: 'Media',
    default: null,
  })
  image?: Types.ObjectId

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
    default: true,
    index: true,
  })
  isPublished!: boolean
}

export const TestimonialSchema =
  SchemaFactory.createForClass(Testimonial)

TestimonialSchema.index({
  isPublished: 1,
  sortOrder: 1,
})

TestimonialSchema.index({
  isFeatured: 1,
  isPublished: 1,
})