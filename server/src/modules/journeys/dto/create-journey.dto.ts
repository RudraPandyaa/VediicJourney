import {
  Transform,
  Type,
} from 'class-transformer'

import {
  ArrayMaxSize,
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

export class JourneyItineraryDayDto {
  @IsInt()
  @Min(1)
  day!: number

  @IsString()
  @MaxLength(200)
  title!: string

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string

  @IsOptional()
  @IsMongoId()
  place?: string

  @IsOptional()
  @IsMongoId()
  image?: string
}

export class JourneySeoDto {
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

export class CreateJourneyDto {
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

  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescription?: string

  @IsOptional()
  @IsString()
  @MaxLength(15000)
  overview?: string

  @IsInt()
  @Min(1)
  durationDays!: number

  @IsArray()
  @IsMongoId({
    each: true,
  })
  destinations!: string[]

  @IsOptional()
  @IsArray()
  @IsMongoId({
    each: true,
  })
  places?: string[]

  @IsOptional()
  @IsArray()
  @IsMongoId({
    each: true,
  })
  experiences?: string[]

  @IsOptional()
  @IsArray()
  @IsMongoId({
    each: true,
  })
  travelStyles?: string[]

  @IsOptional()
  @IsMongoId()
  heroImage?: string

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsMongoId({
    each: true,
  })
  gallery?: string[]

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({
    each: true,
  })
  @MaxLength(300, {
    each: true,
  })
  highlights?: string[]

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(60)
  @ValidateNested({
    each: true,
  })
  @Type(
    () => JourneyItineraryDayDto,
  )
  itinerary?: JourneyItineraryDayDto[]

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
  @Type(() => JourneySeoDto)
  seo?: JourneySeoDto
}