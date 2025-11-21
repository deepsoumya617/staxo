import { asyncHandler } from '@middleware/asyncHandler'
import { authMiddleware } from '@middleware/authMiddleware'
import { Router } from 'express'
import {
  confirmSingleFileUpload,
  createSingleUploadUrl,
  getMultipartPartUrl,
  initiateMultipartUpload,
} from '@modules/files/file.controller'

const fileRouter = Router()

// auth middleware
fileRouter.use(authMiddleware)

// routes

// single upload
fileRouter.post('/upload-url', asyncHandler(createSingleUploadUrl))
fileRouter.post('/confirm-upload', asyncHandler(confirmSingleFileUpload))

// multi-part upload
fileRouter.post('/multipart/initiate', asyncHandler(initiateMultipartUpload))
fileRouter.post('/multipart/part-url', asyncHandler(getMultipartPartUrl))

export default fileRouter
