import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose'
import {
  HydratedDocument,
  Types,
} from 'mongoose'

export type JourneyDocument =
  HydratedDocument<Journey>

@Schema({
  _id: false,
})
export class JourneyItineraryDay {
  @Prop({
    required: true,
    min: 1,
  })
  day!: number

  @Prop({
    required: true,
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
    ref: 'Place',
    default: null,
  })
  place?: Types.ObjectId

  @Prop({
    type: Types.ObjectId,
    ref: 'Media',
    default: null,
  })
  image?: Types.ObjectId
}

export const JourneyItineraryDaySchema =
  SchemaFactory.createForClass(
    JourneyItineraryDay,
  )

@Schema({
  _id: false,
})
export class JourneySeo {
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

export const JourneySeoSchema =
  SchemaFactory.createForClass(
    JourneySeo,
  )

@Schema({
  timestamps: true,
  collection: 'journeys',
})
export class Journey {
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
    required: true,
    min: 1,
  })
  durationDays!: number

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Destination',
      },
    ],
    default: [],
    index: true,
  })
  destinations!: Types.ObjectId[]

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Place',
      },
    ],
    default: [],
  })
  places!: Types.ObjectId[]

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Experience',
      },
    ],
    default: [],
  })
  experiences!: Types.ObjectId[]

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'TravelStyle',
      },
    ],
    default: [],
  })
  travelStyles!: Types.ObjectId[]

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
    type: [String],
    default: [],
  })
  highlights!: string[]

  @Prop({
    type: [JourneyItineraryDaySchema],
    default: [],
  })
  itinerary!: JourneyItineraryDay[]

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
    type: JourneySeoSchema,
    default: {},
  })
  seo!: JourneySeo
}

export const JourneySchema =
  SchemaFactory.createForClass(Journey)

JourneySchema.index({
  isPublished: 1,
  sortOrder: 1,
})

JourneySchema.index({
  isFeatured: 1,
  isPublished: 1,
})

JourneySchema.index({
  destinations: 1,
  isPublished: 1,
})

JourneySchema.index({
  experiences: 1,
  isPublished: 1,
})

JourneySchema.index({
  travelStyles: 1,
  isPublished: 1,
})