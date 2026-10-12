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

import { CertificatesService } from './certificates.service'
import { CreateCertificateDto } from '../dto/create-certificate.dto'
import { UpdateCertificateDto } from '../dto/update-certificate.dto'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { ParseObjectIdPipe } from '../../../common/pipes/parse-object-id.pipe'

@Controller('admin/certificates')
@UseGuards(JwtAuthGuard)
export class CertificatesController {
  constructor(
    private readonly service: CertificatesService,
  ) {}

  @Post()
  create(@Body() dto: CreateCertificateDto) {
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
    @Body() dto: UpdateCertificateDto,
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