import { AuthRequest } from '@middleware/authMiddleware'
import { Response } from 'express'
import {
  createFolderSchema,
  listFolderSchema,
} from '@modules/folders/folder.schema'
import { ValidationError } from '@errors/ValidationError'
import {
  handleCreateFolder,
  handleListFolder,
} from '@modules/folders/folder.service'
import { successResponse } from '@utils/response'

// create folder
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

// list folders and files inside it
export async function listFolder(req: AuthRequest, res: Response) {
  const result = listFolderSchema.safeParse(req.params)

  if (!result.success) {
    throw new ValidationError()
  }

  // get folderId and userId
  const { folderId = null } = result.data
  const userId = req.user!.userId

  const { files, folders } = await handleListFolder({ userId, folderId })

  return successResponse(
    res,
    { files, folders },
    true,
    'Folders and files fetched successfully!',
    200
  )
}
