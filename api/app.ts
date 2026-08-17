/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import messageRoutes from './routes/messages.js'
import visitorRoutes from './routes/visitors.js'
import dataRoutes from './routes/data.js'
import adminRoutes from './routes/admin.js'
import qnaRoutes from './routes/qna.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use((req: Request, res: Response, next: NextFunction) => {
  req.setTimeout(30000, () => {
    console.log('Request timed out:', req.url)
  })
  res.setTimeout(30000, () => {
    console.log('Response timed out:', req.url)
  })
  next()
})

/**
 * Static Files
 */
app.use(express.static(path.join(__dirname, '../dist')))

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/visitors', visitorRoutes)
app.use('/api/data', dataRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/qna', qnaRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * 404 handler for API
 */
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

/**
 * Frontend Routes fallback
 */
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

export default app
