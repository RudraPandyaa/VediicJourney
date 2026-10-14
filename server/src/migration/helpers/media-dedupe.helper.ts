import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'

import { MediaService } from '../../modules/media/media.service'

export type ExistingMedia = {
  id: string
  filename: string
  size: number
  url: string
}

export async function loadExistingMedia(
  mediaService: MediaService,
): Promise<ExistingMedia[]> {
  const existing: ExistingMedia[] = []

  let page = 1

  while (true) {
    const result = await mediaService.findAll(
      page,
      100,
    )

    for (const media of result.data) {
      existing.push({
        id: media._id.toString(),
        filename: media.filename,
        size: media.size,
        url: media.url,
      })
    }

    if (page >= result.pagination.pages) {
      break
    }

    page++
  }

  return existing
}

export function isDuplicateMedia(
  existingMedia: ExistingMedia[],
  filename: string,
  size: number,
) {
  return existingMedia.some(
    (media) =>
      media.filename.toLowerCase() ===
        filename.toLowerCase() &&
      media.size === size,
  )
}

export async function getFileHash(
  filePath: string,
) {
  const buffer = await readFile(filePath)

  return createHash('sha256')
    .update(buffer)
    .digest('hex')
}