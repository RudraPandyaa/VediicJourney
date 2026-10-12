import {
  Type,
  Transform,
} from 'class-transformer'

import {
  IsArray,
  IsBoolean,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator'

export class DestinationSeoDto {
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

export class CreateDestinationDto {
  @IsString()
  @MaxLength(120)
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  name!: string

  @IsString()
  @MaxLength(150)
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim().toLowerCase()
      : value,
  )
  slug!: string

  @IsMongoId()
  region!: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescription?: string

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  overview?: string

  @IsOptional()
  @IsMongoId()
  heroImage?: string

  @IsOptional()
  @IsArray()
  @IsMongoId({
    each: true,
  })
  gallery?: string[]

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean

  @IsOptional()
  @ValidateNested()
  @Type(() => DestinationSeoDto)
  seo?: DestinationSeoDto
}