import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { ConfigService } from '@nestjs/config'

import {
  v2 as cloudinary,
  UploadApiResponse,
} from 'cloudinary'

import { Readable } from 'stream'

@Injectable()
export class StorageService {
  constructor(
    private readonly configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name:
        this.configService.getOrThrow<string>(
          'CLOUDINARY_CLOUD_NAME',
        ),

      api_key:
        this.configService.getOrThrow<string>(
          'CLOUDINARY_API_KEY',
        ),

      api_secret:
        this.configService.getOrThrow<string>(
          'CLOUDINARY_API_SECRET',
        ),

      secure: true,
    })
    cloudinary.api
    .ping()
    .then((result) => {
      console.log('Cloudinary API connected:', result)
    })
    .catch((error) => {
      console.error('Cloudinary API error:', error)
    })
  }

  async upload(
    file: Express.Multer.File,
  ): Promise<{
    filename: string
    storageKey: string
    url: string
    width?: number
    height?: number
  }> {
    const result =
      await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder: 'vedic-journey',

                resource_type: 'auto',
              },

              (error, result) => {
                if (error || !result) {
                  return reject(
                    error ??
                      new Error(
                        'Cloudinary upload failed',
                      ),
                  )
                }

                resolve(result)
              },
            )

          Readable.from(file.buffer).pipe(
            uploadStream,
          )
        },
        ).catch((error) => {
          console.error(
            'Cloudinary upload error:',
            error,
          )

          throw new InternalServerErrorException(
            'Failed to upload media',
          )
        })

    return {
      filename: result.original_filename,

      storageKey: result.public_id,

      url: result.secure_url,

      width: result.width,
      height: result.height,
    }
  }

  async delete(
    storageKey: string,
    resourceType: 'image' | 'video' = 'image',
  ) {
    await cloudinary.uploader.destroy(
      storageKey,
      {
        resource_type: resourceType,
        invalidate: true,
      },
    )
  }
}