import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose'
import {
  HydratedDocument,
  Types,
} from 'mongoose'

export type CertificateDocument =
  HydratedDocument<Certificate>

export enum CertificateType {
  CERTIFICATE = 'certificate',
  AWARD = 'award',
  MEMBERSHIP = 'membership',
  ASSOCIATION = 'association',
}

@Schema({
  timestamps: true,
  collection: 'certificates',
})
export class Certificate {
  @Prop({
    required: true,
    trim: true,
  })
  title!: string

  @Prop({
    required: true,
    enum: CertificateType,
    default: CertificateType.CERTIFICATE,
  })
  type!: CertificateType

  @Prop({
    default: '',
    trim: true,
  })
  organization!: string

  @Prop({
    default: '',
    trim: true,
  })
  description!: string

  @Prop({
    type: Types.ObjectId,
    ref: 'Media',
    required: true,
  })
  image!: Types.ObjectId

  @Prop({
    default: '',
    trim: true,
  })
  externalUrl!: string

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

export const CertificateSchema =
  SchemaFactory.createForClass(Certificate)

CertificateSchema.index({
  isPublished: 1,
  sortOrder: 1,
})