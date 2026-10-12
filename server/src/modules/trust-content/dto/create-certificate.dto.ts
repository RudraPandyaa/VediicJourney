import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator'

import {
  CertificateType,
} from '../schemas/certificate.schema'

export class CreateCertificateDto {
  @IsString()
  @MaxLength(200)
  title!: string

  @IsEnum(CertificateType)
  type!: CertificateType

  @IsOptional()
  @IsString()
  @MaxLength(200)
  organization?: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string

  @IsMongoId()
  image!: string

  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  externalUrl?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean
}