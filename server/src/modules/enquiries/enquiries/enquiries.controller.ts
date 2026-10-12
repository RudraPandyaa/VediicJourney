import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseEnumPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common'

import {
  EnquiriesService,
} from './enquiries.service'

import {
  UpdateEnquiryDto,
} from '../dto/update-enquiry.dto'

import {
  EnquiryStatus,
    EnquiryType,
} from '../schemas/enquiry.schema'

import {
  JwtAuthGuard,
} from '../../auth/guards/jwt-auth.guard'

import {
  ParseObjectIdPipe,
} from '../../../common/pipes/parse-object-id.pipe'



@Controller('admin/enquiries')
@UseGuards(JwtAuthGuard)
export class EnquiriesController {
  constructor(
    private readonly service:
      EnquiriesService,
  ) {}

  @Get()
  findAll(
    @Query(
      'page',
      new DefaultValuePipe(1),
      ParseIntPipe,
    )
    page: number,

    @Query(
      'limit',
      new DefaultValuePipe(20),
      ParseIntPipe,
    )
    limit: number,

    @Query(
      'status',
      new ParseEnumPipe(
        EnquiryStatus,
        { optional: true },
      ),
    )
    status?: EnquiryStatus,

    @Query(
      'type',
      new ParseEnumPipe(
        EnquiryType,
        { optional: true },
      ),
    )
    type?: EnquiryType,
  ) {
    return this.service.findAllAdmin(
      page,
      limit,
      status,
      type,
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
    return this.service.findOneAdmin(
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
    dto: UpdateEnquiryDto,
  ) {
    return this.service.update(
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
    return this.service.remove(id)
  }
}