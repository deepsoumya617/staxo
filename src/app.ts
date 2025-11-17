import { errorHandler } from '@middleware/errorHandler'
import { requestMiddleware } from '@middleware/requestLogger'
import authRoutes from '@modules/auth/auth.routes'
import fileRoutes from '@modules/files/file.routes'
import folderRoutes from '@modules/folders/folder.routes'
import cookieParser from 'cookie-parser'
import express, { Express } from 'express'

const app: Express = express()

// builtin middlewares
app.use(express.json())
app.use(cookieParser())

// request logger
app.use(requestMiddleware)

// health / info route
app.get('/api', (req, res) => {
  return res.status(200).json({ message: 'server is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/folders', folderRoutes)
app.use('/api/files', fileRoutes)

// global error handler
app.use(errorHandler)

export default app
