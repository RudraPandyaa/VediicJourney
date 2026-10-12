import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AdminsService } from '../../admins/admins.service'

export interface JwtPayload {
  sub: string
  email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly adminsService: AdminsService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey:
        configService.getOrThrow<string>(
          'JWT_ACCESS_SECRET',
        ),
    })
  }

  async validate(payload: JwtPayload) {
    const admin =
      await this.adminsService.findById(
        payload.sub,
      )

    if (!admin.isActive) {
      throw new UnauthorizedException(
        'Admin account is inactive',
      )
    }

    return {
      id: String(admin._id),
      email: admin.email,
      name: admin.name
    }
  }
}