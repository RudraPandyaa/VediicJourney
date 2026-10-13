import {
  Transform,
} from 'class-transformer'

import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator'

import {
  EnquiryType,
} from '../schemas/enquiry.schema'
export class CreateEnquiryDto {
  @IsEnum(EnquiryType)
  type!: EnquiryType

  @IsString()
  @MaxLength(150)
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  name!: string

  @IsEmail()
  @MaxLength(200)
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim().toLowerCase()
      : value,
  )
  email!: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  destination?: string

  @IsOptional()
  @IsMongoId()
  journey?: string

  @IsOptional()
  @IsMongoId()
  travelStyle?: string

  @IsOptional()
  @IsDateString()
  travelDate?: string

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  duration?: number

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  travellers?: number

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  message?: string

  @IsOptional()
  @IsString()
  @MaxLength(150)
  departureCity?: string

  @IsOptional()
  @IsString()
  @MaxLength(150)
  arrivalCity?: string

  @IsOptional()
  @IsDateString()
  departureDate?: string

  @IsOptional()
  @IsDateString()
  returnDate?: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  travelClass?: string

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  passengers?: number
}