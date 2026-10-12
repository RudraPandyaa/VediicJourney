import { Module } from '@nestjs/common'
import * as dns from 'node:dns'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { HealthModule } from './modules/health/health.module'
import { AdminsModule } from './modules/admins/admins.module';
import { AuthModule } from './modules/auth/auth.module';
import { MediaModule } from './modules/media/media.module';
import { SiteSettingsModule } from './modules/site-settings/site-settings.module';
import { RegionsModule } from './modules/regions/regions.module';
import { ExperiencesModule } from './modules/experiences/experiences.module';
import { TravelStylesModule } from './modules/travel-styles/travel-styles.module';
import { DestinationsModule } from './modules/destinations/destinations.module';
import { PlacesModule } from './modules/places/places.module';
import { JourneysModule } from './modules/journeys/journeys.module';
import { PagesModule } from './modules/pages/pages.module';
import { JournalModule } from './modules/journal/journal.module';
import { TrustContentModule } from './modules/trust-content/trust-content.module';
import { EnquiriesModule } from './modules/enquiries/enquiries.module';
import { ThrottlerModule } from '@nestjs/throttler'

dns.setServers(['8.8.8.8', '1.1.1.1'])
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
      }),
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),

    HealthModule,

    AdminsModule,

    AuthModule,

    MediaModule,

    SiteSettingsModule,

    RegionsModule,

    ExperiencesModule,

    TravelStylesModule,

    DestinationsModule,

    PlacesModule,

    JourneysModule,

    PagesModule,

    JournalModule,

    TrustContentModule,

    EnquiriesModule,
  ],
})
export class AppModule {}