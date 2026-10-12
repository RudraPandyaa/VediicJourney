import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'

import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

import {
  Region,
  RegionDocument,
} from './schemas/region.schema'
import { CreateRegionDto } from './dto/create-region.dto'
import { UpdateRegionDto } from './dto/update-region.dto'

@Injectable()
export class RegionsService {
  constructor(
    @InjectModel(Region.name)
    private readonly regionModel: Model<RegionDocument>,
  ) {}

    async create(dto: CreateRegionDto) {
        const existing = await this.regionModel
        .exists({ slug: dto.slug })

        if (existing) {
        throw new ConflictException(
            'Region slug already exists',
        )
        }

        const region = await this.regionModel.create(dto)

        return {
        success: true,
        data: region,
        }
    }

    async findAllAdmin() {
        const regions = await this.regionModel
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
        data: regions,
        }
    }

    async findOneAdmin(id: string) {
        const region = await this.regionModel
        .findById(id)
        .populate('image')
        .lean()
        .exec()

        if (!region) {
        throw new NotFoundException(
            'Region not found',
        )
        }

        return {
        success: true,
        data: region,
        }
    }

    async update(
        id: string,
        dto: UpdateRegionDto,
    ) {
        if (dto.slug) {
        const existing = await this.regionModel
            .exists({
            slug: dto.slug,
            _id: { $ne: id },
            })

        if (existing) {
            throw new ConflictException(
            'Region slug already exists',
            )
        }
        }

        const region = await this.regionModel
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

        if (!region) {
        throw new NotFoundException(
            'Region not found',
        )
        }

        return {
        success: true,
        data: region,
        }
    }

    

    async remove(id: string) {
             const regionId = new Types.ObjectId(id)

            const destinationsCount =
            await this.regionModel.db
                .collection('destinations')
                .countDocuments({
                region: regionId,
                })

            if (destinationsCount > 0) {
            throw new BadRequestException(
                'Cannot delete region because it is being used by one or more destinations',
            )
        }
        const region = await this.regionModel
        .findByIdAndDelete(id)
        .lean()
        .exec()
        if (!region) {
        throw new NotFoundException(
            'Region not found',
        )
        }

        return {
        success: true,
        message: 'Region deleted successfully',
        }
    }

    async findAllPublic() {
    const regions = await this.regionModel
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
        data: regions,
    }
    }

    async findOnePublic(slug: string) {
    const region = await this.regionModel
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

    if (!region) {
        throw new NotFoundException(
        'Region not found',
        )
    }

    return {
        success: true,
        data: region,
    }
    }
}