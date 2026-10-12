import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type AdminDocument = HydratedDocument<Admin>

@Schema({
  timestamps: true,
  collection: 'admins',
})
export class Admin {
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
    index: true,
  })
  email!: string

  @Prop({
    required: true,
    select: false,
  })
  passwordHash!: string

  @Prop({
    default: true,
  })
  isActive!: boolean

  @Prop({
    default: null,
  })
  lastLoginAt?: Date

  @Prop({
    default: null,
    select: false,
  })
  refreshTokenHash?: string
}

export const AdminSchema =
  SchemaFactory.createForClass(Admin)