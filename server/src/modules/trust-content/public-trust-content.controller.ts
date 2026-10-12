import {
  Controller,
  Get,
  ParseBoolPipe,
  Query,
} from '@nestjs/common'

import { TestimonialsService } from './testimonials/testimonials.service'
import { CertificatesService } from './certificates/certificates.service'

@Controller()
export class PublicTrustContentController {
  constructor(
    private readonly testimonialsService:
      TestimonialsService,

    private readonly certificatesService:
      CertificatesService,
  ) {}

  @Get('testimonials')
  testimonials(
    @Query(
      'featured',
      new ParseBoolPipe({
        optional: true,
      }),
    )
    featured?: boolean,
  ) {
    return this.testimonialsService.findAllPublic(
      featured,
    )
  }

  @Get('certificates')
  certificates() {
    return this.certificatesService.findAllPublic()
  }
}