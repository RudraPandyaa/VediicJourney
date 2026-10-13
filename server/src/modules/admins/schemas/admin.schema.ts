import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose'

import {
  HydratedDocument,
} from 'mongoose'

export type AdminDocument =
  HydratedDocument<Admin>

export enum AdminStatus {
  INVITED = 'invited',
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

@Schema({
  timestamps: true,
  collection: 'admins',
})
export class Admin {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  name!: string

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email!: string

  @Prop({
    type: String,
    default: null,
    select: false,
  })
  passwordHash?: string | null

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive!: boolean

  @Prop({
    type: String,
    enum: Object.values(AdminStatus),
    default: AdminStatus.ACTIVE,
    index: true,
  })
  status!: AdminStatus

  @Prop({
    type: String,
    default: null,
    select: false,
  })
  inviteTokenHash?: string | null

  @Prop({
    type: Date,
    default: null,
  })
  inviteExpiresAt?: Date | null

  @Prop({
    type: Date,
    default: null,
  })
  lastLoginAt?: Date | null

  @Prop({
    type: String,
    default: null,
    select: false,
  })
  refreshTokenHash?: string | null
}

export const AdminSchema =
  SchemaFactory.createForClass(Admin)