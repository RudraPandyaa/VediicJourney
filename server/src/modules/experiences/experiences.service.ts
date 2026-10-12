import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import {
  Experience,
  ExperienceDocument,
} from './schemas/experience.schema'
import { CreateExperienceDto } from './dto/create-experience.dto'
import { UpdateExperienceDto } from './dto/update-experience.dto'

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectModel(Experience.name)
    private readonly experienceModel: Model<ExperienceDocument>,
  ) {}

  async create(dto: CreateExperienceDto) {
    const existing =
      await this.experienceModel.exists({
        slug: dto.slug,
      })

    if (existing) {
      throw new ConflictException(
        'Experience slug already exists',
      )
    }

    const experience =
      await this.experienceModel.create(dto)

    return {
      success: true,
      data: experience,
    }
  }

  async findAllAdmin() {
    const experiences =
      await this.experienceModel
        .find()
        .sort({
          sortOrder: 1,
          createdAt: -1,
        })
        .populate('image')
        .lean()
        .exec()

    return {
      success: true,
      data: experiences,
    }
  }

  async findOneAdmin(id: string) {
    const experience =
      await this.experienceModel
        .findById(id)
        .populate('image')
        .lean()
        .exec()

    if (!experience) {
      throw new NotFoundException(
        'Experience not found',
      )
    }

    return {
      success: true,
      data: experience,
    }
  }

  async update(
    id: string,
    dto: UpdateExperienceDto,
  ) {
    if (dto.slug) {
      const existing =
        await this.experienceModel.exists({
          slug: dto.slug,
          _id: { $ne: id },
        })

      if (existing) {
        throw new ConflictException(
          'Experience slug already exists',
        )
      }
    }

    const experience =
      await this.experienceModel
        .findByIdAndUpdate(
          id,
          { $set: dto },
          {
            returnDocument: 'after',
            runValidators: true,
          },
        )
        .populate('image')
        .lean()
        .exec()

    if (!experience) {
      throw new NotFoundException(
        'Experience not found',
      )
    }

    return {
      success: true,
      data: experience,
    }
  }

  async remove(id: string) {
    const experienceId =
      new Types.ObjectId(id)

    const journeysCount =
      await this.experienceModel.db
        .collection('journeys')
        .countDocuments({
          experiences: experienceId,
        })

    if (journeysCount > 0) {
      throw new BadRequestException(
        'Cannot delete experience because it is being used by one or more journeys',
      )
    }
    const experience =
      await this.experienceModel
        .findByIdAndDelete(id)
        .lean()
        .exec()

    if (!experience) {
      throw new NotFoundException(
        'Experience not found',
      )
    }

    return {
      success: true,
      message:
        'Experience deleted successfully',
    }
  }

  async findAllPublic() {
    const experiences =
      await this.experienceModel
        .find({
          isPublished: true,
        })
        .select(
          'name slug shortDescription image sortOrder',
        )
        .sort({
          sortOrder: 1,
        })
        .populate(
          'image',
          'url altText width height',
        )
        .lean()
        .exec()

    return {
      success: true,
      data: experiences,
    }
  }

  async findOnePublic(slug: string) {
    const experience =
      await this.experienceModel
        .findOne({
          slug,
          isPublished: true,
        })
        .select(
          'name slug shortDescription image sortOrder',
        )
        .populate(
          'image',
          'url altText width height',
        )
        .lean()
        .exec()

    if (!experience) {
      throw new NotFoundException(
        'Experience not found',
      )
    }

    return {
      success: true,
      data: experience,
    }
  }
}