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

import { ExperiencesService } from './experiences.service'
import { CreateExperienceDto } from './dto/create-experience.dto'
import { UpdateExperienceDto } from './dto/update-experience.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe'

@Controller('admin/experiences')
@UseGuards(JwtAuthGuard)
export class ExperiencesController {
  constructor(
    private readonly experiencesService: ExperiencesService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateExperienceDto,
  ) {
    return this.experiencesService.create(dto)
  }

  @Get()
  findAll() {
    return this.experiencesService.findAllAdmin()
  }

  @Get(':id')
  findOne(
    @Param('id', ParseObjectIdPipe)
    id: string,
  ) {
    return this.experiencesService.findOneAdmin(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe)
    id: string,

    @Body()
    dto: UpdateExperienceDto,
  ) {
    return this.experiencesService.update(
      id,
      dto,
    )
  }

  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe)
    id: string,
  ) {
    return this.experiencesService.remove(id)
  }
}