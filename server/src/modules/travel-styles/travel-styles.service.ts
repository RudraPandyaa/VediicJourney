import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import {
  TravelStyle,
  TravelStyleDocument,
} from './schemas/travel-style.schema'
import { CreateTravelStyleDto } from './dto/create-travel-style.dto'
import { UpdateTravelStyleDto } from './dto/update-travel-style.dto'

@Injectable()
export class TravelStylesService {
  constructor(
    @InjectModel(TravelStyle.name)
    private readonly travelStyleModel: Model<TravelStyleDocument>,
  ) {}

  async create(dto: CreateTravelStyleDto) {
    const existing =
      await this.travelStyleModel.exists({
        slug: dto.slug,
      })

    if (existing) {
      throw new ConflictException(
        'Travel style slug already exists',
      )
    }

    const travelStyle =
      await this.travelStyleModel.create(dto)

    return {
      success: true,
      data: travelStyle,
    }
  }

  async findAllAdmin() {
    const data = await this.travelStyleModel
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
      data,
    }
  }

  async findOneAdmin(id: string) {
    const data = await this.travelStyleModel
      .findById(id)
      .populate('image')
      .lean()
      .exec()

    if (!data) {
      throw new NotFoundException(
        'Travel style not found',
      )
    }

    return {
      success: true,
      data,
    }
  }

  async update(
    id: string,
    dto: UpdateTravelStyleDto,
  ) {
    if (dto.slug) {
      const existing =
        await this.travelStyleModel.exists({
          slug: dto.slug,
          _id: { $ne: id },
        })

      if (existing) {
        throw new ConflictException(
          'Travel style slug already exists',
        )
      }
    }

    const data = await this.travelStyleModel
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

    if (!data) {
      throw new NotFoundException(
        'Travel style not found',
      )
    }

    return {
      success: true,
      data,
    }
  }

  async remove(id: string) {

        const travelStyleId =
      new Types.ObjectId(id)

    const [journeysCount, enquiriesCount] =
      await Promise.all([
        this.travelStyleModel.db
          .collection('journeys')
          .countDocuments({
            travelStyles: travelStyleId,
          }),

        this.travelStyleModel.db
          .collection('enquiries')
          .countDocuments({
            travelStyle: travelStyleId,
          }),
      ])

    if (
      journeysCount > 0 ||
      enquiriesCount > 0
    ) {
      throw new BadRequestException(
        'Cannot delete travel style because it is currently in use',
      )
    }

    const data = await this.travelStyleModel
      .findByIdAndDelete(id)
      .lean()
      .exec()

    if (!data) {
      throw new NotFoundException(
        'Travel style not found',
      )
    }

    return {
      success: true,
      message: 'Travel style deleted successfully',
    }
  }

  async findAllPublic() {
    const data = await this.travelStyleModel
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
      data,
    }
  }

  async findOnePublic(slug: string) {
    const data = await this.travelStyleModel
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

    if (!data) {
      throw new NotFoundException(
        'Travel style not found',
      )
    }

    return {
      success: true,
      data,
    }
  }
}