import { AuthRequest } from '@middleware/authMiddleware'
import { Response } from 'express'
import {
  confirmFileUploadSchema,
  getUploadUrlSchema,
  multipartPartUrlSchema,
} from '@modules/files/file.schema'
import { ValidationError } from '@errors/ValidationError'
import {
  handleConfirmSingleFileUpload,
  handleCreateSingleUploadUrl,
  handleGetMultipartPartUrl,
  handleInitiateMultipartUpload,
} from '@modules/files/file.service'
import { successResponse } from '@utils/response'

// generate upload url
export async function createSingleUploadUrl(req: AuthRequest, res: Response) {
  const result = getUploadUrlSchema.safeParse(req.body)

  if (!result.success) {
    throw new ValidationError()
  }

  const { name, size, mimeType, folderId = null } = result.data
  const userId = req.user!.userId

  // get the data from the service
  const data = await handleCreateSingleUploadUrl({
    name,
    size,
    mimeType,
    folderId,
    userId,
  })

  return successResponse(
    res,
    { ...data },
    'Upload url created succesfully!',
    200
  )
}

// confirm file upload
export async function confirmSingleFileUpload(req: AuthRequest, res: Response) {
  const result = confirmFileUploadSchema.safeParse(req.body)

  if (!result.success) {
    throw new ValidationError()
  }

  const { fileId, size } = result.data
  const userId = req.user!.userId

  // pass to service
  await handleConfirmSingleFileUpload({ userId, fileId, size })

  return successResponse(res, {}, 'Upload confirmed', 200)
}

// multi-part upload
// first initiate multi-part upload
export async function initiateMultipartUpload(req: AuthRequest, res: Response) {
  const result = getUploadUrlSchema.safeParse(req.body)

  if (!result.success) {
    throw new ValidationError()
  }

  const { name, size, mimeType, folderId = null } = result.data
  const userId = req.user!.userId

  const data = await handleInitiateMultipartUpload({
    name,
    size,
    mimeType,
    folderId,
    userId,
  })

  return successResponse(res, { ...data }, 'Multipart upload initiated.', 200)
}

// get signed url for each part
export async function getMultipartPartUrl(req: AuthRequest, res: Response) {
  const result = multipartPartUrlSchema.safeParse(req.body)

  if (!result.success) {
    throw new ValidationError()
  }

  const { fileId, uploadId, partNumber } = result.data
  const userId = req.user!.userId

  // offload to service
  const data = await handleGetMultipartPartUrl({
    fileId,
    partNumber,
    uploadId,
    userId,
  })

  return successResponse(res, { ...data }, 'Part url created', 200)
}
