import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import type {
  Request,
  Response,
} from 'express'

import { AuthService } from './auth.service'
import { CurrentAdmin } from './decorators/current-admin.decorator'
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Controller('admin/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(
    @Body()
    loginDto: LoginDto,
    @Res({ passthrough: true })
    response: Response,
  ) {
    const result =
      await this.authService.login(loginDto)

    response.cookie(
      'admin_refresh_token',
      result.refreshToken,
      this.getRefreshCookieOptions(),
    )

    // Do not expose refresh token to browser JavaScript.
    const {
      refreshToken,
      ...safeResult
    } = result

    return safeResult
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(
    @CurrentAdmin()
    admin: {
      id: string
      name: string
      email: string
      role: string
    },
  ) {
    return {
      success: true,
      admin,
    }
  }

  @Post('refresh')
  async refresh(
    @Req()
    request: Request,
  ) {
    const refreshToken =
      request.cookies?.admin_refresh_token

    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token not found',
      )
    }

    return this.authService.refresh(
      refreshToken,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @CurrentAdmin()
    admin: {
      id: string
    },
    @Res({ passthrough: true })
    response: Response,
  ) {
    await this.authService.logout(admin.id)

    response.clearCookie(
      'admin_refresh_token',
      this.getRefreshCookieOptions(),
    )

    return {
      success: true,
      message: 'Logged out successfully',
    }
  }

  private getRefreshCookieOptions() {
    const isProduction =
      process.env.NODE_ENV === 'production'

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/api/v1/admin/auth',
      maxAge:
        7 * 24 * 60 * 60 * 1000,
    }
  }
}