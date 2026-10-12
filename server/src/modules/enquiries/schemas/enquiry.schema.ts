import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose'

import {
  HydratedDocument,
  Types,
} from 'mongoose'

export type EnquiryDocument =
  HydratedDocument<Enquiry>

export enum EnquiryType {
  JOURNEY = 'journey',
  GENERAL = 'general',
  FLIGHT = 'flight',
  VISA = 'visa',
}

export enum EnquiryStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  IN_PROGRESS = 'in_progress',
  CONVERTED = 'converted',
  CLOSED = 'closed',
}

@Schema({
  timestamps: true,
  collection: 'enquiries',
})
export class Enquiry {
  @Prop({
    required: true,
    enum: EnquiryType,
    index: true,
  })
  type!: EnquiryType

  @Prop({
    required: true,
    trim: true,
  })
  name!: string

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email!: string

  @Prop({
    default: '',
    trim: true,
  })
  phone!: string

  @Prop({
    default: '',
    trim: true,
  })
  country!: string

  @Prop({
    default: '',
    trim: true,
  })
  destination!: string

  @Prop({
    type: Types.ObjectId,
    ref: 'Journey',
    default: null,
  })
  journey?: Types.ObjectId

  @Prop({
    type: Types.ObjectId,
    ref: 'TravelStyle',
    default: null,
  })
  travelStyle?: Types.ObjectId

  @Prop({
    default: null,
  })
  travelDate?: Date

  @Prop({
    default: null,
    min: 1,
  })
  duration?: number

  @Prop({
    default: null,
    min: 1,
  })
  travellers?: number

  @Prop({
    default: '',
    trim: true,
  })
  message!: string

  // Flight enquiry fields

  @Prop({
    default: '',
    trim: true,
  })
  departureCity!: string

  @Prop({
    default: '',
    trim: true,
  })
  arrivalCity!: string

  @Prop({
    default: null,
  })
  departureDate?: Date

  @Prop({
    default: null,
  })
  returnDate?: Date

  @Prop({
    default: '',
    trim: true,
  })
  travelClass!: string

  @Prop({
    default: null,
    min: 1,
  })
  passengers?: number

  // Admin fields

  @Prop({
    required: true,
    enum: EnquiryStatus,
    default: EnquiryStatus.NEW,
    index: true,
  })
  status!: EnquiryStatus

  @Prop({
    default: '',
    trim: true,
  })
  notes!: string
}

export const EnquirySchema =
  SchemaFactory.createForClass(Enquiry)

EnquirySchema.index({
  status: 1,
  createdAt: -1,
})

EnquirySchema.index({
  type: 1,
  createdAt: -1,
})

EnquirySchema.index({
  createdAt: -1,
})