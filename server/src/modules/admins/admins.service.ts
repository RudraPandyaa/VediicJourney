import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'
import { CreateAdminDto } from './dto/create-admin.dto'
import {
  Admin,
  AdminDocument,
} from './schemas/admin.schema'

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<AdminDocument>,
  ) {}

  async create(
    createAdminDto: CreateAdminDto,
  ) {
    const email = createAdminDto.email
      .trim()
      .toLowerCase()

    const existingAdmin = await this.adminModel
      .exists({ email })

    if (existingAdmin) {
      throw new ConflictException(
        'Admin with this email already exists',
      )
    }

    const passwordHash = await bcrypt.hash(
      createAdminDto.password,
      12,
    )

    const admin = await this.adminModel.create({
      name: createAdminDto.name.trim(),
      email,
      passwordHash,
    })

    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      isActive: admin.isActive,
    }
  }

  async findByEmailWithPassword(
    email: string,
  ) {
    return this.adminModel
      .findOne({
        email: email.trim().toLowerCase(),
      })
      .select('+passwordHash')
      .exec()
  }

  async findById(id: string) {
    const admin = await this.adminModel
      .findById(id)
      .lean()
      .exec()

    if (!admin) {
      throw new NotFoundException(
        'Admin not found',
      )
    }

    return admin
  }

  async updateLastLogin(id: string) {
    await this.adminModel
      .updateOne(
        { _id: id },
        {
          $set: {
            lastLoginAt: new Date(),
          },
        },
      )
      .exec()
  }

  async setRefreshToken(
    id: string,
    refreshToken: string,
    ) {
    const refreshTokenHash =
        await bcrypt.hash(refreshToken, 12)

    await this.adminModel
        .updateOne(
        { _id: id },
        {
            $set: {
            refreshTokenHash,
            },
        },
        )
        .exec()
    }

    async removeRefreshToken(id: string) {
    await this.adminModel
        .updateOne(
        { _id: id },
        {
            $set: {
            refreshTokenHash: null,
            },
        },
        )
        .exec()
    }

    async findByIdWithRefreshToken(id: string) {
    return this.adminModel
        .findById(id)
        .select('+refreshTokenHash')
        .exec()
    }
}