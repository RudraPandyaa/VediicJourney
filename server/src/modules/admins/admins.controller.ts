import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'

import {
  CurrentAdmin,
} from '../auth/decorators/current-admin.decorator'

import {
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard'

import {
  InviteAdminDto,
} from './dto/invite-admin.dto'

import {
  SetupAdminAccountDto,
} from './dto/setup-admin-account.dto'

import {
  UpdateAdminStatusDto,
} from './dto/update-admin-status.dto'

import {
  AdminsService,
} from './admins.service'

@Controller('admin/admins')
export class AdminsController {
  constructor(
    private readonly adminsService:
      AdminsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.adminsService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Post('invite')
  invite(
    @Body()
    dto: InviteAdminDto,
  ) {
    return this.adminsService.invite(
      dto,
    )
  }

  /*
   * No JWT guard here intentionally.
   * Invited admin isn't logged in yet.
   */
  @Post('setup-account')
  setupAccount(
    @Body()
    dto: SetupAdminAccountDto,
  ) {
    return this.adminsService
      .setupAccount(
        dto.token,
        dto.password,
      )
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id')
    id: string,

    @CurrentAdmin()
    currentAdmin: {
      id: string
    },

    @Body()
    dto: UpdateAdminStatusDto,
  ) {
    return this.adminsService
      .updateStatus(
        id,
        currentAdmin.id,
        dto.isActive,
      )
  }
}