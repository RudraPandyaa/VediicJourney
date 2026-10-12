import {
  Body,
  Controller,
  Post,
} from '@nestjs/common'

import {
  Throttle,
  ThrottlerGuard,
} from '@nestjs/throttler'

import {
  UseGuards,
} from '@nestjs/common'

import {
  EnquiriesService,
} from './enquiries/enquiries.service'

import {
  CreateEnquiryDto,
} from './dto/create-enquiry.dto'

@Controller('enquiries')
export class PublicEnquiriesController {
  constructor(
    private readonly service:
      EnquiriesService,
  ) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  @Throttle({
    default: {
      limit: 5,
      ttl: 60_000,
    },
  })
  create(
    @Body()
    dto: CreateEnquiryDto,
  ) {
    return this.service.create(dto)
  }
}