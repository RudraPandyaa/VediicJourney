import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import {
  Journey,
  JourneyDocument,
} from './schemas/journey.schema'
import { CreateJourneyDto } from './dto/create-journey.dto'
import { UpdateJourneyDto } from './dto/update-journey.dto'

@Injectable()
export class JourneysService {
  constructor(
    @InjectModel(Journey.name)
    private readonly journeyModel:
      Model<JourneyDocument>,
  ) {}

  private async validateIds(
    collection: string,
    ids: string[] = [],
    label: string,
  ) {
    if (!ids.length) return

    const uniqueIds = [
      ...new Set(ids),
    ]

    const objectIds = uniqueIds.map(
      (id) => new Types.ObjectId(id),
    )

    const count =
      await this.journeyModel.db
        .collection(collection)
        .countDocuments({
          _id: {
            $in: objectIds,
          },
        })

    if (count !== uniqueIds.length) {
      throw new BadRequestException(
        `One or more ${label} do not exist`,
      )
    }
  }

  private async validateRelations(
    dto: CreateJourneyDto | UpdateJourneyDto,
    existing?: JourneyDocument,
  ) {
    const destinationIds =
      dto.destinations ??
      existing?.destinations?.map(
        (id) => id.toString(),
      ) ??
      []

    const placeIds =
      dto.places ??
      existing?.places?.map(
        (id) => id.toString(),
      ) ??
      []

    const experienceIds =
      dto.experiences ??
      existing?.experiences?.map(
        (id) => id.toString(),
      ) ??
      []

    const travelStyleIds =
      dto.travelStyles ??
      existing?.travelStyles?.map(
        (id) => id.toString(),
      ) ??
      []

    await this.validateIds(
      'destinations',
      destinationIds,
      'destinations',
    )

    await this.validateIds(
      'places',
      placeIds,
      'places',
    )

    await this.validateIds(
      'experiences',
      experienceIds,
      'experiences',
    )

    await this.validateIds(
      'travelStyles',
      travelStyleIds,
      'travel styles',
    )

    const itinerary =
      dto.itinerary !== undefined
        ? dto.itinerary
        : existing?.itinerary ?? []

    const itineraryPlaceIds = itinerary
      .map((item: any) => item.place?.toString())
      .filter(
        (id): id is string =>
          typeof id === 'string' && id.length > 0,
      )

    await this.validateIds(
      'places',
      itineraryPlaceIds,
      'itinerary places',
    )

    const allPlaceIds = [
      ...new Set([
        ...placeIds,
        ...itineraryPlaceIds,
      ]),
    ]

    if (
      allPlaceIds.length &&
      destinationIds.length
    ) {
      const places =
        await this.journeyModel.db
          .collection('places')
          .find({
            _id: {
              $in: allPlaceIds.map(
                (id) =>
                  new Types.ObjectId(id),
              ),
            },
          })
          .project({
            destination: 1,
          })
          .toArray()

      const allowedDestinations =
        new Set(destinationIds)

      const invalidPlace =
        places.some(
          (place) =>
            !allowedDestinations.has(
              place.destination.toString(),
            ),
        )

      if (invalidPlace) {
        throw new BadRequestException(
          'One or more places do not belong to the selected destinations',
        )
      }
    }
  }

  async create(
    dto: CreateJourneyDto,
  ) {
    const existing =
      await this.journeyModel.exists({
        slug: dto.slug,
      })

    if (existing) {
      throw new ConflictException(
        'Journey slug already exists',
      )
    }

    await this.validateRelations(dto)

    const journey =
      await this.journeyModel.create(dto)

    return this.findOneAdmin(
      journey._id.toString(),
    )
  }

  async findAllAdmin() {
    const data =
      await this.journeyModel
        .find()
        .select(
          'title slug durationDays destinations heroImage isFeatured isPublished sortOrder createdAt updatedAt',
        )
        .sort({
          sortOrder: 1,
          createdAt: -1,
        })
        .populate(
          'destinations',
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
      await this.journeyModel
        .findById(id)
        .populate(
          'destinations',
          'name slug',
        )
        .populate(
          'places',
          'name slug destination',
        )
        .populate(
          'experiences',
          'name slug',
        )
        .populate(
          'travelStyles',
          'name slug',
        )
        .populate('heroImage')
        .populate('gallery')
        .populate(
          'itinerary.place',
          'name slug destination',
        )
        .populate('itinerary.image')
        .populate('seo.ogImage')
        .lean()
        .exec()

    if (!data) {
      throw new NotFoundException(
        'Journey not found',
      )
    }

    return {
      success: true,
      data,
    }
  }

  async update(
    id: string,
    dto: UpdateJourneyDto,
  ) {
    const existingJourney =
      await this.journeyModel
        .findById(id)
        .exec()

    if (!existingJourney) {
      throw new NotFoundException(
        'Journey not found',
      )
    }

    if (dto.slug) {
      const slugExists =
        await this.journeyModel.exists({
          slug: dto.slug,
          _id: {
            $ne: id,
          },
        })

      if (slugExists) {
        throw new ConflictException(
          'Journey slug already exists',
        )
      }
    }

    await this.validateRelations(
      dto,
      existingJourney,
    )

    const update: Record<string, unknown> = {
      ...dto,
    }

    delete update.seo

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


    await this.journeyModel
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

  async remove(
    id: string,
  ) {
    const data =
      await this.journeyModel
        .findByIdAndDelete(id)
        .lean()
        .exec()

    if (!data) {
      throw new NotFoundException(
        'Journey not found',
      )
    }

    return {
      success: true,
      message:
        'Journey deleted successfully',
    }
  }

  async findAllPublic(
    destinationSlug?: string,
    experienceSlug?: string,
    travelStyleSlug?: string,
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

    if (destinationSlug) {
      const destination =
        await this.journeyModel.db
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

      filter.destinations =
        destination._id
    }

    if (experienceSlug) {
      const experience =
        await this.journeyModel.db
          .collection('experiences')
          .findOne({
            slug: experienceSlug,
            isPublished: true,
          })

      if (!experience) {
        return {
          success: true,
          data: [],
        }
      }

      filter.experiences =
        experience._id
    }

    if (travelStyleSlug) {
      const travelStyle =
        await this.journeyModel.db
          .collection('travelStyles')
          .findOne({
            slug: travelStyleSlug,
            isPublished: true,
          })

      if (!travelStyle) {
        return {
          success: true,
          data: [],
        }
      }

      filter.travelStyles =
        travelStyle._id
    }

    const data =
      await this.journeyModel
        .find(filter)
        .select(
          'title slug shortDescription durationDays destinations experiences travelStyles heroImage isFeatured sortOrder',
        )
        .sort({
          sortOrder: 1,
          createdAt: -1,
        })
        .populate(
          'destinations',
          'name slug',
        )
        .populate(
          'experiences',
          'name slug',
        )
        .populate(
          'travelStyles',
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
      await this.journeyModel
        .findOne({
          slug,
          isPublished: true,
        })
        .select('-__v')
        .populate(
          'destinations',
          'name slug',
        )
        .populate(
          'places',
          'name slug destination',
        )
        .populate(
          'experiences',
          'name slug',
        )
        .populate(
          'travelStyles',
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
          'itinerary.place',
          'name slug destination',
        )
        .populate(
          'itinerary.image',
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
        'Journey not found',
      )
    }

    return {
      success: true,
      data,
    }
  }
}