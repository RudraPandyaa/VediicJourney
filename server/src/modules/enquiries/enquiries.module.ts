import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  Enquiry,
  EnquirySchema,
} from './schemas/enquiry.schema'

import {
  EnquiriesController,
} from './enquiries/enquiries.controller'

import {
  EnquiriesService,
} from './enquiries/enquiries.service'

import {
  PublicEnquiriesController,
} from './public-enquiries.controller'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Enquiry.name,
        schema: EnquirySchema,
      },
    ]),
  ],

  controllers: [
    EnquiriesController,
    PublicEnquiriesController,
  ],

  providers: [
    EnquiriesService,
  ],

  exports: [
    EnquiriesService,
  ],
})
export class EnquiriesModule {}