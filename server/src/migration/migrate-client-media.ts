import { NestFactory } from '@nestjs/core'
import {
  readdir,
  stat,
} from 'node:fs/promises'
import {
  basename,
  extname,
  join,
  relative,
} from 'node:path'

import { AppModule } from '../app.module'
import { MediaService } from '../modules/media/media.service'

import { localFileToMulter } from './helpers/local-file.helper'

import {
    getFileHash,
  isDuplicateMedia,
  loadExistingMedia,
} from './helpers/media-dedupe.helper'

const allowedExtensions = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
])

const DRY_RUN = false
const seenHashes = new Map<string, string>()
/**
 * Files that should never be migrated.
 *
 * Add any rejected visual filename here before
 * running the migration.
 */
const blockedFileNames = new Set<string>([
  // Example:
  // 'some-unwanted-image.jpg',
])

async function scanDirectory(
  directory: string,
): Promise<string[]> {
  const entries = await readdir(directory, {
    withFileTypes: true,
  })

  const files: string[] = []

  for (const entry of entries) {
    const fullPath = join(
      directory,
      entry.name,
    )

    if (entry.isDirectory()) {
      files.push(
        ...(await scanDirectory(fullPath)),
      )

      continue
    }

    if (!entry.isFile()) {
      continue
    }

    const extension = extname(
      entry.name,
    ).toLowerCase()

    if (
      allowedExtensions.has(extension)
    ) {
      files.push(fullPath)
    }
  }

  return files.sort((a, b) => {
    const priority = (path: string) => {
        if (path.includes(`${join('destinations')}`)) return 1
        if (path.includes(`${join('journeys')}`)) return 2
        if (path.includes(`${join('experiences')}`)) return 3
        if (path.includes(`${join('home')}`)) return 4
        if (path.includes(`${join('support')}`)) return 5
        if (path.includes(`${join('aboutPage')}`)) return 6

        return 10
    }

    return priority(a) - priority(b)
    })
}

function createAltText(
  filePath: string,
) {
  return basename(
    filePath,
    extname(filePath),
  )
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function migrateClientMedia() {
  const app =
    await NestFactory.createApplicationContext(
      AppModule,
    )

  try {
    const mediaService =
      app.get(MediaService)

    const imagesRoot = join(
      process.cwd(),
      '..',
      'client',
      'public',
      'images',
    )

    console.log(
      '\nScanning client media...',
    )

    const files =
      await scanDirectory(imagesRoot)

    const existingMedia =
      await loadExistingMedia(mediaService)

    console.log(
      `Found ${files.length} local images`,
    )

    console.log(
      `Found ${existingMedia.length} existing media records\n`,
    )

    let uploaded = 0
    let duplicates = 0
    let blocked = 0
    let failed = 0

    for (const filePath of files) {
      const filename =
        basename(filePath)

      const relativePath = relative(
        imagesRoot,
        filePath,
      )

      if (
        blockedFileNames.has(
          filename.toLowerCase(),
        )
      ) {
        console.log(
          `[BLOCKED] ${relativePath}`,
        )

        blocked++
        continue
      }

      const hash = await getFileHash(filePath)

        const duplicateLocalPath =
        seenHashes.get(hash)

        if (duplicateLocalPath) {
        console.log(
            `[SKIP LOCAL COPY] ${relativePath} -> ${duplicateLocalPath}`,
        )

        duplicates++
        continue
        }

        seenHashes.set(hash, relativePath)

      const fileStat =
        await stat(filePath)

      if (
        isDuplicateMedia(
          existingMedia,
          filename,
          fileStat.size,
        )
      ) {
        console.log(
          `[SKIP DUPLICATE] ${relativePath}`,
        )

        duplicates++
        continue
      }
        if (
        isDuplicateMedia(
            existingMedia,
            filename,
            fileStat.size,
        )
        ) {
        console.log(
            `[SKIP DUPLICATE] ${relativePath}`,
        )

        duplicates++
        continue
        }

        if (DRY_RUN) {
        console.log(
            `[WOULD UPLOAD] ${relativePath}`,
        )

        continue
        }

        try {
        const file =
            await localFileToMulter(
            filePath,
        )

        const altText =
          createAltText(filePath)

        const result =
          await mediaService.upload(
            file,
            altText,
          )

        existingMedia.push({
          id: result.data._id.toString(),
          filename:
            result.data.filename,
          size: result.data.size,
          url: result.data.url,
        })

        uploaded++

        console.log(
          `[UPLOADED] ${relativePath}`,
        )
      } catch (error) {
        failed++

        console.error(
          `[FAILED] ${relativePath}`,
        )

        console.error(error)
      }
    }

    console.log(
      '\n-----------------------------',
    )

    console.log(
      'Client media migration complete',
    )

    console.log({
      discovered: files.length,
      uploaded,
      duplicates,
      blocked,
      failed,
    })
  } finally {
    await app.close()
  }
}

migrateClientMedia().catch(
  (error) => {
    console.error(
      'Client media migration failed:',
      error,
    )

    process.exit(1)
  },
)