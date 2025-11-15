import { authMiddleware } from '@middleware/authMiddleware'
import { Router } from 'express'
import { createFolder, listFolder } from '@modules/folders/folder.controller'

// folder routes
const folderRouter = Router()

folderRouter.use(authMiddleware)

// routes go here..
folderRouter.post('/create', createFolder)
folderRouter.get('/:folderId?', listFolder)

export default folderRouter
