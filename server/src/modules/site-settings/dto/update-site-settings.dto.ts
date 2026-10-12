import {
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator'
import {
  Type,
} from 'class-transformer'

export class SocialLinksDto {
  @IsOptional()
  @IsUrl()
  instagram?: string

  @IsOptional()
  @IsUrl()
  facebook?: string

  @IsOptional()
  @IsUrl()
  youtube?: string

  @IsOptional()
  @IsUrl()
  linkedin?: string
}

export class GlobalSeoDto {
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

export class UpdateSiteSettingsDto {
  @IsOptional()
  @IsMongoId()
  logo?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  whatsapp?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto

  @IsOptional()
  @ValidateNested()
  @Type(() => GlobalSeoDto)
  seo?: GlobalSeoDto

  @IsOptional()
  @IsString()
  @MaxLength(500)
  footerText?: string
}