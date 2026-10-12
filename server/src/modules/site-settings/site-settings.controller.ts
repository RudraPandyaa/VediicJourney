import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common'

import { SiteSettingsService } from './site-settings.service'
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller()
export class SiteSettingsController {
  constructor(
    private readonly siteSettingsService: SiteSettingsService,
  ) {}

  // Public website
  @Get('site-settings')
  getPublicSettings() {
    return this.siteSettingsService.getSettings()
  }

  // Admin dashboard
  @Get('admin/site-settings')
  @UseGuards(JwtAuthGuard)
  getAdminSettings() {
    return this.siteSettingsService.getSettings()
  }

  @Patch('admin/site-settings')
  @UseGuards(JwtAuthGuard)
  updateSettings(
    @Body() dto: UpdateSiteSettingsDto,
  ) {
    return this.siteSettingsService.updateSettings(dto)
  }
}