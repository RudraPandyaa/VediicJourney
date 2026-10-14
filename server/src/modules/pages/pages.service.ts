import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
  Model,
  Types,
} from 'mongoose'

import {
  Media,
  MediaDocument,
} from '../media/schemas/media.schema'

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
    @InjectModel(Media.name)
      private readonly mediaModel:
      Model<MediaDocument>,
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

  private isObjectIdString(
    value: unknown,
  ): value is string {
    return (
      typeof value === 'string' &&
      Types.ObjectId.isValid(value)
    )
  }

  private collectMediaIds(
    value: unknown,
    ids: Set<string>,
  ) {
    if (this.isObjectIdString(value)) {
      ids.add(value)
      return
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        this.collectMediaIds(
          item,
          ids,
        )
      }

      return
    }

    if (
      value &&
      typeof value === 'object'
    ) {
      for (
        const nestedValue
        of Object.values(
          value as Record<
            string,
            unknown
          >,
        )
      ) {
        this.collectMediaIds(
          nestedValue,
          ids,
        )
      }
    }
  }

  private replaceMediaIds(
    value: unknown,
    mediaMap: Map<
      string,
      Record<string, unknown>
    >,
  ): unknown {
    if (this.isObjectIdString(value)) {
      return (
        mediaMap.get(value) ??
        value
      )
    }

    if (Array.isArray(value)) {
      return value.map((item) =>
        this.replaceMediaIds(
          item,
          mediaMap,
        ),
      )
    }

    if (
      value &&
      typeof value === 'object'
    ) {
      const result:
        Record<string, unknown> = {}

      for (
        const [key, nestedValue]
        of Object.entries(
          value as Record<
            string,
            unknown
          >,
        )
      ) {
        result[key] =
          this.replaceMediaIds(
            nestedValue,
            mediaMap,
          )
      }

      return result
    }

    return value
  }

  private async hydrateContentMedia(
    content: Record<string, unknown>,
  ) {
    const ids = new Set<string>()

    this.collectMediaIds(
      content,
      ids,
    )

    if (!ids.size) {
      return content
    }

    const media =
      await this.mediaModel
        .find({
          _id: {
            $in: Array.from(ids).map(
              (id) =>
                new Types.ObjectId(id),
            ),
          },
        })
        .select(
          'type filename url altText width height',
        )
        .lean()
        .exec()

    const mediaMap =
      new Map<
        string,
        Record<string, unknown>
      >()

    for (const item of media) {
      mediaMap.set(
        String(item._id),
        item as unknown as Record<
          string,
          unknown
        >,
      )
    }

    return this.replaceMediaIds(
      content,
      mediaMap,
    ) as Record<string, unknown>
  }

  async findOnePublic(
    key: string,
  ) {
    await this.ensureDefaultPages()

    const data =
      await this.pageModel
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

    const hydratedContent =
      await this.hydrateContentMedia(
        data.content ?? {},
      )

    return {
      success: true,

      data: {
        ...data,
        content: hydratedContent,
      },
    }
  }
}