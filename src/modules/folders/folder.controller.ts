import { AuthRequest } from '@middleware/authMiddleware'
import { Response } from 'express'
import { createFolderSchema } from '@modules/folders/folder.schema'
import { ValidationError } from '@errors/ValidationError'
import { handleCreateFolder } from './folder.service'
import { successResponse } from '@utils/response'

export async function createFolder(req: AuthRequest, res: Response) {
  const result = createFolderSchema.safeParse(req.body)

  if (!result.success) {
    throw new ValidationError()
  }

  // destructure the result
  const { name, parentId = null } = result.data
  const userId = req.user!.userId

  // send inputs to handleCreateFolder
  const folder = await handleCreateFolder({ name, userId, parentId })

  return successResponse(res, folder, true, 'Folder created successfully!', 201)
}
