import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import {
  Destination,
  DestinationDocument,
} from './schemas/destination.schema'

import {
  CreateDestinationDto,
} from './dto/create-destination.dto'

import {
  UpdateDestinationDto,
} from './dto/update-destination.dto'

@Injectable()
export class DestinationsService {
  constructor(
    @InjectModel(Destination.name)
    private readonly destinationModel: Model<DestinationDocument>,
  ) {}

  private async validateRegion(
    regionId: string,
  ) {
    const db = this.destinationModel.db

    const exists = await db
      .collection('regions')
      .findOne(
        {
          _id: new Types.ObjectId(regionId),
        },
        {
          projection: {
            _id: 1,
          },
        },
      )

    if (!exists) {
      throw new BadRequestException(
        'Region does not exist',
      )
    }
  }

  async create(
    dto: CreateDestinationDto,
  ) {
    const existing =
      await this.destinationModel.exists({
        slug: dto.slug,
      })

    if (existing) {
      throw new ConflictException(
        'Destination slug already exists',
      )
    }

    await this.validateRegion(dto.region)

    const destination =
      await this.destinationModel.create(dto)

    const data =
      await this.destinationModel
        .findById(destination._id)
        .populate(
          'region',
          'name slug',
        )
        .populate(
          'heroImage',
          'url altText width height',
        )
        .populate(
          'gallery',
          'url altText width height',
        )
        .populate(
          'seo.ogImage',
          'url altText width height',
        )
        .lean()
        .exec()

    return {
      success: true,
      data,
    }
  }

  async findAllAdmin() {
    const data =
      await this.destinationModel
        .find()
        .sort({
          sortOrder: 1,
          createdAt: -1,
        })
        .populate(
          'region',
          'name slug',
        )
        .populate(
          'heroImage',
          'url altText width height',
        )
        .lean()
        .exec()

    return {
      success: true,
      data,
    }
  }

  async findOneAdmin(
    id: string,
  ) {
    const data =
      await this.destinationModel
        .findById(id)
        .populate(
          'region',
          'name slug',
        )
        .populate('heroImage')
        .populate('gallery')
        .populate('seo.ogImage')
        .lean()
        .exec()

    if (!data) {
      throw new NotFoundException(
        'Destination not found',
      )
    }

    return {
      success: true,
      data,
    }
  }

  async update(
    id: string,
    dto: UpdateDestinationDto,
  ) {
    if (dto.slug) {
      const existing =
        await this.destinationModel.exists({
          slug: dto.slug,
          _id: {
            $ne: id,
          },
        })

      if (existing) {
        throw new ConflictException(
          'Destination slug already exists',
        )
      }
    }

    if (dto.region) {
      await this.validateRegion(
        dto.region,
      )
    }

    const data =
      await this.destinationModel
        .findByIdAndUpdate(
          id,
          {
            $set: dto,
          },
          {
            returnDocument: 'after',
            runValidators: true,
          },
        )
        .populate(
          'region',
          'name slug',
        )
        .populate(
          'heroImage',
          'url altText width height',
        )
        .populate('gallery')
        .populate('seo.ogImage')
        .lean()
        .exec()

    if (!data) {
      throw new NotFoundException(
        'Destination not found',
      )
    }

    return {
      success: true,
      data,
    }
  }

  async remove(id: string) {
    const destination =
      await this.destinationModel
        .findById(id)
        .select('_id')
        .lean()
        .exec()

    if (!destination) {
      throw new NotFoundException(
        'Destination not found',
      )
    }

    const destinationId =
      new Types.ObjectId(id)

    const [placesCount, journeysCount] =
      await Promise.all([
        this.destinationModel.db
          .collection('places')
          .countDocuments({
            destination: destinationId,
          }),

        this.destinationModel.db
          .collection('journeys')
          .countDocuments({
            destinations: destinationId,
          }),
      ])

    if (placesCount > 0) {
      throw new BadRequestException(
        'Cannot delete destination because it is being used by one or more places',
      )
    }

    if (journeysCount > 0) {
      throw new BadRequestException(
        'Cannot delete destination because it is being used by one or more journeys',
      )
    }

    await this.destinationModel
      .deleteOne({
        _id: destinationId,
      })
      .exec()

    return {
      success: true,
      message:
        'Destination deleted successfully',
    }
  }

  async findAllPublic(
    regionSlug?: string,
    featured?: boolean,
  ) {
    const filter: Record<
      string,
      unknown
    > = {
      isPublished: true,
    }

    if (featured !== undefined) {
      filter.isFeatured = featured
    }

    if (regionSlug) {
      const region =
        await this.destinationModel.db
          .collection('regions')
          .findOne({
            slug: regionSlug,
            isPublished: true,
          })

      if (!region) {
        return {
          success: true,
          data: [],
        }
      }

      filter.region = region._id
    }

    const data =
      await this.destinationModel
        .find(filter)
        .select(
          'name slug region shortDescription heroImage isFeatured sortOrder',
        )
        .sort({
          sortOrder: 1,
          createdAt: -1,
        })
        .populate(
          'region',
          'name slug',
        )
        .populate(
          'heroImage',
          'url altText width height',
        )
        .lean()
        .exec()

    return {
      success: true,
      data,
    }
  }

  async findOnePublic(
    slug: string,
  ) {
    const data =
      await this.destinationModel
        .findOne({
          slug,
          isPublished: true,
        })
        .select(
          'name slug region shortDescription overview heroImage gallery seo',
        )
        .populate(
          'region',
          'name slug',
        )
        .populate(
          'heroImage',
          'url altText width height',
        )
        .populate(
          'gallery',
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
        'Destination not found',
      )
    }

    return {
      success: true,
      data,
    }
  }
}