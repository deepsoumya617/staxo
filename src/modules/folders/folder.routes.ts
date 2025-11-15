import { authMiddleware } from '@middleware/authMiddleware'
import { Router } from 'express'
import { createFolder } from '@modules/folders/folder.controller'

// folder routes
const folderRouter = Router()

folderRouter.use(authMiddleware)

// routes go here..
folderRouter.post('/create', createFolder)

export default folderRouter
