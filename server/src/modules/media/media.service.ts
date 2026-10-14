import {
    BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  InjectModel,
} from '@nestjs/mongoose'
import {
  Model,
  Types,
} from 'mongoose'

import {
  Media,
  MediaDocument,
  MediaType,
} from './schemas/media.schema'
import {
  UpdateMediaDto,
} from './dto/update-media.dto'
import { StorageService } from './storage.service'

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name)
    private readonly mediaModel:
        Model<MediaDocument>,

    private readonly storageService:
        StorageService,
  ) {}

  async findAll(
    page = 1,
    limit = 24,
    type?: MediaType,
  ) {
    const safePage = Math.max(page, 1)

    const safeLimit = Math.min(
      Math.max(limit, 1),
      100,
    )

    const skip =
      (safePage - 1) * safeLimit

    const filter: Record<string, unknown> = {}

    if (type) {
      filter.type = type
    }

    const [items, total] =
      await Promise.all([
        this.mediaModel
          .find(filter)
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(safeLimit)
          .lean()
          .exec(),

        this.mediaModel
          .countDocuments(filter)
          .exec(),
      ])

    return {
      success: true,

      data: items,

      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages: Math.ceil(
          total / safeLimit,
        ),
      },
    }
  }

  async findOne(id: string) {
    const media =
      await this.mediaModel
        .findById(id)
        .lean()
        .exec()

    if (!media) {
      throw new NotFoundException(
        'Media not found',
      )
    }

    return {
      success: true,
      data: media,
    }
  }

  async update(
    id: string,
    updateMediaDto: UpdateMediaDto,
  ) {
    const media =
      await this.mediaModel
        .findByIdAndUpdate(
          id,
          {
            $set: updateMediaDto,
          },
          {
            returnDocument: 'after'
          },
        )
        .lean()
        .exec()

    if (!media) {
      throw new NotFoundException(
        'Media not found',
      )
    }

    return {
      success: true,
      data: media,
    }
  }

  async upload(
    file: Express.Multer.File,
    altText = '',
  ) {
    if (!file) {
      throw new BadRequestException(
        'Media file is required',
      )
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ]

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Unsupported media format',
      )
    }

    const isVideo =
      file.mimetype.startsWith('video/')

    const storedFile =
      await this.storageService.upload(file)

    try {
      const media =
        await this.mediaModel.create({
          type: isVideo
            ? MediaType.VIDEO
            : MediaType.IMAGE,

          filename: file.originalname,

          url: storedFile.url,

          storageKey: storedFile.storageKey,

          mimeType: file.mimetype,

          size: file.size,

          width: storedFile.width,
          height: storedFile.height,

          altText: altText.trim(),
        })

      return {
        success: true,
        data: media,
      }
    } catch (error) {
      await this.storageService.delete(
        storedFile.storageKey,
        isVideo ? 'video' : 'image',
      )

      throw error
    }
  }

  private containsMediaId(
    value: unknown,
    id: string,
  ): boolean {
    if (value == null) {
      return false
    }

    if (value instanceof Types.ObjectId) {
      return value.toString() === id
    }

    if (typeof value === 'string') {
      return value === id
    }

    if (Array.isArray(value)) {
      return value.some((item) =>
        this.containsMediaId(item, id),
      )
    }

    if (typeof value === 'object') {
      return Object.values(
        value as Record<string, unknown>,
      ).some((item) =>
        this.containsMediaId(item, id),
      )
    }

    return false
  }

  private async ensureMediaNotInUse(
    id: string,
  ) {
    const mediaId =
      new Types.ObjectId(id)

    const db = this.mediaModel.db

    const checks = await Promise.all([
      db.collection('regions').countDocuments({
        image: mediaId,
      }),

      db.collection('destinations').countDocuments({
        $or: [
          { heroImage: mediaId },
          { gallery: mediaId },
          { 'seo.ogImage': mediaId },
        ],
      }),

      db.collection('places').countDocuments({
        image: mediaId,
      }),

      db.collection('experiences').countDocuments({
        image: mediaId,
      }),

      db.collection('travelStyles').countDocuments({
        image: mediaId,
      }),

      db.collection('journeys').countDocuments({
        $or: [
          { heroImage: mediaId },
          { gallery: mediaId },
          { 'itinerary.image': mediaId },
          { 'seo.ogImage': mediaId },
        ],
      }),

      db.collection('articles').countDocuments({
        $or: [
          { coverImage: mediaId },
          { 'seo.ogImage': mediaId },
        ],
      }),

      db.collection('testimonials').countDocuments({
        image: mediaId,
      }),

      db.collection('certificates').countDocuments({
        image: mediaId,
      }),

      db.collection('siteSettings').countDocuments({
        $or: [
          { logo: mediaId },
          { 'seo.ogImage': mediaId },
        ],
      }),
    ])

    const pages =
      await db
        .collection('pages')
        .find(
          {},
          {
            projection: {
              content: 1,
              seo: 1,
            },
          },
        )
        .toArray()

    const isUsedByPage =
      pages.some((page) =>
        this.containsMediaId(
          page.content,
          id,
        ) ||
        this.containsMediaId(
          page.seo,
          id,
        ),
      )

    const isInUse =
      isUsedByPage ||
      checks.some(
        (count) => count > 0,
      )

    if (isInUse) {
      throw new BadRequestException(
        'Cannot delete media because it is currently being used by website content',
      )
    }
  }

  async remove(id: string) {
    const media = await this.mediaModel
      .findById(id)
      .exec()

    if (!media) {
      throw new NotFoundException(
        'Media not found',
      )
    }

    // Prevent deleting media that is used anywhere
    await this.ensureMediaNotInUse(id)

    // Delete actual file from Cloudinary
    if (media.storageKey) {
      await this.storageService.delete(
        media.storageKey,
        media.type === MediaType.VIDEO
          ? 'video'
          : 'image',
      )
    }

    // Delete MongoDB media record
    await this.mediaModel
      .deleteOne({
        _id: media._id,
      })
      .exec()

    return {
      success: true,
      message: 'Media deleted successfully',
    }
  }
}