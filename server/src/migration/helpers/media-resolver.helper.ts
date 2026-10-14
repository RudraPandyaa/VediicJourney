import { MediaService } from '../../modules/media/media.service'

export type MigrationMediaMap =
  Map<string, string>

export async function buildMediaMap(
  mediaService: MediaService,
): Promise<MigrationMediaMap> {
  const map: MigrationMediaMap =
    new Map()

  let page = 1

  while (true) {
    const result =
      await mediaService.findAll(
        page,
        100,
      )

    for (const media of result.data) {
      const filename =
        media.filename.toLowerCase()

      if (!map.has(filename)) {
        map.set(
          filename,
          media._id.toString(),
        )
      }
    }

    if (
      page >= result.pagination.pages
    ) {
      break
    }

    page++
  }

  return map
}

export function resolveMediaId(
  mediaMap: MigrationMediaMap,
  filename?: string,
) {
  if (!filename) {
    return undefined
  }

  return mediaMap.get(
    filename.toLowerCase(),
  )
}