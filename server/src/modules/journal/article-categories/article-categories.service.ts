import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import {
  ArticleCategory,
  ArticleCategoryDocument,
} from '../schemas/article-category.schema'
import { CreateArticleCategoryDto } from '../dto/create-article-category.dto'
import { UpdateArticleCategoryDto } from '../dto/update-article-category.dto'

@Injectable()
export class ArticleCategoriesService {
  constructor(
    @InjectModel(ArticleCategory.name)
    private readonly categoryModel:
      Model<ArticleCategoryDocument>,
  ) {}

  async create(dto: CreateArticleCategoryDto) {
    const existing =
      await this.categoryModel.exists({
        slug: dto.slug,
      })

    if (existing) {
      throw new ConflictException(
        'Article category slug already exists',
      )
    }

    const data =
      await this.categoryModel.create(dto)

    return {
      success: true,
      data,
    }
  }

  async findAllAdmin() {
    const data = await this.categoryModel
      .find()
      .sort({
        sortOrder: 1,
        createdAt: -1,
      })
      .lean()
      .exec()

    return {
      success: true,
      data,
    }
  }

  async findOneAdmin(id: string) {
    const data = await this.categoryModel
      .findById(id)
      .lean()
      .exec()

    if (!data) {
      throw new NotFoundException(
        'Article category not found',
      )
    }

    return {
      success: true,
      data,
    }
  }

  async update(
    id: string,
    dto: UpdateArticleCategoryDto,
  ) {
    if (dto.slug) {
      const existing =
        await this.categoryModel.exists({
          slug: dto.slug,
          _id: { $ne: id },
        })

      if (existing) {
        throw new ConflictException(
          'Article category slug already exists',
        )
      }
    }

    const data = await this.categoryModel
      .findByIdAndUpdate(
        id,
        { $set: dto },
        {
          returnDocument: 'after',
          runValidators: true,
        },
      )
      .lean()
      .exec()

    if (!data) {
      throw new NotFoundException(
        'Article category not found',
      )
    }

    return {
      success: true,
      data,
    }
  }

  async remove(id: string) {
    const categoryId =
      new Types.ObjectId(id)

    const articlesCount =
      await this.categoryModel.db
        .collection('articles')
        .countDocuments({
          category: categoryId,
        })

    if (articlesCount > 0) {
      throw new BadRequestException(
        'Cannot delete article category because it is being used by one or more articles',
      )
    }
    const data = await this.categoryModel
      .findByIdAndDelete(id)
      .lean()
      .exec()

    if (!data) {
      throw new NotFoundException(
        'Article category not found',
      )
    }

    return {
      success: true,
      message:
        'Article category deleted successfully',
    }
  }

  async findAllPublic() {
    const data = await this.categoryModel
      .find({
        isPublished: true,
      })
      .select(
        'name slug description sortOrder',
      )
      .sort({
        sortOrder: 1,
      })
      .lean()
      .exec()

    return {
      success: true,
      data,
    }
  }
}