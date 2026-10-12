import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import {
  Testimonial,
  TestimonialDocument,
} from '../schemas/testimonial.schema'

import { CreateTestimonialDto } from '../dto/create-testimonial.dto'
import { UpdateTestimonialDto } from '../dto/update-testimonial.dto'

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectModel(Testimonial.name)
    private readonly model:
      Model<TestimonialDocument>,
  ) {}

  async create(dto: CreateTestimonialDto) {
    const data = await this.model.create(dto)

    return {
      success: true,
      data,
    }
  }

  async findAllAdmin() {
    const data = await this.model
      .find()
      .sort({
        sortOrder: 1,
        createdAt: -1,
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

  async findOneAdmin(id: string) {
    const data = await this.model
      .findById(id)
      .populate('image')
      .lean()
      .exec()

    if (!data) {
      throw new NotFoundException(
        'Testimonial not found',
      )
    }

    return {
      success: true,
      data,
    }
  }

  async update(
    id: string,
    dto: UpdateTestimonialDto,
  ) {
    const data = await this.model
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
        'Testimonial not found',
      )
    }

    return {
      success: true,
      data,
    }
  }

  async remove(id: string) {
    const data = await this.model
      .findByIdAndDelete(id)
      .lean()
      .exec()

    if (!data) {
      throw new NotFoundException(
        'Testimonial not found',
      )
    }

    return {
      success: true,
      message: 'Testimonial deleted successfully',
    }
  }

  async findAllPublic(
    featured?: boolean,
  ) {
    const filter: Record<string, unknown> = {
      isPublished: true,
    }

    if (featured !== undefined) {
      filter.isFeatured = featured
    }

    const data = await this.model
      .find(filter)
      .select(
        'name country journey quote rating image isFeatured sortOrder',
      )
      .sort({
        sortOrder: 1,
        createdAt: -1,
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
}