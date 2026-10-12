import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import {
  Certificate,
  CertificateDocument,
} from '../schemas/certificate.schema'

import { CreateCertificateDto } from '../dto/create-certificate.dto'
import { UpdateCertificateDto } from '../dto/update-certificate.dto'

@Injectable()
export class CertificatesService {
  constructor(
    @InjectModel(Certificate.name)
    private readonly model:
      Model<CertificateDocument>,
  ) {}

  async create(dto: CreateCertificateDto) {
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
        'Certificate not found',
      )
    }

    return {
      success: true,
      data,
    }
  }

  async update(
    id: string,
    dto: UpdateCertificateDto,
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
        'Certificate not found',
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
        'Certificate not found',
      )
    }

    return {
      success: true,
      message: 'Certificate deleted successfully',
    }
  }

  async findAllPublic() {
    const data = await this.model
      .find({
        isPublished: true,
      })
      .select(
        'title type organization description image externalUrl sortOrder',
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
}