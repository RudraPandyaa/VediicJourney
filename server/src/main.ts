import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { join } from 'path'
import compression from 'compression'
import { NestExpressApplication } from '@nestjs/platform-express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    )
    app.use(helmet())
    app.use(compression())
    app.use(cookieParser())
  const configService = app.get(ConfigService)

  // API prefix
  app.setGlobalPrefix('api/v1')

  // DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // Frontend + Admin
  app.enableCors({
    origin: [
      configService.get<string>('CLIENT_URL')!,
      configService.get<string>('ADMIN_URL')!,
    ],
    credentials: true,
  })

  const port = configService.get<number>('PORT', 4000)

  await app.listen(port)

  console.log(`Vedic Journey API running on http://localhost:${port}/api/v1`)
}

bootstrap()