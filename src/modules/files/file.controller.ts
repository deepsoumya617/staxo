import { AuthRequest } from '@middleware/authMiddleware'
import { Response } from 'express'
import { uploadUrlSchema } from '@modules/files/file.schema'
import { ValidationError } from '@errors/ValidationError'
import { handleCreateUploadUrl } from '@modules/files/file.service'
import { successResponse } from '@utils/response'

// generate upload url
export async function createUploadUrl(req: AuthRequest, res: Response) {
  const result = uploadUrlSchema.safeParse(req.body)

  if (!result.success) {
    throw new ValidationError()
  }

  const { name, size, mimeType, folderId = null } = result.data
  const userId = req.user!.userId

  // get the data from the service
  const data = await handleCreateUploadUrl({
    name,
    size,
    mimeType,
    folderId,
    userId,
  })

  return successResponse(
    res,
    { ...data },
    true,
    'Upload url created succesfully!',
    200
  )
}
