import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import {
  Article,
  ArticleDocument,
} from '../schemas/article.schema'
import { CreateArticleDto } from '../dto/create-article.dto'
import { UpdateArticleDto } from '../dto/update-article.dto'

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel:
      Model<ArticleDocument>,
  ) {}

  private async validateCategory(
    categoryId: string,
  ) {
    const category =
      await this.articleModel.db
        .collection('articleCategories')
        .findOne(
          {
            _id: new Types.ObjectId(
              categoryId,
            ),
          },
          {
            projection: {
              _id: 1,
            },
          },
        )

    if (!category) {
      throw new BadRequestException(
        'Article category does not exist',
      )
    }
  }

  async create(dto: CreateArticleDto) {
    const existing =
      await this.articleModel.exists({
        slug: dto.slug,
      })

    if (existing) {
      throw new ConflictException(
        'Article slug already exists',
      )
    }

    await this.validateCategory(
      dto.category,
    )

    const payload = {
      ...dto,
      publishedAt:
        dto.isPublished &&
        !dto.publishedAt
          ? new Date()
          : dto.publishedAt,
    }

    const article =
      await this.articleModel.create(
        payload,
      )

    return this.findOneAdmin(
      article._id.toString(),
    )
  }

  async findAllAdmin(
    page = 1,
    limit = 20,
  ) {
    const safePage = Math.max(
      1,
      page,
    )

    const safeLimit = Math.min(
      100,
      Math.max(1, limit),
    )

    const skip =
      (safePage - 1) * safeLimit

    const [data, total] =
      await Promise.all([
        this.articleModel
          .find()
          .select(
            'title slug category coverImage author isFeatured isPublished publishedAt createdAt updatedAt',
          )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(safeLimit)
          .populate(
            'category',
            'name slug',
          )
          .populate(
            'coverImage',
            'url altText width height',
          )
          .lean()
          .exec(),

        this.articleModel
          .countDocuments()
          .exec(),
      ])

    return {
      success: true,
      data,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages:
          Math.ceil(
            total / safeLimit,
          ),
      },
    }
  }

  async findOneAdmin(id: string) {
    const data =
      await this.articleModel
        .findById(id)
        .populate(
          'category',
          'name slug',
        )
        .populate('coverImage')
        .populate('seo.ogImage')
        .lean()
        .exec()

    if (!data) {
      throw new NotFoundException(
        'Article not found',
      )
    }

    return {
      success: true,
      data,
    }
  }

  async update(
    id: string,
    dto: UpdateArticleDto,
  ) {
    const existingArticle =
      await this.articleModel
        .findById(id)
        .exec()

    if (!existingArticle) {
      throw new NotFoundException(
        'Article not found',
      )
    }

    if (dto.slug) {
      const slugExists =
        await this.articleModel.exists({
          slug: dto.slug,
          _id: { $ne: id },
        })

      if (slugExists) {
        throw new ConflictException(
          'Article slug already exists',
        )
      }
    }

    if (dto.category) {
      await this.validateCategory(
        dto.category,
      )
    }

    const update: Record<
      string,
      unknown
    > = {
      ...dto,
    }

    /*
     * Automatically set first
     * publication time.
     */
    if (
      dto.isPublished === true &&
      !dto.publishedAt &&
      !existingArticle.publishedAt
    ) {
      update.publishedAt =
        new Date()
    }

    /*
     * Partial SEO update without
     * deleting existing SEO fields.
     */
    delete update.seo

    if (dto.seo) {
      for (
        const [key, value]
        of Object.entries(dto.seo)
      ) {
        if (value !== undefined) {
          update[`seo.${key}`] =
            value
        }
      }
    }

    await this.articleModel
      .findByIdAndUpdate(
        id,
        {
          $set: update,
        },
        {
          returnDocument: 'after',
          runValidators: true,
        },
      )
      .exec()

    return this.findOneAdmin(id)
  }

  async remove(id: string) {
    const data =
      await this.articleModel
        .findByIdAndDelete(id)
        .lean()
        .exec()

    if (!data) {
      throw new NotFoundException(
        'Article not found',
      )
    }

    return {
      success: true,
      message:
        'Article deleted successfully',
    }
  }

  async findAllPublic(
    page = 1,
    limit = 9,
    categorySlug?: string,
    featured?: boolean,
  ) {
    const safePage = Math.max(
      1,
      page,
    )

    const safeLimit = Math.min(
      50,
      Math.max(1, limit),
    )

    const filter: Record<
      string,
      unknown
    > = {
      isPublished: true,
    }

    if (featured !== undefined) {
      filter.isFeatured = featured
    }

    if (categorySlug) {
      const category =
        await this.articleModel.db
          .collection(
            'articleCategories',
          )
          .findOne({
            slug: categorySlug,
            isPublished: true,
          })

      if (!category) {
        return {
          success: true,
          data: [],
          pagination: {
            page: safePage,
            limit: safeLimit,
            total: 0,
            totalPages: 0,
          },
        }
      }

      filter.category =
        category._id
    }

    const skip =
      (safePage - 1) * safeLimit

    const [data, total] =
      await Promise.all([
        this.articleModel
          .find(filter)
          .select(
            'title slug category excerpt coverImage author isFeatured publishedAt',
          )
          .sort({
            publishedAt: -1,
            createdAt: -1,
          })
          .skip(skip)
          .limit(safeLimit)
          .populate(
            'category',
            'name slug',
          )
          .populate(
            'coverImage',
            'url altText width height',
          )
          .lean()
          .exec(),

        this.articleModel
          .countDocuments(filter)
          .exec(),
      ])

    return {
      success: true,
      data,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages:
          Math.ceil(
            total / safeLimit,
          ),
      },
    }
  }

  async findOnePublic(
    slug: string,
  ) {
    const data =
      await this.articleModel
        .findOne({
          slug,
          isPublished: true,
        })
        .select('-__v')
        .populate(
          'category',
          'name slug',
        )
        .populate(
          'coverImage',
          'url altText width height',
        )
        .populate(
          'seo.ogImage',
          'url altText width height',
        )
        .lean()
        .exec()

    if (!data) {
      throw new NotFoundException(
        'Article not found',
      )
    }

    return {
      success: true,
      data,
    }
  }
}