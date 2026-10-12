import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose'
import {
  HydratedDocument,
} from 'mongoose'

export type MediaDocument =
  HydratedDocument<Media>

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Schema({
  timestamps: true,
  collection: 'media',
})
export class Media {
  @Prop({
    required: true,
    enum: MediaType,
  })
  type!: MediaType

  @Prop({
    required: true,
    trim: true,
  })
  filename!: string

  @Prop({
    required: true,
    trim: true,
  })
  url!: string

  @Prop({
    trim: true,
    default: '',
  })
  altText!: string

  @Prop({
    required: true,
  })
  mimeType!: string

  @Prop({
    required: true,
  })
  size!: number

  @Prop()
  width?: number

  @Prop()
  height?: number

  @Prop({
    trim: true,
  })
  storageKey?: string
}

export const MediaSchema =
  SchemaFactory.createForClass(Media)

MediaSchema.index({
  createdAt: -1,
})