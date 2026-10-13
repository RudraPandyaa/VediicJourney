import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  InjectModel,
} from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import * as crypto from 'node:crypto'
import {
  Model,
} from 'mongoose'

import {
  CreateAdminDto,
} from './dto/create-admin.dto'

import {
  InviteAdminDto,
} from './dto/invite-admin.dto'
import {
  EmailService,
} from '../email/email.service'
import {
  Admin,
  AdminDocument,
  AdminStatus,
} from './schemas/admin.schema'

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel:
      Model<AdminDocument>,
    private readonly emailService:
      EmailService,
  ) {}

  /*
   * Existing method.
   * Keep this for seed/bootstrap admin creation.
   */
  async create(
    createAdminDto: CreateAdminDto,
  ) {
    const email =
      createAdminDto.email
        .trim()
        .toLowerCase()

    const existingAdmin =
      await this.adminModel.exists({
        email,
      })

    if (existingAdmin) {
      throw new ConflictException(
        'Admin with this email already exists',
      )
    }

    const passwordHash =
      await bcrypt.hash(
        createAdminDto.password,
        12,
      )

    const admin =
      await this.adminModel.create({
        name:
          createAdminDto.name.trim(),

        email,

        passwordHash,

        isActive: true,

        status:
          AdminStatus.ACTIVE,
      })

    return {
      id: String(admin._id),
      name: admin.name,
      email: admin.email,
      isActive: admin.isActive,
      status: admin.status,
    }
  }

  /*
   * Admin dashboard list.
   */
  async findAll() {
    const admins =
      await this.adminModel
        .find()
        .select(
          'name email isActive status lastLoginAt inviteExpiresAt createdAt updatedAt',
        )
        .sort({
          createdAt: -1,
        })
        .lean()
        .exec()

    return {
      success: true,
      data: admins.map(
        (admin: any) => ({
          id: String(admin._id),
          name: admin.name,
          email: admin.email,

          isActive:
            admin.isActive,

          // Old admin documents may not
          // have status yet.
          status:
            admin.status ??
            AdminStatus.ACTIVE,

          lastLoginAt:
            admin.lastLoginAt ??
            null,

          inviteExpiresAt:
            admin.inviteExpiresAt ??
            null,

          createdAt:
            admin.createdAt,

          updatedAt:
            admin.updatedAt,
        }),
      ),
    }
  }

  /*
   * Creates pending invited admin.
   *
   * Later we will email the raw token.
   * Only its hash is stored in MongoDB.
   */
  async invite(
    inviteAdminDto: InviteAdminDto,
  ) {
    const email =
      inviteAdminDto.email
        .trim()
        .toLowerCase()

    const existingAdmin =
      await this.adminModel.exists({
        email,
      })

    if (existingAdmin) {
      throw new ConflictException(
        'Admin with this email already exists',
      )
    }

    const inviteToken =
      crypto.randomBytes(32)
        .toString('hex')

    const inviteTokenHash =
      this.hashInviteToken(
        inviteToken,
      )

    const inviteExpiresAt =
      new Date(
        Date.now() +
        24 * 60 * 60 * 1000,
      )

    const admin =
      await this.adminModel.create({
        name:
          inviteAdminDto.name.trim(),

        email,

        passwordHash: null,

        isActive: false,

        status:
          AdminStatus.INVITED,

        inviteTokenHash,

        inviteExpiresAt,
      })

    try {
      await this.emailService.sendAdminInvite({
        name: admin.name,
        email: admin.email,
        inviteToken,
      })
    } catch (error) {
      // Email failed, so remove the
      // incomplete invitation from DB.
      await this.adminModel.deleteOne({
        _id: admin._id,
      })

      throw error
    }

    return {
      success: true,

      message:
        'Admin invitation sent successfully',

      data: {
        id: String(admin._id),
        name: admin.name,
        email: admin.email,
        status: admin.status,
        inviteExpiresAt,
      },
    }
  }

  /*
   * Public invite completion.
   */
  async setupAccount(
    token: string,
    password: string,
  ) {
    const inviteTokenHash =
      this.hashInviteToken(token)

    const admin =
      await this.adminModel
        .findOne({
          inviteTokenHash,

          status:
            AdminStatus.INVITED,

          inviteExpiresAt: {
            $gt: new Date(),
          },
        })
        .select(
          '+inviteTokenHash +passwordHash',
        )
        .exec()

    if (!admin) {
      throw new BadRequestException(
        'Invitation is invalid or has expired',
      )
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        12,
      )

    admin.passwordHash =
      passwordHash

    admin.status =
      AdminStatus.ACTIVE

    admin.isActive = true

    admin.inviteTokenHash = null

    admin.inviteExpiresAt = null

    await admin.save()

    return {
      success: true,
      message:
        'Admin account setup completed successfully',
    }
  }

  /*
   * Enable / disable another admin.
   */
  async updateStatus(
    targetAdminId: string,
    currentAdminId: string,
    isActive: boolean,
  ) {
    if (
      targetAdminId ===
      currentAdminId
    ) {
      throw new BadRequestException(
        'You cannot change the status of your own account',
      )
    }

    const admin =
      await this.adminModel
        .findById(targetAdminId)
        .exec()

    if (!admin) {
      throw new NotFoundException(
        'Admin not found',
      )
    }

    /*
     * Don't enable an invited admin
     * before they set a password.
     */
    if (
      isActive &&
      admin.status ===
        AdminStatus.INVITED
    ) {
      throw new BadRequestException(
        'Invited admin must complete account setup first',
      )
    }

    if (!isActive) {
      const activeAdminCount =
        await this.adminModel.countDocuments({
          isActive: true,

          $or: [
            {
              status:
                AdminStatus.ACTIVE,
            },
            {
              status: {
                $exists: false,
              },
            },
          ],
        })

      if (activeAdminCount <= 1) {
        throw new BadRequestException(
          'The last active admin cannot be disabled',
        )
      }

      admin.isActive = false

      admin.status =
        AdminStatus.DISABLED

      admin.refreshTokenHash =
        null
    } else {
      admin.isActive = true

      admin.status =
        AdminStatus.ACTIVE
    }

    await admin.save()

    return {
      success: true,

      message: isActive
        ? 'Admin enabled successfully'
        : 'Admin disabled successfully',

      data: {
        id: String(admin._id),
        name: admin.name,
        email: admin.email,
        isActive: admin.isActive,
        status: admin.status,
      },
    }
  }

  async findByEmailWithPassword(
    email: string,
  ) {
    return this.adminModel
      .findOne({
        email:
          email
            .trim()
            .toLowerCase(),
      })
      .select('+passwordHash')
      .exec()
  }

  async findById(
    id: string,
  ) {
    const admin =
      await this.adminModel
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

  async updateLastLogin(
    id: string,
  ) {
    await this.adminModel
      .updateOne(
        {
          _id: id,
        },
        {
          $set: {
            lastLoginAt:
              new Date(),
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
      await bcrypt.hash(
        refreshToken,
        12,
      )

    await this.adminModel
      .updateOne(
        {
          _id: id,
        },
        {
          $set: {
            refreshTokenHash,
          },
        },
      )
      .exec()
  }

  async removeRefreshToken(
    id: string,
  ) {
    await this.adminModel
      .updateOne(
        {
          _id: id,
        },
        {
          $set: {
            refreshTokenHash:
              null,
          },
        },
      )
      .exec()
  }

  async findByIdWithRefreshToken(
    id: string,
  ) {
    return this.adminModel
      .findById(id)
      .select('+refreshTokenHash')
      .exec()
  }

  private hashInviteToken(
    token: string,
  ) {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')
  }
}