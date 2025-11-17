import { asyncHandler } from '@middleware/asyncHandler'
import { authMiddleware } from '@middleware/authMiddleware'
import { Router } from 'express'
import { createUploadUrl } from './file.controller'

const fileRouter = Router()

// auth middleware
fileRouter.use(authMiddleware)

// routes
fileRouter.post('/upload-url', asyncHandler(createUploadUrl))

export default fileRouter
