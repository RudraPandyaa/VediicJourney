import { readFile, stat } from 'node:fs/promises'
import { basename, extname } from 'node:path'

const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
}

export async function localFileToMulter(
  filePath: string,
): Promise<Express.Multer.File> {
  const buffer = await readFile(filePath)
  const fileStat = await stat(filePath)
  const extension = extname(filePath).toLowerCase()
  const filename = basename(filePath)

  const mimetype = mimeTypes[extension]

  if (!mimetype) {
    throw new Error(
      `Unsupported migration file type: ${extension}`,
    )
  }

  return {
    fieldname: 'file',
    originalname: filename,
    encoding: '7bit',
    mimetype,
    size: fileStat.size,
    buffer,
    destination: '',
    filename,
    path: filePath,
    stream: undefined as any,
  }
}