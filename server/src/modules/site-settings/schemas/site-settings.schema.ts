import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose'
import {
  HydratedDocument,
  Types,
} from 'mongoose'

export type SiteSettingsDocument =
  HydratedDocument<SiteSettings>

@Schema({
  _id: false,
})
export class SocialLinks {
  @Prop({ default: '' })
  instagram!: string

  @Prop({ default: '' })
  facebook!: string

  @Prop({ default: '' })
  youtube!: string

  @Prop({ default: '' })
  linkedin!: string
}

const SocialLinksSchema =
  SchemaFactory.createForClass(SocialLinks)

@Schema({
  _id: false,
})
export class GlobalSeo {
  @Prop({ default: '' })
  title!: string

  @Prop({ default: '' })
  description!: string

  @Prop({
    type: Types.ObjectId,
    ref: 'Media',
    default: null,
  })
  ogImage?: Types.ObjectId
}

const GlobalSeoSchema =
  SchemaFactory.createForClass(GlobalSeo)

@Schema({
  timestamps: true,
  collection: 'siteSettings',
})
export class SiteSettings {
  @Prop({
    required: true,
    unique: true,
    default: 'global',
  })
  key!: string

  @Prop({
    type: Types.ObjectId,
    ref: 'Media',
    default: null,
  })
  logo?: Types.ObjectId

  @Prop({ default: '' })
  email!: string

  @Prop({ default: '' })
  phone!: string

  @Prop({ default: '' })
  whatsapp!: string

  @Prop({ default: '' })
  address!: string

  @Prop({
    type: SocialLinksSchema,
    default: {},
  })
  socialLinks!: SocialLinks

  @Prop({
    type: GlobalSeoSchema,
    default: {},
  })
  seo!: GlobalSeo

  @Prop({ default: '' })
  footerText!: string
}

export const SiteSettingsSchema =
  SchemaFactory.createForClass(
    SiteSettings,
  )