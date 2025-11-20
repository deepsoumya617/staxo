import { asyncHandler } from '@middleware/asyncHandler'
import { authMiddleware } from '@middleware/authMiddleware'
import { Router } from 'express'
import {
  confirmSingleFileUpload,
  createSingleUploadUrl,
} from '@modules/files/file.controller'

const fileRouter = Router()

// auth middleware
fileRouter.use(authMiddleware)

// routes

// single upload
fileRouter.post('/upload-url', asyncHandler(createSingleUploadUrl))
fileRouter.post('/confirm-upload', asyncHandler(confirmSingleFileUpload))

// multi-part upload

export default fileRouter
