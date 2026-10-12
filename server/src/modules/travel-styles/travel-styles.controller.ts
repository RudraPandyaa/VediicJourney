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

import { TravelStylesService } from './travel-styles.service'
import { CreateTravelStyleDto } from './dto/create-travel-style.dto'
import { UpdateTravelStyleDto } from './dto/update-travel-style.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe'

@Controller('admin/travel-styles')
@UseGuards(JwtAuthGuard)
export class TravelStylesController {
  constructor(
    private readonly travelStylesService: TravelStylesService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateTravelStyleDto,
  ) {
    return this.travelStylesService.create(dto)
  }

  @Get()
  findAll() {
    return this.travelStylesService.findAllAdmin()
  }

  @Get(':id')
  findOne(
    @Param('id', ParseObjectIdPipe)
    id: string,
  ) {
    return this.travelStylesService.findOneAdmin(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe)
    id: string,
    @Body() dto: UpdateTravelStyleDto,
  ) {
    return this.travelStylesService.update(
      id,
      dto,
    )
  }

  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe)
    id: string,
  ) {
    return this.travelStylesService.remove(id)
  }
}