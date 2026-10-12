import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'

import {
  JourneysService,
} from './journeys.service'

import {
  CreateJourneyDto,
} from './dto/create-journey.dto'

import {
  UpdateJourneyDto,
} from './dto/update-journey.dto'

import {
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard'

import {
  ParseObjectIdPipe,
} from '../../common/pipes/parse-object-id.pipe'

@Controller('admin/journeys')
@UseGuards(JwtAuthGuard)
export class JourneysController {
  constructor(
    private readonly journeysService:
      JourneysService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateJourneyDto,
  ) {
    return this.journeysService.create(
      dto,
    )
  }

  @Get()
  findAll() {
    return this.journeysService.findAllAdmin()
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      ParseObjectIdPipe,
    )
    id: string,
  ) {
    return this.journeysService.findOneAdmin(
      id,
    )
  }

  @Patch(':id')
  update(
    @Param(
      'id',
      ParseObjectIdPipe,
    )
    id: string,

    @Body()
    dto: UpdateJourneyDto,
  ) {
    return this.journeysService.update(
      id,
      dto,
    )
  }

  @Delete(':id')
  remove(
    @Param(
      'id',
      ParseObjectIdPipe,
    )
    id: string,
  ) {
    return this.journeysService.remove(
      id,
    )
  }
}