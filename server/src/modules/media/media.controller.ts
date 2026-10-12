import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UpdateMediaDto } from './dto/update-media.dto'
import { MediaService } from './media.service'
import { MediaType } from './schemas/media.schema'

@Controller('admin/media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(
    private readonly mediaService:
      MediaService,
  ) {}
  
    @Post('upload')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: memoryStorage(),

        limits: {
          fileSize: 20 * 1024 * 1024,
        },
      }),
    )
    upload(
      @UploadedFile()
      file: Express.Multer.File,

      @Body('altText')
      altText?: string,
    ) {
      return this.mediaService.upload(
        file,
        altText,
      )
    }

    @Get()
    findAll(
      @Query(
        'page',
        new ParseIntPipe({
          optional: true,
        }),
      )
      page = 1,

      @Query(
        'limit',
        new ParseIntPipe({
          optional: true,
        }),
      )
      limit = 24,

      @Query(
        'type',
        new ParseEnumPipe(MediaType, {
          optional: true,
        }),
      )
      type?: MediaType,
    ) {
      return this.mediaService.findAll(
        page,
        limit,
        type,
      )
    }

  @Get(':id')
  findOne(
    @Param('id', ParseObjectIdPipe)
    id: string,
  ) {
    return this.mediaService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe)
    id: string,

    @Body()
    updateMediaDto: UpdateMediaDto,
  ) {
    return this.mediaService.update(
      id,
      updateMediaDto,
    )
  }

  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe)
    id: string,
  ) {
    return this.mediaService.remove(id)
  }
}