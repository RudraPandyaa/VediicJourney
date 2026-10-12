import {
  Transform,
  Type,
} from 'class-transformer'

import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator'

export class ArticleSeoDto {
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

export class CreateArticleDto {
  @IsString()
  @MaxLength(200)
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  title!: string

  @IsString()
  @MaxLength(220)
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim().toLowerCase()
      : value,
  )
  slug!: string

  @IsMongoId()
  category!: string

  @IsOptional()
  @IsString()
  @MaxLength(800)
  excerpt?: string

  @IsOptional()
  @IsString()
  @MaxLength(100000)
  content?: string

  @IsOptional()
  @IsMongoId()
  coverImage?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  author?: string

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean

  @IsOptional()
  @IsDateString()
  publishedAt?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => ArticleSeoDto)
  seo?: ArticleSeoDto
}