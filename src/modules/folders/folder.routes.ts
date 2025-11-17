import { authMiddleware } from '@middleware/authMiddleware'
import { Router } from 'express'
import {
  createFolder,
  listFolder,
  renameFolder,
} from '@modules/folders/folder.controller'
import { asyncHandler } from '@middleware/asyncHandler'

// folder routes
const folderRouter = Router()

folderRouter.use(authMiddleware)

// routes go here..
folderRouter.post('/create', asyncHandler(createFolder))
folderRouter.get('/:folderId?', asyncHandler(listFolder))
folderRouter.patch('/:folderId', asyncHandler(renameFolder))

export default folderRouter
