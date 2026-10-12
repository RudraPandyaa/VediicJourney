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

import { TestimonialsService } from './testimonials.service'
import { CreateTestimonialDto } from '../dto/create-testimonial.dto'
import { UpdateTestimonialDto } from '../dto/update-testimonial.dto'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { ParseObjectIdPipe } from '../../../common/pipes/parse-object-id.pipe'

@Controller('admin/testimonials')
@UseGuards(JwtAuthGuard)
export class TestimonialsController {
  constructor(
    private readonly service: TestimonialsService,
  ) {}

  @Post()
  create(@Body() dto: CreateTestimonialDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll() {
    return this.service.findAllAdmin()
  }

  @Get(':id')
  findOne(
    @Param('id', ParseObjectIdPipe)
    id: string,
  ) {
    return this.service.findOneAdmin(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe)
    id: string,
    @Body() dto: UpdateTestimonialDto,
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe)
    id: string,
  ) {
    return this.service.remove(id)
  }
}