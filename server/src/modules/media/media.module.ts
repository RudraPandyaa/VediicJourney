import { Module } from '@nestjs/common'
import {
  MongooseModule,
} from '@nestjs/mongoose'
import { StorageService } from './storage.service'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'
import {
  Media,
  MediaSchema,
} from './schemas/media.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Media.name,
        schema: MediaSchema,
      },
    ]),
  ],

  controllers: [
    MediaController,
  ],

  providers: [
    MediaService,
    StorageService,
  ],

  exports: [
    MediaService,
  ],
})
export class MediaModule {}