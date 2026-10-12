import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { Transform } from 'class-transformer'

export class UpdateMediaDto {
  @IsOptional()
  @IsString()
  @MaxLength(250)
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  altText?: string
}