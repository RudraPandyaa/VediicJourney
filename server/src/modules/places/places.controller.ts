import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'

import { PlacesService } from './places.service'
import { CreatePlaceDto } from './dto/create-place.dto'
import { UpdatePlaceDto } from './dto/update-place.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe'

@Controller('admin/places')
@UseGuards(JwtAuthGuard)
export class PlacesController {
  constructor(
    private readonly placesService:
      PlacesService,
  ) {}

  @Post()
  create(
    @Body() dto: CreatePlaceDto,
  ) {
    return this.placesService.create(
      dto,
    )
  }

  @Get()
  findAll(
    @Query('destination')
    destination?: string,
  ) {
    return this.placesService.findAllAdmin(
      destination,
    )
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      ParseObjectIdPipe,
    )
    id: string,
  ) {
    return this.placesService.findOneAdmin(
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
    dto: UpdatePlaceDto,
  ) {
    return this.placesService.update(
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
    return this.placesService.remove(
      id,
    )
  }
}