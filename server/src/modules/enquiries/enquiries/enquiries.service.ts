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
  Enquiry,
  EnquiryDocument,
  EnquiryStatus,
  EnquiryType,
} from '../schemas/enquiry.schema'

import {
  CreateEnquiryDto,
} from '../dto/create-enquiry.dto'

import {
  UpdateEnquiryDto,
} from '../dto/update-enquiry.dto'

@Injectable()
export class EnquiriesService {
  constructor(
    @InjectModel(Enquiry.name)
    private readonly enquiryModel:
      Model<EnquiryDocument>,
  ) {}

  private async validateReference(
    collection: string,
    id: string | undefined,
    label: string,
  ) {
    if (!id) {
      return
    }

    const exists =
      await this.enquiryModel.db
        .collection(collection)
        .findOne(
          {
            _id: new Types.ObjectId(id),
          },
          {
            projection: {
              _id: 1,
            },
          },
        )

    if (!exists) {
      throw new BadRequestException(
        `${label} does not exist`,
      )
    }
  }

  async create(dto: CreateEnquiryDto) {
    await Promise.all([
      this.validateReference(
        'journeys',
        dto.journey,
        'Journey',
      ),

      this.validateReference(
        'travelStyles',
        dto.travelStyle,
        'Travel style',
      ),
    ])

    const data =
      await this.enquiryModel.create({
        ...dto,

        status:
          EnquiryStatus.NEW,

        notes: '',
      })

    return {
      success: true,
      message:
        'Your enquiry has been submitted successfully.',
      data: {
        id: data._id,
      },
    }
  }

  async findAllAdmin(
    page = 1,
    limit = 20,
    status?: EnquiryStatus,
    type?: EnquiryType,
  ) {
    const safePage =
      Math.max(1, page)

    const safeLimit =
      Math.min(
        100,
        Math.max(1, limit),
      )

    const filter:
      Record<string, unknown> = {}

    if (status) {
      filter.status = status
    }

    if (type) {
      filter.type = type
    }

    const skip =
      (safePage - 1) *
      safeLimit

    const [data, total] =
      await Promise.all([
        this.enquiryModel
          .find(filter)
          .select(
            'type name email phone country destination journey status createdAt updatedAt',
          )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(safeLimit)
          .populate(
            'journey',
            'title slug',
          )
          .lean()
          .exec(),

        this.enquiryModel
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

  async findOneAdmin(
    id: string,
  ) {
    const data =
      await this.enquiryModel
        .findById(id)
        .populate(
          'journey',
          'title slug',
        )
        .populate(
          'travelStyle',
          'name slug',
        )
        .lean()
        .exec()

    if (!data) {
      throw new NotFoundException(
        'Enquiry not found',
      )
    }

    return {
      success: true,
      data,
    }
  }

  async update(
    id: string,
    dto: UpdateEnquiryDto,
  ) {
    const data =
      await this.enquiryModel
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
          'journey',
          'title slug',
        )
        .populate(
          'travelStyle',
          'name slug',
        )
        .lean()
        .exec()

    if (!data) {
      throw new NotFoundException(
        'Enquiry not found',
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
    const data =
      await this.enquiryModel
        .findByIdAndDelete(id)
        .lean()
        .exec()

    if (!data) {
      throw new NotFoundException(
        'Enquiry not found',
      )
    }

    return {
      success: true,
      message:
        'Enquiry deleted successfully',
    }
  }
}