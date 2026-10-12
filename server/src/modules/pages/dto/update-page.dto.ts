import {
  Type,
} from 'class-transformer'

import {
  IsBoolean,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator'

export class PageSeoDto {
  @IsOptional()
  @IsString()
  @MaxLength(70)
  title?: string

  @IsOptional()
  @IsString()
  @MaxLength(180)
  description?: string

  @IsOptional()
  @IsMongoId()
  ogImage?: string
}

export class UpdatePageDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string

  @IsOptional()
  @IsObject()
  content?: Record<string, unknown>

  @IsOptional()
  @ValidateNested()
  @Type(() => PageSeoDto)
  seo?: PageSeoDto

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean
}