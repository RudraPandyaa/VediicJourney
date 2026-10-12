import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import {
  Observable,
} from 'rxjs'

@Injectable()
export class PublicCacheInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const response = context
      .switchToHttp()
      .getResponse()

    response.setHeader(
      'Cache-Control',
      'public, max-age=60, s-maxage=300, stale-while-revalidate=60',
    )

    return next.handle()
  }
}