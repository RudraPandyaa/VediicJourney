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

import { RegionsService } from './regions.service'
import { CreateRegionDto } from './dto/create-region.dto'
import { UpdateRegionDto } from './dto/update-region.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe'

@Controller('admin/regions')
@UseGuards(JwtAuthGuard)
export class RegionsController {
  constructor(
    private readonly regionsService: RegionsService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateRegionDto,
  ) {
    return this.regionsService.create(dto)
  }

  @Get()
  findAll() {
    return this.regionsService.findAllAdmin()
  }

  @Get(':id')
  findOne(
    @Param('id', ParseObjectIdPipe)
    id: string,
  ) {
    return this.regionsService.findOneAdmin(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe)
    id: string,

    @Body()
    dto: UpdateRegionDto,
  ) {
    return this.regionsService.update(id, dto)
  }

  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe)
    id: string,
  ) {
    return this.regionsService.remove(id)
  }
}