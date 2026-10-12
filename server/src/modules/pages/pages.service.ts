import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import {
  Page,
  PageDocument,
} from './schemas/page.schema'

import {
  UpdatePageDto,
} from './dto/update-page.dto'

const DEFAULT_PAGES = [
  {
    key: 'home',
    title: 'Home',
  },
  {
    key: 'about',
    title: 'About',
  },
  {
    key: 'contact',
    title: 'Contact',
  },
  {
    key: 'destinations',
    title: 'Destinations',
  },
]

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(Page.name)
    private readonly pageModel:
      Model<PageDocument>,
  ) {}

  private async ensureDefaultPages() {
    await Promise.all(
      DEFAULT_PAGES.map((page) =>
        this.pageModel
          .updateOne(
            {
              key: page.key,
            },
            {
              $setOnInsert: {
                ...page,
                content: {},
                seo: {},
                isPublished: true,
              },
            },
            {
              upsert: true,
            },
          )
          .exec(),
      ),
    )
  }

  async findAllAdmin() {
    await this.ensureDefaultPages()

    const data = await this.pageModel
      .find()
      .select(
        'key title isPublished updatedAt',
      )
      .sort({
        key: 1,
      })
      .lean()
      .exec()

    return {
      success: true,
      data,
    }
  }

  async findOneAdmin(
    key: string,
  ) {
    await this.ensureDefaultPages()

    const data = await this.pageModel
      .findOne({
        key: key.toLowerCase(),
      })
      .populate(
        'seo.ogImage',
        'url altText width height',
      )
      .lean()
      .exec()

    if (!data) {
      throw new NotFoundException(
        'Page not found',
      )
    }

    return {
      success: true,
      data,
    }
  }

  async update(
    key: string,
    dto: UpdatePageDto,
  ) {
    await this.ensureDefaultPages()

    const normalizedKey =
      key.toLowerCase()

    const exists =
      await this.pageModel.exists({
        key: normalizedKey,
      })

    if (!exists) {
      throw new NotFoundException(
        'Page not found',
      )
    }

    const update: Record<
      string,
      unknown
    > = {}

    if (dto.title !== undefined) {
      update.title = dto.title
    }

    if (dto.content !== undefined) {
      update.content = dto.content
    }

    if (
      dto.isPublished !== undefined
    ) {
      update.isPublished =
        dto.isPublished
    }

    /*
     * SEO uses dot notation so:
     *
     * { seo: { title: "New" } }
     *
     * doesn't accidentally remove
     * description / ogImage.
     */
    if (dto.seo) {
      for (
        const [seoKey, value]
        of Object.entries(dto.seo)
      ) {
        if (value !== undefined) {
          update[`seo.${seoKey}`] =
            value
        }
      }
    }

    const data = await this.pageModel
      .findOneAndUpdate(
        {
          key: normalizedKey,
        },
        {
          $set: update,
        },
        {
          returnDocument: 'after',
          runValidators: true,
        },
      )
      .populate(
        'seo.ogImage',
        'url altText width height',
      )
      .lean()
      .exec()

    if (!data) {
      throw new NotFoundException(
        'Page not found',
      )
    }

    return {
      success: true,
      data,
    }
  }

  async findOnePublic(
    key: string,
  ) {
    await this.ensureDefaultPages()

    const data = await this.pageModel
      .findOne({
        key: key.toLowerCase(),
        isPublished: true,
      })
      .select(
        'key title content seo updatedAt',
      )
      .populate(
        'seo.ogImage',
        'url altText width height',
      )
      .lean()
      .exec()

    if (!data) {
      throw new NotFoundException(
        'Page not found',
      )
    }

    return {
      success: true,
      data,
    }
  }
}