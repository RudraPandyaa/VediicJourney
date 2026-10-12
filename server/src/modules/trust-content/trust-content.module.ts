import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  Testimonial,
  TestimonialSchema,
} from './schemas/testimonial.schema'

import {
  Certificate,
  CertificateSchema,
} from './schemas/certificate.schema'

import { TestimonialsController } from './testimonials/testimonials.controller'
import { TestimonialsService } from './testimonials/testimonials.service'

import { CertificatesController } from './certificates/certificates.controller'
import { CertificatesService } from './certificates/certificates.service'

import { PublicTrustContentController } from './public-trust-content.controller'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Testimonial.name,
        schema: TestimonialSchema,
      },
      {
        name: Certificate.name,
        schema: CertificateSchema,
      },
    ]),
  ],

  controllers: [
    TestimonialsController,
    CertificatesController,
    PublicTrustContentController,
  ],

  providers: [
    TestimonialsService,
    CertificatesService,
  ],

  exports: [
    TestimonialsService,
    CertificatesService,
  ],
})
export class TrustContentModule {}