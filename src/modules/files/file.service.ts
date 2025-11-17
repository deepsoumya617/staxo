import { db } from '@config/db'
import { createUploadUrlType } from './file.types'
import { files, folders, users } from '@db/index'
import { and, eq } from 'drizzle-orm'
import { NotFoundError } from '@errors/NotFoundError'
import { ForbiddenError } from '@errors/ForbiddenError'
import { generateStorageKey } from '@utils/generateStorageKey'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { env } from '@config/env'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3 } from '@config/s3'

// create upload url and return to the controller
export async function handleCreateUploadUrl({
  name,
  size,
  mimeType,
  folderId,
  userId,
}: createUploadUrlType) {
  // so, if the folderId is not null, we have to check the ownership
  if (folderId !== null) {
    const [folder] = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, folderId), eq(folders.userId, userId)))

    if (!folder) {
      throw new NotFoundError('Folder not found!')
    }
  }

  // check storage quota for the user
  const [user] = await db.select().from(users).where(eq(users.id, userId))

  if (!user) {
    throw new NotFoundError('User not found.')
  }

  if (user.totalStorageUsed + size > user.storageLimit) {
    throw new ForbiddenError('Not enough storage.')
  }

  // add new entry in db
  const [file] = await db
    .insert(files)
    .values({
      name,
      size: 0,
      mimeType,
      folderId,
      userId,
      storageKey: '', // keep empty for this moment
      status: 'PENDING',
    })
    .returning()

  const fileId = file.id
  const fileName = name

  // generate the storage key
  const storageKey = generateStorageKey({ userId, fileId, fileName, folderId })

  // update the storagekey
  await db.update(files).set({ storageKey }).where(eq(files.id, file.id))

  // create the url
  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: storageKey,
    ContentType: mimeType,
  })

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 900,
  })

  return { uploadUrl, fileId, storageKey }
}
