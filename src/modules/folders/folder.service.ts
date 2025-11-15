import { db } from '@config/db'
import { folders } from '@db/index'
import { NotFoundError } from '@errors/NotFoundError'
import { createFolderType } from '@modules/folders/folder.types'
import { and, eq } from 'drizzle-orm'

export async function handleCreateFolder({
  name,
  userId,
  parentId,
}: createFolderType) {
  // validate the parentId first
  // parentId => parent folder id
  if (parentId) {
    // check if it exists and belongs to the current user
    const [parent] = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, parentId), eq(folders.userId, userId)))

    if (!parent) {
      throw new NotFoundError('Parent folder not found')
    }
  }

  // create the folder
  const [folder] = await db
    .insert(folders)
    .values({
      name,
      userId,
      parentId,
    })
    .returning()

  return folder
}
