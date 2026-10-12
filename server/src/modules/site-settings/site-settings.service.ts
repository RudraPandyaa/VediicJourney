import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import {
  SiteSettings,
  SiteSettingsDocument,
} from './schemas/site-settings.schema'
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto'

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectModel(SiteSettings.name)
    private readonly siteSettingsModel: Model<SiteSettingsDocument>,
  ) {}

  async getSettings() {
    const settings = await this.siteSettingsModel
      .findOneAndUpdate(
        { key: 'global' },
        {
          $setOnInsert: {
            key: 'global',
          },
        },
        {
            returnDocument: 'after',
            upsert: true,
            runValidators: true,
        },
      )
      .populate('logo')
      .populate('seo.ogImage')
      .lean()
      .exec()

    return {
      success: true,
      data: settings,
    }
  }

    async updateSettings(
    dto: UpdateSiteSettingsDto,
    ) {
    const update: Record<string, unknown> = {}

    if (dto.logo !== undefined) {
        update.logo = dto.logo
    }

    if (dto.email !== undefined) {
        update.email = dto.email
    }

    if (dto.phone !== undefined) {
        update.phone = dto.phone
    }

    if (dto.whatsapp !== undefined) {
        update.whatsapp = dto.whatsapp
    }

    if (dto.address !== undefined) {
        update.address = dto.address
    }

    if (dto.footerText !== undefined) {
        update.footerText = dto.footerText
    }

    if (dto.socialLinks) {
        for (
        const [key, value]
        of Object.entries(dto.socialLinks)
        ) {
        if (value !== undefined) {
            update[`socialLinks.${key}`] = value
        }
        }
    }

    if (dto.seo) {
        for (
        const [key, value]
        of Object.entries(dto.seo)
        ) {
        if (value !== undefined) {
            update[`seo.${key}`] = value
        }
        }
    }

    const settings =
        await this.siteSettingsModel
        .findOneAndUpdate(
            { key: 'global' },
            {
            $set: update,
            $setOnInsert: {
                key: 'global',
            },
            },
            {
            returnDocument: 'after',
            upsert: true,
            runValidators: true,
            },
        )
        .populate('logo')
        .populate('seo.ogImage')
        .lean()
        .exec()

    return {
        success: true,
        data: settings,
    }
    }
}