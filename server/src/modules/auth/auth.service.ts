import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import type { SignOptions } from 'jsonwebtoken'
import { AdminsService } from '../admins/admins.service'
import { LoginDto } from './dto/login.dto'
@Injectable()
export class AuthService {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const admin =
      await this.adminsService.findByEmailWithPassword(
        loginDto.email,
      )

    if (!admin) {
      throw new UnauthorizedException(
        'Invalid email or password',
      )
    }

    if (!admin.isActive) {
      throw new UnauthorizedException(
        'Admin account is inactive',
      )
    }

    if (!admin.passwordHash) {
      throw new UnauthorizedException(
        'Admin account setup is incomplete',
      )
    }

    const passwordMatches =
      await bcrypt.compare(
        loginDto.password,
        admin.passwordHash,
      )

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Invalid email or password',
      )
    }

    const payload = {
      sub: String(admin._id),
      email: admin.email,
    }

    const accessToken =
      await this.jwtService.signAsync(
        payload,
        {
          secret:
            this.configService.getOrThrow<string>(
              'JWT_ACCESS_SECRET',
            ),

          expiresIn:
            (this.configService.get<string>(
              'JWT_ACCESS_EXPIRES',
            ) ?? '15m') as SignOptions['expiresIn'],
        },
      )

    const refreshToken =
      await this.jwtService.signAsync(
        payload,
        {
          secret:
            this.configService.getOrThrow<string>(
              'JWT_REFRESH_SECRET',
            ),

          expiresIn:
            (this.configService.get<string>(
              'JWT_REFRESH_EXPIRES',
            ) ?? '7d') as SignOptions['expiresIn'],
        },
      )

    await this.adminsService.setRefreshToken(
      String(admin._id),
      refreshToken,
    )

    await this.adminsService.updateLastLogin(
      String(admin._id),
    )

    return {
      success: true,

      accessToken,
      refreshToken,
      admin: {
        id: String(admin._id),
        name: admin.name,
        email: admin.email,
      },
    }
  }

  async refresh(refreshToken: string) {
      try {
        const payload =
          await this.jwtService.verifyAsync<{
            sub: string
            email: string
          }>(
            refreshToken,
            {
              secret:
                this.configService.getOrThrow<string>(
                  'JWT_REFRESH_SECRET',
                ),
            },
          )

        const admin =
          await this.adminsService
            .findByIdWithRefreshToken(payload.sub)

        if (
          !admin ||
          !admin.isActive ||
          !admin.refreshTokenHash
        ) {
          throw new UnauthorizedException(
            'Invalid refresh token',
          )
        }

        const tokenMatches =
          await bcrypt.compare(
            refreshToken,
            admin.refreshTokenHash,
          )

        if (!tokenMatches) {
          throw new UnauthorizedException(
            'Invalid refresh token',
          )
        }

        const newPayload = {
          sub: String(admin._id),
          email: admin.email,
        }

        const accessToken =
          await this.jwtService.signAsync(
            newPayload,
            {
              secret:
                this.configService.getOrThrow<string>(
                  'JWT_ACCESS_SECRET',
                ),

              expiresIn:
                (this.configService.get<string>(
                  'JWT_ACCESS_EXPIRES',
                ) ?? '15m') as SignOptions['expiresIn'],
            },
          )

        return {
          success: true,
          accessToken,
        }
      } catch {
        throw new UnauthorizedException(
          'Invalid or expired refresh token',
        )
      }
  }

  async logout(adminId: string) {
    await this.adminsService.removeRefreshToken(
      adminId,
    )

    return {
      success: true,
      message: 'Logged out successfully',
    }
  }
}