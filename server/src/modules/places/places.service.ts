import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
  Model,
  Types,
} from 'mongoose'

import {
  Place,
  PlaceDocument,
} from './schemas/place.schema'
import { CreatePlaceDto } from './dto/create-place.dto'
import { UpdatePlaceDto } from './dto/update-place.dto'

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place.name)
    private readonly placeModel:
      Model<PlaceDocument>,
  ) {}

  private async validateDestination(
    destinationId: string,
  ) {
    const destination =
      await this.placeModel.db
        .collection('destinations')
        .findOne(
          {
            _id: new Types.ObjectId(
              destinationId,
            ),
          },
          {
            projection: {
              _id: 1,
            },
          },
        )

    if (!destination) {
      throw new BadRequestException(
        'Destination does not exist',
      )
    }
  }

  async create(
    dto: CreatePlaceDto,
  ) {
    const existing =
      await this.placeModel.exists({
        slug: dto.slug,
      })

    if (existing) {
      throw new ConflictException(
        'Place slug already exists',
      )
    }

    await this.validateDestination(
      dto.destination,
    )

    const place =
      await this.placeModel.create(dto)

    const data =
      await this.placeModel
        .findById(place._id)
        .populate(
          'destination',
          'name slug',
        )
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

  async findAllAdmin(
    destinationId?: string,
  ) {
    const filter: Record<
      string,
      unknown
    > = {}

    if (destinationId) {
      if (
        !Types.ObjectId.isValid(
          destinationId,
        )
      ) {
        throw new BadRequestException(
          'Invalid destination ID',
        )
      }

      filter.destination =
        new Types.ObjectId(
          destinationId,
        )
    }

    const data =
      await this.placeModel
        .find(filter)
        .sort({
          sortOrder: 1,
          createdAt: -1,
        })
        .populate(
          'destination',
          'name slug',
        )
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

  async findOneAdmin(
    id: string,
  ) {
    const data =
      await this.placeModel
        .findById(id)
        .populate(
          'destination',
          'name slug',
        )
        .populate('image')
        .lean()
        .exec()

    if (!data) {
      throw new NotFoundException(
        'Place not found',
      )
    }

    return {
      success: true,
      data,
    }
  }

  async update(
    id: string,
    dto: UpdatePlaceDto,
  ) {
    if (dto.slug) {
      const existing =
        await this.placeModel.exists({
          slug: dto.slug,
          _id: {
            $ne: id,
          },
        })

      if (existing) {
        throw new ConflictException(
          'Place slug already exists',
        )
      }
    }

    if (dto.destination) {
      await this.validateDestination(
        dto.destination,
      )
    }

    const data =
      await this.placeModel
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
          'destination',
          'name slug',
        )
        .populate(
          'image',
          'url altText width height',
        )
        .lean()
        .exec()

    if (!data) {
      throw new NotFoundException(
        'Place not found',
      )
    }

    return {
      success: true,
      data,
    }
  }

  async remove(
    id: string,
  ) {
    const placeId = new Types.ObjectId(id)

    const journeysCount =
      await this.placeModel.db
        .collection('journeys')
        .countDocuments({
          $or: [
            {
              places: placeId,
            },
            {
              'itinerary.place': placeId,
            },
          ],
        })

    if (journeysCount > 0) {
      throw new BadRequestException(
        'Cannot delete place because it is being used by one or more journeys',
      )
    }
    const data =
      await this.placeModel
        .findByIdAndDelete(id)
        .lean()
        .exec()

    if (!data) {
      throw new NotFoundException(
        'Place not found',
      )
    }

    return {
      success: true,
      message:
        'Place deleted successfully',
    }
  }

  async findAllPublic(
    destinationSlug?: string,
  ) {
    const filter: Record<
      string,
      unknown
    > = {
      isPublished: true,
    }

    if (destinationSlug) {
      const destination =
        await this.placeModel.db
          .collection('destinations')
          .findOne({
            slug: destinationSlug,
            isPublished: true,
          })

      if (!destination) {
        return {
          success: true,
          data: [],
        }
      }

      filter.destination =
        destination._id
    }

    const data =
      await this.placeModel
        .find(filter)
        .select(
          'name slug destination shortDescription image sortOrder',
        )
        .sort({
          sortOrder: 1,
        })
        .populate(
          'destination',
          'name slug',
        )
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

  async findOnePublic(
    slug: string,
  ) {
    const data =
      await this.placeModel
        .findOne({
          slug,
          isPublished: true,
        })
        .select(
          'name slug destination shortDescription image sortOrder',
        )
        .populate(
          'destination',
          'name slug',
        )
        .populate(
          'image',
          'url altText width height',
        )
        .lean()
        .exec()

    if (!data) {
      throw new NotFoundException(
        'Place not found',
      )
    }

    return {
      success: true,
      data,
    }
  }
}