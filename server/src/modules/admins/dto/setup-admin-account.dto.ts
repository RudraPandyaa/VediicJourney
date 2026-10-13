import {
  IsString,
  MinLength,
} from 'class-validator'

export class SetupAdminAccountDto {
  @IsString()
  token!: string

  @IsString()
  @MinLength(8)
  password!: string
}