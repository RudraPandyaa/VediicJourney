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
  DestinationsService,
} from './destinations.service'

import {
  CreateDestinationDto,
} from './dto/create-destination.dto'

import {
  UpdateDestinationDto,
} from './dto/update-destination.dto'

import {
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard'

import {
  ParseObjectIdPipe,
} from '../../common/pipes/parse-object-id.pipe'

@Controller('admin/destinations')
@UseGuards(JwtAuthGuard)
export class DestinationsController {
  constructor(
    private readonly destinationsService:
      DestinationsService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateDestinationDto,
  ) {
    return this.destinationsService.create(
      dto,
    )
  }

  @Get()
  findAll() {
    return this.destinationsService.findAllAdmin()
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      ParseObjectIdPipe,
    )
    id: string,
  ) {
    return this.destinationsService.findOneAdmin(
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
    dto: UpdateDestinationDto,
  ) {
    return this.destinationsService.update(
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
    return this.destinationsService.remove(
      id,
    )
  }
}